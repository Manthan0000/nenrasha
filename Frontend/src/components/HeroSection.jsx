import { Box, Typography, Button } from '@mui/material';
import { heroBanner } from '../data/banners';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function HeroSection() {
  return (
    <Box 
      sx={{ 
        mb: 4, 
        width: '100%',
        position: 'relative',
        height: { xs: '400px', md: '600px' },
        backgroundImage: `url(${heroBanner.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: { xs: 'center', md: heroBanner.position === 'left' ? 'flex-start' : 'flex-end' },
        px: { xs: 3, md: 6 },
        py: 4,
      }}
    >
      <Box
        sx={{
          color: '#fff',
          maxWidth: '1200px',
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Typography
          variant="overline"
          sx={{
            fontSize: { xs: '12px', md: '14px' },
            letterSpacing: '2px',
            fontWeight: 'normal',
            mb: 1,
            display: 'block',
          }}
        >
          {heroBanner.title}
        </Typography>
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
            fontWeight: 'bold',
            mb: 3,
            lineHeight: 1.2,
          }}
        >
          {heroBanner.subtitle}
        </Typography>
        <Button
          variant="outlined"
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
          {heroBanner.buttonText}
        </Button>
      </Box>
    </Box>
  );
}
export default HeroSection;