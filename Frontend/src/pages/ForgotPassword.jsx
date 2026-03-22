import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box, Typography, TextField, Button, Alert,
    CircularProgress, Container
} from '@mui/material';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import API_BASE from '../config/api';

const API_URL = `${API_BASE}/api/auth`;

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('OTP sent! Please check your email inbox.');
                // Store email in sessionStorage so VerifyOTP page can access it
                sessionStorage.setItem('resetEmail', email);
                setTimeout(() => {
                    navigate('/verify-otp');
                }, 1500);
            } else {
                setError(data.message || 'Failed to send OTP. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check if the server is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ backgroundColor: '#fff', minHeight: '100vh' }}>
            <ScrollToTop />

            {/* Hero Banner */}
            <Box
                sx={{
                    backgroundImage:
                        'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    py: { xs: 6, md: 10 },
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.45)',
                    },
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff' }}>
                    <Typography
                        variant="h3"
                        sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}
                    >
                        Forgot Password
                    </Typography>
                    <Typography sx={{ fontSize: '16px', opacity: 0.85 }}>
                        Homepage / Pages / Forgot Password
                    </Typography>
                </Box>
            </Box>

            {/* Form */}
            <Container maxWidth="sm">
                <Box
                    sx={{
                        maxWidth: 500,
                        mx: 'auto',
                        mt: 6,
                        mb: 8,
                        p: { xs: 3, md: 5 },
                        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                        borderRadius: 1,
                        backgroundColor: '#fff',
                    }}
                >
                    {/* Icon */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <LockResetOutlinedIcon sx={{ fontSize: 32, color: '#000' }} />
                        </Box>
                    </Box>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{ mb: 1, textAlign: 'center' }}
                    >
                        Reset Your Password
                    </Typography>
                    <Typography
                        sx={{ mb: 3, textAlign: 'center', color: 'text.secondary', fontSize: '14px' }}
                    >
                        Enter the email address linked to your account. We'll send you a one-time
                        password (OTP) to verify your identity.
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email Address"
                            name="email"
                            placeholder="Enter your registered email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                            required
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <EmailOutlinedIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: 0 },
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.5,
                                backgroundColor: '#000',
                                color: '#fff',
                                borderRadius: 0,
                                textTransform: 'none',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                '&:hover': { backgroundColor: '#333' },
                                '&:disabled': { backgroundColor: '#888' },
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} sx={{ color: '#fff' }} />
                            ) : (
                                'Send OTP'
                            )}
                        </Button>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                        <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                            Remember your password?{' '}
                            <Link
                                to="/login"
                                style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}
                                onMouseEnter={(e) => (e.target.style.color = '#d32f2f')}
                                onMouseLeave={(e) => (e.target.style.color = '#000')}
                            >
                                Login here
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>

            <Footer />
        </Box>
    );
}

export default ForgotPassword;
