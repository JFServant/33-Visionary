import { sx } from '../theme'

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

export const h1SX = sx(({ weight, gradient, precision }) => ({
  fontWeight: weight[6],
  background: gradient.right,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  letterSpacing: `-${precision[2]}`,
  marginLeft: `-${precision[2]}`,
}))

export const outletSX = sx(() => ({
  flex: 1,
  display: 'flex',
}))

export const sidelineSX = sx(({ precision, gradient }) => ({
  border: 'none',
  width: precision[2],
  background: gradient.bottom,
}))
