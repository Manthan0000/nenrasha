import { Box, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const heroSlides = [
  {
    image: 'https://res.cloudinary.com/ducxkpytj/image/upload/v1773084990/1_nciuwv.jpg',
    showButton: true,
  },
  {
    image: 'https://res.cloudinary.com/ducxkpytj/image/upload/v1773085055/2_mxpla2.jpg',
    showButton: false,
  },
  {
    image: 'https://res.cloudinary.com/ducxkpytj/image/upload/v1773085083/3_w0k3bd.jpg',
    showButton: false,
  },
];

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleExploreNow = () => {
    navigate('/products');
  };

  return (
    <Box sx={{ mb: 4, width: '100%', position: 'relative', height: { xs: '400px', md: '600px' }, overflow: 'hidden' }}>
      {heroSlides.map((slide, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: index === currentSlide ? 1 : 0,
            visibility: index === currentSlide ? 'visible' : 'hidden',
            transition: 'opacity 0.5s ease-in-out',
            display: 'flex',
            pointerEvents: index === currentSlide ? 'auto' : 'none',
            alignItems: 'center',
            justifyContent: index === 0 ? 'flex-start' : 'center',
            px: { xs: 3, md: 6 },
            py: 4,
          }}
        >
          {slide.showButton && index === currentSlide && (
            <Box sx={{ 
              zIndex: 20, 
              ml: { xs: 2, md: 8 },
              mt: { xs: 20, md: 0 }
            }}>
              <Button
                variant="outlined"
                onClick={handleExploreNow}
                sx={{
                  color: '#fff',
                  borderColor: '#fff',
                  borderWidth: '2px',
                  px: { xs: 3, md: 4 },
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: { xs: '14px', md: '16px' },
                  '&:hover': {
                    borderColor: '#fff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Explore Now
              </Button>
            </Box>
          )}
        </Box>
      ))}

      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 10,
        }}
      >
        {heroSlides.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentSlide(index)}
            sx={{
              width: currentSlide === index ? '32px' : '12px',
              height: '12px',
              backgroundColor: currentSlide === index ? '#fff' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: '#fff',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default HeroSection;
