import type { SxProps, Theme } from '@mui/material'
import { sx } from '../../99-design/theme'

export const styles: Record<string, SxProps<Theme>> = {
  container: sx(() => ({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  })),
  preview: sx(({ precision, palette, size }) => ({
    border: `${precision[3]} double ${palette.primary.light}`,
    display: 'flex',
    flex: 1,
    margin: `${size[2]} 0`,
    minHeight: 0,
  })),
  image: sx(() => ({
    flex: 1,
    maxWidth: '100%',
    objectFit: 'contain',
  })),
  buttons: sx(() => ({ margin: 'auto' })),
  button: sx(() => ({ overflow: 'hidden' })),
  input: sx(({ precision }) => ({
    bottom: 0,
    height: precision[1],
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    width: precision[1],
  })),
}
