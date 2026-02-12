import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Button, Container, Grid, IconButton, 
    Chip, Stack, Divider, Breadcrumbs, Link as MuiLink 
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../context/AuthContext';

// Mock data helper if fields are missing
const getMockSizes = () => ['S', 'M', 'L', 'XL', 'XXL'];
const getMockColors = () => ['#000000', '#FFFFFF', '#1976d2', '#d32f2f', '#388e3c'];

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, toggleLike } = useAuth();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Find product by ID
        fetch(`http://localhost:5000/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const foundProduct = { ...data.data, id: data.data._id };
                    setProduct(foundProduct);
                    
                    // Set defaults if available, else use mocks
                    const sizes = foundProduct.size && foundProduct.size.length > 0 ? foundProduct.size : getMockSizes();
                    const colors = foundProduct.colors && foundProduct.colors.length > 0 ? foundProduct.colors : getMockColors();
                    
                    // Just for UI state 
                    setSelectedSize(sizes[0]); 
                    setSelectedColor(colors[0]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>Loading...</Box>;
    }

    if (!product) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>Product not found</Typography>
                <Button variant="contained" onClick={() => navigate('/')}>Return Home</Button>
            </Container>
        );
    }

    const sizes = product.size && product.size.length > 0 ? product.size : getMockSizes();
    const colors = product.colors && product.colors.length > 0 ? product.colors : getMockColors();

    const discountPercentage = product.discount > 0 
        ? product.discount 
        : product.oldPriceINR 
            ? Math.round(((product.oldPriceINR - product.priceINR) / product.oldPriceINR) * 100) 
            : 0;

    return (
        <Box sx={{ backgroundColor: '#fff', minHeight: '100vh', pb: 8 }}>
            
            {/* Breadcrumb & Back */}
            <Container maxWidth="lg" sx={{ py: 2 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2, color: 'text.secondary' }}>
                    Back
                </Button>
                <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <MuiLink underline="hover" color="inherit" href="/" onClick={(e) => {e.preventDefault(); navigate('/');}}>
                        Home
                    </MuiLink>
                    <MuiLink underline="hover" color="inherit" href={`/category/${product.category}`} onClick={(e) => {e.preventDefault(); navigate(`/category/${product.category}`);}}>
                        {product.category}
                    </MuiLink>
                    <Typography color="text.primary">{product.name}</Typography>
                </Breadcrumbs>
            </Container>

            <Container maxWidth="lg">
                <Grid container spacing={6}>
                    
                    {/* Left: Image Gallery */}
                    <Grid item xs={12} md={6}>
                        <Box 
                            sx={{ 
                                position: 'relative', 
                                borderRadius: 2, 
                                overflow: 'hidden', 
                                boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                                backgroundColor: '#f9f9f9',
                                height: { xs: 400, md: 600 }
                            }}
                        >
                            <Box 
                                component="img"
                                src={product.image}
                                alt={product.name}
                                sx={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'contain', 
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'scale(1.02)' }
                                }}
                            />
                            {discountPercentage > 0 && (
                                <Box sx={{ 
                                    position: 'absolute', top: 20, left: 20, 
                                    bgcolor: '#d32f2f', color: '#fff', 
                                    px: 2, py: 0.5, borderRadius: 1, fontWeight: 'bold'
                                }}>
                                    {discountPercentage}% OFF
                                </Box>
                            )}
                        </Box>
                    </Grid>

                    {/* Right: Details */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="overline" sx={{ letterSpacing: 1.5, color: 'text.secondary', fontWeight: 600 }}>
                                {product.brand.toUpperCase()}
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.2 }}>
                                {product.name}
                            </Typography>
                            
                            <Stack direction="row" alignItems="baseline" spacing={2} sx={{ mb: 3 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f' }}>
                                    ₹{product.priceINR.toLocaleString('en-IN')}
                                </Typography>
                                {product.oldPriceINR && (
                                    <Typography variant="h6" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                        ₹{product.oldPriceINR.toLocaleString('en-IN')}
                                    </Typography>
                                )}
                            </Stack>

                            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
                                Experience premium quality with the {product.name}. Designed for modern lifestyles, 
                                offering exceptional comfort and durability. Perfect for any occasion.
                            </Typography>

                            <Divider sx={{ mb: 3 }} />

                            {/* Color Selection */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>COLOR: {selectedColor}</Typography>
                                <Stack direction="row" spacing={1.5}>
                                    {colors.map((color, index) => (
                                        <Box
                                            key={index}
                                            onClick={() => setSelectedColor(color)}
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                bgcolor: color,
                                                border: selectedColor === color ? `2px solid #000` : '1px solid #ddd',
                                                cursor: 'pointer',
                                                boxShadow: selectedColor === color ? '0 0 0 2px #fff, 0 0 0 4px #000' : 'none',
                                                transition: 'all 0.2s'
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Box>

                            {/* Size Selection */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>SELECT SIZE</Typography>
                                <Stack direction="row" flexWrap="wrap" gap={1}>
                                    {sizes.map((size) => (
                                        <Chip
                                            key={size}
                                            label={size}
                                            onClick={() => setSelectedSize(size)}
                                            variant={selectedSize === size ? "filled" : "outlined"}
                                            sx={{ 
                                                borderRadius: 1, 
                                                height: 40, 
                                                minWidth: 50,
                                                bgcolor: selectedSize === size ? '#000' : 'transparent',
                                                color: selectedSize === size ? '#fff' : 'text.primary',
                                                border: selectedSize === size ? 'none' : '1px solid #ddd',
                                                '&:hover': { 
                                                    borderColor: '#000',
                                                    bgcolor: selectedSize === size ? '#333' : 'rgba(0,0,0,0.05)'
                                                } 
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Box>

                            {/* Actions */}
                            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                                <Button 
                                    variant="contained" 
                                    startIcon={<AddShoppingCartIcon />}
                                    size="large"
                                    fullWidth
                                    sx={{ 
                                        bgcolor: '#000', 
                                        color: '#fff', 
                                        py: 1.5,
                                        fontSize: '1rem',
                                        '&:hover': { bgcolor: '#333' }
                                    }}
                                >
                                    Add to Cart
                                </Button>
                                <IconButton 
                                    size="large" 
                                    onClick={() => toggleLike(product.id)}
                                    sx={{ 
                                        border: '1px solid #ddd', 
                                        borderRadius: 1,
                                        width: 56,
                                        color: user?.likedProducts?.includes(product.id) ? '#d32f2f' : 'inherit'
                                    }}
                                >
                                    {user?.likedProducts?.includes(product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                </IconButton>
                            </Stack>

                        </Box>
                    </Grid>
                </Grid>
                
            </Container>
        </Box>
    );
};

export default ProductDetails;
