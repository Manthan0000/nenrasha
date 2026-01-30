import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, TextField, Button, Alert, CircularProgress, Container } from '@mui/material';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

const API_URL = 'http://localhost:5000/api/auth';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                // Token is handled by cookie, but we store user info for UI
                // And context handles localStorage
                login({
                    _id: data.data._id,
                    name: data.data.name,
                    email: data.data.email,
                    role: data.data.role,
                });

                navigate('/');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please check if the server is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ backgroundColor: '#fff', minHeight: '100vh' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    py: { xs: 6, md: 10 },
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    },
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        textAlign: 'center',
                        color: '#fff',
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 'bold',
                            mb: 2,
                            fontSize: { xs: '2rem', md: '3rem' },
                        }}
                    >
                        Login
                    </Typography>
                    <Typography sx={{ fontSize: '16px', opacity: 0.9 }}>
                        Homepage / Pages / Login
                    </Typography>
                </Box>
            </Box>

            {/* Login Form Section */}
            <Container maxWidth="sm">
                <Box
                    sx={{
                        maxWidth: 500,
                        mx: 'auto',
                        p: { xs: 3, md: 5 },
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        borderRadius: 1,
                        backgroundColor: '#fff',
                        mb: 6,
                    }}
                >
                    <Typography 
                        variant="h4" 
                        fontWeight="bold" 
                        gutterBottom
                        sx={{ mb: 3, textAlign: 'center' }}
                    >
                        Login to Nenrasha
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            name="email"
                            placeholder="Enter Email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 0,
                                },
                            }}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            placeholder="Enter Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 0,
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
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
                                '&:hover': {
                                    backgroundColor: '#333',
                                },
                                '&:disabled': {
                                    backgroundColor: '#666',
                                },
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Login'}
                        </Button>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                style={{
                                    color: '#000',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#d32f2f'}
                                onMouseLeave={(e) => e.target.style.color = '#000'}
                            >
                                Register here
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>

            <Footer />
            <ScrollToTop />
        </Box>
    );
}

export default Login;