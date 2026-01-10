import { Box, Typography, Button, Grid} from "@mui/material";
import Categories from '../components/Categories.jsx';
import ProductsSection from '../components/ProductsSection.jsx';
import Container from '../components/Container.jsx';
import { products } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";

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

    <Grid container spacing={3} columns={12}>
        {products.map((product) => (
            <Grid key={product.id} gridColumn="span 3">
                <ProductCard product={product} />
            </Grid>
        ))}
    </Grid>
        <ProductsSection />
        </>
    );
}
export default Home;
