import { Box, Typography, Button, Grid} from "@mui/material";
import Categories from '../components/Categories.jsx';
import ProductsSection from '../components/ProductsSection.jsx';
import Container from '../components/Container.jsx';
import { products } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";
import HeroSection from "../components/HeroSection.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";

function Home(){
    return (
        <>
        <HeroSection />
        <Categories />
        <ProductsSection />
        <ScrollToTop />
        </>
    );
}
export default Home;
