import {Box, Typography, TextField, Button} from '@mui/material';

function Login(){
    return (
        <Box sx={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Box sx={{
                width: 360,
                p: 4,
                boxShadow: 3,
                borderRadius: 2,
            }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Login to Nenrasha
                </Typography>
                <TextField lable="Email" placeholder="Enter Email" type="email" fullWidth margin="normal" />
                <TextField lable="Password" placeholder="Enter Password" type="Password" fullWidth margin="normal" />
                <Button variant='contained' fullWidth sx={{ mt:2}}>Login</Button>
            </Box>
        </Box>
    );
}
export default Login;