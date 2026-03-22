import { Card, CardContent, Typography, Box, IconButton, Button, Stack } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useDialog } from '../context/DialogContext';
import { useState } from 'react';
import API_URL from '../config/api';

const formatPrice = (priceINR) => {
    return `₹${priceINR.toLocaleString('en-IN')}`;
};

const getOldPrice = (oldPriceINR) => {
    return oldPriceINR ? `₹${oldPriceINR.toLocaleString('en-IN')}` : null;
};

const IMAGE_HEIGHT = 280;   
const CONTENT_HEIGHT = 148; 

function ProductCard({ product }){
    const navigate = useNavigate();
    const { user, toggleLike } = useAuth();
    const { addToCart } = useCart();
    const [addingToCart, setAddingToCart] = useState(false);
    const { showAlert, showConfirm } = useDialog();
    
    const isLiked = user?.likedProducts?.includes(product.id);

    const handleLike = async () => {
        await toggleLike(product.id);
    };
    const handleProductClick = () => {
        // Fire and forget visit increment
        fetch(`${API_URL}/api/products/${product.id}/visit`, { method: 'PUT' })
            .catch(err => console.error('Error incrementing visits:', err));
        
        navigate(`/product/${product.id}`);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        const confirmed = await showConfirm('Are you sure you want to delete this product? This action cannot be undone.', { title: 'Delete Product', severity: 'error' });
        if (confirmed) {
            try {
                const res = await fetch(`${API_URL}/api/products/${product.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    await showAlert('Product deleted successfully.', { severity: 'success' });
                    window.location.reload(); 
                } else {
                    await showAlert(data.message || 'Failed to delete product.', { severity: 'error' });
                }
            } catch (err) {
                console.error(err);
                await showAlert('An error occurred while deleting the product.', { severity: 'error' });
            }
        }
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!user) {
            await showAlert('Please login to add items to your cart.', { title: 'Login Required', severity: 'warning' });
            navigate('/login');
            return;
        }
        
        // Defaults if variant not selected
        const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : '';
        const defaultSize = product.size && product.size.length > 0 ? product.size[0] : '';

        setAddingToCart(true);
        const res = await addToCart(product.id, 1, defaultColor, defaultSize);
        setAddingToCart(false);
        
        if (res.success) {
            await showAlert(`${product.name} has been added to your cart!`, { title: 'Added to Cart', severity: 'success' });
        } else {
            await showAlert(res.message || 'Failed to add to cart. Please try again.', { severity: 'error' });
        }
    };

    const isOwner = user && user.role === 'admin' && (product.createdBy === user._id || product.createdBy === user.id);

    return(
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                position: 'relative',
                /* KEY FIX: explicit fixed height, never driven by image */
                width: '100%',
                height: `${IMAGE_HEIGHT + CONTENT_HEIGHT}px`,
                minHeight: `${IMAGE_HEIGHT + CONTENT_HEIGHT}px`,
                maxHeight: `${IMAGE_HEIGHT + CONTENT_HEIGHT}px`,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)',
                    '& .product-actions': {
                        opacity: 1,
                    },
                    '& .add-to-cart': {
                        opacity: 1,
                        transform: 'translateY(0)',
                    },
                    '& .product-image': {
                        transform: 'scale(1.05)',
                    },
                },
            }}
        >
        {/* IMAGE BOX — fixed pixel height, never changes */}
        <Box
            className="product-image-container"
            sx={{
                position: "relative",
                width: "100%",
                height: `${IMAGE_HEIGHT}px`,
                minHeight: `${IMAGE_HEIGHT}px`,
                maxHeight: `${IMAGE_HEIGHT}px`,
                flexShrink: 0,
                overflow: "hidden",
                backgroundColor: "#f8f9fa",
                cursor: 'pointer',
                borderRadius: '8px 8px 0 0',
            }}
            onClick={handleProductClick}
        >
            <Box
                className="product-image"
                component="img"
                src={product.image}
                alt={product.name}
                onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                }}
                sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",   // fills the fixed box, crops excess
                    objectPosition: "center top", // show top of image (faces/key product area)
                    display: 'block',
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            />

            {product.discount > 0 && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
                        color: "#fff",
                        fontSize: { xs: 11, sm: 12 },
                        px: { xs: 1.5, sm: 2 },
                        py: { xs: 0.5, sm: 0.75 },
                        fontWeight: 700,
                        zIndex: 1,
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(211, 47, 47, 0.3)',
                        letterSpacing: 0.5
                    }}
                >
                    -{product.discount}% OFF
                </Box>
            )}

            {/* Action Icons */}
            <Box
                className="product-actions"
                sx={{
                    position: 'absolute',
                    right: 12,
                    top: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    zIndex: 2
                }}
            >
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleLike();
                    }}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        '&:hover': { 
                            backgroundColor: '#fff',
                            transform: 'scale(1.1)',
                        },
                        color: isLiked ? '#d32f2f' : '#333',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                </IconButton>
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.id}`);
                    }}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        '&:hover': { 
                            backgroundColor: '#fff',
                            transform: 'scale(1.1)',
                        },
                        color: '#333',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <VisibilityIcon fontSize="small" />
                </IconButton>

                {isOwner && (
                    <>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/edit-product/${product.id}`);
                            }}
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                '&:hover': { 
                                    backgroundColor: '#fff',
                                    transform: 'scale(1.1)',
                                    color: '#1976d2'
                                },
                                color: '#333',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={handleDelete}
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                '&:hover': { 
                                    backgroundColor: '#fff',
                                    transform: 'scale(1.1)',
                                    color: '#d32f2f'
                                },
                                color: '#333',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </>
                )}
            </Box>

            {/* Add to Cart Button */}
            <Button
                className="add-to-cart"
                variant="contained"
                fullWidth
                onClick={handleAddToCart}
                disabled={addingToCart}
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                    color: '#fff',
                    borderRadius: 0,
                    py: 1.5,
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: 1,
                    opacity: 0,
                    transform: 'translateY(10px)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 -4px 12px rgba(0,0,0,0.15)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #333 0%, #000 100%)',
                        transform: 'translateY(0)',
                        boxShadow: '0 -6px 16px rgba(0,0,0,0.2)',
                    },
                }}
            >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
        </Box>

        {/* CONTENT — fixed pixel height */}
        <CardContent sx={{ 
            px: { xs: 1.5, sm: 2 }, 
            pt: 2,
            pb: '12px !important',
            /* KEY FIX: exact fixed height for content area */
            height: `${CONTENT_HEIGHT}px`,
            minHeight: `${CONTENT_HEIGHT}px`,
            maxHeight: `${CONTENT_HEIGHT}px`,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#fff',
        }}>
            <Typography 
                variant="body2" 
                color="text.secondary" 
                noWrap 
                sx={{ 
                    mb: 0.5,
                    fontSize: { xs: '0.72rem', sm: '0.78rem' },
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontWeight: 600,
                    opacity: 0.65,
                    lineHeight: 1.4,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                }}
            >
                {product.brand}
            </Typography>
            <Typography 
                fontWeight={600} 
                sx={{ 
                    mb: 'auto', 
                    fontSize: { xs: '14px', sm: '15px' },
                    lineHeight: 1.4,
                    color: '#1a1a1a',
                    /* clamp to exactly 2 lines, never more */
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flexShrink: 0,
                    height: '42px',
                    minHeight: '42px',
                }}
            >
                {product.name}
            </Typography>

            <Box sx={{ 
                display: 'flex', 
                gap: 1.5, 
                alignItems: 'center', 
                flexWrap: 'nowrap',
                mt: 1,
                flexShrink: 0,
            }}>
                {product.oldPriceINR ? (
                    <>
                        <Typography
                            sx={{
                                textDecoration: 'line-through',
                                color: 'text.secondary',
                                fontSize: { xs: '12px', sm: '13px' },
                                opacity: 0.6,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {getOldPrice(product.oldPriceINR)}
                        </Typography>
                        <Typography 
                            fontWeight={700} 
                            sx={{ 
                                fontSize: { xs: '16px', sm: '18px' }, 
                                color: '#d32f2f',
                                letterSpacing: 0.5,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {formatPrice(product.priceINR)}
                        </Typography>
                    </>
                ):(
                    <Typography 
                        fontWeight={700} 
                        sx={{ 
                            fontSize: { xs: '16px', sm: '18px' },
                            color: '#1a1a1a',
                            letterSpacing: 0.5,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {formatPrice(product.priceINR)}
                    </Typography>
                )}
            </Box>
        </CardContent>
        </Card>
    );
}
export default ProductCard;