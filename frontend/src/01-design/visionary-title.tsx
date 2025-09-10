import { Box, Typography } from '@mui/material'
import type { JSX } from 'react'
import { sx } from './theme'

const SX = sx(({ weight, palette, precision }) => ({
  display: 'inline-flex',
  fontWeight: weight[6],
  background: `linear-gradient(to right, ${palette.primary.main}, ${palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  letterSpacing: `-${precision[2]}`,
  marginLeft: `-${precision[2]}`,
}))

const VisionaryTitle = (): JSX.Element => (
  <Box component="div">
    <Typography component="h1" variant="h4" sx={SX}>
      Visionary
    </Typography>
  </Box>
)

export default VisionaryTitle
