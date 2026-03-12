import { IconButton,Box } from "@mui/material";
import KeyboarrdArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useEffect, useState } from "react";
function ScrollToTop(){
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const toggleVisiblity = () => {
            if(window.pageYOffset > 300){
                setIsVisible(true);
            }else{
                setIsVisible(false);
            }
        };
        window.addEventListener('scroll', toggleVisiblity);
        return() => {
            window.removeEventListener('scroll', toggleVisiblity);
        };
    },[]);
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };
    return(
        <>
            {isVisible && (
                <IconButton
                    onClick={scrollToTop}
                    sx={{
                        position: 'fixed',
                        bottom: 30,
                        right: 30,
                        backgroundColor: '#000',
                        color: '#fff',
                        width: 50,
                        height: 50,
                        zIndex: 1000,
                        '&:hover':{
                            backgroundColor: '#333',
                            transform: 'translateY(-5px)',
                        },
                        transition: 'all 0.3s ease',
                    }}
                    >
                        <KeyboarrdArrowUpIcon />
                </IconButton>
            )}
        </>
    );
}

export default ScrollToTop;