import { Box, Typography, Button, Grid} from "@mui/material";
import Categories from '../components/Categories.jsx';
import ProductsSection from '../components/ProductsSection.jsx';
import Container from '../components/Container.jsx';
import { products } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";
import HeroSection from "../components/HeroSection.jsx";

function Home(){
    return (
        <>
        <HeroSection />
        <Categories />

    <Grid container spacing={3}>
        {products.map((product) => (
            <Grid
                key={product.id}
                gridColumn={{ xs: 'span 12', sm: 'span 6', md: 'span 3' }}
            >
            <ProductCard product={product} />
            </Grid>
        ))}
    </Grid>
        <ProductsSection />
        </>
    );
}
export default Home;
