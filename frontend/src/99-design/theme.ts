import { alpha, createTheme, type SxProps, type Theme } from '@mui/material/styles'

export const sx = (sxProps: SxProps<Theme>): SxProps<Theme> => sxProps

const PRIMARY_MAIN = '#6a5af9'
const SECONDARY_MAIN = '#00d4ff'

export const theme = createTheme({
  palette: {
    primary: { main: PRIMARY_MAIN },
    secondary: { main: SECONDARY_MAIN },
    background: { paper: alpha(PRIMARY_MAIN, 0.08) },
  },
  size: {
    1: '0.5rem',
    2: '1rem',
    3: '1.5rem',
    4: '2rem',
    5: '2.5rem',
    6: '3rem',
  },
  precision: {
    1: '1px',
    2: '2px',
    3: '3px',
    4: '4px',
    5: '5px',
    6: '6px',
  },
  weight: {
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
    6: 600,
  },
})
