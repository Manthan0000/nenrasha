import { Box, Typography, Tabs, Tab, IconButton } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import ProductCard from './ProductCard';

import Container from './Container';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const tabLabels = ['On Sale', 'Trending'];

function ProductTabs() {
  const [value, setValue] = useState(0);
  const scrollContainerRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data.map(p => ({ ...p, id: p._id })));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter products based on active tab
  const getFilteredProducts = () => {
    const currentLabel = tabLabels[value];
    if (currentLabel === 'On Sale') {
        return products
          .filter((product) => product.discount > 20)
          .sort((a, b) => (b.discount || 0) - (a.discount || 0));
    } else if (currentLabel === 'Trending') {
        // Sort by visits descending and take top 8
        return [...products].sort((a, b) => (b.visits || 0) - (a.visits || 0)).slice(0, 8);
    }
    return [];
  };

  const displayedProducts = getFilteredProducts();

  // Reset scroll when tab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [value]);

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
    <Box sx={{ py: 6 }} id="product-tabs">
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Tabs
            value={value}
            onChange={(e, val) => setValue(val)}
            centered
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '18px',
                fontWeight: 500,
                minWidth: 'auto',
                mx: 3,
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
            {displayedProducts.map((product) => (
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
