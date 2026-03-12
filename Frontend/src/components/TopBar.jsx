import { Box, Typography, Select, MenuItem, Link } from "@mui/material";
function TopBar(){
    return(
        <Box sx={{
            backgroundColor: '#000',
            color: '#fff',
            py: 1,
            px: 2,
            display: {xs: 'none', md: 'flex'},
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '14px',
            maxWidth: '100%',
        }}>
            <Typography component="span" sx={{ fontSize: '14px' }}>
                +91 8401487213
            </Typography>
            <Typography component="span" sx={{ fontSize: '14px' }}>
                manthanjasoliya84014@gmail.com
            </Typography>
            <Link href="/" sx={{ color: '#fff', textDecoration: 'none', fontSize: '14px', '&:hover': { textDecoration: 'underline' } }}>
                Our Store
            </Link>
        </Box>
    );
}
export default TopBar;
