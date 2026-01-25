import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';

function Navbar() {
  const location = useLocation();
  const [pagesMenuOpen, setPagesMenuOpen] = useState(false);

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #eee',
      }}
    >
      <Toolbar 
        sx={{
          maxWidth: '1200px',
          width: '100%',
          mx: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
        }}
      >
        {/* Logo */}
        <Typography 
          variant="h5" 
          component={Link} 
          to="/" 
          sx={{
            textDecoration: 'none', 
            color: '#000', 
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '1px',
          }}
        >
          Modave
        </Typography>

        {/* Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button 
            component={Link} 
            to="/" 
            sx={{
              color: location.pathname === '/' ? '#d32f2f' : '#000',
              textTransform: 'none',
              fontWeight: location.pathname === '/' ? 'bold' : 'normal',
              fontSize: '15px',
              '&:hover': { backgroundColor: 'transparent' }
            }}
          >
            Home
          </Button>
          <Button 
            sx={{
              color: '#000',
              textTransform: 'none',
              fontSize: '15px',
              '&:hover': { backgroundColor: 'transparent' }
            }}
          >
            Shop
          </Button>
          <Button 
            sx={{
              color: '#000',
              textTransform: 'none',
              fontSize: '15px',
              '&:hover': { backgroundColor: 'transparent' }
            }}
          >
            Products
          </Button>
          <Button 
            component={Link}
            to="/blog"
            sx={{
              color: location.pathname === '/blog' ? '#d32f2f' : '#000',
              textTransform: 'none',
              fontWeight: location.pathname === '/blog' ? 'bold' : 'normal',
              fontSize: '15px',
              '&:hover': { backgroundColor: 'transparent' }
            }}
          >
            Blog
          </Button>
          <Box
            sx={{
              position: 'relative',
            }}
            onMouseEnter={() => setPagesMenuOpen(true)}
            onMouseLeave={() => setPagesMenuOpen(false)}
          >
            <Button 
              sx={{
                color: (location.pathname === '/about' || location.pathname === '/contact' || location.pathname === '/blog' || location.pathname === '/my-account') ? '#d32f2f' : '#000',
                textTransform: 'none',
                fontWeight: (location.pathname === '/about' || location.pathname === '/contact' || location.pathname === '/blog' || location.pathname === '/my-account') ? 'bold' : 'normal',
                fontSize: '15px',
                '&:hover': { backgroundColor: 'transparent' }
              }}
              endIcon={<KeyboardArrowDownIcon />}
            >
              Pages
            </Button>
            <Box
              className="pages-dropdown"
              sx={{
                display: pagesMenuOpen ? 'block' : 'none',
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: '#fff',
                minWidth: '200px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '4px',
                zIndex: 1000,
                mt: 0.5,
                border: '1px solid #eee',
              }}
            >
              <Box
                component={Link}
                to="/about"
                sx={{
                  display: 'block',
                  px: 2,
                  py: 1.5,
                  textDecoration: 'none',
                  color: location.pathname === '/about' ? '#d32f2f' : '#000',
                  fontSize: '15px',
                  fontWeight: location.pathname === '/about' ? 'bold' : 'normal',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    color: '#d32f2f',
                  },
                }}
              >
                About Us
              </Box>
              <Box
                component={Link}
                to="/contact"
                sx={{
                  display: 'block',
                  px: 2,
                  py: 1.5,
                  textDecoration: 'none',
                  color: location.pathname === '/contact' ? '#d32f2f' : '#000',
                  fontSize: '15px',
                  fontWeight: location.pathname === '/contact' ? 'bold' : 'normal',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    color: '#d32f2f',
                  },
                }}
              >
                Contact Us
              </Box>
              <Box
                component={Link}
                to="/blog"
                sx={{
                  display: 'block',
                  px: 2,
                  py: 1.5,
                  textDecoration: 'none',
                  color: location.pathname === '/blog' ? '#d32f2f' : '#000',
                  fontSize: '15px',
                  fontWeight: location.pathname === '/blog' ? 'bold' : 'normal',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    color: '#d32f2f',
                  },
                }}
              >
                Blog
              </Box>
              <Box
                component={Link}
                to="/my-account"
                sx={{
                  display: 'block',
                  px: 2,
                  py: 1.5,
                  textDecoration: 'none',
                  color: location.pathname === '/my-account' ? '#d32f2f' : '#000',
                  fontSize: '15px',
                  fontWeight: location.pathname === '/my-account' ? 'bold' : 'normal',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    color: '#d32f2f',
                  },
                }}
              >
                My account
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Icons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton sx={{ color: '#000' }}>
            <SearchIcon />
          </IconButton>
          <IconButton sx={{ color: '#000' }}>
            <PersonIcon />
          </IconButton>
          <IconButton sx={{ color: '#000' }}>
            <FavoriteIcon />
          </IconButton>
          <IconButton sx={{ color: '#000', position: 'relative' }}>
            <Badge badgeContent={0} color="error">
              <ShoppingBagIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;