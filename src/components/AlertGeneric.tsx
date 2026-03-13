import { Snackbar, Alert } from '@mui/material';
import type { AlertSeverity } from '../types/AlertSeverity';

interface AsyncState {
    severity: AlertSeverity,
    message: string | null,
    open: boolean,
    onClose: () => void
}

const AlertGeneric = ({ severity, message, open, onClose }: AsyncState) => {
    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={onClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={onClose}
                    severity={severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        boxShadow: 10,
                        // fontSize: '1.1rem',
                        alignItems: 'center',
                        // '& .MuiAlert-icon': {
                        //     fontSize: '2rem'
                        // }
                    }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default AlertGeneric