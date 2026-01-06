import { Box, Typography, Button } from "@mui/material";

function Home(){
    return (
        <Box sx={{minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',textAlign: 'center',
            px: 2,
        }}>
            <Box>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Discover Your Style
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Explore the latest fashion trends at Nenrasha
                </Typography>
                <Button variant="contained" size="large">
                    Shop Now
                </Button>
            </Box>
        </Box>
    );
}
export default Home;
