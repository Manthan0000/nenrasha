import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Paper, Divider, Button, Stepper, Step, StepLabel, Grid, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import API_URL from '../config/api';

const steps = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const OrderDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showAlert } = useDialog();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const token = storedUser?.token || user?.token;

                const res = await fetch(`${API_URL}/api/orders/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setOrder(data.data);
                } else {
                    await showAlert(data.message || 'Order not found. Redirecting to your orders.', { severity: 'warning' });
                    navigate('/my-orders');
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                navigate('/my-orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id, user, navigate]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!order) return null;

    const orderStatusLevels = {
        'Processing': 0,
        'Shipped': 1,
        'Out for Delivery': 2,
        'Delivered': 3,
        'Cancelled': -1
    };

    let computedStatus = 'Processing';
    if (order.items && order.items.length > 0) {
        let minStatus = 3;
        let allCancelled = true;
        
        order.items.forEach(item => {
            const s = item.status || 'Processing';
            if (s !== 'Cancelled') {
                allCancelled = false;
                if (orderStatusLevels[s] < minStatus) {
                    minStatus = orderStatusLevels[s];
                }
            }
        });
        
        if (allCancelled) {
            computedStatus = 'Cancelled';
        } else {
            computedStatus = Object.keys(orderStatusLevels).find(k => orderStatusLevels[k] === minStatus) || 'Processing';
        }
    }

    let currentStepIndex = steps.indexOf(computedStatus);
    if (computedStatus === 'Cancelled') {
        currentStepIndex = -1; // Indicates cancelled, could handle UI differently if needed
    }
    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/my-orders')} sx={{ mb: 3, color: 'text.secondary' }}>
                Back to Orders
            </Button>
            
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Order Details
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                Order #{order._id.substring(order._id.length - 8).toUpperCase()} • Placed on {new Date(order.createdAt).toLocaleDateString()}
            </Typography>

            <Grid container spacing={4}>
                {/* Left Side: Tracking & Items */}
                <Grid item xs={12} md={8}>
                    {/* Order Tracking */}
                    <Paper elevation={0} sx={{ border: '1px solid #eee', p: 4, mb: 4 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Order Tracking
                        </Typography>
                        <Divider sx={{ mb: 4 }} />
                        
                        {computedStatus === 'Cancelled' ? (
                            <Typography variant="h6" color="error" align="center" sx={{ py: 3 }}>
                                This order has been cancelled.
                            </Typography>
                        ) : (
                            <Stepper activeStep={currentStepIndex} alternativeLabel sx={{ pt: 2, pb: 4 }}>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        )}
                    </Paper>

                    {/* Order Items */}
                    <Paper elevation={0} sx={{ border: '1px solid #eee', p: 4 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Items in your order
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        {order.items.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 3, mb: 4, alignItems: 'center' }}>
                                {item.image && (
                                    <Box 
                                        component="img"
                                        src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`}
                                        alt={item.name}
                                        sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1, border: '1px solid #eee' }}
                                    />
                                )}
                                <Box sx={{ flex: 1 }}>
                                    <Typography 
                                        variant="subtitle1" 
                                        fontWeight="bold"
                                        component={Link} 
                                        to={`/product/${item.product}`}
                                        sx={{ textDecoration: 'none', color: '#000', '&:hover': { color: '#d32f2f' } }}
                                    >
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {item.color && `Color: ${item.color}`}
                                        {item.color && item.size && ' | '}
                                        {item.size && `Size: ${item.size}`}
                                    </Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <Chip 
                                            label={item.status || 'Processing'} 
                                            size="small" 
                                            color={
                                                item.status === 'Delivered' ? 'success' : 
                                                item.status === 'Cancelled' ? 'error' : 
                                                item.status === 'Shipped' || item.status === 'Out for Delivery' ? 'primary' : 'warning'
                                            }
                                            variant="outlined" 
                                            sx={{ fontWeight: 'bold' }} 
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        ₹{(item.priceINR * item.quantity).toLocaleString('en-IN')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Qty: {item.quantity}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Paper>
                </Grid>

                {/* Right Side: Summary & Shipping Info */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ border: '1px solid #eee', p: 4, mb: 4, bgcolor: '#fbfbfb' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Order Summary
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography color="text.secondary">Subtotal</Typography>
                            <Typography>₹{order.totalAmount?.toLocaleString('en-IN')}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography color="text.secondary">Shipping</Typography>
                            <Typography color="success.main">Free</Typography>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
                            <Typography variant="subtitle1" fontWeight="bold" color="error">
                                ₹{order.totalAmount?.toLocaleString('en-IN')}
                            </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" display="block" align="right">
                            Paid via {order.paymentMethod}
                        </Typography>
                    </Paper>

                    <Paper elevation={0} sx={{ border: '1px solid #eee', p: 4 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Shipping Details
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            {order.shippingAddress?.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1 }}>
                            {order.shippingAddress?.address}<br/>
                            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Phone: {order.shippingAddress?.mobile}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default OrderDetails;
