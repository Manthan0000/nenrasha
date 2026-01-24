import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

function Navbar() {
    const location = useLocation();

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
            Nenrasha
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
                sx={{
                    color: '#000',
                    textTransform: 'none',
                    fontSize: '15px',
                    '&:hover': { backgroundColor: 'transparent' }
                }}
            >
                Blog
            </Button>
            <Button 
                component={Link}
                to="/about"
                sx={{
                    color: location.pathname === '/about' ? '#d32f2f' : '#000',
                    textTransform: 'none',
                    fontSize: '15px',
                    '&:hover': { backgroundColor: 'transparent' }
                }}
            >
                Pages
            </Button>
            <Button 
                sx={{
                    color: '#000',
                    textTransform: 'none',
                    fontSize: '15px',
                    '&:hover': { backgroundColor: 'transparent' }
                }}
            >
                Buy Theme
            </Button>
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