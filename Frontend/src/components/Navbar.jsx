import {AppBar, Toolbar, Typography, Button, Box} from '@mui/material';
import {Link} from 'react-router-dom';

function Navbar(){
    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar sx={{justifyContent: 'space-between'}}>
                {/* Logo */}
                <Typography variant="h6" component={Link} to="/" sx={{textDecoration: 'none', color: 'black', fontweight: 'bold'}}>Nenrasha</Typography>
                {/*Menu*/}
                <Box>
                    <Button component={Link} to="/" sx={{color: 'black', textTransform: 'none'}}>Home</Button>
                    <Button component={Link} to="/login" sx={{color: 'black', textTransform: 'none'}}>Login</Button>
                    <Button component={Link} to="/register" sx={{color: 'black', textTransform: 'none'}}>Register</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
export default Navbar;