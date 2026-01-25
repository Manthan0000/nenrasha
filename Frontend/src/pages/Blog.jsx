import { Box, Typography } from '@mui/material';
import Container from '../components/Container';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

function Blog() {
  return (
    <Box sx={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      {/* Page Title */}
      <Box
        sx={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: { xs: 6, md: 10 },
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Blog
          </Typography>
          <Typography sx={{ fontSize: '16px', opacity: 0.9 }}>
            Homepage / Pages / Blog
          </Typography>
        </Box>
      </Box>

      {/* Blog Content */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 4,
              textAlign: 'center',
              fontSize: { xs: '1.8rem', md: '2.5rem' },
            }}
          >
            Our Blog
          </Typography>
          <Typography
            sx={{
              fontSize: '16px',
              color: 'text.secondary',
              textAlign: 'center',
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Welcome to our blog. Stay updated with the latest fashion trends, style tips, and news from Nenrasha Store.
          </Typography>
        </Container>
      </Box>

      <Footer />
      <ScrollToTop />
    </Box>
  );
}

export default Blog;
