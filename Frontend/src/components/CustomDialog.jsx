import { useEffect } from 'react';
import { Box, Typography, Button, Fade } from '@mui/material';

/**
 * CustomDialog — ONE design for all popups.
 * Only the icon color, title, message, and button set change.
 *
 * Props:
 *  open      : boolean
 *  type      : 'alert' | 'confirm'
 *  title     : string | null
 *  message   : string
 *  severity  : 'info' | 'success' | 'warning' | 'error'
 *  onOk      : () => void  (alert)
 *  onConfirm : () => void  (confirm → true)
 *  onCancel  : () => void  (confirm → false)
 */

const SEVERITY_MAP = {
    info:    { bg: '#e8f4fd', icon: 'ℹ', color: '#1565c0' },
    success: { bg: '#e8f9f0', icon: '✓', color: '#1b5e20' },
    warning: { bg: '#fff8e1', icon: '!', color: '#e65100' },
    error:   { bg: '#fdecea', icon: '✕', color: '#c62828' },
};

export default function CustomDialog({
    open, type, title, message, severity = 'info',
    onOk, onConfirm, onCancel,
}) {
    const s = SEVERITY_MAP[severity] || SEVERITY_MAP.info;

    // Close on Escape key
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (e.key === 'Escape') {
                type === 'alert' ? onOk?.() : onCancel?.();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, type, onOk, onCancel]);

    // Prevent body scroll while open
    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (!open) return null;

    return (
        /* Backdrop */
        <Box
            onClick={() => type === 'alert' ? onOk?.() : onCancel?.()}
            sx={{
                position: 'fixed', inset: 0,
                bgcolor: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(4px)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                animation: 'fadeInBackdrop 0.18s ease',
                '@keyframes fadeInBackdrop': { from: { opacity: 0 }, to: { opacity: 1 } },
            }}
        >
            {/* Card — stop propagation so clicking inside doesn't close */}
            <Box
                onClick={(e) => e.stopPropagation()}
                sx={{
                    bgcolor: '#fff',
                    borderRadius: '18px',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.22)',
                    p: { xs: 3, sm: 4 },
                    maxWidth: 420,
                    width: '100%',
                    textAlign: 'center',
                    animation: 'scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                    '@keyframes scaleIn': {
                        from: { opacity: 0, transform: 'scale(0.88)' },
                        to:   { opacity: 1, transform: 'scale(1)' },
                    },
                }}
            >
                {/* Icon circle */}
                <Box sx={{
                    width: 60, height: 60,
                    borderRadius: '50%',
                    bgcolor: s.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 2.5,
                    fontSize: 26, fontWeight: 800, color: s.color,
                    lineHeight: 1,
                    userSelect: 'none',
                    fontFamily: 'monospace',
                }}>
                    {s.icon}
                </Box>

                {/* Title (optional) */}
                {title && (
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            color: '#111',
                            mb: 1,
                            lineHeight: 1.3,
                        }}
                    >
                        {title}
                    </Typography>
                )}

                {/* Message */}
                <Typography
                    sx={{
                        color: '#555',
                        fontSize: '0.95rem',
                        lineHeight: 1.65,
                        mb: 3.5,
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {message}
                </Typography>

                {/* Buttons */}
                <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                    {type === 'confirm' && (
                        <Button
                            onClick={onCancel}
                            variant="outlined"
                            sx={{
                                flex: 1,
                                height: 46,
                                borderRadius: '10px',
                                borderColor: '#ddd',
                                color: '#444',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                textTransform: 'none',
                                '&:hover': { borderColor: '#aaa', bgcolor: '#f5f5f5' },
                            }}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        onClick={type === 'alert' ? onOk : onConfirm}
                        variant="contained"
                        sx={{
                            flex: 1,
                            height: 46,
                            borderRadius: '10px',
                            bgcolor: type === 'confirm' && severity === 'error' ? '#c62828' : '#111',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: type === 'confirm' && severity === 'error' ? '#b71c1c' : '#333',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                            },
                        }}
                    >
                        {type === 'alert' ? 'OK' : 'Confirm'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
