import { Drawer, Box, Typography, Button, TextField, MenuItem, Avatar, Divider, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';

const API_URL = 'http://localhost:5000/api/auth';

function ProfileSidebar({ open, onClose }) {
  const { user, login, logout } = useAuth(); // login acts as updateUser here
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    gender: '',
    address: '',
    profilePhoto: null, // File object
    profilePhotoPreview: '', // URL for preview
  });

  // Check if profile is complete (rudimentary check) - Removed forced check
  // const isProfileComplete = user?.mobile && user?.gender && user?.address && user?.profilePhoto;

  useEffect(() => {
    if (open && user) {
        // Reset form when opening to current details
        setFormData({
            name: user.name || '',
            mobile: user.mobile || '',
            gender: user.gender || '',
            address: user.address || '',
            profilePhoto: null,
            profilePhotoPreview: user.profilePhoto || '',
        });
        // We do NOT force edit mode anymore. User can choose to edit.
        setIsEditing(false); 
    }
  }, [open, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFormData({
            ...formData,
            profilePhoto: file,
            profilePhotoPreview: URL.createObjectURL(file), // Preview
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const data = new FormData();
        data.append('userId', user._id);
        data.append('name', formData.name);
        data.append('mobile', formData.mobile);
        data.append('gender', formData.gender);
        data.append('address', formData.address);
        if (formData.profilePhoto) {
            data.append('profilePhoto', formData.profilePhoto);
        }

        const response = await fetch(`${API_URL}/profile`, {
            method: 'PUT',
            body: data, // No Content-Type header needed, browser sets boundary
        });

        const result = await response.json();

        if (result.success) {
            login(result.data); // Update context
            setIsEditing(false); // Go to view mode
        } else {
            alert(result.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Profile update error', error);
        alert('Network error');
    } finally {
        setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: '400px', md: '33vw' }, p: 3 }
      }}
    >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
                {isEditing ? 'Complete User Profile' : 'User Profile'}
            </Typography>
            <IconButton onClick={onClose}>
                <CloseIcon />
            </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {isEditing ? (
            /* EDIT / COMPLETE FORM */
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar 
                            src={formData.profilePhotoPreview} 
                            sx={{ width: 100, height: 100, mb: 1, border: '2px solid #eee' }} 
                        />
                         <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: '#fff',
                                border: '1px solid #ccc',
                                '&:hover': { backgroundColor: '#f5f5f5' }
                            }}
                        >
                            <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                            <CameraAltIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    <Typography variant="caption" color="text.secondary">Upload Profile Photo</Typography>
                </Box>

                <TextField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                />

                <TextField
                    label="Mobile Number"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                />

                <TextField
                    select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </TextField>

                <TextField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={3}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                />

                <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    sx={{ 
                        mt: 2, 
                        py: 1.5,
                        backgroundColor: '#000', 
                        borderRadius: 0,
                        '&:hover': { backgroundColor: '#333' } 
                    }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} sx={{color:'#fff'}}/> : 'Save Details'}
                </Button>
            </form>
        ) : (
            /* VIEW MODE */
            <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    <Avatar 
                        src={user.profilePhoto} 
                        sx={{ width: 120, height: 120, mb: 2, border: '2px solid #e0e0e0' }} 
                    />
                    <Typography variant="h5" fontWeight="bold">{user.name}</Typography>
                    <Typography color="text.secondary">{user.email}</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Mobile</Typography>
                        <Typography variant="body1">{user.mobile || 'Not set'}</Typography>
                    </Box>
                    <Divider />
                     <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Gender</Typography>
                        <Typography variant="body1">{user.gender || 'Not set'}</Typography>
                    </Box>
                    <Divider />
                     <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Address</Typography>
                        <Typography variant="body1">{user.address || 'Not set'}</Typography>
                    </Box>
                    <Divider />
                    <Button 
                        variant="outlined" 
                        fullWidth 
                        onClick={() => setIsEditing(true)}
                        sx={{ 
                            mt: 2, 
                            color: '#000', 
                            borderColor: '#000', 
                            borderRadius: 0,
                            '&:hover': { borderColor: '#333', backgroundColor: '#f9f9f9' }
                        }}
                    >
                        Edit Profile
                    </Button>

                    <Button 
                        variant="contained" 
                        fullWidth 
                        color="error"
                        onClick={() => {
                            logout();
                            onClose();
                            navigate('/');
                        }}
                        startIcon={<LogoutIcon />}
                        sx={{ 
                            mt: 1, 
                            borderRadius: 0,
                            boxShadow: 'none',
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>
        )}
    </Drawer>
  );
}

export default ProfileSidebar;
