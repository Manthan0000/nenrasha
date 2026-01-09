import {Box ,Typography, TextField, Button} from '@mui/material'

function Register(){
    return (
        <Box sx={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Box sx={{
                width: 360,
                p: 4,
                boxShadow: 3,
                borderRadius: 2,
            }}>
                <Typography variant='h5' fontWeight="bold" gutterBottom>
                    Create Your account
                </Typography>
                <TextField label="Full Name" placeholder="Enter Your Name" fullWidth margin="normal"></TextField>
                <TextField label="Email" placeholder="Enter Email Address" fullWidth margin="normal"></TextField>
                <TextField label="Password" placeholder="Enter Password" fullWidth margin="normal"></TextField>
                <Button variant='contained' fullWidth sx={{ mt: 2}}>Register</Button>
            </Box>
        </Box>
    );
}
export default Register;