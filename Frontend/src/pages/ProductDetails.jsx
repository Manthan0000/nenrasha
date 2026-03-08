import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Button, Container, Grid, IconButton, 
    Chip, Stack, Divider, Breadcrumbs, Link as MuiLink,
    Tabs, Tab, Table, TableBody, TableCell, TableRow,
    TableContainer, Fade, Tooltip, Snackbar, Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    ShoppingCartOutlined as CartIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    LocalShippingOutlined as ShippingIcon,
    VerifiedUserOutlined as SecurityIcon,
    LoopOutlined as ReturnIcon,
    ShareOutlined as ShareIcon,
    Star as StarIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircleOutline as CheckIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useDialog } from '../context/DialogContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, toggleLike } = useAuth();
    const { addToCart } = useCart();
    const { showAlert, showConfirm } = useDialog();
    
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const [isZoomed, setIsZoomed] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, msg: '', severity: 'success' });
    const imageRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:5000/api/products/${id}`);
            const data = await res.json();
            if (data.success) {
                const foundProduct = { ...data.data, id: data.data._id };
                setProduct(foundProduct);
                if (foundProduct.size?.length > 0) setSelectedSize(foundProduct.size[0]);
                if (foundProduct.colors?.length > 0) setSelectedColor(foundProduct.colors[0]);
            }
        } catch (err) {
            console.error('Fetch product error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!user) { navigate('/login'); return; }
        setAddingToCart(true);
        const res = await addToCart(product.id, quantity, selectedColor, selectedSize);
        setAddingToCart(false);
        if (res.success) {
            setAddedToCart(true);
            setSnackbar({ open: true, msg: `${product.name} added to cart!`, severity: 'success' });
            setTimeout(() => setAddedToCart(false), 2500);
        } else {
            setSnackbar({ open: true, msg: res.message || 'Failed to add to cart', severity: 'error' });
        }
    };

    const handleDelete = async () => {
        const confirmed = await showConfirm('Are you sure you want to delete this product? This action cannot be undone.', { title: 'Delete Product', severity: 'error' });
        if (!confirmed) return;
        try {
            const response = await fetch(`http://localhost:5000/api/products/${product.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            if (data.success) { navigate('/admin/my-listings'); }
            else { await showAlert(data.message || 'Failed to delete product.', { severity: 'error' }); }
        } catch (error) {
            console.error('Error deleting product:', error);
            await showAlert('An error occurred while deleting the product.', { severity: 'error' });
        }
    };

    const handleLike = async () => {
        if (!user) { navigate('/login'); return; }
        await toggleLike(product.id);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: product.name, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            setSnackbar({ open: true, msg: 'Link copied to clipboard!', severity: 'info' });
        }
    };

    const handleMouseMove = (e) => {
        if (!imageRef.current) return;
        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPos({ x, y });
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{
                        width: 48, height: 48, borderRadius: '50%',
                        border: '3px solid #111', borderTopColor: 'transparent',
                        animation: 'spin 0.8s linear infinite', mx: 'auto', mb: 2,
                        '@keyframes spin': { to: { transform: 'rotate(360deg)' } }
                    }} />
                    <Typography variant="body2" color="text.secondary">Loading product…</Typography>
                </Box>
            </Box>
        );
    }

    if (!product) {
        return (
            <Container sx={{ py: 15, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>Product not found</Typography>
                <Button variant="contained" onClick={() => navigate('/')} sx={{ bgcolor: '#000', '&:hover': { bgcolor: '#222' } }}>
                    Return to Shop
                </Button>
            </Container>
        );
    }

    const isOwner = user && user.role === 'admin' && (product.createdBy === user._id || product.createdBy === user.id);
    const isLiked = user?.likedProducts?.includes(product.id);
    const discountPct = product.discount || (product.oldPriceINR
        ? Math.round(((product.oldPriceINR - product.priceINR) / product.oldPriceINR) * 100)
        : 0);

    return (
        <Box sx={{ backgroundColor: '#fafafa', minHeight: '100vh', pb: { xs: 14, md: 10 } }}>

            {/* ── Snackbar feedback ─────────────────────────────────────────── */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                    sx={{ fontWeight: 600 }}
                >
                    {snackbar.msg}
                </Alert>
            </Snackbar>

            {/* ── Breadcrumb bar ────────────────────────────────────────────── */}
            <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #ebebeb' }}>
                <Container maxWidth="lg">
                    <Breadcrumbs separator="›" sx={{ py: 1.5, '& .MuiBreadcrumbs-li': { fontSize: '0.78rem' } }}>
                        <MuiLink
                            underline="hover" color="inherit"
                            sx={{ cursor: 'pointer', '&:hover': { color: '#000' } }}
                            onClick={() => navigate('/')}
                        >
                            Home
                        </MuiLink>
                        <MuiLink
                            underline="hover" color="inherit"
                            sx={{ cursor: 'pointer', '&:hover': { color: '#000' } }}
                            onClick={() => navigate(`/category/${product.category}`)}
                        >
                            {product.category}
                        </MuiLink>
                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#111' }}>
                            {product.name}
                        </Typography>
                    </Breadcrumbs>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
                <Grid container spacing={{ xs: 3, md: 6 }} alignItems="flex-start">

                    {/* ── LEFT: Image panel ────────────────────────────────── */}
                    <Grid item xs={12} md={6}>
                        {/* Main image */}
                        <Box
                            ref={imageRef}
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setIsZoomed(true)}
                            onMouseLeave={() => setIsZoomed(false)}
                            sx={{
                                position: 'relative',
                                width: '100%',
                                /* Fixed 4:5 portrait ratio — great for fashion/product shots */
                                paddingTop: '125%',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                backgroundColor: '#f0f0f0',
                                boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
                                cursor: isZoomed ? 'zoom-in' : 'default',
                            }}
                        >
                            <Box
                                component="img"
                                src={product.image}
                                alt={product.name}
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x750?text=No+Image'; }}
                                sx={{
                                    position: 'absolute',
                                    top: 0, left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center top',
                                    transition: 'transform 0.1s linear',
                                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                                    transform: isZoomed ? 'scale(1.85)' : 'scale(1)',
                                }}
                            />
                            {/* Discount badge */}
                            {discountPct > 0 && (
                                <Box sx={{
                                    position: 'absolute', top: 16, left: 16,
                                    bgcolor: '#111', color: '#fff',
                                    px: 2, py: 0.75,
                                    borderRadius: 2,
                                    fontSize: '0.75rem', fontWeight: 800,
                                    letterSpacing: 0.5,
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
                                }}>
                                    {discountPct}% OFF
                                </Box>
                            )}
                            {/* Action pills */}
                            <Stack sx={{ position: 'absolute', top: 16, right: 16, gap: 1 }}>
                                <Tooltip title={isLiked ? 'Remove from wishlist' : 'Add to wishlist'} placement="left">
                                    <IconButton
                                        onClick={handleLike}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.95)',
                                            backdropFilter: 'blur(8px)',
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                                            color: isLiked ? '#d32f2f' : '#444',
                                            '&:hover': { bgcolor: '#fff', transform: 'scale(1.12)' },
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Share" placement="left">
                                    <IconButton
                                        onClick={handleShare}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.95)',
                                            backdropFilter: 'blur(8px)',
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                                            color: '#444',
                                            '&:hover': { bgcolor: '#fff', transform: 'scale(1.12)' },
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <ShareIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                {isOwner && (
                                    <>
                                        <Tooltip title="Edit product" placement="left">
                                            <IconButton
                                                onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(255,255,255,0.95)',
                                                    backdropFilter: 'blur(8px)',
                                                    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                                                    color: '#1565c0',
                                                    '&:hover': { bgcolor: '#fff', transform: 'scale(1.12)' },
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete product" placement="left">
                                            <IconButton
                                                onClick={handleDelete}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(255,255,255,0.95)',
                                                    backdropFilter: 'blur(8px)',
                                                    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                                                    color: '#d32f2f',
                                                    '&:hover': { bgcolor: '#fff', transform: 'scale(1.12)' },
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                )}
                            </Stack>
                        </Box>

                        {/* Trust signals row */}
                        <Grid container spacing={1} sx={{ mt: 2 }}>
                            {[
                                { icon: <ShippingIcon sx={{ fontSize: 18 }} />, title: 'Fast Delivery', sub: '2–5 business days' },
                                { icon: <SecurityIcon sx={{ fontSize: 18 }} />, title: 'Secure Payment', sub: '100% safe & encrypted' },
                                { icon: <ReturnIcon sx={{ fontSize: 18 }} />, title: 'Easy Returns', sub: '30-day return policy' },
                            ].map((item, i) => (
                                <Grid item xs={4} key={i}>
                                    <Box sx={{
                                        bgcolor: '#fff',
                                        borderRadius: 2,
                                        p: { xs: 1, sm: 1.5 },
                                        textAlign: 'center',
                                        border: '1px solid #ebebeb',
                                        height: '100%',
                                    }}>
                                        <Box sx={{ color: '#555', mb: 0.5 }}>{item.icon}</Box>
                                        <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.72rem' }, fontWeight: 700, color: '#222', lineHeight: 1.2, mb: 0.25 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem' }, color: '#888', lineHeight: 1.2, display: { xs: 'none', sm: 'block' } }}>
                                            {item.sub}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    {/* ── RIGHT: Info panel ────────────────────────────────── */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>

                            {/* Brand + name */}
                            <Typography sx={{
                                letterSpacing: 3, color: '#888', fontWeight: 700,
                                fontSize: '0.7rem', textTransform: 'uppercase', mb: 0.75
                            }}>
                                {product.brand}
                            </Typography>
                            <Typography variant="h4" sx={{
                                fontWeight: 800, mb: 1.5,
                                fontSize: { xs: '1.6rem', md: '2rem' },
                                color: '#111', lineHeight: 1.25
                            }}>
                                {product.name}
                            </Typography>

                            {/* Rating row (decorative) */}
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                {[1,2,3,4,5].map(i => (
                                    <StarIcon key={i} sx={{ fontSize: 16, color: i <= 4 ? '#f59e0b' : '#ddd' }} />
                                ))}
                                <Typography sx={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>4.0 (128 reviews)</Typography>
                            </Stack>

                            {/* Price row */}
                            <Stack direction="row" alignItems="baseline" spacing={1.5} sx={{ mb: 2.5 }}>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: '#111', fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                                    ₹{product.priceINR.toLocaleString('en-IN')}
                                </Typography>
                                {product.oldPriceINR && (
                                    <Typography sx={{ textDecoration: 'line-through', color: '#bbb', fontWeight: 400, fontSize: '1.1rem' }}>
                                        ₹{product.oldPriceINR.toLocaleString('en-IN')}
                                    </Typography>
                                )}
                                {discountPct > 0 && (
                                    <Chip
                                        label={`Save ${discountPct}%`}
                                        size="small"
                                        sx={{ bgcolor: '#ecfdf5', color: '#065f46', fontWeight: 700, fontSize: '0.72rem' }}
                                    />
                                )}
                            </Stack>

                            {/* Description snippet */}
                            <Typography sx={{ 
                                color: '#555', mb: 3, lineHeight: 1.75, 
                                fontSize: '0.9rem',
                                pb: 3, borderBottom: '1px solid #ebebeb'
                            }}>
                                Premium quality {product.category} by {product.brand}. Crafted for those who appreciate fine details and superior comfort — featuring durable materials built for everyday wear.
                            </Typography>

                            {/* Color selector */}
                            {product.colors?.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', mb: 1.5, letterSpacing: 1, textTransform: 'uppercase' }}>
                                        Color: <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#555' }}>{selectedColor}</span>
                                    </Typography>
                                    <Stack direction="row" spacing={1.5}>
                                        {product.colors.map((color, i) => (
                                            <Box key={i} onClick={() => setSelectedColor(color)}
                                                sx={{
                                                    width: 34, height: 34, borderRadius: '50%',
                                                    bgcolor: color === 'white' ? '#fff' : color,
                                                    border: `3px solid ${selectedColor === color ? '#111' : '#ddd'}`,
                                                    outline: selectedColor === color ? '2px solid #fff' : 'none',
                                                    outlineOffset: '-5px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    boxShadow: selectedColor === color ? '0 0 0 2px #111' : '0 1px 4px rgba(0,0,0,0.15)',
                                                    '&:hover': { transform: 'scale(1.15)' }
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            {/* Size selector */}
                            {(product.size?.length > 0) && (
                                <Box sx={{ mb: 3.5 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                                        <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', letterSpacing: 1, textTransform: 'uppercase' }}>
                                            Size: <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#555' }}>{selectedSize}</span>
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" flexWrap="wrap" gap={1}>
                                        {product.size.map((size) => (
                                            <Box
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                sx={{
                                                    minWidth: 52, height: 48,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    border: `2px solid ${selectedSize === size ? '#111' : '#ddd'}`,
                                                    borderRadius: '8px',
                                                    bgcolor: selectedSize === size ? '#111' : '#fff',
                                                    color: selectedSize === size ? '#fff' : '#333',
                                                    fontWeight: 700, fontSize: '0.85rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    px: 1.5,
                                                    '&:hover': {
                                                        borderColor: '#111',
                                                        bgcolor: selectedSize === size ? '#333' : '#f5f5f5'
                                                    }
                                                }}
                                            >
                                                {size}
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                            {/* Quantity + Add to Cart */}
                            <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                                {/* Qty stepper */}
                                <Stack direction="row" alignItems="center"
                                    sx={{ border: '2px solid #e0e0e0', borderRadius: '8px', px: 0.5, minWidth: 110 }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        sx={{ color: '#444' }}
                                    >
                                        <RemoveIcon fontSize="small" />
                                    </IconButton>
                                    <Typography sx={{ mx: 1.5, fontWeight: 800, fontSize: '1rem', minWidth: 20, textAlign: 'center' }}>
                                        {quantity}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => setQuantity(q => q + 1)}
                                        sx={{ color: '#444' }}
                                    >
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </Stack>

                                {/* Add to Cart CTA */}
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                    startIcon={addedToCart ? <CheckIcon /> : <CartIcon />}
                                    sx={{
                                        height: 52,
                                        bgcolor: addedToCart ? '#065f46' : '#111',
                                        color: '#fff',
                                        fontWeight: 800,
                                        fontSize: '0.9rem',
                                        letterSpacing: 0.5,
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        transition: 'all 0.3s ease',
                                        boxShadow: addedToCart
                                            ? '0 4px 20px rgba(6, 95, 70, 0.35)'
                                            : '0 4px 20px rgba(0,0,0,0.20)',
                                        '&:hover': {
                                            bgcolor: addedToCart ? '#065f46' : '#333',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
                                        }
                                    }}
                                >
                                    {addingToCart ? 'Adding…' : addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                                </Button>
                            </Stack>

                            {/* Tags/highlights */}
                            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
                                {(['In Stock', 'Official Brand', 'Cash on Delivery']).map(tag => (
                                    <Chip
                                        key={tag} label={tag} size="small"
                                        sx={{ bgcolor: '#f5f5f5', color: '#555', fontWeight: 600, fontSize: '0.72rem', borderRadius: '6px' }}
                                    />
                                ))}
                            </Stack>

                            {/* Tabs: Details / Specs */}
                            <Box sx={{ bgcolor: '#fff', borderRadius: '12px', border: '1px solid #ebebeb', overflow: 'hidden' }}>
                                <Tabs
                                    value={tabValue}
                                    onChange={(_, v) => setTabValue(v)}
                                    sx={{
                                        borderBottom: '1px solid #ebebeb',
                                        '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '0.85rem', minWidth: 'auto', px: 3 },
                                        '& .MuiTabs-indicator': { bgcolor: '#111', height: 2 },
                                        '& .Mui-selected': { color: '#111 !important' }
                                    }}
                                >
                                    <Tab label="Description" />
                                    <Tab label="Specifications" />
                                </Tabs>

                                <Box sx={{ p: 2.5 }}>
                                    {tabValue === 0 && (
                                        <Typography sx={{ fontSize: '0.875rem', color: '#555', lineHeight: 1.8 }}>
                                            This {product.name} by {product.brand} is a premium {product.category} designed for those who value quality and style.
                                            Made with top-grade materials, it provides excellent durability and comfort for everyday use.
                                            Whether you're dressing up or keeping it casual, this piece seamlessly fits into your wardrobe.
                                        </Typography>
                                    )}
                                    {tabValue === 1 && (
                                        <TableContainer>
                                            <Table size="small">
                                                <TableBody>
                                                    {[
                                                        ['Brand', product.brand],
                                                        ['Category', product.category],
                                                        ...(product.size?.length > 0 ? [['Available Sizes', product.size.join(', ')]] : []),
                                                        ...(product.colors?.length > 0 ? [['Available Colors', product.colors.join(', ')]] : []),
                                                        ['Price', `₹${product.priceINR.toLocaleString('en-IN')}`],
                                                        ...(product.oldPriceINR ? [['MRP', `₹${product.oldPriceINR.toLocaleString('en-IN')}`]] : []),
                                                        ...(discountPct > 0 ? [['Discount', `${discountPct}%`]] : []),
                                                    ].map(([key, val]) => (
                                                        <TableRow key={key} sx={{ '&:last-child td': { border: 0 } }}>
                                                            <TableCell sx={{ border: 0, py: 0.75, color: '#888', fontWeight: 600, fontSize: '0.8rem', width: '40%', pl: 0 }}>
                                                                {key}
                                                            </TableCell>
                                                            <TableCell sx={{ border: 0, py: 0.75, color: '#222', fontWeight: 500, fontSize: '0.85rem', pr: 0 }}>
                                                                {val}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </Box>
                            </Box>

                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* ── Sticky mobile bottom bar ──────────────────────────────────── */}
            <Box sx={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                display: { xs: 'block', md: 'none' },
                bgcolor: '#fff', borderTop: '1px solid #ebebeb',
                p: 1.5, zIndex: 1200,
                boxShadow: '0 -4px 24px rgba(0,0,0,0.08)'
            }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ minWidth: 90 }}>
                        {product.oldPriceINR && (
                            <Typography sx={{ fontSize: '0.65rem', color: '#aaa', textDecoration: 'line-through', lineHeight: 1 }}>
                                ₹{product.oldPriceINR.toLocaleString('en-IN')}
                            </Typography>
                        )}
                        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1, color: '#111', fontSize: '1.1rem' }}>
                            ₹{product.priceINR.toLocaleString('en-IN')}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        startIcon={addedToCart ? <CheckIcon /> : <CartIcon />}
                        sx={{
                            bgcolor: addedToCart ? '#065f46' : '#111',
                            borderRadius: '10px',
                            fontWeight: 800,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            height: 48,
                            transition: 'all 0.3s',
                            '&:hover': { bgcolor: addedToCart ? '#065f46' : '#333' }
                        }}
                    >
                        {addingToCart ? 'Adding…' : addedToCart ? 'Added!' : 'Add to Cart'}
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default ProductDetails;
