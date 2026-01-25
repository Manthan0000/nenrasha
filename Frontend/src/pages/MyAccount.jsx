import { Box, Typography, Card, CardContent, TextField, Button, Grid } from '@mui/material';
import Container from '../components/Container';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

function MyAccount() {
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
          <Grid container spacing={4}>
            {/* Login Form */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      mb: 3,
                      fontSize: { xs: '1.5rem', md: '2rem' },
                    }}
                  >
                    Login
                  </Typography>
                  <Box
                    component="form"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Username or Email"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: '#000',
                        color: '#fff',
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '16px',
                        borderRadius: 0,
                        '&:hover': {
                          backgroundColor: '#333',
                        },
                      }}
                    >
                      Login
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Register Form */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      mb: 3,
                      fontSize: { xs: '1.5rem', md: '2rem' },
                    }}
                  >
                    Register
                  </Typography>
                  <Box
                    component="form"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: '#000',
                        color: '#fff',
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '16px',
                        borderRadius: 0,
                        '&:hover': {
                          backgroundColor: '#333',
                        },
                      }}
                    >
                      Register
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
      <ScrollToTop />
    </Box>
  );
}

export default MyAccount;