import LogoutIcon from '@mui/icons-material/Logout';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PeopleIcon from '@mui/icons-material/People';
import FolderIcon from '@mui/icons-material/Folder';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import type { MenuItem } from "../interfaces/MenuItem";

export const Menu: MenuItem[] = [
    { text: 'Clientes', icon: <PeopleIcon />, path: '/customers' },
    { text: 'Rifas', icon: <FolderIcon />, path: '/raffles' },
    {
        text: 'Boletas',
        icon: <ConfirmationNumberIcon />,
        children: [
            { text: 'Lista de Boletas', icon: <HandshakeIcon />, path: '/tickets' },
        ]
    },
    { text: 'Vendedores', icon: <PeopleIcon />, path: '/sellers' },
    { text: 'Promociones', icon: <LocalOfferIcon />, path: '/promotions' },
    { text: 'Logout', icon: <LogoutIcon />, path: '/admin' },
]
