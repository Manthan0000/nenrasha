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
  DialogActions
} from '@mui/material';
import Container from '../components/Container';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { useAuth } from '../context/AuthContext';
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
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ProductCard from '../components/ProductCard';

function MyAccount() {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
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
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        // Map backend _id to frontend id for ProductCard
        const mappedProducts = data.data.map(p => ({
            ...p,
            id: p._id
        }));
        setLikedProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Error fetching liked products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setEditData({
            ...editData,
            profilePhoto: file,
            profilePhotoPreview: URL.createObjectURL(file),
        });
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
      if (editData.profilePhoto) {
          formData.append('profilePhoto', editData.profilePhoto);
      }

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        // Update local state via login function (which sets localStorage and state)
        login({ ...user, ...data.data });
        setEditDialogOpen(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const renderInfoItem = (icon, label, value) => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'flex-start',
      p: 3, 
      borderRadius: '20px', 
      bgcolor: '#fff',
      border: '1px solid #f0f0f0',
      transition: 'all 0.2s', 
      '&:hover': { 
        borderColor: '#e0e0e0',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
      } 
    }}>
      <Box sx={{ 
        bgcolor: '#f8f9fa', 
        p: 1.5, 
        borderRadius: '12px', 
        mb: 2,
        color: '#111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 800, fontSize: '0.7rem' }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700, color: '#111', mt: 0.5, fontSize: '1.1rem' }}>
          {value || 'Not provided'}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Page Title */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #111 0%, #333 100%)',
          py: { xs: 8, md: 10 },
          textAlign: 'center',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            mb: 1.5,
            fontSize: { xs: '2.5rem', md: '4rem' },
            letterSpacing: -1,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}
        >
          My Account
        </Typography>
        <Typography sx={{ 
          fontSize: '13px', 
          opacity: 0.8, 
          textTransform: 'uppercase', 
          letterSpacing: 3,
          fontWeight: 600
        }}>
          Home / Profile Settings
        </Typography>
      </Box>

      {/* Account Content */}
      <Box sx={{ py: { xs: 6, md: 8 }, flexGrow: 1 }}>
        <Container>
          {user ? (
            <Grid container spacing={5}>
              {/* Profile Sidebar Card */}
              <Grid item xs={12} lg={3.5}>
                <Card sx={{ 
                  borderRadius: '24px', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  position: 'sticky',
                  top: '100px',
                  background: 'linear-gradient(180deg, #fff 0%, #fafafa 100%)',
                  overflow: 'visible'
                }}>
                  <CardContent sx={{ p: 4, pt: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5, mt: -8 }}>
                      <Box sx={{
                        position: 'relative',
                        mb: 2,
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: -6, left: -6, right: -6, bottom: -6,
                          borderRadius: '50%',
                          background: 'linear-gradient(45deg, #111, #666)',
                          zIndex: 0,
                          opacity: 0.1
                        }
                      }}>
                        <Avatar
                          src={user.profilePhoto || ''}
                          sx={{ 
                            width: 140, 
                            height: 140, 
                            boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                            border: '5px solid #fff',
                            position: 'relative',
                            zIndex: 1,
                            bgcolor: '#f5f5f5',
                            color: '#aaa'
                          }}
                        >
                          {!user.profilePhoto && <PersonIcon sx={{ fontSize: 75 }} />}
                        </Avatar>
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontSize: '1.75rem', color: '#111' }}>
                        {user.name}
                      </Typography>
                      <Box sx={{ 
                        px: 2.5, 
                        py: 0.75, 
                        background: user.role === 'admin' ? 'linear-gradient(135deg, #111, #444)' : '#f0f0f0', 
                        color: user.role === 'admin' ? '#fff' : '#666',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: 1.5,
                        boxShadow: user.role === 'admin' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                      }}>
                        {user.role}
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Stack spacing={1.5}>
                      <Button 
                        fullWidth 
                        variant={activeTab === 'info' ? "contained" : "text"} 
                        startIcon={<PersonIcon />}
                        onClick={() => setActiveTab('info')}
                        disableElevation
                        sx={{ 
                          borderRadius: '16px',
                          py: 1.8,
                          justifyContent: 'flex-start',
                          px: 3,
                          bgcolor: activeTab === 'info' ? '#111' : 'transparent',
                          color: activeTab === 'info' ? '#fff' : '#666',
                          '&:hover': { bgcolor: activeTab === 'info' ? '#111' : '#f5f5f5', color: activeTab === 'info' ? '#fff' : '#111' },
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '1rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Account Info
                      </Button>

                      <Button 
                        fullWidth 
                        variant="text" 
                        startIcon={<FavoriteIcon />}
                        onClick={() => navigate('/liked-products')}
                        disableElevation
                        sx={{ 
                          borderRadius: '16px',
                          py: 1.8,
                          justifyContent: 'flex-start',
                          px: 3,
                          bgcolor: 'transparent',
                          color: '#666',
                          '&:hover': { bgcolor: '#f5f5f5', color: '#111' },
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '1rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        My Liked Products
                      </Button>

                      <Button 
                        fullWidth 
                        variant="text" 
                        startIcon={<EditIcon />}
                        onClick={handleEditClick}
                        sx={{ 
                          borderRadius: '16px',
                          py: 1.8,
                          justifyContent: 'flex-start',
                          px: 3,
                          color: '#666',
                          '&:hover': { bgcolor: '#f5f5f5', color: '#111' },
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '1rem'
                        }}
                      >
                        Edit Profile
                      </Button>

                        <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.05)' }} />

                      {user.role === 'admin' && (
                        <>
                          <Button 
                            fullWidth 
                            variant="text" 
                            startIcon={<AddCircleIcon />}
                            onClick={() => navigate('/admin/add-product')}
                            sx={{ 
                              borderRadius: '16px',
                              py: 1.8,
                              justifyContent: 'flex-start',
                              px: 3,
                              color: '#666',
                              '&:hover': { bgcolor: '#e3f2fd', color: '#1976d2' },
                              textTransform: 'none',
                              fontWeight: 700,
                              fontSize: '1rem'
                            }}
                          >
                            Add Product
                          </Button>
                          <Button 
                            fullWidth 
                            variant="text" 
                            startIcon={<ListAltIcon />}
                            onClick={() => navigate('/admin/my-listings')}
                            sx={{ 
                              borderRadius: '16px',
                              py: 1.8,
                              justifyContent: 'flex-start',
                              px: 3,
                              color: '#666',
                              '&:hover': { bgcolor: '#e3f2fd', color: '#1976d2' },
                              textTransform: 'none',
                              fontWeight: 700,
                              fontSize: '1rem'
                            }}
                          >
                            My Listings
                          </Button>
                        </>
                      )}

                      <Button 
                        fullWidth 
                        variant="text" 
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{ 
                          borderRadius: '16px',
                          py: 1.8,
                          justifyContent: 'flex-start',
                          px: 3,
                          color: '#d32f2f',
                          '&:hover': { bgcolor: '#ffebee' },
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '1rem',
                          mt: 1
                        }}
                      >
                        Logout
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Details and Liked Products Main Area */}
              <Grid item xs={12} lg={8.5}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {activeTab === 'info' && (
                    <Box sx={{ animation: 'fadeIn 0.4s ease-in-out' }}>
                      <Typography variant="h3" sx={{ fontWeight: 900, mb: 4, letterSpacing: -1, color: '#111' }}>
                        Account Information
                      </Typography>
                      
                      <Card sx={{ 
                        borderRadius: '24px', 
                        boxShadow: 'none',
                        background: 'transparent'
                      }}>
                        <CardContent sx={{ p: 0 }}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                              {renderInfoItem(<BadgeIcon fontSize="medium" />, "Full Name", user.name)}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              {renderInfoItem(<EmailIcon fontSize="medium" />, "Email Address", user.email)}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              {renderInfoItem(<PhoneIcon fontSize="medium" />, "Mobile Number", user.mobile)}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              {renderInfoItem(<HomeIcon fontSize="medium" />, "Delivery Address", user.address)}
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          ) : (
             // Logged Out View - Login Required Message
             <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center', py: 8 }}>
                 <Card sx={{ p: 6, boxShadow: '0 20px 60px rgba(0,0,0,0.1)', borderRadius: '32px', border: '1px solid #f0f0f0' }}>
                     <Box sx={{ 
                       width: 100, 
                       height: 100, 
                       bgcolor: '#f5f5f5', 
                       borderRadius: '50%', 
                       display: 'flex', 
                       alignItems: 'center', 
                       justifyContent: 'center',
                       mx: 'auto',
                       mb: 3
                     }}>
                      <PersonIcon sx={{ fontSize: 50, color: '#000' }} />
                     </Box>
                     <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                         Sign in Required
                     </Typography>
                     <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
                         Access your orders, wishlist, and profile settings by signing in to your account.
                     </Typography>
                     
                     <Stack spacing={2} sx={{ maxWidth: 300, mx: 'auto' }}>
                         <Button 
                             component={Link} 
                             to="/login"
                             variant="contained" 
                             size="large"
                             sx={{
                                 backgroundColor: '#000',
                                 color: '#fff',
                                 py: 1.8,
                                 textTransform: 'none',
                                 borderRadius: '14px',
                                 fontWeight: 700,
                                 '&:hover': { backgroundColor: '#333' }
                             }}
                         >
                             Login to Account
                         </Button>
                         <Button 
                             component={Link} 
                             to="/register"
                             variant="outlined" 
                             size="large"
                             sx={{
                                 color: '#000',
                                 borderColor: '#000',
                                 py: 1.8,
                                 textTransform: 'none',
                                 borderRadius: '14px',
                                 fontWeight: 700,
                                 '&:hover': { backgroundColor: '#f5f5f5', borderColor: '#000' }
                             }}
                         >
                             Create New Account
                         </Button>
                     </Stack>
                 </Card>
             </Box>
          )}
        </Container>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleEditClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: '24px', p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem' }}>Edit Profile Information</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Box sx={{ position: 'relative' }}>
                    <Avatar 
                        src={editData.profilePhotoPreview} 
                        sx={{ width: 100, height: 100, border: '2px solid #eee' }} 
                    />
                    <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="label"
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: -10,
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            '&:hover': { backgroundColor: '#f5f5f5' }
                        }}
                    >
                        <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                        <CameraAltIcon fontSize="small" sx={{ color: '#111' }} />
                    </IconButton>
                </Box>
            </Box>

            <TextField
              label="Full Name"
              name="name"
              value={editData.name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <TextField
              label="Mobile Number"
              name="mobile"
              value={editData.mobile}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <TextField
              label="Address"
              name="address"
              value={editData.address}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleEditClose} sx={{ color: '#666', fontWeight: 700 }}>Cancel</Button>
          <Button 
            onClick={handleUpdateProfile} 
            variant="contained" 
            disabled={updating}
            sx={{ 
                bgcolor: '#000', 
                borderRadius: '10px', 
                px: 4,
                '&:hover': { bgcolor: '#333' }
            }}
          >
            {updating ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
      <ScrollToTop />
    </Box>
  );
}

export default MyAccount;
