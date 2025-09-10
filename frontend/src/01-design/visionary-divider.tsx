import { Box, type SxProps, type Theme } from '@mui/material'
import type { JSX } from 'react'
import { sx } from './theme'

type Direction = 'to top' | 'to bottom'

const SX = (direction: Direction): SxProps<Theme> =>
  sx(({ precision, palette }) => ({
    border: 'none',
    width: precision[2],
    background: `linear-gradient(${direction}, ${palette.primary.main}, ${palette.secondary.main})`,
  }))

const VisionaryDivider = ({ direction }: { direction: Direction }): JSX.Element => (
  <Box component="hr" sx={SX(direction)}></Box>
)

export default VisionaryDivider
