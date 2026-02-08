import { useState } from 'react';
import { Box, Container, TextField, Button, Typography, Alert, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const categories = ['Watches & Glasses', 'Shoes', 'Classic', 'Genz', 'Traditional', 'Accessories'];
const availableColors = ['black', 'elemental', 'blue', 'red', 'green', 'white', 'yellow', 'brown'];
const availableSizes = ['xs', 's', 'm', 'l', 'xl', 'xxl', '7', '8', '9', '10', '11']; // Mix of clothing/shoes

function AddProduct() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        priceINR: '',
        oldPriceINR: '',
        discount: 0,
        image: '',
        category: '',
        colors: [],
        size: []
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!user || user.role !== 'admin') {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h5" color="error">Access Denied. Admins only.</Typography>
                <Button sx={{ mt: 2 }} onClick={() => navigate('/')}>Go Home</Button>
            </Container>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: typeof value === 'string' ? value.split(',') : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Just in case, though we rely on Cookie usually. 
                    // Wait, AuthMiddleware uses cookie token... but Fetch doesn't send cookies by default unless credentials: 'include'
                },
                // Middleware expects Cookie 'token' OR Header 'Authorization: Bearer <token>'
                // Frontend AuthContext didn't store token in localStorage, only user data.
                // Wait, Register.jsx set Cookie.
                // So I need credentials: 'include'.
            });

            // Re-doing fetch with credentials
        } catch (err) {
            console.error(err);
        }
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            // Fallback: Send token in header if available (in case cookies are blocked)
            if (user && user.token) {
                headers['Authorization'] = `Bearer ${user.token}`;
            }

            const res = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(formData),
                credentials: 'include' 
            });

            const data = await res.json();
            if (data.success) {
                setSuccess('Product added successfully!');
                setFormData({
                    name: '', brand: '', priceINR: '', oldPriceINR: '', discount: 0, image: '', category: '',
                    colors: [], size: []
                });
            } else {
                setError(data.message || 'Failed to add product');
            }
        } catch (err) {
            setError('Server error.');
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>Add New Product</Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <form onSubmit={submitForm}>
                <TextField fullWidth label="Product Name" name="name" value={formData.name} onChange={handleChange} required sx={{ mb: 2 }} />
                <TextField fullWidth label="Brand" name="brand" value={formData.brand} onChange={handleChange} required sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField fullWidth type="number" label="Price (INR)" name="priceINR" value={formData.priceINR} onChange={handleChange} required />
                    <TextField fullWidth type="number" label="Old Price (INR)" name="oldPriceINR" value={formData.oldPriceINR} onChange={handleChange} />
                    <TextField fullWidth type="number" label="Discount %" name="discount" value={formData.discount} onChange={handleChange} />
                </Box>

                <TextField fullWidth label="Image URL" name="image" value={formData.image} onChange={handleChange} required sx={{ mb: 2 }} 
                           helperText="Enter a valid image URL" />

                <TextField select fullWidth label="Category" name="category" value={formData.category} onChange={handleChange} required sx={{ mb: 2 }}>
                    {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </TextField>

                <TextField
                    select
                    fullWidth
                    label="Colors"
                    name="colors"
                    value={formData.colors}
                    onChange={handleSelectChange}
                    SelectProps={{ multiple: true, renderValue: (selected) => selected.join(', ') }}
                    sx={{ mb: 2 }}
                >
                    {availableColors.map((color) => (
                        <MenuItem key={color} value={color}>
                            <Checkbox checked={formData.colors.indexOf(color) > -1} />
                            <ListItemText primary={color} />
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    fullWidth
                    label="Size"
                    name="size"
                    value={formData.size}
                    onChange={handleSelectChange}
                    SelectProps={{ multiple: true, renderValue: (selected) => selected.join(', ') }}
                    sx={{ mb: 2 }}
                >
                    {availableSizes.map((s) => (
                        <MenuItem key={s} value={s}>
                            <Checkbox checked={formData.size.indexOf(s) > -1} />
                            <ListItemText primary={s} />
                        </MenuItem>
                    ))}
                </TextField>

                <Button type="submit" variant="contained" size="large" sx={{ bgcolor: 'black', '&:hover':{bgcolor:'#333'} }}>
                    List Product
                </Button>
            </form>
        </Container>
    );
}

export default AddProduct;
