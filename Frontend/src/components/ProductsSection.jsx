import { Grid } from '@mui/material';
import ProductCard from './ProductCard';
import { products } from '../data/products';

function ProductsSection() {
    return (
        <Grid container spacing={3} columns={12}>
            {products.map((product) => (
        <Grid
            key={product.id}
            gridColumn={{
                xs: 'span 12',
                sm: 'span 6',
                md: 'span 3',
            }}
        >
            <ProductCard product={product} />
        </Grid>
        ))}
        </Grid>
    );
}
export default ProductsSection;