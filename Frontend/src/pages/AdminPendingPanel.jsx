import { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, CircularProgress, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  MenuItem, Select, Chip, Avatar
} from '@mui/material';
import Container from '../components/Container';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function AdminPendingPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showAlert } = useDialog();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchSellerOrders();
  }, [user, navigate]);

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/orders/seller-orders', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      showAlert('Failed to load orders', { severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, itemId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/item/${itemId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        showAlert(`Order item status updated to ${newStatus}`, { severity: 'success' });
        // Update local state
        setOrders(prevOrders => prevOrders.map(order => {
          if (order._id === orderId) {
            return {
              ...order,
              items: order.items.map(item => 
                item._id === itemId ? { ...item, status: newStatus } : item
              )
            };
          }
          return order;
        }));
      } else {
        showAlert(data.message || 'Failed to update status', { severity: 'error' });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showAlert('Error connecting to server', { severity: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Processing': return 'warning';
      case 'Shipped': return 'info';
      case 'Out for Delivery': return 'primary';
      case 'Delivered': return 'success';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f9fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ bgcolor: '#0f172a', py: 6, color: '#fff' }}>
        <Container>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/my-account')}
                sx={{ color: '#94a3b8', mb: 2, textTransform: 'none', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
                Back to Account
            </Button>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: '#f8fafc' }}>Pending Orders Panel</Typography>
            <Typography sx={{ color: '#cbd5e1' }}>Manage orders containing products you've listed</Typography>
        </Container>
      </Box>

      <Box sx={{ py: 6, flexGrow: 1 }}>
        <Container>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress sx={{ color: '#0f172a' }} />
            </Box>
          ) : orders.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {orders.map((order) => (
                <Card key={order._id} sx={{ borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <Box sx={{ bgcolor: '#f1f5f9', p: 3, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Order ID</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 800, color: '#0f172a' }}>{order._id}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Customer Info</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>{order.user?.name} ({order.user?.email})</Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>{order.shippingAddress?.address}, {order.shippingAddress?.city}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Order Date</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>{new Date(order.createdAt).toLocaleDateString()}</Typography>
                    </Box>
                  </Box>
                  
                  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
                    <Table>
                      <TableHead sx={{ bgcolor: '#fff' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Product</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Details</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Price</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Current Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b' }}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.items.map((item) => (
                          <TableRow key={item._id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: '#fff', '&:hover': { bgcolor: '#f8fafc' } }}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar 
                                  src={item.image} 
                                  variant="rounded" 
                                  sx={{ width: 60, height: 60, bgcolor: '#f1f5f9', border: '1px solid #e2e8f0' }}
                                />
                                <Typography sx={{ fontWeight: 700, color: '#0f172a', maxWidth: 200 }}>{item.name}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ color: '#475569' }}>Qty: {item.quantity}</Typography>
                              {item.color && <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Color: {item.color}</Typography>}
                              {item.size && <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Size: {item.size}</Typography>}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#16a34a' }}>
                              ₹{item.priceINR?.toLocaleString('en-IN')}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={item.status || 'Processing'} 
                                color={getStatusColor(item.status || 'Processing')}
                                size="small"
                                sx={{ fontWeight: 700, borderRadius: '8px' }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Select
                                size="small"
                                value={item.status || 'Processing'}
                                onChange={(e) => handleStatusChange(order._id, item._id, e.target.value)}
                                sx={{ 
                                  width: 160, textAlign: 'left', bgcolor: '#fff', borderRadius: '8px',
                                  '& .MuiSelect-select': { py: 1, px: 2, fontSize: '0.875rem', fontWeight: 600 }
                                }}
                              >
                                {['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
                                  <MenuItem key={status} value={status} sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                    {status}
                                  </MenuItem>
                                ))}
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 12, bgcolor: '#fff', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 800, color: '#0f172a' }}>No Pending Orders</Typography>
              <Typography sx={{ color: '#64748b', mb: 4 }}>You don't have any orders for your listed products currently.</Typography>
              <Button 
                onClick={() => navigate('/admin/my-listings')}
                variant="outlined"
                sx={{ borderRadius: '12px', px: 4, py: 1.5, textTransform: 'none', fontWeight: 700, color: '#0f172a', borderColor: '#0f172a', '&:hover': { bgcolor: '#f8fafc' } }}
              >
                View My Listings
              </Button>
            </Box>
          )}
        </Container>
      </Box>
      <Footer />
      <ScrollToTop />
    </Box>
  );
}

export default AdminPendingPanel;
