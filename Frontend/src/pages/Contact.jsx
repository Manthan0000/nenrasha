import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import Container from '../components/Container';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function Contact() {
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
            Contact Us
          </Typography>
          <Typography sx={{ fontSize: '16px', opacity: 0.9 }}>
            Homepage / Pages / Contact Us
          </Typography>
        </Box>
      </Box>

      {/* Map Section */}
      <Box sx={{ width: '100%', height: { xs: '400px', md: '500px' }, mb: { xs: 6, md: 8 } }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3665.561901915584!2d72.647789275321!3d23.259024079008793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c2c777c4b5e63%3A0xf2af0643c7186398!2sIndian%20Institute%20of%20Information%20Technology%20Vadodara%20(Gandhinagar%20Campus)!5e0!3m2!1sen!2sin!4v1769186105051!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
        />
      </Box>

      {/* Contact Form and Information */}
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#fafafa' }}>
        <Container>
          <Grid container spacing={6}>
            {/* Left Side - Contact Form */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  fontSize: { xs: '1.8rem', md: '2.5rem' },
                }}
              >
                Get In Touch
              </Typography>

              <Box
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                          backgroundColor: '#fff',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Email"
                      type="email"
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                          backgroundColor: '#fff',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                <TextField
                  fullWidth
                  label="Your Message"
                  required
                  multiline
                  rows={6}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      backgroundColor: '#fff',
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
                    alignSelf: 'flex-start',
                    '&:hover': {
                      backgroundColor: '#333',
                    },
                  }}
                >
                  Send Message
                </Button>
              </Box>
            </Grid>

            {/* Right Side - Information */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 4,
                  fontSize: { xs: '1.8rem', md: '2.5rem' },
                }}
              >
                Information
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Phone */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <PhoneIcon sx={{ color: '#d32f2f', fontSize: '28px', mt: 0.5 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '16px' }}>
                      Mobile No. :
                    </Typography>
                    <Typography sx={{ fontSize: '16px', color: 'text.secondary' }}>
                      +91 84014+++++
                    </Typography>
                  </Box>
                </Box>

                {/* Email */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <EmailIcon sx={{ color: '#d32f2f', fontSize: '28px', mt: 0.5 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '16px' }}>
                      Email :
                    </Typography>
                    <Typography sx={{ fontSize: '16px', color: 'text.secondary' }}>
                      manthanjasoliya84014@gmail.com
                    </Typography>
                  </Box>
                </Box>

                {/* Address */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <LocationOnIcon sx={{ color: '#d32f2f', fontSize: '28px', mt: 0.5 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '16px' }}>
                      Address:
                    </Typography>
                    <Typography sx={{ fontSize: '16px', color: 'text.secondary', lineHeight: 1.6 }}>
                      Gandhinagar, Gujarat, India.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
      <ScrollToTop />
    </Box>
  );
}

export default Contact;
