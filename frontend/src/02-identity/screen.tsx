import { Box } from '@mui/material'
import type { JSX } from 'react'
import { Outlet } from 'react-router'
import Divider from '../99-design/divider'
import Title from '../99-design/title'
import { mainSX, outletSX, screenSX } from './style'

const IdentityScreen = (): JSX.Element => {
  return (
    <Box component="div" sx={screenSX}>
      <Box component="main" sx={mainSX}>
        <Title />
        <Box component="div" sx={outletSX}>
          <Divider direction="to bottom" />
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default IdentityScreen
