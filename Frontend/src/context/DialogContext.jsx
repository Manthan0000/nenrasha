import { createContext, useContext, useState, useCallback, useRef } from 'react';
import CustomDialog from '../components/CustomDialog';

const DialogContext = createContext(null);

/**
 * useDialog() hook
 *  - showAlert(message, options?)   → Promise<void>
 *  - showConfirm(message, options?) → Promise<boolean>
 *
 * options: { title?: string, severity?: 'info'|'success'|'warning'|'error' }
 */
export function useDialog() {
    const ctx = useContext(DialogContext);
    if (!ctx) throw new Error('useDialog must be used inside <DialogProvider>');
    return ctx;
}

export function DialogProvider({ children }) {
    const [dialog, setDialog] = useState(null);
    // We store the resolver so we can resolve the promise when the user clicks
    const resolverRef = useRef(null);

    const openDialog = useCallback((config) => {
        return new Promise((resolve) => {
            resolverRef.current = resolve;
            setDialog(config);
        });
    }, []);

    /** showAlert — resolves when user clicks OK */
    const showAlert = useCallback((message, options = {}) => {
        return openDialog({
            type: 'alert',
            message,
            title: options.title || null,
            severity: options.severity || 'info',
        });
    }, [openDialog]);

    /** showConfirm — resolves true/false */
    const showConfirm = useCallback((message, options = {}) => {
        return openDialog({
            type: 'confirm',
            message,
            title: options.title || 'Are you sure?',
            severity: options.severity || 'warning',
        });
    }, [openDialog]);

    const handleClose = useCallback((result) => {
        setDialog(null);
        if (resolverRef.current) {
            resolverRef.current(result);
            resolverRef.current = null;
        }
    }, []);

    return (
        <DialogContext.Provider value={{ showAlert, showConfirm }}>
            {children}
            {dialog && (
                <CustomDialog
                    open={Boolean(dialog)}
                    type={dialog.type}
                    title={dialog.title}
                    message={dialog.message}
                    severity={dialog.severity}
                    onConfirm={() => handleClose(true)}
                    onCancel={() => handleClose(false)}
                    onOk={() => handleClose(undefined)}
                />
            )}
        </DialogContext.Provider>
    );
}
