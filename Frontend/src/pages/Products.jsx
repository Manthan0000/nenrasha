import { Box, Typography, Grid, Select, MenuItem, FormControl, InputLabel, Paper, Chip } from '@mui/material';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Container from '../components/Container';
import ProductCard from '../components/ProductCard';

function Products() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialSort = queryParams.get('sort') || 'popularity';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState(initialSort);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:5000/api/products?sort=${sortBy}`)
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
    }, [sortBy]);

    return (
        <Box sx={{ 
            py: { xs: 4, md: 8 }, 
            minHeight: '80vh', 
            backgroundColor: '#fafafa',
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,0,0,0.02) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.02) 0%, transparent 50%)'
        }}>
            <Container>
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
                                Our Products
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Chip 
                                    label={`${products.length} Products`}
                                    sx={{ 
                                        backgroundColor: '#000',
                                        color: '#fff',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        height: 28
                                    }}
                                />
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary" 
                                    sx={{ 
                                        fontSize: '0.875rem',
                                        letterSpacing: 0.5
                                    }}
                                >
                                    Ordered by {sortBy === 'popularity' ? 'Popularity' : sortBy.replace(/-/g, ' ')}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <FormControl 
                                size="small" 
                                sx={{ 
                                    minWidth: { xs: '100%', sm: 160 },
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#fff',
                                        borderRadius: 2,
                                        '&:hover': { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#000' } },
                                        '&.Mui-focused': { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#000', borderWidth: 2 } }
                                    }
                                }}
                            >
                                <InputLabel>Sort By</InputLabel>
                                <Select
                                    value={sortBy}
                                    label="Sort By"
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <MenuItem value="popularity">Most Popular</MenuItem>
                                    <MenuItem value="newest">Newest First</MenuItem>
                                    <MenuItem value="price-low-high">Price: Low to High</MenuItem>
                                    <MenuItem value="price-high-low">Price: High to Low</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </Paper>
                
                {loading ? (
                    <Box sx={{ py: 10, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">Loading products...</Typography>
                    </Box>
                ) : products.length === 0 ? (
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
                    </Paper>
                ) : (
                    <Grid container spacing={2.5}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={3} key={product.id}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}

export default Products;
