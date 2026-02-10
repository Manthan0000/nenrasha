import { useState } from 'react';
import { 
    Box, Container, TextField, Button, Typography, Alert, MenuItem, 
    Grid, Paper, IconButton, Stack, Chip, InputAdornment, useTheme
} from '@mui/material';
import { CloudUpload, Add } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const categories = ['Watches & Glasses', 'Shoes', 'Classic', 'Genz', 'Traditional', 'Accessories'];
const commonSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '7', '8', '9', '10', '11']; 

function AddProduct() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    // Form States
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [priceINR, setPriceINR] = useState('');
    const [oldPriceINR, setOldPriceINR] = useState('');
    const [discount, setDiscount] = useState(0);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState(''); // Added description support if backend supports it later
    
    // Complex States
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);

    // UI States
    const [colorInput, setColorInput] = useState('#000000');
    const [sizeInput, setSizeInput] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Handlers
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddColor = () => {
        if (!colors.includes(colorInput)) {
            setColors([...colors, colorInput]);
        }
    };

    const handleRemoveColor = (colorToRemove) => {
        setColors(colors.filter(c => c !== colorToRemove));
    };

    const toggleSize = (size) => {
        if (sizes.includes(size)) {
            setSizes(sizes.filter(s => s !== size));
        } else {
            setSizes([...sizes, size]);
        }
    };

    const handleAddCustomSize = () => {
        if (sizeInput && !sizes.includes(sizeInput)) {
            setSizes([...sizes, sizeInput]);
            setSizeInput('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!imageFile) {
            setError('Please upload an image');
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('brand', brand);
            formData.append('priceINR', priceINR);
            if (oldPriceINR) formData.append('oldPriceINR', oldPriceINR);
            formData.append('discount', discount);
            formData.append('category', category);
            
            // Join arrays to strings for backend parsing
            formData.append('colors', colors.join(','));
            formData.append('size', sizes.join(','));
            
            // Append file
            formData.append('image', imageFile);

            const headers = {};
            if (user && user.token) {
                headers['Authorization'] = `Bearer ${user.token}`;
            }

            const res = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: headers,
                body: formData // No Content-Type header, browser sets it with boundary
            });

            const data = await res.json();
            if (data.success) {
                setSuccess('Product added successfully!');
                // Reset form
                setName(''); setBrand(''); setPriceINR(''); setOldPriceINR(''); 
                setDiscount(0); setCategory(''); setImageFile(null); setImagePreview(null);
                setColors([]); setSizes([]);
            } else {
                setError(data.message || 'Failed to add product');
            }
        } catch (err) {
            console.error(err);
            setError('Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Render Logic
    if (!user || user.role !== 'admin') {
         // Redirect or show access denied
         // For now show simple denied
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h5" color="error">Access Denied. Admins only.</Typography>
                <Button sx={{ mt: 2 }} onClick={() => navigate('/')}>Go Home</Button>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', py: 4 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: '#1a1a1a' }}>
                    Listing New Product
                </Typography>

                <Grid container spacing={4}>
                    {/* Left Side: Form */}
                    <Grid item xs={12} md={8}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: '#fff' }}>
                            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                            <form onSubmit={handleSubmit}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Basic Information</Typography>
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={12}>
                                        <TextField fullWidth label="Product Name" value={name} onChange={e => setName(e.target.value)} required />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Brand" value={brand} onChange={e => setBrand(e.target.value)} required />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField select fullWidth label="Category" value={category} onChange={e => setCategory(e.target.value)} required>
                                            {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                                        </TextField>
                                    </Grid>
                                </Grid>

                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Pricing</Typography>
                                <Grid container spacing={2} sx={{ mb: 4 }}>
                                    <Grid item xs={12} sm={4}>
                                        <TextField 
                                            fullWidth type="number" label="Price (INR)" 
                                            value={priceINR} onChange={e => setPriceINR(e.target.value)} required 
                                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField 
                                            fullWidth type="number" label="Old Price" 
                                            value={oldPriceINR} onChange={e => setOldPriceINR(e.target.value)} 
                                            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField 
                                            fullWidth type="number" label="Discount %" 
                                            value={discount} onChange={e => setDiscount(e.target.value)} 
                                        />
                                    </Grid>
                                </Grid>

                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Product Variants</Typography>
                                
                                {/* Colors Section */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Available Colors</Typography>
                                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                        <input 
                                            type="color" 
                                            value={colorInput} 
                                            onChange={(e) => setColorInput(e.target.value)}
                                            style={{ width: 50, height: 50, padding: 0, border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}
                                        />
                                        <TextField 
                                            size="small" 
                                            value={colorInput} 
                                            onChange={(e) => setColorInput(e.target.value)}
                                            label="Hex Code"
                                            sx={{ width: 120 }}
                                        />
                                        <Button 
                                            variant="outlined" 
                                            onClick={handleAddColor}
                                            startIcon={<Add />}
                                        >
                                            Add
                                        </Button>
                                    </Stack>
                                    <Stack direction="row" flexWrap="wrap" gap={1}>
                                        {colors.map((color, index) => (
                                            <Chip
                                                key={index}
                                                label={color}
                                                onDelete={() => handleRemoveColor(color)}
                                                avatar={<Box sx={{ bgcolor: color, width: 16, height: 16, borderRadius: '50%' }} />}
                                                variant="outlined"
                                            />
                                        ))}
                                    </Stack>
                                </Box>

                                {/* Sizes Section */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Available Sizes</Typography>
                                    <Box sx={{ mb: 2 }}>
                                        {commonSizes.map(size => (
                                            <Chip 
                                                key={size} 
                                                label={size} 
                                                onClick={() => toggleSize(size)}
                                                color={sizes.includes(size) ? "primary" : "default"}
                                                variant={sizes.includes(size) ? "filled" : "outlined"}
                                                sx={{ m: 0.5, borderRadius: 2 }}
                                            />
                                        ))}
                                    </Box>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <TextField 
                                            size="small" 
                                            label="Custom Size" 
                                            value={sizeInput}
                                            onChange={(e) => setSizeInput(e.target.value)}
                                            sx={{ width: 150 }}
                                        />
                                        <Button variant="outlined" onClick={handleAddCustomSize} size="small">Add Custom</Button>
                                    </Stack>
                                    {/* Show selected custom sizes if not in common list */}
                                    <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                                        {sizes.filter(s => !commonSizes.includes(s)).map(s => (
                                            <Chip key={s} label={s} onDelete={() => toggleSize(s)} color="primary" />
                                        ))}
                                    </Stack>
                                </Box>

                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    size="large" 
                                    fullWidth
                                    disabled={loading}
                                    sx={{ 
                                        mt: 2, py: 1.5, bgcolor: '#000', 
                                        '&:hover': { bgcolor: '#333' }
                                    }}
                                >
                                    {loading ? 'Publishing...' : 'Publish Product'}
                                </Button>
                            </form>
                        </Paper>
                    </Grid>

                    {/* Right Side: Image Upload & Preview */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: '#fff', textAlign: 'center', height: '100%', minHeight: 400 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Product Image</Typography>
                            
                            <Box 
                                sx={{ 
                                    border: '2px dashed #ddd', 
                                    borderRadius: 3, 
                                    p: 4, 
                                    cursor: 'pointer',
                                    bgcolor: '#fafafa',
                                    transition: 'all 0.2s',
                                    '&:hover': { borderColor: theme.palette.primary.main, bgcolor: '#f0f7ff' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: 300,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                component="label"
                            >
                                <input 
                                    type="file" 
                                    hidden 
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                
                                {imagePreview ? (
                                    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                                        <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '250px', objectFit: 'contain' }} />
                                        <Typography variant="caption" display="block" sx={{ mt: 2 }}>Click to change</Typography>
                                    </Box>
                                ) : (
                                    <>
                                        <CloudUpload sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                        <Typography color="text.secondary" fontWeight={500}>
                                            Click to Upload
                                        </Typography>
                                        <Typography variant="caption" color="text.disabled">
                                            PNG, JPG up to 5MB
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default AddProduct;
