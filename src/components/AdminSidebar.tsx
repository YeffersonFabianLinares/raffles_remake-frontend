import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Collapse from '@mui/material/Collapse';
import type { MenuItem } from '../interfaces/MenuItem';
import { Menu } from '../constants/menu';

const drawerWidth = 240;

const menuItems: MenuItem[] = Menu

const AdminSidebar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const handleSubMenuClick = (text: string) => {
        setOpenMenus((prev) => ({ ...prev, [text]: !prev[text] }))
    }

    const handleDrawerOpen = () => {
        if (open == true) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const isItemActive = (item: MenuItem): boolean => {
        if (!item.path) return false;
        if (item.statusFilter !== undefined) {
            return location.pathname === item.path &&
                (searchParams.get('status') || '') === item.statusFilter;
        }
        return location.pathname === item.path;
    };

    const handleNavigation = (item: MenuItem) => {
        setOpen(false);
        if (!item.path) return;
        if (item.statusFilter !== undefined) {
            navigate(item.statusFilter ? `${item.path}?status=${encodeURIComponent(item.statusFilter)}` : item.path);
        } else {
            navigate(item.path);
        }
        if (window.innerWidth < 600) setOpen(false);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>

                <AppBar
                    position="fixed"
                    className='bg-general'
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            CASASORTEOS
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="temporary"
                    open={open}
                    onClose={handleDrawerClose}
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                        display: { xs: 'block', md: 'block' },
                    }}>
                    <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />

                    <List>
                        {menuItems.map((item) => (
                            <>
                                <Divider />
                                <React.Fragment key={item.text}>
                                    {
                                        item.children ? (
                                            <>
                                                <ListItemButton
                                                    key={item.text}
                                                    onClick={() => handleSubMenuClick(item.text)}
                                                    selected={location.pathname === item.path}
                                                >
                                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                                    <ListItemText primary={item.text} />
                                                </ListItemButton>

                                                <Collapse in={openMenus[item.text]} timeout="auto" unmountOnExit>
                                                    <List component="div" disablePadding>
                                                        {item.children.map((child) => (
                                                            <ListItemButton
                                                                key={child.text}
                                                                sx={{ pl: 4 }}
                                                                onClick={() => handleNavigation(child)}
                                                                selected={isItemActive(child)}
                                                            >
                                                                <ListItemIcon>{child.icon}</ListItemIcon>
                                                                <ListItemText primary={child.text} />
                                                            </ListItemButton>
                                                        ))}
                                                    </List>
                                                </Collapse>
                                            </>
                                        ) : (
                                            <ListItemButton
                                                onClick={() => handleNavigation(item)}
                                                selected={isItemActive(item)}
                                            >
                                                <ListItemIcon>{item.icon}</ListItemIcon>
                                                <ListItemText primary={item.text} />
                                            </ListItemButton>
                                        )
                                    }

                                </React.Fragment>
                            </>
                        ))}
                    </List>
                    <Divider />
                </Drawer>

                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    <Outlet />
                </Box>
            </Box>
        </>
    );
};

export default AdminSidebar;
