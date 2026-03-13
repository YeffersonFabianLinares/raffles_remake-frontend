import { Backdrop } from '@mui/material';
import LogoSimple from '../assets/logo_casa_sorteos.png'

const SpinnerLoad = () => {
    return (
        <>
            {/* El Backdrop se muestra solo cuando loading es true */}
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)' // Fondo sutil
                }}
                open={true}
            >
                <img className='preloader-rotate-y' src={LogoSimple} alt="" width={150} />
                {/* <CircularProgress color="inherit" size={60} /> */}
            </Backdrop>
        </>
    );

}

export default SpinnerLoad