import {
  FirstPageRounded,
  LastPageRounded,
  NavigateBeforeRounded,
  NavigateNextRounded,
} from '@mui/icons-material'
import {
  Alert,
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  Fade,
  Grow,
  ImageList,
  ImageListItem,
  Typography,
  type AlertProps,
} from '@mui/material'
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState, type JSX } from 'react'
import { useRequest } from '../../01-network/requester'
import type { Direction, Image, Page } from './contract'
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

type ListingPagerProps = {
  page: Page
  pageNumber: number
  loading: boolean
  onNavigate: (direction: Direction, cursor: string | null) => void
}

const ListingPager = ({
  page,
  pageNumber,
  loading,
  onNavigate,
}: ListingPagerProps): JSX.Element => {
  const isFirstPage = pageNumber <= 1
  const isLastPage = pageNumber >= page.pageCount

  return (
    <ButtonGroup variant="contained" sx={styles.pager}>
      <Button
        aria-label="First page"
        disabled={loading || isFirstPage}
        onClick={() => onNavigate('first', null)}
      >
        <FirstPageRounded />
      </Button>
      <Button
        aria-label="Previous page"
        disabled={loading || isFirstPage}
        onClick={() => onNavigate('prev', page.prevCursor)}
      >
        <NavigateBeforeRounded />
      </Button>
      <Button disableRipple disabled sx={styles.count}>
        {pageNumber} / {page.pageCount}
      </Button>
      <Button
        aria-label="Next page"
        disabled={loading || isLastPage}
        onClick={() => onNavigate('next', page.nextCursor)}
      >
        <NavigateNextRounded />
      </Button>
      <Button
        aria-label="Last page"
        disabled={loading || isLastPage}
        onClick={() => onNavigate('last', null)}
      >
        <LastPageRounded />
      </Button>
    </ButtonGroup>
  )
}

const ListingComponent = (): JSX.Element => {
  const request = useRequest<Page>()

  const [{ severity, message }, setAlert] = useState<AlertState>(initialAlert)
  const [page, setPage] = useState<Page | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(false)
  const [display, setDisplay] = useState<Image | null>(null)

  const load = useCallback(
    async (direction: Direction, cursor: string | null): Promise<void> => {
      setLoading(true)

      const query = new URLSearchParams({ direction })
      if (cursor) query.set('cursor', cursor)

      const res = await request({ method: 'GET', path: `/image/listing?${query}` })

      setLoading(false)

      if ('error' in res) {
        setAlert({ severity: 'error', message: res.error.message })
        return
      }

      setPage(res.data)
      setPageNumber((current) => {
        if (direction === 'first') return 1
        if (direction === 'last') return res.data.pageCount
        return direction === 'next' ? current + 1 : current - 1
      })
    },
    [request]
  )

  useEffect(() => {
    void load('first', null)
  }, [load])

  const hasImages = !!page && !!page.images.length

  return (
    <Fade in>
      <Box component="section" sx={styles.section}>
        <Alert severity={severity}>
          <Typography component="p" variant="subtitle2">
            {message}
          </Typography>
        </Alert>
        <Box component="div" sx={styles.container(!hasImages)}>
          {!hasImages ? (
            <Typography component="p" variant="h6" sx={styles.info}>
              No images found.
            </Typography>
          ) : (
            <ImageList variant="standard" cols={3} sx={styles.list}>
              {page.images.map((image) => (
                <ImageGridItem key={image.id} image={image} onSelect={setDisplay} />
              ))}
            </ImageList>
          )}
        </Box>

        {hasImages && (
          <ListingPager page={page} pageNumber={pageNumber} loading={loading} onNavigate={load} />
        )}

        <ImageDetail image={display} onClose={() => setDisplay(null)} />
      </Box>
    </Fade>
  )
}

export default ListingComponent
