import {
  Alert,
  Backdrop,
  Box,
  Fade,
  Grow,
  ImageList,
  ImageListItem,
  Typography,
  type AlertProps,
} from '@mui/material'
import { useEffect, useLayoutEffect, useRef, useState, type JSX } from 'react'
import { useRequest } from '../../01-network/requester'
import type { Image } from './contract'
import * as styles from './style'

type Size = { width: number; height: number }

type State = {
  severity: AlertProps['severity']
  message: string
  images: Image[] | null
  display: Image | null
}

const initialState: State = {
  severity: 'info',
  message: 'You can click on your images to see their predictions.',
  images: null,
  display: null,
}

const genAlt = (predictions: Image['predictions']): string => {
  return `Possibly Detected: ${predictions.map(({ classification }) => classification.toUpperCase()).join(', ')}`
}

const genConfidence = (num: number): number => {
  return Math.round(num * 100)
}

const ListingComponent = (): JSX.Element => {
  const request = useRequest<Image[]>()
  const [{ severity, message, images, display }, setState] = useState<State>(initialState)

  const overlayImageRef = useRef<HTMLImageElement>(null)
  const [overlaySize, setOverlaySize] = useState<Size | null>(null)

  useEffect(() => {
    ;(async (): Promise<void> => {
      const res = await request({ method: 'GET', path: '/image/listing' })

      if ('error' in res) {
        return setState((p) => ({ ...p, severity: 'error', message: res.error.message }))
      }

      setState((p) => ({ ...p, images: res.data }))
    })()
  }, [request])

  useLayoutEffect(() => {
    const element = overlayImageRef.current

    if (!element) return

    const observer = new ResizeObserver((): void => {
      setOverlaySize({ width: element.clientWidth, height: element.clientHeight })
    })

    observer.observe(element)

    return (): void => {
      observer.disconnect()
      setOverlaySize(null)
    }
  }, [display])

  const isImage = !!images && !!images.length

  return (
    <Fade in>
      <Box component="section" sx={styles.section}>
        <Alert severity={severity}>
          <Typography component="p" variant="subtitle2">
            {message}
          </Typography>
        </Alert>
        <Box component="div" sx={styles.container(!isImage)}>
          {!isImage ? (
            <Typography component="p" variant="h6" sx={styles.info}>
              No images found.
            </Typography>
          ) : (
            <ImageList variant="standard" cols={3} sx={styles.list}>
              {images.map((image) => (
                <ImageListItem key={image.id} sx={styles.item}>
                  <img
                    src={image.url}
                    alt={genAlt(image.predictions)}
                    loading="lazy"
                    onClick={() => setState((p) => ({ ...p, display: image }))}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Box>

        {display && (
          <Backdrop open={!!display} onClick={() => setState((p) => ({ ...p, display: null }))}>
            <Box component="div" sx={styles.imageBox}>
              {overlaySize &&
                overlaySize.width > 0 &&
                display.predictions.map(
                  ({ id, x, y, width, height, classification, confidence }) => (
                    <Grow key={id} in timeout={1_000}>
                      <Box
                        component="div"
                        sx={styles.bbox({
                          left: x * overlaySize.width,
                          top: y * overlaySize.height,
                          width: width * overlaySize.width,
                          height: height * overlaySize.height,
                        })}
                      >
                        <Typography component="p" variant="subtitle2" sx={styles.classification}>
                          {classification.toUpperCase()} {genConfidence(confidence)}%
                        </Typography>
                      </Box>
                    </Grow>
                  )
                )}
              <Box
                component="img"
                ref={overlayImageRef}
                src={display.url}
                alt={genAlt(display.predictions)}
                sx={styles.image}
              />
            </Box>
          </Backdrop>
        )}
      </Box>
    </Fade>
  )
}

export default ListingComponent
