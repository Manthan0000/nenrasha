import { Box, Typography, Grid, Card, CardActionArea, CardMedia } from "@mui/material";
import { categories } from "../data/categories.js";
import { useNavigate } from "react-router-dom";

function Categories() {
    const navigate = useNavigate();
    
    return (
        <Box
            sx={{
                maxWidth: "1400px",
                mx: "auto",
                px: { xs: 2, md: 4 },
                py: 8,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 6,
                    flexWrap: 'wrap',
                    gap: 2
                }}
            >
                <Typography
                    variant="h3"
                    fontWeight="800"
                    sx={{ 
                        fontSize: { xs: "2rem", md: "2.5rem" },
                        background: 'linear-gradient(45deg, #000 30%, #444 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Shop by Category
                </Typography>
                <Typography
                    onClick={() => navigate('/category/all')}
                    sx={{
                        textDecoration: "none",
                        color: "#000",
                        fontSize: "16px",
                        fontWeight: 600,
                        cursor: "pointer",
                        borderBottom: '2px solid transparent',
                        transition: 'all 0.3s',
                        "&:hover": { 
                            color: "#d32f2f",
                            borderBottom: '2px solid #d32f2f'
                        },
                    }}
                >
                    View All Collections
                </Typography>
            </Box>

            <Grid container spacing={3} justifyContent="center" columns={{ xs: 4, sm: 8, md: 12 }}>
                {categories.map((category) => (
                    <Grid item xs={2} sm={4} md={3} key={category.id}>
                        <Card
                            sx={{
                                height: '100%',
                                borderRadius: 4,
                                overflow: 'hidden',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                transition: "all 0.3s ease-in-out",
                                display: 'flex',
                                flexDirection: 'column',
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                                    "& .category-image": {
                                        transform: "scale(1.1)",
                                    },
                                    "& .category-overlay": {
                                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                                    }
                                },
                            }}
                        >
                            <CardActionArea 
                                onClick={() => navigate(`/category/${category.name}`)}
                                sx={{ 
                                    height: { xs: 250, sm: 300, md: 350 },
                                    minHeight: { xs: 250, sm: 300, md: 350 },
                                    position: 'relative',
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <Box
                                    className="category-image"
                                    component="img"
                                    src={category.image}
                                    alt={category.name}
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        transition: "transform 0.6s ease",
                                        display: 'block'
                                    }}
                                />
                                <Box
                                    className="category-overlay"
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                                        transition: "background-color 0.3s ease",
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        pb: 4
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center', px: 2 }}>
                                        <Typography
                                            variant="h5"
                                            component="div"
                                            sx={{
                                                color: '#fff',
                                                fontWeight: 700,
                                                letterSpacing: 1,
                                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                                mb: 0.5
                                            }}
                                        >
                                            {category.name}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Categories;
