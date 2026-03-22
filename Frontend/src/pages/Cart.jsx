import { useState } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, CircularProgress, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      await updateQuantity(itemId, newQuantity);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Shopping Cart
      </Typography>

      {(!cart || !cart.items || cart.items.length === 0) ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your cart is currently empty.
          </Typography>
          <Button 
            variant="contained" 
            color="error" 
            component={Link} 
            to="/products"
            sx={{ mt: 3, px: 4, py: 1 }}
          >
            Return to Shop
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Cart Items */}
          <Box sx={{ flex: 2 }}>
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f9f9f9' }}>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {item.product?.image && (
                            <Box 
                              component="img"
                              src={item.product.image.startsWith('http') ? item.product.image : `${API_URL}${item.product.image}`}
                              alt={item.product.name}
                              sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                            />
                          )}
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              component={Link} 
                              to={`/product/${item.product?._id}`}
                              sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: '#d32f2f' } }}
                            >
                              {item.product?.name || 'Unknown Product'}
                            </Typography>
                            {(item.color || item.size) && (
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                {item.color && `Color: ${item.color}`}
                                {item.color && item.size && ' | '}
                                {item.size && `Size: ${item.size}`}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ddd', borderRadius: 1, p: 0.5, width: 'fit-content', mx: 'auto' }}>
                          <IconButton size="small" onClick={() => handleQuantityChange(item._id, item.quantity, -1)}>
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ px: 2, minWidth: '30px', textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton size="small" onClick={() => handleQuantityChange(item._id, item.quantity, 1)}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        ₹{item.product?.priceINR || 0}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        ₹{(item.product?.priceINR || 0) * item.quantity}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="error" onClick={() => removeFromCart(item._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button 
                variant="outlined" 
                color="inherit" 
                component={Link} 
                to="/products"
              >
                Continue Shopping
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </Box>
          </Box>

          {/* Cart Summary */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={0} sx={{ border: '1px solid #eee', p: 3, bgcolor: '#fbfbfb' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Cart Totals
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography fontWeight="medium">₹{getCartTotal()}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography fontWeight="medium">Calculated at checkout</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">Total</Typography>
                <Typography variant="h6" color="error" fontWeight="bold">₹{getCartTotal()}</Typography>
              </Box>

              <Button 
                variant="contained" 
                color="error" 
                fullWidth 
                size="large"
                sx={{ py: 1.5, fontWeight: 'bold' }}
                onClick={() => {
                  navigate('/checkout');
                }}
              >
                PROCEED TO CHECKOUT
              </Button>
            </Paper>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Cart;
