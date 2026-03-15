import { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Grid, Paper, Divider, Dialog, DialogTitle, DialogContent, CircularProgress, FormControlLabel, Checkbox } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '../context/DialogContext';
import SaveIcon from '@mui/icons-material/Save';
import PayPalCheckout from '../components/PayPalCheckout';

const Checkout = () => {
  const { user, login } = useAuth();
  const { cart, getCartTotal, fetchCart } = useCart();
  const navigate = useNavigate();
  const { showAlert } = useDialog();

  const [loading, setLoading] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [saveAddress, setSaveAddress] = useState(true); // default: save changes
  const [addressData, setAddressData] = useState({
    fullName: user?.name || '',
    mobile: user?.mobile || '',
    address: user?.address || '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!addressData.fullName || !addressData.mobile || !addressData.address || !addressData.city || !addressData.state || !addressData.zipCode) {
        showAlert('Please fill out all address fields before proceeding.', { title: 'Missing Information', severity: 'warning' });
        return;
    }
    setPaymentDialogOpen(true);
  };

  // Silently sync updated address/name/mobile back to user profile in DB
  const syncProfileIfChanged = async (token) => {
    const hasChanged =
      addressData.fullName !== (user?.name || '') ||
      addressData.mobile   !== (user?.mobile || '') ||
      addressData.address  !== (user?.address || '');

    if (!hasChanged) return; // nothing to update

    try {
      const formData = new FormData();
      formData.append('userId', user._id || user.id);
      formData.append('name',    addressData.fullName);
      formData.append('mobile',  addressData.mobile);
      // Combine address + city + state + zip for the profile address field
      const fullAddress = `${addressData.address}, ${addressData.city}, ${addressData.state} - ${addressData.zipCode}`;
      formData.append('address', fullAddress);

      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        // Merge updated fields into current user and persist to context + localStorage
        login({ ...user, ...data.data });
      }
    } catch (err) {
      // Silent — don't block the order flow if profile sync fails
      console.warn('Profile sync after checkout failed:', err);
    }
  };

  // Called by PayPalCheckout after PayPal confirms COMPLETED status
  const handlePayPalSuccess = async ({ paypalOrderId, status }) => {
    if (status !== 'COMPLETED') {
      await showAlert('Payment was not completed. Please try again.', { severity: 'error' });
      return;
    }
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser?.token || user?.token;

      // Save the order in MongoDB only after PayPal confirms payment
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress: addressData,
          totalAmount: getCartTotal(),
          paymentStatus: 'Paid',
          paypalOrderId,              // store PayPal order ID for records
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentDialogOpen(false);
        if (saveAddress) await syncProfileIfChanged(token);
        await fetchCart();
        await showAlert('Payment successful! Your order has been placed.', { title: 'Order Placed! 🎉', severity: 'success' });
        navigate('/my-orders');
      } else {
        await showAlert(data.message || 'Failed to save order. Please contact support.', { severity: 'error' });
      }
    } catch (err) {
      console.error('Order save error:', err);
      await showAlert('A server error occurred while saving your order.', { severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalError = async (msg) => {
    console.error('PayPal error:', msg);
    await showAlert('PayPal payment failed: ' + msg, { severity: 'error' });
  };

  if (!cart || !cart.items || cart.items.length === 0) {
      return (
          <Container sx={{ py: 10, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>Your cart is empty.</Typography>
              <Button variant="contained" onClick={() => navigate('/products')}>Return to Shop</Button>
          </Container>
      );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Checkout
      </Typography>

      <Grid container spacing={4}>
        {/* Left Side: Address Form */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ border: '1px solid #eee', p: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Delivery Address
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={handleProceedToPayment}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Full Name" 
                    name="fullName" 
                    value={addressData.fullName} 
                    onChange={handleChange} 
                    fullWidth 
                    required 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Mobile Number" 
                    name="mobile" 
                    value={addressData.mobile} 
                    onChange={handleChange} 
                    fullWidth 
                    required 
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    label="Address (Street, Apt, Suite)" 
                    name="address" 
                    value={addressData.address} 
                    onChange={handleChange} 
                    fullWidth 
                    required 
                    multiline 
                    rows={2} 
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    label="City" 
                    name="city" 
                    value={addressData.city} 
                    onChange={handleChange} 
                    fullWidth 
                    required 
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    label="State" 
                    name="state" 
                    value={addressData.state} 
                    onChange={handleChange} 
                    fullWidth 
                    required 
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField 
                    label="ZIP Code" 
                    name="zipCode" 
                    value={addressData.zipCode} 
                    onChange={handleChange} 
                    fullWidth 
                    required 
                  />
                </Grid>

                {/* Save address checkbox */}
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', alignItems: 'center', 
                    p: 2, borderRadius: 2, 
                    bgcolor: saveAddress ? '#f0fdf4' : '#fafafa',
                    border: `1px solid ${saveAddress ? '#bbf7d0' : '#eee'}`,
                    transition: 'all 0.2s ease'
                  }}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                          sx={{ color: '#16a34a', '&.Mui-checked': { color: '#16a34a' } }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SaveIcon sx={{ fontSize: 16, color: saveAddress ? '#16a34a' : '#aaa' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: saveAddress ? '#15803d' : '#888' }}>
                            Save changes to my profile (name, mobile & address)
                          </Typography>
                        </Box>
                      }
                      sx={{ m: 0 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Right Side: Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ border: '1px solid #eee', p: 4, bgcolor: '#fbfbfb' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              {cart.items.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ flex: 1, pr: 2 }}>
                    {item.quantity} x {item.product?.name}
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    ₹{(item.product?.priceINR || 0) * item.quantity}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography>₹{getCartTotal()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography color="text.secondary">Shipping</Typography>
              <Typography color="success.main">Free</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Typography variant="h6" fontWeight="bold">Total Bill</Typography>
              <Typography variant="h6" color="error" fontWeight="bold">₹{getCartTotal()}</Typography>
            </Box>

            <Button 
              variant="contained" 
              color="error" 
              fullWidth 
              size="large"
              sx={{ py: 1.5, fontWeight: 'bold' }}
              onClick={handleProceedToPayment}
            >
              PROCEED TO PAYMENT
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* PayPal Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => !loading && setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', pb: 1 }}>
          Complete Payment with PayPal
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="h6" gutterBottom>
            Total: <span style={{ color: '#d32f2f' }}>₹{getCartTotal()}</span>
            <Typography variant="caption" display="block" color="text.secondary">
              (~${(getCartTotal() / 84).toFixed(2)} USD — PayPal sandbox)
            </Typography>
          </Typography>

          {saveAddress && (
            <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0' }}>
              <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 600 }}>
                ✓ Your profile details will be updated after payment
              </Typography>
            </Box>
          )}

          {loading ? (
            <Box sx={{ py: 4 }}><CircularProgress /></Box>
          ) : (
            <>
              {/* Mock PayPal credentials for sandbox testing */}
              <Box sx={{
                mb: 2.5,
                p: 2,
                bgcolor: '#eff6ff',
                borderRadius: 2,
                border: '1px solid #bfdbfe',
                textAlign: 'left',
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e40af', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  🔑 Mock PayPal Login Credentials
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: 0.5 }}>
                  <Typography variant="body2" sx={{ color: '#1e3a5f', fontFamily: 'monospace' }}>
                    <strong>Email:</strong> nenrashamockpay@gmail.com
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1e3a5f', fontFamily: 'monospace' }}>
                    <strong>Password:</strong> RojJalsa123
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#6b7280', mt: 1, display: 'block' }}>
                  Use these credentials when the PayPal popup asks you to log in.
                </Typography>
              </Box>

              <PayPalCheckout
                amount={getCartTotal()}
                token={JSON.parse(localStorage.getItem('user'))?.token || user?.token}
                onSuccess={handlePayPalSuccess}
                onError={handlePayPalError}
              />
            </>
          )}

          <Button
            variant="text"
            color="inherit"
            size="small"
            onClick={() => setPaymentDialogOpen(false)}
            disabled={loading}
            sx={{ mt: 1, color: 'text.secondary' }}
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Checkout;
