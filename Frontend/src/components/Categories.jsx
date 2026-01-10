import { Box, Typography, Grid, Card } from '@mui/material';
const categories = [
    { name: 'New In' },
    { name: 'Promotion' },
    { name: 'Clothing' },
    { name: 'Shoes' },
    { name: 'Bags' },
];
function Categories() {
    return (
    <Box
        sx={{
        mx: 'auto',
        px: 2,
        py: 6,
        }} 
    >
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        Categories you might like
        </Typography>

        <Grid container spacing={7} justifyContent="center" sx={{ mt: 5 }}>
        {categories.map((category) => (
            <Grid key={category.name}>
            <Card
                sx={{
                width: 180,
                height: 180,
                borderRadius: '50%',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.05)',
                },
                }}
            >
                <Typography fontWeight="medium">
                {category.name}
                </Typography>
            </Card>
            </Grid>
        ))}
        </Grid>
    </Box>
    );
}
export default Categories;