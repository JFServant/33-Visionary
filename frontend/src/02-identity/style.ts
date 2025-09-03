import { sx } from '../01-design/theme'

export const screenSX = sx(() => ({
  height: '100vh',
  display: 'flex',
}))

export const mainSX = sx(({ shadows, shape, size }) => ({
  height: '40rem',
  width: '28rem',
  margin: 'auto',
  boxShadow: shadows[15],
  borderRadius: shape.borderRadius,
  padding: size[4],
  display: 'flex',
  flexDirection: 'column',
  gap: size[1],
}))

export const outletSX = sx(() => ({
  flex: 1,
  display: 'flex',
}))
