import { Box, Typography, Card, CardContent, Button, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import Container from '../components/Container';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const tabContent = [
  {
    title: 'Introduction',
    content: 'Welcome to Nenrasha Store, your premier destination for fashion-forward clothing and accessories. We pride ourselves on offering a curated selection of rare and beautiful items sourced both locally and globally. Our mission is to bring you the latest trends and timeless styles, ensuring every piece reflects quality and elegance. Discover the perfect addition to your wardrobe at Nenrasha Store.'
  },
  {
    title: 'Our Vision',
    content: 'At Nenrasha, we envision a world where fashion meets sustainability and style knows no boundaries. We are committed to providing exceptional quality products while maintaining ethical practices and environmental responsibility. Our vision is to be the go-to destination for fashion enthusiasts who value both aesthetics and integrity.'
  },
  {
    title: 'Difference',
    content: 'What makes Nenrasha unique is our dedication to curating rare and beautiful items that you won\'t find anywhere else. We carefully select each product, ensuring it meets our high standards for quality, design, and value. Our team works tirelessly to bring you the best in fashion, combining global trends with timeless elegance.'
  },
];

function About() {
  const [value, setValue] = useState(0);

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
            About Our Store
          </Typography>
          <Typography sx={{ fontSize: '16px', opacity: 0.9 }}>
            Homepage / Pages / About Our Store
          </Typography>
        </Box>
      </Box>

      {/* About Content */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              alignItems: 'flex-start',
              mb: 8,
            }}
          >
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop"
                alt="About Nenrasha"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                }}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  mb: 4,
                  fontSize: { xs: '1.8rem', md: '2.5rem' },
                }}
              >
                Nenrasha – Offering rare and beautiful items worldwide
              </Typography>

              {/* Tabs */}
              <Box sx={{ mb: 3 }}>
                <Tabs
                  value={value}
                  onChange={(e, newValue) => setValue(newValue)}
                  sx={{
                    borderBottom: '1px solid #e0e0e0',
                    mb: 3,
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      minWidth: 'auto',
                      px: 2,
                      py: 1,
                      color: '#666',
                      '&.Mui-selected': {
                        color: '#d32f2f',
                        fontWeight: 'bold',
                      },
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#d32f2f',
                      height: '2px',
                    },
                  }}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {tabContent.map((tab, index) => (
                    <Tab key={index} label={tab.title} />
                  ))}
                </Tabs>

                {/* Tab Content */}
                <Box sx={{ minHeight: '150px', py: 2 }}>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      lineHeight: 1.8,
                      color: 'text.secondary',
                    }}
                  >
                    {tabContent[value].content}
                  </Typography>
                </Box>
              </Box>

              {/* Read More Button */}
              <Button
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
                endIcon={<ArrowForwardIcon />}
              >
                Read More
              </Button>
            </Box>
          </Box>

          {/* Our Team - Single Member */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Meet Our Team
            </Typography>
            <Typography
              sx={{
                fontSize: '16px',
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
                mb: 6,
              }}
            >
              The passionate individual behind Nenrasha Store
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                sx={{
                  maxWidth: 350,
                  borderRadius: 0,
                  boxShadow: 'none',
                  border: '1px solid #e0e0e0',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover img': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="https://res.cloudinary.com/ducxkpytj/image/upload/v1769185142/image-4_sa9gjr.jpg"
                    alt="Manthan Jasoliya"
                    sx={{
                      width: '100%',
                      height: 350,
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      fontSize: '1.25rem',
                    }}
                  >
                    Manthan Jasoliya
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: 'text.secondary',
                    }}
                  >
                    Founder & CEO
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
      <ScrollToTop />
    </Box>
  );
}

export default About;
