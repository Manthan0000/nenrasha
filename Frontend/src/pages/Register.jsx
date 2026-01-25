import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, CircularProgress, Container, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from '@mui/material';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

const API_URL = 'http://localhost:5000/api/auth';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Registration successful! Redirecting...');
                
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify({
                    _id: data.data._id,
                    name: data.data.name,
                    email: data.data.email,
                    role: data.data.role,
                }));

                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setError(data.message || 'Registration failed');
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
                        Register
                    </Typography>
                    <Typography sx={{ fontSize: '16px', opacity: 0.9 }}>
                        Homepage / Pages / Register
                    </Typography>
                </Box>
            </Box>

            {/* Register Form Section */}
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
                        Join Nenrasha
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            {success}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Full Name"
                            name="name"
                            placeholder="Enter Your Name"
                            fullWidth
                            margin="normal"
                            value={formData.name}
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
                            label="Email"
                            name="email"
                            placeholder="Enter Email Address"
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
                            helperText="Password must be at least 6 characters"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 0,
                                },
                            }}
                        />
                        
                        {/* Role Selection */}
                        <Box
                            sx={{
                                mt: 2,
                                mb: 1,
                                p: 2,
                                border: '1px solid #e0e0e0',
                                borderRadius: 0,
                                backgroundColor: '#fafafa',
                            }}
                        >
                            <FormControl component="fieldset" fullWidth>
                                <FormLabel 
                                    component="legend" 
                                    sx={{ 
                                        mb: 1.5,
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        color: '#000',
                                    }}
                                >
                                    Select Role
                                </FormLabel>
                                <RadioGroup
                                    row
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                    }}
                                >
                                    <FormControlLabel
                                        value="user"
                                        control={
                                            <Radio 
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />
                                        }
                                        label="User"
                                        disabled={loading}
                                    />
                                    <FormControlLabel
                                        value="admin"
                                        control={
                                            <Radio 
                                                sx={{
                                                    color: '#000',
                                                    '&.Mui-checked': {
                                                        color: '#000',
                                                    },
                                                }}
                                            />
                                        }
                                        label="Admin"
                                        disabled={loading}
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Box>

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
                            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Register'}
                        </Button>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                style={{
                                    color: '#000',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#d32f2f'}
                                onMouseLeave={(e) => e.target.style.color = '#000'}
                            >
                                Login here
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

export default Register;