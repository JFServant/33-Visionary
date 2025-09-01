import { Box } from '@mui/material'
import { Outlet } from 'react-router'
import VisionaryDivider from '../design/visionary-divider'
import VisionaryTitle from '../design/visionary-title'
import { mainSX, outletSX, screenSX } from './style'

const IdentityScreen = () => {
  return (
    <Box component="div" sx={screenSX}>
      <Box component="main" sx={mainSX}>
        <VisionaryTitle />
        <Box component="div" sx={outletSX}>
          <VisionaryDivider direction="to bottom" />
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default IdentityScreen
