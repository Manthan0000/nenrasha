import { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress, Button } from '@mui/material';
import Container from '../components/Container';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ScrollToTop from '../components/ScrollToTop';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function MyListings() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchMyListings();
  }, [user, navigate]);

  const fetchMyListings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/my-listings', {
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
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ bgcolor: '#000', py: 6, color: '#fff' }}>
        <Container>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/my-account')}
                sx={{ color: '#fff', mb: 2, textTransform: 'none', '&:hover': { opacity: 0.8 } }}
            >
                Back to Account
            </Button>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>My Product Listings</Typography>
            <Typography sx={{ opacity: 0.7 }}>Manage and edit your products</Typography>
        </Container>
      </Box>

      <Box sx={{ py: 8, flexGrow: 1 }}>
        <Container>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress color="inherit" />
            </Box>
          ) : products.length > 0 ? (
            <Grid container spacing={4} alignItems="stretch">
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} sx={{ display: 'flex' }}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>You haven't listed any products yet.</Typography>
              <Button 
                component={Link} 
                to="/admin/add-product" 
                variant="contained"
                sx={{ bgcolor: '#000', borderRadius: 0, px: 4, py: 1.5, '&:hover': { bgcolor: '#333' } }}
              >
                Add Your First Product
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

export default MyListings;
