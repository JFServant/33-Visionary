import { Box } from '@mui/material'
import { sx } from './theme'

type Direction = 'to top' | 'to bottom'

const SX = (direction: Direction) =>
  sx(({ precision, palette }) => ({
    border: 'none',
    width: precision[2],
    background: `linear-gradient(${direction}, ${palette.primary.main}, ${palette.secondary.main})`,
  }))

const VisionaryDivider = ({ direction }: { direction: Direction }) => (
  <Box component="hr" sx={SX(direction)}></Box>
)

export default VisionaryDivider
