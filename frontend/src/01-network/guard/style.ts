import { sx } from '../../99-design/theme'

export const screenSX = sx(() => ({
  display: 'flex',
  height: '100vh',
}))

export const mainSX = sx(({ shape, shadows, size }) => ({
  borderRadius: shape.borderRadius,
  boxShadow: shadows[15],
  display: 'flex',
  height: '40rem',
  margin: 'auto',
  padding: size[2],
  width: '56rem',
}))

export const articleSX = sx(({ size }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginRight: size[2],
  width: '14rem',
}))

export const containerSX = sx(({ precision, palette, size }) => ({
  borderBottom: `${precision[1]} solid ${palette.primary.light}`,
  borderTop: `${precision[1]} solid ${palette.primary.light}`,
  display: 'flex',
  flex: 1,
  margin: `${size[1]} 0 ${size[2]}`,
}))

export const navSX = sx(({ palette, shape, shadows, size }) => ({
  backgroundColor: palette.background.paper,
  borderRadius: shape.borderRadius,
  boxShadow: `inset ${shadows[1]}`,
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  margin: `${size[2]} 0`,
}))

export const legendSX = sx(({ precision, palette, size }) => ({
  borderBottom: `${precision[1]} solid ${palette.primary.light}`,
  color: palette.primary.light,
  margin: `0 ${size[2]}`,
  padding: `${size[1]} ${size[1]} 0 ${size[1]}`,
}))

export const listSX = sx(({ precision }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: precision[2],
}))

export const itemSX = sx(({ palette }) => ({ color: palette.primary.main }))

export const iconSX = sx(({ palette }) => ({ color: palette.primary.main }))

export const sectionSX = sx(({ size }) => ({
  display: 'flex',
  flex: 1,
  marginLeft: size[2],
}))
