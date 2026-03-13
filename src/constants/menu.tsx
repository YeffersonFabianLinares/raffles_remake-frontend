import LogoutIcon from '@mui/icons-material/Logout';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PeopleIcon from '@mui/icons-material/People';
import FolderIcon from '@mui/icons-material/Folder';

import type { MenuItem } from "../interfaces/MenuItem";

export const Menu: MenuItem[] = [
    { text: 'Clientes', icon: <PeopleIcon />, path: '/customers' },
    { text: 'Rifas', icon: <PeopleIcon />, path: '/tickets/Libre' },
    {
        text: 'Boletas',
        icon: <FolderIcon />,
        children: [
            { text: 'Boletas Disponibles', icon: <HandshakeIcon />, path: '/tickets/Libre' },
            { text: 'Boletas Sin Abono', icon: <HandshakeIcon />, path: '/admin/gratitudes' },
            { text: 'Boletas Con Abono', icon: <HandshakeIcon />, path: '/admin/gratitudes' },
            { text: 'Boletas Pagadas', icon: <HandshakeIcon />, path: '/admin/gratitudes' },
            { text: 'Boletas En Línea', icon: <HandshakeIcon />, path: '/admin/gratitudes' },
            { text: 'Cargue de Boletas', icon: <HandshakeIcon />, path: '/admin/gratitudes' },
        ]
    },
    { text: 'Vendedores', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Promociones', icon: <PeopleIcon />, path: '/admin/users' },
    {
        text: 'Reportes',
        icon: <FolderIcon />,
        children: [
            { text: 'Reporte de Ventas', icon: <HandshakeIcon />, path: '/admin/gratitudes' },
            { text: 'Reporte de Usuarios', icon: <HandshakeIcon />, path: '/admin/gratitudes' },
            { text: 'Reporte de Vendedores', icon: <HandshakeIcon />, path: '/admin/gratitudes' },
        ]
    },
    { text: 'Logout', icon: <LogoutIcon />, path: '/logout' },
]