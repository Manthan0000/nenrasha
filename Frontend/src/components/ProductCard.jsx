import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Chip,
    }from '@mui/material';
function ProductCard({ product }) {
    return (
        <Card
        sx={{
        borderRadius: 3,
        boxShadow: 'none',
        cursor: 'pointer',
        }}
        >
      {/* Image */}
        <Box sx={{ position: 'relative' }}>
        {product.isSale && (
            <Chip
                label="-25%"
                color="error"
                size="small"
                sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    zIndex: 1,
                }}
            />
        )}

        <CardMedia
            component="img"
            height="300"
            image={product.image}
            alt={product.name}
        />
        </Box>

      {/* Content */}
        <CardContent sx={{ px: 0 }}>
        <Typography fontWeight="500">
            {product.name}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            {product.oldPrice && (
            <Typography
                sx={{ textDecoration: 'line-through', color: '#999' }}
            >
                ${product.oldPrice}
            </Typography>
            )}

            <Typography fontWeight="bold">
            ${product.price}
            </Typography>
        </Box>
        </CardContent>
        </Card>
    );
}

export default ProductCard;
