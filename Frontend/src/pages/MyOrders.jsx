import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Paper, Divider, Button, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import API_URL from '../config/api';

const MyOrders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                const token = storedUser?.token || user?.token;

                const res = await fetch(`${API_URL}/api/orders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setOrders(data.data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'primary';
            case 'Shipped': return 'info';
            case 'Out for Delivery': return 'warning';
            case 'Delivered': return 'success';
            case 'Cancelled': return 'error';
            default: return 'default';
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                My Orders
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                View your order history and track recent purchases.
            </Typography>

            {orders.length === 0 ? (
                <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: '1px solid #eee' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        You haven't placed any orders yet.
                    </Typography>
                    <Button 
                        variant="contained" 
                        component={Link} 
                        to="/products"
                        sx={{ mt: 2, bgcolor: '#000', '&:hover': { bgcolor: '#333' } }}
                    >
                        Start Shopping
                    </Button>
                </Paper>
            ) : (
                <Box>
                    {orders.map((order) => (
                        <Paper 
                            key={order._id} 
                            elevation={0} 
                            sx={{ 
                                mb: 3, 
                                border: '1px solid #eee', 
                                '&:hover': { borderColor: '#ccc' },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {/* Header */}
                            <Box sx={{ p: 2, bgcolor: '#f9f9f9', display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">ORDER PLACED</Typography>
                                        <Typography variant="body2" fontWeight="medium">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">TOTAL</Typography>
                                        <Typography variant="body2" fontWeight="medium">
                                            ₹{order.totalAmount?.toLocaleString('en-IN') || 0}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">SHIP TO</Typography>
                                        <Typography variant="body2" fontWeight="medium">
                                            {order.shippingAddress?.fullName}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption" color="text.secondary" display="block">ORDER #</Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        {order._id.substring(order._id.length - 8).toUpperCase()}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Body */}
                            <Box sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'space-between' }}>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ mb: 1 }}>
                                        {/* Item list starts below */}
                                    </Box>
                                    {order.items.slice(0, 2).map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                            {item.image && (
                                                <Box 
                                                    component="img"
                                                    src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`}
                                                    alt={item.name}
                                                    sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1, border: '1px solid #eee' }}
                                                />
                                            )}
                                            <Box>
                                                <Typography 
                                                    variant="subtitle2" 
                                                    component={Link} 
                                                    to={`/product/${item.product}`}
                                                    sx={{ textDecoration: 'none', color: '#1976d2', '&:hover': { color: '#0056b3' } }}
                                                >
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Quantity: {item.quantity} {item.color ? `| Color: ${item.color}` : ''} {item.size ? `| Size: ${item.size}` : ''}
                                                </Typography>
                                                <Box sx={{ mt: 0.5 }}>
                                                    <Chip 
                                                        label={item.status || 'Processing'} 
                                                        size="small" 
                                                        color={
                                                            item.status === 'Delivered' ? 'success' : 
                                                            item.status === 'Cancelled' ? 'error' : 
                                                            item.status === 'Shipped' || item.status === 'Out for Delivery' ? 'primary' : 'warning'
                                                        }
                                                        variant="outlined" 
                                                        sx={{ fontWeight: 'bold', fontSize: '0.7rem', height: 20 }} 
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                    {order.items.length > 2 && (
                                        <Typography variant="body2" color="text.secondary">
                                            + {order.items.length - 2} more item(s)...
                                        </Typography>
                                    )}
                                </Box>

                                {/* Action Buttons */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: '150px' }}>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth 
                                        component={Link} 
                                        to={`/my-orders/${order._id}`}
                                        sx={{ color: '#000', borderColor: '#ccc', '&:hover': { borderColor: '#000', bgcolor: 'transparent' } }}
                                    >
                                        Track Order
                                    </Button>
                                    <Button 
                                        variant="text" 
                                        fullWidth 
                                        sx={{ color: 'text.secondary', '&:hover': { color: '#000', bgcolor: 'transparent' } }}
                                    >
                                        View Invoice
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default MyOrders;
