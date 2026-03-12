import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Grid, 
  Button, 
  CircularProgress
} from '@mui/material';
import Container from '../components/Container';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ProductCard from '../components/ProductCard';

function LikedProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchLikedProducts();
  }, [user, navigate]);

  const fetchLikedProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/products/liked', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        // Map backend _id to frontend id for ProductCard
        const mappedProducts = data.data.map(p => ({
            ...p,
            id: p._id
        }));
        setLikedProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Error fetching liked products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Page Title */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #111 0%, #333 100%)',
          py: { xs: 8, md: 10 },
          textAlign: 'center',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            mb: 1.5,
            fontSize: { xs: '2.5rem', md: '4rem' },
            letterSpacing: -1,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}
        >
          My Liked Products
        </Typography>
        <Typography sx={{ 
          fontSize: '13px', 
          opacity: 0.8, 
          textTransform: 'uppercase', 
          letterSpacing: 3,
          fontWeight: 600
        }}>
          Home / Favorites
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ py: { xs: 6, md: 8 }, flexGrow: 1 }}>
        <Container>
          <Box sx={{ animation: 'fadeIn 0.4s ease-in-out' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
              <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -1, color: '#111' }}>
                Favorites
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {likedProducts.length} Items
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress sx={{ color: '#111' }} />
              </Box>
            ) : likedProducts.length > 0 ? (
              <Grid container spacing={3} alignItems="stretch">
                {likedProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={product.id} sx={{ display: 'flex' }}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card sx={{ 
                borderRadius: '24px', 
                p: { xs: 6, md: 10 }, 
                textAlign: 'center',
                background: 'linear-gradient(180deg, #fff 0%, #fafafa 100%)',
                border: '2px dashed #e5e7eb',
                boxShadow: 'none'
              }}>
                <FavoriteIcon sx={{ fontSize: 60, color: '#e5e7eb', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#111', mb: 1.5 }}>
                  No favorites yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '400px', mx: 'auto' }}>
                  Tap the heart on any product to save it to your favorites. Check out what's new below!
                </Typography>
                <Button 
                  component={Link} 
                  to="/products" 
                  variant="contained"
                  size="large"
                  sx={{ 
                    bgcolor: '#111', 
                    borderRadius: '14px',
                    px: 5,
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    '&:hover': { bgcolor: '#000', boxShadow: '0 10px 24px rgba(0,0,0,0.2)', transform: 'translateY(-2px)' },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Explore Products
                </Button>
              </Card>
            )}
          </Box>
        </Container>
      </Box>

      <Footer />
      <ScrollToTop />
    </Box>
  );
}

export default LikedProducts;
