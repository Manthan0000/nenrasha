import {Box ,Typography,Grid, Link, TextField,IconButton, Container} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Link as RouterLink } from 'react-router-dom';

function Footer(){
    const services = [
        {
            icon: '↩',
            title: '14-Day Returns',
            description: 'Risk free shopping with easy returns.',
        },
        {
            icon: '🚚',
            title: 'Free shipping',
            description: 'No extra cost, on some products',
        },
        {
            icon: '🎧',
            title: '24/7 Support',
            description: 'Customer support',
        },
        {
            icon: '👥',
            title: 'Member Discount',
            description: 'Special price for our loyal customer',
        },
    ];
    const informationLinks = [
        'About Us',
        'Blog',
        'Contact us',
        'My Account',
    ];
    const customerServicesLinks = [
        'Shipping',
        'Return & Refund',
        'Privacy Policy',
        'Terms & Conditions',
    ];

    return(
        <Box sx={{ background: '#f5f5f5'}}>
            {/* Service section */}
            <Box sx={{ py: 4, borderBottom: '1px solid #ddd' }}>
                <Container>
                    <Grid container spacing={4}>
                        {services.map((service, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Typography sx={{ fontSize: '32px' }}>{service.icon}</Typography>
                                    <Box>
                                        <Typography sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '16px' }}>
                                            {service.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                                            {service.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
            {/*Main Footer*/}
            <Container>
                <Grid container spacing={6} sx={{ py: 6 }}>
                    {/* Company Info */}
                    <Grid item xs={12} md={3}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 'bold',
                                mb: 2,
                                fontFamily: 'Arial, sans-serif',
                                letterSpacing: '1px',
                            }}
                        >
                        Modave
                        </Typography>
                        <Typography sx={{ fontSize: '14px', mb: 2, color: 'text.secondary' }}>
                            Gandhinagar, Gujarat
                        </Typography>
                        <Link
                            href="#"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '14px',
                                color: '#000',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                                mb: 2,
                                '&:hover': { color: '#d32f2f' },
                            }}
                        >   
                            GET DIRECTION
                            <ArrowForwardIcon sx={{ fontSize: '16px' }} />
                        </Link>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <EmailIcon sx={{ fontSize: '18px' }} />
                            <Typography sx={{ fontSize: '14px' }}>manthanjasoliya84014@gmail.com</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <PhoneIcon sx={{ fontSize: '18px' }} />
                            <Typography sx={{ fontSize: '14px' }}>+91 84014+++++</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton sx={{ backgroundColor: '#fff', '&:hover': { backgroundColor: '#e0e0e0' } }}>
                                <FacebookIcon />
                            </IconButton>
                            <IconButton sx={{ backgroundColor: '#fff', '&:hover': { backgroundColor: '#e0e0e0' } }}>
                                <TwitterIcon />
                            </IconButton>
                            <IconButton sx={{ backgroundColor: '#fff', '&:hover': { backgroundColor: '#e0e0e0' } }}>
                                <InstagramIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                    {/* Information */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography sx={{ fontWeight: 'bold', mb: 2, fontSize: '16px' }}>
                            Infomation
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {informationLinks.map((link) => {
                                const getRoute = () => {
                                    if (link === 'About Us') return '/about';
                                    if (link === 'Contact us') return '/contact';
                                    if (link === 'My Account') return '/my-account';
                                    if (link === 'Blog') return '/blog';
                                    return undefined;
                                };
                                const route = getRoute();
                                const isRoutable = route !== undefined;
                                return (
                                    <Link
                                        key={link}
                                        component={isRoutable ? RouterLink : 'a'}
                                        to={isRoutable ? route : undefined}
                                        href={!isRoutable ? '#' : undefined}
                                        sx={{
                                            color: 'text.secondary',
                                            textDecoration: 'none',
                                            fontSize: '14px',
                                            '&:hover': { color: '#d32f2f' },
                                        }}
                                    >   
                                        {link}
                                    </Link>
                                );
                            })}
                        </Box>
                    </Grid>
                    {/* Customer Services */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography sx={{ fontWeight: 'bold', mb: 2, fontSize: '16px' }}>
                            Customer Services
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {customerServicesLinks.map((link) => (
                                <Link
                                    key={link}
                                    href="#"
                                    sx={{
                                        color: 'text.secondary',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        '&:hover': { color: '#d32f2f' },
                                    }}
                                >
                                    {link}
                                </Link>
                            ))}
                        </Box>
                    </Grid>
                    
                    {/* Newsletter */}
                    <Grid item xs={12} md={5}>
                        <Typography sx={{ fontWeight: 'bold', mb: 2, fontSize: '16px' }}>
                            Newsletter.
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: 'text.secondary', mb: 2 }}>
                            Sign up for our newsletter and get 10% off your first purchase
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <TextField
                                placeholder="Enter your e-mail"
                                variant="outlined"
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 0,
                                        backgroundColor: '#fff',
                                    },
                                }}
                            />
                            <IconButton
                                sx={{
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    borderRadius: 0,
                                    '&:hover': { backgroundColor: '#333' },
                                }}
                            >
                                <ArrowForwardIcon />
                            </IconButton>
                        </Box>
                        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                            By clicking subscribe, you agree to the{' '}
                            <Link href="#" sx={{ textDecoration: 'underline', color: 'inherit', fontWeight: 'bold' }}>
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="#" sx={{ textDecoration: 'underline', color: 'inherit', fontWeight: 'bold' }}>
                                Privacy Policy
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Footer;
