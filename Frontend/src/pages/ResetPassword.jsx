import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box, Typography, TextField, Button, Alert,
    CircularProgress, Container, InputAdornment, IconButton
} from '@mui/material';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import API_BASE from '../config/api';

const API_URL = `${API_BASE}/api/auth`;

function ResetPassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const email = sessionStorage.getItem('resetEmail') || '';
    const otpVerified = sessionStorage.getItem('otpVerified') === 'true';

    // Guard: must have come through the proper flow
    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        } else if (!otpVerified) {
            navigate('/verify-otp');
        }
    }, [email, otpVerified, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    // Password strength helpers
    const password = formData.newPassword;
    const rules = [
        { label: 'At least 6 characters', met: password.length >= 6 },
        { label: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'At least one number', met: /\d/.test(password) },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword: formData.newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                // Clean up session storage
                sessionStorage.removeItem('resetEmail');
                sessionStorage.removeItem('otpVerified');
                setDone(true);
            } else {
                setError(data.message || data.error || 'Failed to reset password. Please try again.');
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
                        Reset Password
                    </Typography>
                    <Typography sx={{ fontSize: '16px', opacity: 0.85 }}>
                        Homepage / Pages / Reset Password
                    </Typography>
                </Box>
            </Box>

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
                    {/* Success State */}
                    {done ? (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <CheckCircleOutlineIcon
                                sx={{ fontSize: 72, color: '#2e7d32', mb: 2 }}
                            />
                            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                                Password Updated!
                            </Typography>
                            <Typography sx={{ color: 'text.secondary', mb: 3, fontSize: '15px' }}>
                                Your password has been reset successfully. You can now log in
                                with your new password.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/login')}
                                sx={{
                                    py: 1.5,
                                    px: 5,
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    borderRadius: 0,
                                    textTransform: 'none',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    '&:hover': { backgroundColor: '#333' },
                                }}
                            >
                                Go to Login
                            </Button>
                        </Box>
                    ) : (
                        <>
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
                                    <LockOutlinedIcon sx={{ fontSize: 32, color: '#000' }} />
                                </Box>
                            </Box>

                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                sx={{ mb: 1, textAlign: 'center' }}
                            >
                                Create New Password
                            </Typography>
                            <Typography
                                sx={{
                                    mb: 3,
                                    textAlign: 'center',
                                    color: 'text.secondary',
                                    fontSize: '14px',
                                }}
                            >
                                Choose a strong password to keep your account secure.
                            </Typography>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit}>
                                <TextField
                                    label="New Password"
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    margin="normal"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword((p) => !p)}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOffOutlinedIcon fontSize="small" />
                                                    ) : (
                                                        <VisibilityOutlinedIcon fontSize="small" />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                                />

                                {/* Password strength hints */}
                                {formData.newPassword.length > 0 && (
                                    <Box sx={{ mt: 0.5, mb: 1 }}>
                                        {rules.map((rule) => (
                                            <Typography
                                                key={rule.label}
                                                sx={{
                                                    fontSize: '12px',
                                                    color: rule.met ? '#2e7d32' : '#aaa',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                }}
                                            >
                                                {rule.met ? '✓' : '○'} {rule.label}
                                            </Typography>
                                        ))}
                                    </Box>
                                )}

                                <TextField
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    placeholder="Re-enter new password"
                                    type={showConfirm ? 'text' : 'password'}
                                    fullWidth
                                    margin="normal"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    error={
                                        formData.confirmPassword.length > 0 &&
                                        formData.newPassword !== formData.confirmPassword
                                    }
                                    helperText={
                                        formData.confirmPassword.length > 0 &&
                                        formData.newPassword !== formData.confirmPassword
                                            ? 'Passwords do not match'
                                            : ''
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirm((p) => !p)}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    {showConfirm ? (
                                                        <VisibilityOffOutlinedIcon fontSize="small" />
                                                    ) : (
                                                        <VisibilityOutlinedIcon fontSize="small" />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
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
                                        'Reset Password'
                                    )}
                                </Button>
                            </form>

                            <Box sx={{ textAlign: 'center', mt: 1 }}>
                                <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                                    <Link
                                        to="/login"
                                        style={{
                                            color: '#000',
                                            textDecoration: 'none',
                                            fontWeight: 'bold',
                                        }}
                                        onMouseEnter={(e) => (e.target.style.color = '#d32f2f')}
                                        onMouseLeave={(e) => (e.target.style.color = '#000')}
                                    >
                                        ← Back to Login
                                    </Link>
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>
            </Container>

            <Footer />
        </Box>
    );
}

export default ResetPassword;
