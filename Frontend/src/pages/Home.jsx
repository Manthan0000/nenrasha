import { Box, Typography, Button } from "@mui/material";
import Categories from '../components/Categories.jsx';
import ProductsSection from '../components/ProductsSection';

function Home(){
    return (
        <>
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
        <Categories />
        <ProductsSection />
        </>
    );
}
export default Home;
