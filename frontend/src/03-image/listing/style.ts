import type { SxProps, Theme } from '@mui/material'
import { sx } from '../../99-design/theme'

export const section = sx(() => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
}))

export const container = (flex: boolean): SxProps<Theme> =>
  sx(({ size, shadows }) => ({
    ...(flex ? { display: 'flex' } : {}),
    boxShadow: `inset ${shadows[1]}`,
    flex: 1,
    marginTop: size[2],
    overflow: 'scroll',
  }))

export const info = sx(() => ({
  margin: 'auto',
}))

export const list = sx(({ size }) => ({
  margin: size[1],
}))

export const item = sx(() => ({
  cursor: 'pointer',
  overflow: 'hidden',
  '& > img': {
    transition: 'transform 250ms ease-in-out, filter 250ms ease-in-out',
    willChange: 'transform, filter',
  },
  '&:hover > img': {
    filter: 'brightness(1.06)',
    transform: 'scale(1.02)',
  },
}))

export const imageBox = sx(() => ({
  position: 'relative',
}))

type BBox = { left: number; top: number; width: number; height: number }

export const bbox = ({ left, top, width, height }: BBox): SxProps<Theme> =>
  sx(({ precision, palette }) => ({
    border: `${precision[2]} solid ${palette.secondary.main}`,
    borderRadius: precision[4],
    height,
    left,
    position: 'absolute',
    top,
    width,
  }))

export const classification = sx(({ palette, precision, weight }) => ({
  background: palette.background.default,
  borderRadius: precision[4],
  fontWeight: weight[6],
  margin: precision[4],
  padding: `0 ${precision[4]}`,
  position: 'absolute',
  zIndex: '1',
}))

export const image = sx(() => ({
  maxHeight: '40rem',
  maxWidth: '56rem',
}))
