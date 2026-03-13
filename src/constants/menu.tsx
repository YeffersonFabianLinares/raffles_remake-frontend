import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import LogoutIcon from '@mui/icons-material/Logout';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HandshakeIcon from '@mui/icons-material/Handshake';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import MailRounded from '@mui/icons-material/MailRounded';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import PeopleIcon from '@mui/icons-material/People';
import FolderIcon from '@mui/icons-material/Folder';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import ArticleIcon from '@mui/icons-material/Article';
import CleanHandsIcon from '@mui/icons-material/CleanHands';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import GavelIcon from '@mui/icons-material/Gavel';

import type { MenuItem } from "../interfaces/MenuItem";

export const Menu: MenuItem[] = [
    {
        text: 'Dashboard',
        icon: <FolderIcon />,
        children: [
            { text: 'Agradecimientos', icon: <HandshakeIcon />, path: '/admin/gratitudes' },
            { text: 'Correos', icon: <MailRounded />, path: '/admin/emails' },
            { text: 'General', icon: <DashboardIcon />, path: '/admin/dashboardGeneral' },
            { text: 'Imágenes principales', icon: <InsertPhotoIcon />, path: '/admin/main-images' },
            { text: 'Noticias y eventos', icon: <NewspaperIcon />, path: '/admin/news' },
            { text: 'Nuestro especialistas', icon: <Diversity1Icon />, path: '/admin/specialist' },
            { text: 'Pacientes y familia', icon: <FamilyRestroomIcon />, path: '/admin/patients' },
            { text: 'Políticas de Privacidad', icon: <PrivacyTipIcon />, path: '/admin/privacy-policies' },
            { text: 'Redes Sociales', icon: <ConnectWithoutContactIcon />, path: '/admin/social-media' },
            { text: 'Servicios', icon: <MedicalServicesIcon />, path: '/admin/services' },
        ]
    },
    {
        text: 'Sobre nosotros',
        icon: <FolderIcon />,
        children: [
            { text: 'General', icon: <DashboardIcon />, path: '/admin/whoWeAre/general/'},
            { text: 'Nuestros Principios', icon: <HistoryEduIcon />, path: '/admin/out-principles' },
            { text: 'Valores institucionales', icon: <ArticleIcon />, path: '/admin/institutional-values' },
        ]
    },
    {
        text: 'Servicios',
        icon: <FolderIcon />,
        children: [
            { text: 'General', icon: <DashboardIcon />, path: '/admin/services/general/'},
            { text: 'Bondades', icon: <NaturePeopleIcon />, path: '/admin/services/benefits' },
            { text: 'Recomendaciones', icon: <CleanHandsIcon />, path: '/admin/services/recomendations' },
        ]
    },
    {
        text: 'Pacientes & Familia',
        icon: <FolderIcon />,
        children: [
            { text: 'General', icon: <DashboardIcon />, path: '/admin/patient_family/general/'},
            { text: 'Lineamientos', icon: <GavelIcon />, path: '/admin/patient_family/guideline/'},
        ]
    },
    { text: 'Usuarios', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Logout', icon: <LogoutIcon />, path: '/logout' },
]