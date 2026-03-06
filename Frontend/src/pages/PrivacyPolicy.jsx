import { Container, Typography, Box } from '@mui/material';

const PrivacyPolicy = () => {
    return (
        <Container sx={{ py: 6, minHeight: '60vh' }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
                Privacy Policy
            </Typography>
            <Box sx={{ color: 'text.secondary' }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    At Nenrasha, protecting your privacy is important to us. This Privacy Policy outlines how we collect, use, and safeguard your personal information.
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', mt: 3, mb: 1 }}>
                    1. Information We Collect
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    We may collect personal information such as your name, email address, phone number, and shipping details when you interact with our website or create an account.
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', mt: 3, mb: 1 }}>
                    2. How We Use Your Information
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    We use your information to process transactions, fulfill orders, improve our website, and send promotional emails if you have opted in.
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', mt: 3, mb: 1 }}>
                    3. Data Protection
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    If you have any questions or concerns regarding this policy, please contact us.
                </Typography>
            </Box>
        </Container>
    );
};

export default PrivacyPolicy;
