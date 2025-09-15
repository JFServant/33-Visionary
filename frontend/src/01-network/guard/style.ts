import { sx } from '../../99-design/theme'

export const screenSX = sx(() => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
}))

export const headerSX = sx(({ size, shadows }) => ({
  padding: `${size[1]} ${size[2]}`,
  boxShadow: shadows[3],
}))

export const contentSX = sx(() => ({
  flex: 1,
  display: 'flex',
}))

export const menuSX = sx(({ palette }) => ({
  width: '16rem',
  display: 'flex',
  backgroundColor: palette.background.paper,
}))

export const listSX = sx(({ size, palette, shadows }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: size[1],
  backgroundColor: palette.background.default,
  boxShadow: shadows[1],
  padding: size[2],
  margin: size[1],
  borderRadius: size[1],
}))

export const itemSX = sx(({ size, precision, palette, weight }) => ({
  flex: 0,
  height: size[4],
  border: `${precision[1]} solid ${palette.primary.main}`,
  borderRadius: size[1],

  ':last-child': {
    marginTop: 'auto',
  },

  '.MuiListItemIcon-root, .MuiListItemText-primary': {
    color: palette.primary.main,
    fontWeight: weight[6],
  },
}))

export const mainSX = sx(() => ({
  flex: 1,
  display: 'flex',
}))

export const footerSX = sx(({ size, shadows }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: `${size[2]} 0`,
  boxShadow: shadows[6],
}))
