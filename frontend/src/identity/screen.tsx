import { Box, Typography } from '@mui/material'
import { Outlet } from 'react-router'
import { h1SX, mainSX, outletSX, screenSX, sidelineSX } from './style'

const IdentityScreen = () => {
  return (
    <Box component="div" sx={screenSX}>
      <Box component="main" sx={mainSX}>
        <Typography component="h1" variant="h4" sx={h1SX}>
          Visionary
        </Typography>
        <Box component="div" sx={outletSX}>
          <Box component="hr" sx={sidelineSX} />
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default IdentityScreen
