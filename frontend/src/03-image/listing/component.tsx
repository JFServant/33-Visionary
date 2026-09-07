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
import { memo, useEffect, useLayoutEffect, useRef, useState, type JSX } from 'react'
import { useRequest } from '../../01-network/requester'
import type { Image } from './contract'
import * as styles from './style'

type Size = { width: number; height: number }

type AlertState = {
  severity: AlertProps['severity']
  message: string
}

const initialAlert: AlertState = {
  severity: 'info',
  message: 'You can click on your images to see their predictions.',
}

const genAlt = (predictions: Image['predictions']): string => {
  return `Possibly Detected: ${predictions.map(({ classification }) => classification.toUpperCase()).join(', ')}`
}

const genConfidence = (num: number): number => {
  return Math.round(num * 100)
}

type ImageGridItemProps = {
  image: Image
  onSelect: (image: Image) => void
}

const ImageGridItem = memo(({ image, onSelect }: ImageGridItemProps): JSX.Element => {
  return (
    <ImageListItem sx={styles.item}>
      <img
        src={image.url}
        alt={genAlt(image.predictions)}
        loading="lazy"
        onClick={() => onSelect(image)}
      />
    </ImageListItem>
  )
})

type ImageDetailProps = {
  image: Image | null
  onClose: () => void
}

const ImageDetail = ({ image, onClose }: ImageDetailProps): JSX.Element | null => {
  const imageRef = useRef<HTMLImageElement>(null)
  const [size, setSize] = useState<Size | null>(null)

  useLayoutEffect(() => {
    const element = imageRef.current

    if (!element) return

    const observer = new ResizeObserver((): void => {
      setSize({ width: element.clientWidth, height: element.clientHeight })
    })

    observer.observe(element)

    return (): void => {
      observer.disconnect()
      setSize(null)
    }
  }, [image])

  if (!image) return null

  return (
    <Backdrop open onClick={onClose}>
      <Box component="div" sx={styles.imageBox}>
        {size &&
          size.width > 0 &&
          image.predictions.map(({ id, x, y, width, height, classification, confidence }) => (
            <Grow key={id} in timeout={1_000}>
              <Box
                component="div"
                sx={styles.bbox({
                  left: x * size.width,
                  top: y * size.height,
                  width: width * size.width,
                  height: height * size.height,
                })}
              >
                <Typography component="p" variant="subtitle2" sx={styles.classification}>
                  {classification.toUpperCase()} {genConfidence(confidence)}%
                </Typography>
              </Box>
            </Grow>
          ))}
        <Box
          component="img"
          ref={imageRef}
          src={image.url}
          alt={genAlt(image.predictions)}
          sx={styles.image}
        />
      </Box>
    </Backdrop>
  )
}

const ListingComponent = (): JSX.Element => {
  const request = useRequest<Image[]>()

  const [{ severity, message }, setAlert] = useState<AlertState>(initialAlert)
  const [images, setImages] = useState<Image[] | null>(null)
  const [display, setDisplay] = useState<Image | null>(null)

  useEffect(() => {
    ;(async (): Promise<void> => {
      const res = await request({ method: 'GET', path: '/image/listing' })

      if ('error' in res) {
        setAlert({ severity: 'error', message: res.error.message })
        return
      }

      setImages(res.data)
    })()
  }, [request])

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
                <ImageGridItem key={image.id} image={image} onSelect={setDisplay} />
              ))}
            </ImageList>
          )}
        </Box>

        <ImageDetail image={display} onClose={() => setDisplay(null)} />
      </Box>
    </Fade>
  )
}

export default ListingComponent
