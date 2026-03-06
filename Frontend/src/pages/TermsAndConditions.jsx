import { Container, Typography, Box } from '@mui/material';

const TermsAndConditions = () => {
    return (
        <Container sx={{ py: 6, minHeight: '60vh' }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
                Terms & Conditions
            </Typography>
            <Box sx={{ color: 'text.secondary' }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Welcome to Nenrasha. By accessing and using our website, you agree to comply with the following terms and conditions.
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', mt: 3, mb: 1 }}>
                    1. General Conditions
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    We reserve the right to refuse service to anyone for any reason at any time. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service without express written permission by us.
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', mt: 3, mb: 1 }}>
                    2. Product Prices and Availability
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Prices for our products are subject to change without notice. We handle inventory and availability but do not guarantee all items will be continuously in stock.
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', mt: 3, mb: 1 }}>
                    3. Modifications to the Service
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    We reserve the right to modify or discontinue the Service (or any part or content thereof) without notice at any time.
                </Typography>
            </Box>
        </Container>
    );
};

export default TermsAndConditions;
