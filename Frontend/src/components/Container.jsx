import {Box} from '@mui/material';

function Container({children}){
    return(
        <Box sx={{
            maxWidth: '1200px',
            mx: 'auto',
            px:{xs:2,sm:3,md:4},
        }}>
            {children}
        </Box>
    );
}
export default Container;