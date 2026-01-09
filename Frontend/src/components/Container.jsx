import {Box} from '@mui/material';

function Container({children}){
    return(
        <Box sx={{
            maxWidth: '1200px',
            mx: 'auto',
            px: 2,
        }}>
            {children}
        </Box>
    );
}
export default Container;