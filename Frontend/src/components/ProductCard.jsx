import { Card, CardContent, Typography, Box, IconButton, Button, Stack } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../context/AuthContext';





const formatPrice = (priceINR) => {
    return `₹${priceINR.toLocaleString('en-IN')}`;
};

const getOldPrice = (oldPriceINR) => {
    return oldPriceINR ? `₹${oldPriceINR.toLocaleString('en-IN')}` : null;
};

function ProductCard({ product }){
    const navigate = useNavigate();
    const { user, toggleLike } = useAuth();
    
    const isLiked = user?.likedProducts?.includes(product.id);

    const handleLike = async () => {
        await toggleLike(product.id);
    };
    const handleProductClick = () => {
        // Fire and forget visit increment
        fetch(`http://localhost:5000/api/products/${product.id}/visit`, { method: 'PUT' })
            .catch(err => console.error('Error incrementing visits:', err));
        
        navigate(`/product/${product.id}`);
    };

    return(
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backgroundColor: '#fff',
                transition: 'all 0.3s ease-in-out',
                width: '100%',
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
        {/* IMAGE BOX */}
        <Box
            className="product-image-container"
            sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "3/4",
                minHeight: { xs: '280px', sm: '320px', md: '360px' },
                overflow: "hidden",
                backgroundColor: "#f8f9fa",
                cursor: 'pointer',
                borderRadius: '8px 8px 0 0',
                flexShrink: 0,
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
                    objectFit: "cover",
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
            </Box>

            {/* Add to Cart Button */}
            <Button
                className="add-to-cart"
                variant="contained"
                fullWidth
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
                Add to Cart
            </Button>
        </Box>

        {/* CONTENT */}
        <CardContent sx={{ 
            px: { xs: 1.5, sm: 2 }, 
            pt: 2.5, 
            pb: 2.5,
            flexGrow: 0,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            minHeight: { xs: '120px', sm: '130px' }
        }}>
            <Typography 
                variant="body2" 
                color="text.secondary" 
                noWrap 
                sx={{ 
                    mb: 0.75,
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontWeight: 600,
                    opacity: 0.7,
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {product.brand}
            </Typography>
            <Typography 
                fontWeight={600} 
                sx={{ 
                    mb: 1.5, 
                    fontSize: { xs: '15px', sm: '16px' },
                    lineHeight: 1.4,
                    color: '#1a1a1a',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minHeight: { xs: '44px', sm: '48px' },
                    maxHeight: { xs: '44px', sm: '48px' }
                }}
            >
                {product.name}
            </Typography>

            <Box sx={{ 
                display: 'flex', 
                gap: 1.5, 
                alignItems: 'center', 
                flexWrap: 'wrap',
                mt: 'auto'
            }}>
                {product.oldPriceINR ? (
                    <>
                        <Typography
                            sx={{
                                textDecoration: 'line-through',
                                color: 'text.secondary',
                                fontSize: { xs: '13px', sm: '14px' },
                                opacity: 0.6
                            }}
                        >
                            {getOldPrice(product.oldPriceINR)}
                        </Typography>
                        <Typography 
                            fontWeight={700} 
                            sx={{ 
                                fontSize: { xs: '17px', sm: '19px' }, 
                                color: '#d32f2f',
                                letterSpacing: 0.5
                            }}
                        >
                            {formatPrice(product.priceINR)}
                        </Typography>
                    </>
                ):(
                    <Typography 
                        fontWeight={700} 
                        sx={{ 
                            fontSize: { xs: '17px', sm: '19px' },
                            color: '#1a1a1a',
                            letterSpacing: 0.5
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