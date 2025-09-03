import {
  DashboardRounded,
  HelpRounded,
  HistoryRounded,
  LogoutRounded,
  SettingsRounded,
  UploadFileRounded,
} from '@mui/icons-material'
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router'
import VisionaryDivider from '../../01-design/visionary-divider'
import VisionaryTitle from '../../01-design/visionary-title'
import { Storer } from '../storer'
import { contentSX, footerSX, headerSX, itemSX, listSX, mainSX, menuSX, screenSX } from './style'

const menuItems = [
  { label: 'Dashboard', icon: <DashboardRounded />, path: '#' },
  { label: 'Upload', icon: <UploadFileRounded />, path: '/detection/upload' },
  { label: 'History', icon: <HistoryRounded />, path: '#' },
  { label: 'Settings', icon: <SettingsRounded />, path: '#' },
  { label: 'Help', icon: <HelpRounded />, path: '#' },
]

const GuardScreen = () => {
  const navigate = useNavigate()
  const token = Storer.get('token')

  if (!token) return <Navigate to="/identity" replace />

  const onClick = () => {
    Storer.remove('sub')
    Storer.remove('token')
    navigate('/identity', { replace: true })
  }

  return (
    <Box component="div" sx={screenSX}>
      <Box component="header" sx={headerSX}>
        <VisionaryTitle />
      </Box>
      <Box component="div" sx={contentSX}>
        <Box component="nav" sx={menuSX}>
          <List sx={listSX}>
            {menuItems.map(({ label, path, icon }) => (
              <ListItemButton key={label} component={NavLink} to={path} sx={itemSX}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
            <ListItemButton component="button" onClick={onClick} sx={itemSX}>
              <ListItemIcon>
                <LogoutRounded />
              </ListItemIcon>
              <ListItemText primary="Log out" />
            </ListItemButton>
          </List>
        </Box>
        <VisionaryDivider direction="to top" />
        <Box component="main" sx={mainSX}>
          <Outlet />
        </Box>
      </Box>
      <Box component="footer" sx={footerSX}>
        <Typography component="p" variant="caption">
          &copy; {new Date().getFullYear()} Visionary. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}

export default GuardScreen
