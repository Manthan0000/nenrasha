import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box, Typography, Button, Alert,
    CircularProgress, Container
} from '@mui/material';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';

const API_URL = 'http://localhost:5000/api/auth';
const OTP_LENGTH = 6;

function VerifyOTP() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const inputsRef = useRef([]);

    const email = sessionStorage.getItem('resetEmail') || '';

    // Redirect if no email in session
    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleOtpChange = (index, value) => {
        // Allow only single digit numbers
        const digit = value.replace(/\D/g, '').slice(-1);
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);
        setError('');

        // Move focus forward
        if (digit && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // Move focus back if current is already empty
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputsRef.current[index - 1]?.focus();
            } else {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputsRef.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        const newOtp = Array(OTP_LENGTH).fill('');
        for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
        setOtp(newOtp);
        // Focus last filled box or first empty
        const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
        inputsRef.current[focusIdx]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otp.some((d) => d === '')) {
            setError('Please enter all 6 digits of the OTP.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otpString }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('OTP verified! Redirecting to reset password...');
                sessionStorage.setItem('otpVerified', 'true');
                setTimeout(() => {
                    navigate('/reset-password');
                }, 1200);
            } else {
                setError(data.message || 'Invalid or expired OTP. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check if the server is running.');
        } finally {
            setLoading(false);
        }
    };

    const maskedEmail = email
        ? email.replace(/(.{2}).+(@.+)/, '$1***$2')
        : '';

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
                        Verify OTP
                    </Typography>
                    <Typography sx={{ fontSize: '16px', opacity: 0.85 }}>
                        Homepage / Pages / Verify OTP
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
                            <VerifiedOutlinedIcon sx={{ fontSize: 32, color: '#000' }} />
                        </Box>
                    </Box>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{ mb: 1, textAlign: 'center' }}
                    >
                        Enter Verification Code
                    </Typography>
                    <Typography
                        sx={{ mb: 3, textAlign: 'center', color: 'text.secondary', fontSize: '14px' }}
                    >
                        We've sent a 6-digit OTP to{' '}
                        <strong style={{ color: '#000' }}>{maskedEmail}</strong>.
                        Enter it below to verify your identity.
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
                        {/* OTP Boxes */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: { xs: 1, sm: 1.5 },
                                mb: 3,
                            }}
                        >
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputsRef.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    disabled={loading}
                                    style={{
                                        width: '48px',
                                        height: '56px',
                                        textAlign: 'center',
                                        fontSize: '22px',
                                        fontWeight: 'bold',
                                        border: digit
                                            ? '2px solid #000'
                                            : '2px solid #ccc',
                                        borderRadius: '4px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        fontFamily: 'inherit',
                                        background: '#fff',
                                        cursor: loading ? 'not-allowed' : 'text',
                                        opacity: loading ? 0.6 : 1,
                                    }}
                                    onFocus={(e) =>
                                        (e.target.style.borderColor = '#000')
                                    }
                                    onBlur={(e) =>
                                        (e.target.style.borderColor = digit ? '#000' : '#ccc')
                                    }
                                />
                            ))}
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
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
                                'Verify OTP'
                            )}
                        </Button>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 1.5 }}>
                        <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                            Wrong email?{' '}
                            <Link
                                to="/forgot-password"
                                style={{
                                    color: '#000',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                }}
                                onMouseEnter={(e) => (e.target.style.color = '#d32f2f')}
                                onMouseLeave={(e) => (e.target.style.color = '#000')}
                            >
                                Go back
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>

            <Footer />
        </Box>
    );
}

export default VerifyOTP;
