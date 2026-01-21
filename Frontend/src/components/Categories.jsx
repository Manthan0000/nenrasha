import {Box,Typography,Grid,Card,CardContent} from "@mui/material";
import { categories } from "../data/categories.js";
function Categories() {
    return(
        <Box
        sx={{
            maxWidth: "1200px",
            mx: "auto",
            px: 2,
            py: 6,
        }}
        >
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
            }}
        >
            <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" } }}
            >
            Categories you might like
            </Typography>
            <Typography
            component="a"
            href="#"
            sx={{
                textDecoration: "underline",
                color: "#000",
                fontSize: "16px",
                "&:hover": { color: "#d32f2f" },
            }}
            >
            View All Collection
            </Typography>
        </Box>

        <Box sx={{ position: "relative" }}>
            <Grid container spacing={4} justifyContent="center" sx={{ px: 2 }}>
                {categories.map((category) => (
                <Grid item xs={6} sm={4} md={2} key={category.id}>
                    <Card
                        sx={{
                            width: { xs: 150, sm: 180 },
                            height: { xs: 150, sm: 180 },
                            borderRadius: "50%",
                            position: "relative",
                            overflow: "hidden",
                            cursor: "pointer",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                            transform: "scale(1.05)",
                        },
                        }}
                    >
                    <Box
                        component="img"
                        src={category.image}
                        alt={category.name}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                        />
                        <CardContent
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            textAlign: "center",
                            py: 1,
                        }}
                        >
                        <Typography
                            fontWeight="600"
                            sx={{ fontSize: "14px", mb: 0.5 }}
                        >
                            {category.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {category.itemCount} items
                        </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                ))}
            </Grid>
        </Box>
        </Box>
    );
}

export default Categories;
