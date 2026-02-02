import { useParams } from 'react-router-dom';
import { Box, Typography, Grid } from '@mui/material';
import Container from '../components/Container';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

// Helper to normalize category matching
const normalizeCategory = (cat) => cat.toLowerCase().replace(/[^a-z0-9]/g, '');

function CategoryPage() {
    const { categoryName } = useParams();
    const isAll = categoryName && categoryName.toLowerCase() === 'all';
    
    const filteredProducts = isAll ? products : products.filter(product => {
        // Handle mapping if necessary. The URL param will be the category name.
        if (!categoryName) return false;
        
        // Match logic:
        // URL might be "GenZ", data is "Genz".
        // URL might be "Watches & Glasses", data is matches.
        
        // We can use the logic from ProductTabs but inverse.
        if (categoryName === 'GenZ') return product.category === 'Genz';
        if (categoryName === 'Watches & Glasses') return product.category === 'Watches & Glasses';
        
        return product.category.toLowerCase() === categoryName.toLowerCase();
    });

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 4, textTransform: 'capitalize' }}>
                {isAll ? 'All Products' : `${categoryName} Collection`}
            </Typography>
            
            {filteredProducts.length === 0 ? (
                <Typography variant="h6">No products found in this category.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {filteredProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={3} key={product.id}>
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}

export default CategoryPage;
