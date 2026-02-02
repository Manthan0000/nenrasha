import { Card, CardContent, Typography, Box, IconButton, Button, Stack } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';



const actionIcons = [
    {Icon: FavoriteIcon},
    {Icon: VisibilityIcon},
];

const formatPrice = (priceINR) => {
    return `₹${priceINR.toLocaleString('en-IN')}`;
};

const getOldPrice = (oldPriceINR) => {
    return oldPriceINR ? `₹${oldPriceINR.toLocaleString('en-IN')}` : null;
};

function ProductCard({ product }){
    const navigate = useNavigate();
    return(
        <Card
            sx={{
                borderRadius: 0,
                boxShadow: "none",
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                    '& .product-actions': {
                        opacity: 1,
                    },
                    '& .add-to-cart': {
                        opacity: 1,
                        transform: 'translateY(0)',
                    },
                },
            }}
        >
        {/* IMAGE BOX */}
        <Box
            sx={{
                position: "relative",
                width: "100%",
                height: 400,
                overflow: "hidden",
                backgroundColor: "#f5f5f5",
                cursor: 'pointer',
            }}
            onClick={() => navigate(`/product/${product.id}`)}
        >
            <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                }}
            />

            {product.discount > 0 && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        backgroundColor: "#d32f2f",
                        color: "#fff",
                        fontSize: 12,
                        px: 1.5,
                        py: 0.5,
                        fontWeight: 'bold',
                    }}
                >
                    -{product.discount}%
                </Box>
            )}
            {/* Action Icons */}
            <Box
                className="product-actions"
                sx={{
                    position: 'absolute',
                    right: 12,
                    top: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                }}
            >
            {actionIcons.map(({ Icon }, index) => (
                <IconButton
                    key={index}
                    size="small"
                    sx={{
                        backgroundColor: '#fff',
                        '&:hover': { backgroundColor: '#f5f5f5' },
                    }}
                >
                    <Icon fontSize="small" />
                </IconButton>
            ))}
            </Box>

            {/* Add to Cart Button */}
            <Button
                className="add-to-cart"
                variant="contained"
                fullWidth
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#000',
                    color: '#fff',
                    borderRadius: 0,
                    py: 1.5,
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    opacity: 0,
                    transform: 'translateY(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: '#333',
                    },
                }}
            >
                Add to Cart
            </Button>
        </Box>

        {/* CONTENT */}
        <CardContent sx={{ px: 0, pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {product.brand}
            </Typography>
            <Typography fontWeight={500} sx={{ mb: 1, fontSize: '15px' }}>
                {product.name}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                {product.oldPriceINR ? (
                    <>
                        <Typography
                            sx={{
                                textDecoration: 'line-through',
                                color: 'text.secondary',
                                fontSize: '14px',
                            }}
                        >
                            {getOldPrice(product.oldPriceINR)}
                        </Typography>
                        <Typography fontWeight={600} sx={{ fontSize: '16px', color: '#d32f2f' }}>
                            {formatPrice(product.priceINR)}
                        </Typography>
                    </>
                ):(
                    <Typography fontWeight={600} sx={{ fontSize: '16px' }}>
                        {formatPrice(product.priceINR)}
                    </Typography>
                )}
            </Box>


        </CardContent>
        </Card>
    );
}
export default ProductCard;