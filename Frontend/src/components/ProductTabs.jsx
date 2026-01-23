import { Box, Typography, Tabs, Tab, Grid } from '@mui/material';
import { useState } from 'react';
import ProductCard from './ProductCard';
import { newArrivals, bestSellers, onSale } from '../data/products';
import Container from './Container';
const productCategories = [newArrivals, bestSellers, onSale];
const tabLabels = ['New Arrivals', 'Best Seller', 'On Sale'];

function ProductTabs() {
    const [value, setValue] = useState(0);
    const products = productCategories[value];

    return (
        <Box sx={{ py: 6 }}>
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                    <Tabs
                        value={value}
                        onChange={(e, newValue) => setValue(newValue)}
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 500,
                                minWidth: '150px',
                                '&.Mui-selected': {
                                    fontWeight: 'bold',
                                    textDecoration: 'underline',
                                    textDecorationThickness: '2px',
                                },
                            },
                        }}
                    >
                        {tabLabels.map((label) => (
                            <Tab key={label} label={label} />
                        ))}
                    </Tabs>
                </Box>
                
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={3} key={product.id}>
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default ProductTabs;
