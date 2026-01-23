import { Box, Typography, Tabs, Tab, IconButton } from '@mui/material';
import { useState, useRef } from 'react';
import ProductCard from './ProductCard';
import { newArrivals, bestSellers, onSale } from '../data/products';
import Container from './Container';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const productCategories = [newArrivals, bestSellers, onSale];
const tabLabels = ['New Arrivals', 'Best Seller', 'On Sale'];

function ProductTabs() {
  const [value, setValue] = useState(0);
  const scrollContainerRef = useRef(null);
  const products = productCategories[value];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box sx={{ py: 6 }}>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Tabs
            value={value}
            onChange={(e, newValue) => {
              setValue(newValue);
              // Reset scroll position when tab changes
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollLeft = 0;
              }
            }}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 500,
                minWidth: '150px',
                '&.Mui-selected': {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  textDecorationThickness: '2px',
                },
              },
            }}
          >
            {tabLabels.map((label) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ position: 'relative' }}>
          {/* Left Arrow */}
          <IconButton
            onClick={scrollLeft}
            sx={{
              position: 'absolute',
              left: { xs: -20, md: -50 },
              top: '45%',
              transform: 'translateY(-50%)',
              backgroundColor: '#f5f5f5',
              zIndex: 2,
              '&:hover': { backgroundColor: '#e0e0e0' },
              display: { xs: 'none', md: 'flex' },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          {/* Scrollable Container */}
          <Box
            ref={scrollContainerRef}
            sx={{
              display: 'flex',
              gap: 3,
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none', // Firefox
              '&::-webkit-scrollbar': {
                display: 'none', // Chrome, Safari
              },
              px: { xs: 2, md: 0 },
              pb: 2,
            }}
          >
            {products.map((product) => (
              <Box
                key={product.id}
                sx={{
                  minWidth: { xs: '280px', sm: '300px', md: '280px' },
                  maxWidth: { xs: '280px', sm: '300px', md: '280px' },
                  flexShrink: 0,
                }}
              >
                <ProductCard product={product} />
              </Box>
            ))}
          </Box>

          {/* Right Arrow */}
          <IconButton
            onClick={scrollRight}
            sx={{
              position: 'absolute',
              right: { xs: -20, md: -50 },
              top: '45%',
              transform: 'translateY(-50%)',
              backgroundColor: '#f5f5f5',
              zIndex: 2,
              '&:hover': { backgroundColor: '#e0e0e0' },
              display: { xs: 'none', md: 'flex' },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}

export default ProductTabs;
