import { Box, Typography, Card, CardContent, TextField, Button, Grid, Avatar, Divider, Stack } from '@mui/material';
import Container from '../components/Container';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { useAuth } from '../context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, Link } from 'react-router-dom';

function MyAccount() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
            My Account
          </Typography>
          <Typography sx={{ fontSize: '16px', opacity: 0.9 }}>
            Homepage / Pages / My Account
          </Typography>
        </Box>
      </Box>

      {/* Account Content */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container>
          {user ? (
             // Logged In View
            <Card sx={{ maxWidth: 800, mx: 'auto', borderRadius: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
                  <Avatar
                    src={user.profilePhoto || ''}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      bgcolor: '#f5f5f5',
                      color: '#000'
                    }}
                  >
                    {!user.profilePhoto && <PersonIcon sx={{ fontSize: 60 }} />}
                  </Avatar>
                  
                  <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {user.name || user.username || 'User'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      {user.email}
                    </Typography>
                    
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                      <Button variant="outlined" color="inherit">
                        Edit Profile
                      </Button>
                      <Button 
                        variant="contained" 
                        color="error"
                        onClick={handleLogout}
                        sx={{ 
                            backgroundColor: '#d32f2f',
                            '&:hover': { backgroundColor: '#b71c1c' }
                        }}
                      >
                        Logout
                      </Button>
                      {user.role === 'admin' && (
                          <Button 
                              variant="contained" 
                              sx={{ 
                                  backgroundColor: '#1976d2',
                                  '&:hover': { backgroundColor: '#115293' }
                              }}
                              onClick={() => navigate('/admin/add-product')}
                          >
                              Add Product
                          </Button>
                      )}
                    </Stack>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 4 }} />
                
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Account Details</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{user.name || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Email Address</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{user.email || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">User ID</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{user.id || 'N/A'}</Typography>
                    </Grid>
                     <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Member Since</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{new Date().toLocaleDateString()}</Typography>
                    </Grid>
                </Grid>

              </CardContent>
            </Card>
          ) : (
            // Logged Out View - Login Required Message
            <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center', py: 8 }}>
                <Card sx={{ p: 6, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: 0 }}>
                    <PersonIcon sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Account Access
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
                        Please login to view your account details, track orders, and manage your settings.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Button 
                            component={Link} 
                            to="/login"
                            variant="contained" 
                            size="large"
                            sx={{
                                backgroundColor: '#000',
                                color: '#fff',
                                px: 4,
                                textTransform: 'none',
                                borderRadius: 0,
                                '&:hover': { backgroundColor: '#333' }
                            }}
                        >
                            Login
                        </Button>
                        <Button 
                            component={Link} 
                            to="/register"
                            variant="outlined" 
                            size="large"
                            sx={{
                                color: '#000',
                                borderColor: '#000',
                                px: 4,
                                textTransform: 'none',
                                borderRadius: 0,
                                '&:hover': { backgroundColor: '#f5f5f5', borderColor: '#000' }
                            }}
                        >
                            Register
                        </Button>
                    </Box>
                </Card>
            </Box>
          )}
        </Container>
      </Box>

      <Footer />
      <ScrollToTop />
    </Box>
  );
}

export default MyAccount;