import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Chip, Select, MenuItem, FormControl, InputLabel, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import Container from '../components/Container';
import ProductCard from '../components/ProductCard';

// Helper to normalize category matching
const normalizeCategory = (cat) => cat.toLowerCase().replace(/[^a-z0-9]/g, '');

function CategoryPage() {
    const { categoryName } = useParams();
    const isAll = categoryName && categoryName.toLowerCase() === 'all';
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProducts(data.data.map(p => ({ ...p, id: p._id })));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Debug: Log normalization to check what we are comparing
    const targetCategory = categoryName ? normalize(categoryName) : '';

    let filteredProducts = isAll ? products : products.filter(product => {
        if (!categoryName) return false;
        
        // Robust matching
        const productCat = normalize(product.category || '');
        
        // Handle specific edge cases if needed, but normalization usually covers it
        // Example: 'watches & glasses' -> 'watchesglasses'
        // 'GenZ' -> 'genz'
        
        return productCat === targetCategory || product.category?.toLowerCase() === categoryName.toLowerCase();
    });

    // Sort products
    if (sortBy === 'newest') {
        filteredProducts = [...filteredProducts].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'price-low') {
        filteredProducts = [...filteredProducts].sort((a, b) => (a.priceINR || 0) - (b.priceINR || 0));
    } else if (sortBy === 'price-high') {
        filteredProducts = [...filteredProducts].sort((a, b) => (b.priceINR || 0) - (a.priceINR || 0));
    } else if (sortBy === 'popular') {
        filteredProducts = [...filteredProducts].sort((a, b) => (b.visits || 0) - (a.visits || 0));
    }

    if (loading) {
        return (
            <Box sx={{ 
                py: 10, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                minHeight: '60vh',
                backgroundColor: '#fafafa'
            }}>
                <Typography variant="h6" color="text.secondary">Loading products...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            py: { xs: 4, md: 8 }, 
            minHeight: '80vh', 
            backgroundColor: '#fafafa',
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,0,0,0.02) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.02) 0%, transparent 50%)'
        }}>
            <Container>
                {/* Header Section with Enhanced Styling */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        mb: 6, 
                        p: { xs: 3, md: 4 },
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                        borderRadius: 3,
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', md: 'row' }, 
                        alignItems: { xs: 'flex-start', md: 'center' }, 
                        justifyContent: 'space-between', 
                        gap: 3 
                    }}>
                        <Box>
                            <Typography 
                                variant="h2" 
                                fontWeight="800" 
                                sx={{ 
                                    textTransform: 'uppercase', 
                                    letterSpacing: { xs: 0.5, md: 1.5 },
                                    fontSize: { xs: "2rem", md: "3.5rem" },
                                    lineHeight: 1.1,
                                    background: 'linear-gradient(45deg, #000 30%, #333 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1
                                }}
                            >
                                {isAll ? 'All Products' : categoryName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Chip 
                                    label={`${filteredProducts.length} Products`}
                                    sx={{ 
                                        backgroundColor: '#000',
                                        color: '#fff',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        height: 28
                                    }}
                                />
                                {filteredProducts.length > 0 && (
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{ 
                                            fontSize: '0.875rem',
                                            letterSpacing: 0.5
                                        }}
                                    >
                                        Discover our curated collection
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        {/* Enhanced Filter/Sort Controls */}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <FormControl 
                                size="small" 
                                sx={{ 
                                    minWidth: { xs: '100%', sm: 160 },
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#fff',
                                        borderRadius: 2,
                                        '&:hover': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#000',
                                            }
                                        },
                                        '&.Mui-focused': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#000',
                                                borderWidth: 2,
                                            }
                                        }
                                    }
                                }}
                            >
                                <InputLabel>Sort By</InputLabel>
                                <Select
                                    value={sortBy}
                                    label="Sort By"
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <MenuItem value="newest">Newest First</MenuItem>
                                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                                    <MenuItem value="popular">Most Popular</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </Paper>
                
                {filteredProducts.length === 0 ? (
                    <Paper 
                        elevation={0}
                        sx={{ 
                            py: 10, 
                            textAlign: 'center',
                            backgroundColor: '#fff',
                            borderRadius: 3,
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}
                    >
                        <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                            No products found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            We couldn't find any products in this category. Try browsing other categories.
                        </Typography>
                    </Paper>
                ) : (
                    <Grid 
                        container 
                        spacing={{ xs: 2, sm: 2.5, md: 2.5 }}
                        justifyContent="center"
                        sx={{
                            '& .MuiGrid-item': {
                                display: 'flex',
                                flexDirection: 'column',
                                height: 'auto'
                            }
                        }}
                    >
                        {filteredProducts.map((product) => (
                            <Grid 
                                item 
                                xs={12} 
                                sm={6} 
                                md={3} 
                                lg={3} 
                                key={product.id}
                                sx={{
                                    transition: 'transform 0.2s ease-in-out',
                                    display: 'flex',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                    }
                                }}
                            >
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}

export default CategoryPage;
