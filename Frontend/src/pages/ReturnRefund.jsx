import { Container, Typography, Box } from '@mui/material';

const ReturnRefund = () => {
    return (
        <Container sx={{ py: 6, minHeight: '60vh' }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
                Return & Refund Policy
            </Typography>
            <Box sx={{ color: 'text.secondary' }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Thanks for shopping at Nenrasha. If you are not entirely satisfied with your purchase, we're here to help.
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', mt: 3, mb: 1 }}>
                    1. Returns
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    You have 14 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Your item needs to have the receipt or proof of purchase.
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', mt: 3, mb: 1 }}>
                    2. Refunds
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    If your return is approved, we will initiate a refund to your credit card (or original method of payment). You will receive the credit within a certain amount of days, depending on your card issuer's policies.
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', mt: 3, mb: 1 }}>
                    3. Shipping
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
                </Typography>
            </Box>
        </Container>
    );
};

export default ReturnRefund;
