import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Stack,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
} from '@mui/material';
import Container from '../components/Container';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useNavigate, Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ProductCard from '../components/ProductCard';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';

function MyAccount() {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const { showAlert } = useDialog();
  const [likedProducts, setLikedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    profilePhoto: null,
    profilePhotoPreview: ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        address: user.address || '',
        profilePhoto: null,
        profilePhotoPreview: user.profilePhoto || ''
      });
      fetchLikedProducts();
    }
  }, [user]);

  const fetchLikedProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/products/liked', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await response.json();
      if (data.success) {
        setLikedProducts(data.data.map(p => ({ ...p, id: p._id })));
      }
    } catch (error) {
      console.error('Error fetching liked products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };
  const handleEditClick = () => setEditDialogOpen(true);
  const handleEditClose = () => setEditDialogOpen(false);
  const handleInputChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({ ...editData, profilePhoto: file, profilePhotoPreview: URL.createObjectURL(file) });
    }
  };

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('userId', user._id || user.id);
      formData.append('name', editData.name);
      formData.append('mobile', editData.mobile);
      formData.append('address', editData.address);
      if (editData.profilePhoto) formData.append('profilePhoto', editData.profilePhoto);

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${user.token}` },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        login({ ...user, ...data.data });
        setEditDialogOpen(false);
      } else {
        await showAlert(data.message || 'Failed to update profile.', { severity: 'error' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      await showAlert('Failed to update profile. Please check your connection and try again.', { severity: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  // Sidebar nav items
  const navItems = [
    { key: 'info', label: 'Account Info', icon: <PersonIcon fontSize="small" /> },
    { key: 'orders', label: 'My Orders', icon: <ShoppingBagIcon fontSize="small" />, onClick: () => navigate('/my-orders') },
    { key: 'liked', label: 'Liked Products', icon: <FavoriteIcon fontSize="small" />, onClick: () => navigate('/liked-products') },
    { key: 'cart', label: 'My Cart', icon: <ShoppingCartIcon fontSize="small" />, onClick: () => navigate('/cart') },
  ];

  // Quick stat cards
  const stats = [
    { label: 'Orders', icon: <ShoppingBagIcon />, color: '#6366f1', bg: 'linear-gradient(135deg,#6366f1,#818cf8)', onClick: () => navigate('/my-orders') },
    { label: 'Wishlist', icon: <FavoriteIcon />, color: '#ef4444', bg: 'linear-gradient(135deg,#ef4444,#f87171)', onClick: () => navigate('/liked-products') },
    { label: 'Cart', icon: <ShoppingCartIcon />, color: '#f59e0b', bg: 'linear-gradient(135deg,#f59e0b,#fbbf24)', onClick: () => navigate('/cart') },
    { label: 'Shipping', icon: <LocalShippingIcon />, color: '#10b981', bg: 'linear-gradient(135deg,#10b981,#34d399)', onClick: () => navigate('/my-orders') },
  ];

  const infoFields = [
    { icon: <BadgeIcon />, label: 'Full Name', value: user?.name, color: '#6366f1' },
    { icon: <EmailIcon />, label: 'Email Address', value: user?.email, color: '#ef4444' },
    { icon: <PhoneIcon />, label: 'Mobile Number', value: user?.mobile, color: '#f59e0b' },
    { icon: <HomeIcon />, label: 'Delivery Address', value: user?.address, color: '#10b981' },
  ];

  return (
    <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Hero Banner ── */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
        py: { xs: 7, md: 9 },
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Container>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'center' }, gap: 4 }}>
            {user && (
              <>
                {/* Avatar */}
                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                  <Box sx={{
                    width: { xs: 100, md: 120 }, height: { xs: 100, md: 120 },
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#6366f1,#ef4444)',
                    p: '3px',
                    boxShadow: '0 0 40px rgba(99,102,241,0.4)'
                  }}>
                    <Avatar
                      src={user.profilePhoto || ''}
                      sx={{ width: '100%', height: '100%', bgcolor: '#1e1e2e', color: '#aaa', border: '3px solid #0f0f0f' }}
                    >
                      {!user.profilePhoto && <PersonIcon sx={{ fontSize: 50 }} />}
                    </Avatar>
                  </Box>
                  <Tooltip title="Edit Profile">
                    <IconButton
                      onClick={handleEditClick}
                      size="small"
                      sx={{
                        position: 'absolute', bottom: 2, right: 2,
                        bgcolor: '#6366f1', color: '#fff', width: 30, height: 30,
                        '&:hover': { bgcolor: '#4f46e5' },
                        boxShadow: '0 4px 14px rgba(99,102,241,0.5)',
                      }}
                    >
                      <EditIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Name + role */}
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: { xs: 'center', md: 'flex-start' }, mb: 1 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff', fontSize: { xs: '1.8rem', md: '2.5rem' }, letterSpacing: -1 }}>
                      {user.name}
                    </Typography>
                    <VerifiedUserIcon sx={{ color: '#6366f1', fontSize: 28 }} />
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', mb: 2 }}>{user.email}</Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Chip
                      label={user.role?.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: user.role === 'admin' ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.1)',
                        color: user.role === 'admin' ? '#a5b4fc' : 'rgba(255,255,255,0.7)',
                        fontWeight: 800, letterSpacing: 1.5, fontSize: '0.65rem',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    />
                    <Chip
                      label="Active Member"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(16,185,129,0.2)', color: '#6ee7b7',
                        fontWeight: 700, fontSize: '0.65rem', letterSpacing: 1,
                        border: '1px solid rgba(16,185,129,0.3)',
                      }}
                    />
                  </Box>
                </Box>

                {/* Edit button (desktop) */}
                <Box sx={{ ml: { md: 'auto' }, display: { xs: 'none', md: 'block' } }}>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={handleEditClick}
                    variant="outlined"
                    sx={{
                      borderRadius: '14px', borderColor: 'rgba(255,255,255,0.2)', color: '#fff',
                      px: 3, py: 1.2, fontWeight: 700, textTransform: 'none',
                      backdropFilter: 'blur(10px)',
                      '&:hover': { borderColor: '#6366f1', bgcolor: 'rgba(99,102,241,0.15)' },
                      transition: 'all 0.25s ease'
                    }}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </>
            )}

            {!user && (
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff', mb: 1 }}>My Account</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.55)' }}>Home / Profile Settings</Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* ── Body ── */}
      <Box sx={{ py: { xs: 5, md: 7 }, flexGrow: 1 }}>
        <Container>
          {user ? (
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' } }}>

              {/* ── Left Sidebar ── */}
              <Box sx={{ width: { xs: '100%', md: '280px' }, flexShrink: 0 }}>

                  {/* Nav Card */}
                  <Card sx={{
                    borderRadius: '20px', border: '1px solid rgba(0,0,0,0.07)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden',
                    position: 'sticky', top: '90px'
                  }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="overline" sx={{ color: '#aaa', fontWeight: 800, fontSize: '0.65rem', letterSpacing: 2, px: 1, mb: 1, display: 'block' }}>
                        Navigation
                      </Typography>
                      <Stack spacing={0.5}>
                        {navItems.map((item) => {
                          const isActive = activeTab === item.key && !item.onClick;
                          return (
                            <Button
                              key={item.key}
                              fullWidth
                              disableElevation
                              startIcon={item.icon}
                              onClick={() => { if (item.onClick) item.onClick(); else setActiveTab(item.key); }}
                              endIcon={item.onClick ? <ArrowForwardIosIcon sx={{ fontSize: '10px !important' }} /> : null}
                              sx={{
                                justifyContent: 'flex-start',
                                py: 1.4, px: 2,
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.92rem',
                                bgcolor: isActive ? '#111' : 'transparent',
                                color: isActive ? '#fff' : '#444',
                                '&:hover': { bgcolor: isActive ? '#111' : '#f4f4f6', color: isActive ? '#fff' : '#000' },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {item.label}
                            </Button>
                          );
                        })}

                        <Divider sx={{ my: 1 }} />

                        {/* Edit Profile */}
                        <Button
                          fullWidth disableElevation
                          startIcon={<EditIcon fontSize="small" />}
                          onClick={handleEditClick}
                          sx={{
                            justifyContent: 'flex-start', py: 1.4, px: 2, borderRadius: '12px',
                            textTransform: 'none', fontWeight: 700, fontSize: '0.92rem',
                            color: '#444', '&:hover': { bgcolor: '#f4f4f6', color: '#000' }, transition: 'all 0.2s ease'
                          }}
                        >
                          Edit Profile
                        </Button>

                        {/* Admin Buttons */}
                        {user.role === 'admin' && (
                          <>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="overline" sx={{ color: '#aaa', fontWeight: 800, fontSize: '0.65rem', letterSpacing: 2, px: 1, display: 'block' }}>
                              Admin
                            </Typography>
                            <Button
                              fullWidth disableElevation startIcon={<AddCircleIcon fontSize="small" />}
                              onClick={() => navigate('/admin/add-product')}
                              sx={{
                                justifyContent: 'flex-start', py: 1.4, px: 2, borderRadius: '12px',
                                textTransform: 'none', fontWeight: 700, fontSize: '0.92rem',
                                color: '#6366f1', '&:hover': { bgcolor: 'rgba(99,102,241,0.08)' }, transition: 'all 0.2s ease'
                              }}
                            >
                              Add Product
                            </Button>
                            <Button
                              fullWidth disableElevation startIcon={<ListAltIcon fontSize="small" />}
                              onClick={() => navigate('/admin/my-listings')}
                              sx={{
                                justifyContent: 'flex-start', py: 1.4, px: 2, borderRadius: '12px',
                                textTransform: 'none', fontWeight: 700, fontSize: '0.92rem',
                                color: '#6366f1', '&:hover': { bgcolor: 'rgba(99,102,241,0.08)' }, transition: 'all 0.2s ease'
                              }}
                            >
                              My Listings
                            </Button>
                            <Button
                              fullWidth disableElevation startIcon={<AssignmentIcon fontSize="small" />}
                              onClick={() => navigate('/admin/seller-orders')}
                              sx={{
                                justifyContent: 'flex-start', py: 1.4, px: 2, borderRadius: '12px',
                                textTransform: 'none', fontWeight: 700, fontSize: '0.92rem',
                                color: '#6366f1', '&:hover': { bgcolor: 'rgba(99,102,241,0.08)' }, transition: 'all 0.2s ease'
                              }}
                            >
                              Pending Panel
                            </Button>
                          </>
                        )}

                        <Divider sx={{ my: 1 }} />

                        {/* Logout */}
                        <Button
                          fullWidth disableElevation startIcon={<LogoutIcon fontSize="small" />}
                          onClick={handleLogout}
                          sx={{
                            justifyContent: 'flex-start', py: 1.4, px: 2, borderRadius: '12px',
                            textTransform: 'none', fontWeight: 700, fontSize: '0.92rem',
                            color: '#ef4444', '&:hover': { bgcolor: '#fff1f2' }, transition: 'all 0.2s ease'
                          }}
                        >
                          Logout
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>

              </Box>

              {/* ── Main Content ── */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack spacing={4}>

                  {/* Quick Stat Cards */}
                  <Grid container spacing={2}>
                    {stats.map((stat) => (
                      <Grid item xs={6} sm={3} key={stat.label}>
                        <Card
                          onClick={stat.onClick}
                          sx={{
                            borderRadius: '18px', cursor: 'pointer', overflow: 'hidden',
                            background: stat.bg,
                            boxShadow: `0 8px 24px ${stat.color}33`,
                            transition: 'all 0.3s ease',
                            '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 16px 32px ${stat.color}44` }
                          }}
                        >
                          <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{
                              width: 44, height: 44, borderRadius: '12px',
                              bgcolor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                            }}>
                              {stat.icon}
                            </Box>
                            <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 800, fontSize: '1rem' }}>
                              {stat.label}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Account Info Panel */}
                  {activeTab === 'info' && (
                    <Card sx={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                          <Box>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: '#111', letterSpacing: -0.5 }}>
                              Account Information
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#aaa', mt: 0.5 }}>
                              Your personal details and preferences
                            </Typography>
                          </Box>
                          <Button
                            startIcon={<EditIcon />}
                            onClick={handleEditClick}
                            variant="outlined"
                            size="small"
                            sx={{
                              borderRadius: '10px', borderColor: '#e0e0e0', color: '#444',
                              textTransform: 'none', fontWeight: 700,
                              '&:hover': { borderColor: '#111', bgcolor: '#f9f9f9', color: '#111' }
                            }}
                          >
                            Edit
                          </Button>
                        </Box>

                        <Grid container spacing={3}>
                          {infoFields.map((field) => (
                            <Grid item xs={12} sm={6} key={field.label}>
                              <Box sx={{
                                p: 3, borderRadius: '16px',
                                border: '1.5px solid #f0f0f0', bgcolor: '#fafafa',
                                display: 'flex', gap: 2, alignItems: 'flex-start',
                                transition: 'all 0.25s ease',
                                '&:hover': { borderColor: field.color + '55', bgcolor: '#fff', transform: 'translateY(-2px)', boxShadow: `0 6px 20px ${field.color}15` }
                              }}>
                                <Box sx={{
                                  width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                                  background: field.color + '15',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  color: field.color
                                }}>
                                  {field.icon}
                                </Box>
                                <Box>
                                  <Typography variant="caption" sx={{ color: '#999', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.65rem' }}>
                                    {field.label}
                                  </Typography>
                                  <Typography variant="body1" sx={{ fontWeight: 700, color: field.value ? '#111' : '#ccc', mt: 0.3, fontSize: '0.98rem', wordBreak: 'break-word' }}>
                                    {field.value || 'Not provided'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>

                        {/* Completeness bar */}
                        <Box sx={{ mt: 4, p: 3, borderRadius: '14px', bgcolor: '#f8f9fa', border: '1px solid #f0f0f0' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#444' }}>Profile Completeness</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#6366f1' }}>
                              {Math.round(([user.name, user.email, user.mobile, user.address].filter(Boolean).length / 4) * 100)}%
                            </Typography>
                          </Box>
                          <Box sx={{ height: 8, borderRadius: '99px', bgcolor: '#e9ecef', overflow: 'hidden' }}>
                            <Box sx={{
                              height: '100%', borderRadius: '99px',
                              background: 'linear-gradient(90deg,#6366f1,#818cf8)',
                              width: `${([user.name, user.email, user.mobile, user.address].filter(Boolean).length / 4) * 100}%`,
                              transition: 'width 0.6s ease'
                            }} />
                          </Box>
                          {([user.name, user.email, user.mobile, user.address].filter(Boolean).length < 4) && (
                            <Typography variant="caption" sx={{ color: '#aaa', mt: 1, display: 'block' }}>
                              Complete your profile to unlock all features.
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  )}

                  {/* Quick Links Banner */}
                  <Grid container spacing={2}>
                    {/* My Orders Banner */}
                    <Grid item xs={12} sm={6}>
                      <Card
                        onClick={() => navigate('/my-orders')}
                        sx={{
                          borderRadius: '20px', cursor: 'pointer', overflow: 'hidden',
                          background: 'linear-gradient(135deg,#1e1b4b,#312e81)',
                          border: '1px solid rgba(99,102,241,0.3)',
                          boxShadow: '0 4px 20px rgba(99,102,241,0.12)',
                          transition: 'all 0.3s ease',
                          '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 32px rgba(99,102,241,0.25)' }
                        }}
                      >
                        <CardContent sx={{ p: 3.5, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                          <Box sx={{
                            width: 56, height: 56, borderRadius: '14px',
                            bgcolor: 'rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#a5b4fc', flexShrink: 0
                          }}>
                            <ShoppingBagIcon sx={{ fontSize: 28 }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>My Orders</Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mt: 0.3 }}>Track & manage your orders</Typography>
                          </Box>
                          <ArrowForwardIosIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }} />
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Wishlist Banner */}
                    <Grid item xs={12} sm={6}>
                      <Card
                        onClick={() => navigate('/liked-products')}
                        sx={{
                          borderRadius: '20px', cursor: 'pointer', overflow: 'hidden',
                          background: 'linear-gradient(135deg,#450a0a,#7f1d1d)',
                          border: '1px solid rgba(239,68,68,0.3)',
                          boxShadow: '0 4px 20px rgba(239,68,68,0.12)',
                          transition: 'all 0.3s ease',
                          '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 32px rgba(239,68,68,0.25)' }
                        }}
                      >
                        <CardContent sx={{ p: 3.5, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                          <Box sx={{
                            width: 56, height: 56, borderRadius: '14px',
                            bgcolor: 'rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fca5a5', flexShrink: 0
                          }}>
                            <FavoriteIcon sx={{ fontSize: 28 }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>My Wishlist</Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mt: 0.3 }}>
                              {likedProducts.length} saved item{likedProducts.length !== 1 ? 's' : ''}
                            </Typography>
                          </Box>
                          <ArrowForwardIosIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }} />
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                </Stack>
              </Box>

            </Box>
          ) : (
            /* ── Not logged in ── */
            <Box sx={{ maxWidth: 520, mx: 'auto', textAlign: 'center', py: 10 }}>
              <Card sx={{ p: 6, boxShadow: '0 20px 60px rgba(0,0,0,0.08)', borderRadius: '28px', border: '1px solid #f0f0f0' }}>
                <Box sx={{
                  width: 90, height: 90, bgcolor: '#f5f5f5', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3
                }}>
                  <PersonIcon sx={{ fontSize: 50, color: '#111' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1.5, color: '#111' }}>Sign in Required</Typography>
                <Typography color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                  Access your orders, wishlist, and profile settings by signing in to your account.
                </Typography>
                <Stack spacing={1.5} sx={{ maxWidth: 280, mx: 'auto' }}>
                  <Button component={Link} to="/login" variant="contained" size="large" sx={{ bgcolor: '#111', borderRadius: '12px', py: 1.6, textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#333' } }}>
                    Login to Account
                  </Button>
                  <Button component={Link} to="/register" variant="outlined" size="large" sx={{ borderColor: '#ddd', color: '#444', borderRadius: '12px', py: 1.6, textTransform: 'none', fontWeight: 700, '&:hover': { borderColor: '#111', bgcolor: '#fafafa' } }}>
                    Create New Account
                  </Button>
                </Stack>
              </Card>
            </Box>
          )}
        </Container>
      </Box>

      {/* ── Edit Profile Dialog ── */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditClose}
        fullWidth maxWidth="sm"
        PaperProps={{ sx: { borderRadius: '24px', p: 0, overflow: 'hidden' } }}
      >
        {/* Dialog Header */}
        <Box sx={{ background: 'linear-gradient(135deg,#0f0f0f,#1a1a2e)', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800 }}>Edit Profile</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)' }}>Update your personal information</Typography>
          </Box>
          <IconButton onClick={handleEditClose} sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            {/* Avatar Upload */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ position: 'relative' }}>
                <Box sx={{
                  width: 100, height: 100, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#6366f1,#ef4444)', p: '3px',
                  boxShadow: '0 0 30px rgba(99,102,241,0.3)'
                }}>
                  <Avatar src={editData.profilePhotoPreview} sx={{ width: '100%', height: '100%', border: '3px solid #fff', bgcolor: '#f0f0f0' }} />
                </Box>
                <IconButton
                  component="label"
                  size="small"
                  sx={{
                    position: 'absolute', bottom: 2, right: 2,
                    bgcolor: '#6366f1', color: '#fff', width: 30, height: 30,
                    '&:hover': { bgcolor: '#4f46e5' }, boxShadow: '0 4px 14px rgba(99,102,241,0.4)'
                  }}
                >
                  <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                  <CameraAltIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
              <Typography variant="caption" sx={{ color: '#aaa' }}>Click the camera icon to change your photo</Typography>
            </Box>

            <TextField
              label="Full Name" name="name" value={editData.name} onChange={handleInputChange}
              fullWidth variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <TextField
              label="Mobile Number" name="mobile" value={editData.mobile} onChange={handleInputChange}
              fullWidth variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <TextField
              label="Delivery Address" name="address" value={editData.address} onChange={handleInputChange}
              fullWidth multiline rows={3} variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, gap: 1.5 }}>
          <Button onClick={handleEditClose} sx={{ color: '#888', fontWeight: 700, textTransform: 'none', borderRadius: '10px' }}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProfile}
            variant="contained"
            disabled={updating}
            sx={{
              bgcolor: '#111', borderRadius: '12px', px: 4, py: 1.2,
              fontWeight: 700, textTransform: 'none',
              '&:hover': { bgcolor: '#333' }, minWidth: 140
            }}
          >
            {updating ? <CircularProgress size={22} color="inherit" /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
      <ScrollToTop />
    </Box>
  );
}

export default MyAccount;