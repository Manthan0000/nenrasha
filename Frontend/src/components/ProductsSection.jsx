import {Box, Typography, Grid} from '@mui/material';
import ProductCard from './ProductCard';

const products = [
    { id: 1, name: 'Stylish Jacket', price: 2499 },
    { id: 2, name: 'Casual Shoes', price: 1999 },
    { id: 3, name: 'Leather Bag', price: 2999 },
    { id: 4, name: 'Summer Dress', price: 1799 },
];

function ProductsSection() {
    return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2, py: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
        New Arrivals
        </Typography>

        <Grid container spacing={3}>
        {products.map((product) => (
            <Grid item key={product.id}>
            <ProductCard
                name={product.name}
                price={product.price}
            />
            </Grid>
        ))}
        </Grid>
    </Box>
    );
}
export default ProductsSection;