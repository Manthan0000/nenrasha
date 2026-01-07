import {Card, CardContent, Typography, Box, Button} from '@mui/material';
function ProductCard({name, price}) {
    return(
        <>
            <Card sx={{ width: 260}}>
                <Box sx={{height: 180,backgroundColor: '#f5f5f5'}}></Box>
                <CardContent>
                    <Typography fontWeight="medium">
                        {name}
                    </Typography>
                    <Typography color="text.secondary">
                        ₹ {price}
                    </Typography>
                    <Button variant="outlined" size="small" sx={{ mt:1}}>
                        View Product
                    </Button>
                </CardContent>
            </Card>
        </>
    );
}
export default ProductCard;