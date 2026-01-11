import { Card, CardContent, Typography, Box } from "@mui/material";

function ProductCard({ product }) {
    return (
        <Card
            sx={{
            borderRadius: 3,
            boxShadow: "none",
            }}
        >
        {/* IMAGE BOX */}
        <Box
            sx={{
            position: "relative",
            width: "100%",
            height: 320, // 🔥 FIXED HEIGHT
            overflow: "hidden",
            borderRadius: 3,
            backgroundColor: "#f5f5f5",
            }}
        >
        <img
            src={product.image}
            alt={product.title}
            style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // 🔥 MOST IMPORTANT
            }}
        />

        {product.isSale && (
            <Box
            sx={{
                position: "absolute",
                top: 12,
                left: 12,
                backgroundColor: "#e53935",
                color: "#fff",
                fontSize: 12,
                px: 1.2,
                py: 0.4,
                borderRadius: 10,
            }}
            >
            -25%
            </Box>
        )}
        </Box>

      {/* CONTENT */}
        <CardContent sx={{ px: 0 }}>
        <Typography fontWeight={500}>{product.title}</Typography>

        <Typography fontWeight={600}>${product.price}</Typography>
        </CardContent>
    </Card>
    );
}

export default ProductCard;
