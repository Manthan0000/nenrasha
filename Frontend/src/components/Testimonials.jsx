import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import API_URL from '../config/api';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch(`${API_URL}/api/reviews/testimonials`);
            const data = await res.json();
            if (data.success) {
                setTestimonials(data.data);
            }
        } catch (err) {
            console.error('Fetch testimonials error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || testimonials.length === 0) {
        return null;
    }

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatProductName = (product) => {
        if (!product) return '';
        return typeof product === 'string' ? product : product.name || '';
    };

    return (
        <Box sx={{
            py: { xs: 8, md: 10 },
            background: 'linear-gradient(180deg, #fafafa 0%, #f0f0f0 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Container maxWidth="lg">
                <Typography variant="h4" sx={{
                    textAlign: 'center',
                    fontWeight: 800,
                    mb: 1,
                    fontSize: { xs: '1.75rem', md: '2.5rem' },
                    color: '#111'
                }}>
                    What Our Customers Say
                </Typography>
                <Typography sx={{
                    textAlign: 'center',
                    color: '#666',
                    mb: 6,
                    fontSize: { xs: '0.9rem', md: '1rem' }
                }}>
                    Real reviews from verified buyers
                </Typography>

                <Grid container spacing={3}>
                    {testimonials.map((review, index) => (
                        <Grid item xs={12} sm={6} md={4} key={review._id || index}>
                            <Box sx={{
                                background: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                p: 3,
                                height: '100%',
                                border: '1px solid rgba(255, 255, 255, 0.8)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)'
                                }
                            }}>
                                <Box sx={{
                                    position: 'absolute',
                                    top: 20,
                                    right: 20,
                                    fontSize: '4rem',
                                    lineHeight: 1,
                                    color: 'rgba(0, 0, 0, 0.06)',
                                    fontFamily: 'Georgia, serif',
                                    fontWeight: 700
                                }}>
                                    "
                                </Box>

                                <Typography sx={{
                                    color: '#333',
                                    mb: 2.5,
                                    lineHeight: 1.7,
                                    fontSize: '0.95rem',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    "{review.comment}"
                                </Typography>

                                <Box sx={{ display: 'flex', mb: 1.5 }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <StarIcon
                                            key={star}
                                            sx={{
                                                fontSize: 18,
                                                color: star <= review.rating ? '#f59e0b' : '#e0e0e0'
                                            }}
                                        />
                                    ))}
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: '50%',
                                        bgcolor: '#111',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '0.85rem'
                                    }}>
                                        {getInitials(review.user?.name)}
                                    </Box>
                                    <Box>
                                        <Typography sx={{
                                            fontWeight: 700,
                                            fontSize: '0.95rem',
                                            color: '#111',
                                            lineHeight: 1.3
                                        }}>
                                            {review.user?.name || 'Anonymous'}
                                        </Typography>
                                        <Typography sx={{
                                            fontSize: '0.75rem',
                                            color: '#888',
                                            lineHeight: 1.3
                                        }}>
                                            {formatProductName(review.product)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Testimonials;
