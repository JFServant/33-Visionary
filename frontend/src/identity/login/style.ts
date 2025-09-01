import { sx } from '../../design/theme'

export const formSX = sx(({ size }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: size[1],
  padding: `0 ${size[2]}`,
}))

export const h2SX = sx(({ size, precision }) => ({
  fontSize: size[5],
  letterSpacing: `-${precision[2]}`,
  marginLeft: `-${precision[2]}`,
  marginBottom: size[1],
}))

export const buttonSX = sx(({ weight }) => ({
  fontWeight: weight[6],
}))

export const linkSX = sx(() => ({
  marginTop: 'auto',
}))
