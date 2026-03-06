import { ListRounded, LogoutRounded, UploadFileRounded } from '@mui/icons-material'
import {
  Box,
  Button,
  Grow,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import { useEffect, type JSX } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import Divider from '../../99-design/divider'
import Title from '../../99-design/title'
import { EventManager } from '../event/manager'
import { Storer } from '../storer'
import {
  articleSX,
  containerSX,
  iconSX,
  itemSX,
  legendSX,
  listSX,
  mainSX,
  navSX,
  screenSX,
  sectionSX,
} from './style'

const items = [
  { label: 'Listing', path: '/image/listing', icon: <ListRounded /> },
  { label: 'Upload', path: '/image/upload', icon: <UploadFileRounded /> },
]

const GuardScreen = (): JSX.Element => {
  const navigate = useNavigate()
  const token = Storer.get('token')

  useEffect(() => {
    if (!token) navigate('/identity', { replace: true })
  }, [token, navigate])

  const onClick = (): void => {
    Storer.remove('sub')
    Storer.remove('token')
    EventManager.disconnect()
    navigate('/identity', { replace: true })
  }

  return (
    <Box component="div" sx={screenSX}>
      <Grow in>
        <Box component="main" sx={mainSX}>
          <Box component="article" sx={articleSX}>
            <Title />
            <Box component="div" sx={containerSX}>
              <Box component="nav" sx={navSX}>
                <Typography component="p" variant="overline" sx={legendSX}>
                  Image
                </Typography>
                <List sx={listSX}>
                  {items.map(({ label, path, icon }) => (
                    <ListItem key={label} disablePadding dense>
                      <ListItemButton component={NavLink} to={path} sx={itemSX}>
                        <ListItemIcon sx={iconSX}>{icon}</ListItemIcon>
                        <ListItemText primary={label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
            <Button variant="contained" startIcon={<LogoutRounded />} onClick={onClick}>
              Log out
            </Button>
          </Box>
          <Divider direction="to top" />
          <Box component="section" sx={sectionSX}>
            <Outlet />
          </Box>
        </Box>
      </Grow>
    </Box>
  )
}

export default GuardScreen
