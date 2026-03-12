import {Box} from '@mui/material';

function Container({children}){
    return(
        <Box sx={{
            maxWidth: { xs: '100%', sm: '1200px', md: '1400px' },
            mx: 'auto',
            px:{xs:2,sm:3,md:4},
        }}>
            {children}
        </Box>
    );
}
export default Container;