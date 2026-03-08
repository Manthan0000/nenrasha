import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

// ── Map common error codes → friendly messages ─────────────────────────────
const ERROR_MAP = {
    404: { heading: "Oops!", title: "Something is Missing.", sub: "The page you're looking for cannot be found. Take a break before trying again." },
    403: { heading: "Access Denied", title: "You Don't Have Permission.", sub: "You are not authorised to view this page. Please log in or return to the homepage." },
    500: { heading: "Server Error", title: "Something Went Wrong.", sub: "Our server is taking a short break. Please try again in a few moments." },
    default: { heading: "Oops!", title: "Something is Missing.", sub: "The page you're looking for cannot be found. Take a break before trying again." },
};

export default function ErrorPage({ code: codeProp, message: msgProp }) {
    const navigate = useNavigate();
    const location = useLocation();

    // Accept code/message from props OR from router state (navigate('/error', { state: { code, message } }))
    const stateCode = location.state?.code;
    const stateMsg  = location.state?.message;
    const code      = codeProp || stateCode || 404;
    const customMsg = msgProp  || stateMsg  || null;

    const err = ERROR_MAP[code] || ERROR_MAP.default;

    return (
        <Box sx={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            px: 3,
            py: 10,
            bgcolor: '#fff',
            textAlign: 'center',
        }}>
            {/* ── SVG Illustration (no external image) ──────────────────── */}
            <Box sx={{ mb: 5, userSelect: 'none' }}>
                <svg width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Large blurred background number */}
                    <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle"
                        fontSize="160" fontWeight="900" fontFamily="system-ui, sans-serif"
                        fill="#f0f0f0" letterSpacing="-8">
                        {code}
                    </text>

                    {/* Ghost body */}
                    <ellipse cx="140" cy="105" rx="38" ry="44" fill="#111" />
                    {/* Ghost head round */}
                    <circle cx="140" cy="68" r="38" fill="#111" />
                    {/* Ghost wavy bottom */}
                    <path d="M102 105 Q110 118 118 108 Q126 120 134 108 Q142 120 150 108 Q158 120 166 108 Q174 115 178 105 L178 150 Q170 160 162 150 Q154 160 146 150 Q138 160 130 150 Q122 160 114 150 Q106 160 102 150 Z"
                        fill="#111" />
                    {/* Eyes */}
                    <circle cx="128" cy="68" r="7" fill="#fff" />
                    <circle cx="152" cy="68" r="7" fill="#fff" />
                    <circle cx="130" cy="69" r="3.5" fill="#111" />
                    <circle cx="154" cy="69" r="3.5" fill="#111" />
                    {/* Floating sparkles */}
                    <circle cx="60" cy="55" r="4" fill="#111" opacity="0.15" />
                    <circle cx="220" cy="40" r="6" fill="#111" opacity="0.10" />
                    <circle cx="45" cy="130" r="3" fill="#111" opacity="0.12" />
                    <circle cx="235" cy="115" r="5" fill="#111" opacity="0.12" />
                    <line x1="60" y1="38" x2="60" y2="47" stroke="#111" strokeWidth="2" opacity="0.2" strokeLinecap="round" />
                    <line x1="56" y1="43" x2="64" y2="43" stroke="#111" strokeWidth="2" opacity="0.2" strokeLinecap="round" />
                    <line x1="220" y1="22" x2="220" y2="31" stroke="#111" strokeWidth="2" opacity="0.15" strokeLinecap="round" />
                    <line x1="216" y1="26" x2="224" y2="26" stroke="#111" strokeWidth="2" opacity="0.15" strokeLinecap="round" />
                </svg>
            </Box>

            {/* ── Text content ─────────────────────────────────────────── */}
            <Typography
                sx={{
                    fontWeight: 900, fontSize: { xs: '2.4rem', md: '3rem' },
                    color: '#111', letterSpacing: -1, mb: 1,
                    animation: 'fadeUp 0.4s ease both',
                    '@keyframes fadeUp': { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                }}
            >
                {err.heading}
            </Typography>

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700, color: '#111', mb: 1.5,
                    fontSize: { xs: '1.1rem', md: '1.35rem' },
                    animation: 'fadeUp 0.5s ease 0.05s both',
                }}
            >
                {customMsg || err.title}
            </Typography>

            <Typography
                sx={{
                    color: '#888', maxWidth: 420, mx: 'auto', lineHeight: 1.75,
                    fontSize: '0.95rem', mb: 4.5,
                    animation: 'fadeUp 0.6s ease 0.1s both',
                }}
            >
                {err.sub}
            </Typography>

            {/* ── CTA Button ───────────────────────────────────────────── */}
            <Button
                variant="contained"
                onClick={() => navigate('/')}
                sx={{
                    bgcolor: '#111', color: '#fff',
                    px: 5, py: 1.6,
                    borderRadius: '10px',
                    fontWeight: 700, fontSize: '0.95rem',
                    textTransform: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
                    animation: 'fadeUp 0.7s ease 0.15s both',
                    '&:hover': {
                        bgcolor: '#333',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 28px rgba(0,0,0,0.22)',
                    },
                    transition: 'all 0.25s ease',
                }}
            >
                Back to Homepage
            </Button>
        </Box>
    );
}
