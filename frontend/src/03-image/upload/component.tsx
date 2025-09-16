import { CloudUploadRounded, PreviewRounded, ResetTvRounded } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Fade,
  Input,
  Typography,
  type AlertProps,
} from '@mui/material'
import { useState, type ChangeEvent, type JSX } from 'react'
import { useNavigate } from 'react-router'
import { useRealtime } from '../../01-network/event/hook'
import { useRequest } from '../../01-network/requester'
import type { Failure, Success } from '../../types'
import { styles } from './style'
import { validator } from './validator'

type State = {
  severity: AlertProps['severity']
  message: string
  preview: string | null
  file: File | null
  isLoading: boolean
}

const init: State = {
  severity: 'info',
  message: 'The file must be an image, and be under 10MB.',
  preview: null,
  file: null,
  isLoading: false,
}

type ApiResponse = Success<true> | Failure

const UploadComponent = (): JSX.Element => {
  const navigate = useNavigate()

  useRealtime({
    event: 'detection',
    handler({ data }) {
      if (data === 'success') return navigate('/image/listing')

      setState((p) => ({
        ...p,
        severity: 'error',
        message: 'Oops... The detection failed, please try with another image.',
      }))
    },
  })

  const [{ preview, severity, message, file, isLoading }, setState] = useState<State>(init)
  const request = useRequest<ApiResponse>()

  const reset = (): void => {
    setState(({ preview }) => {
      if (preview) URL.revokeObjectURL(preview)
      return init
    })
  }

  const onChange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
    const validation = validator(target.files)

    if ('error' in validation) {
      return setState((p) => ({ ...p, severity: 'warning', message: validation.error.message }))
    }

    reset()

    const url = URL.createObjectURL(validation.data)
    setState((p) => ({ ...p, preview: url, file: validation.data }))
  }

  const onClick = async (): Promise<void> => {
    if (!file) return

    setState((p) => ({ ...p, isLoading: true }))

    const body = new FormData()
    body.append('image', file)

    const res = await request({ method: 'POST', path: '/image/upload', body })

    setState((p) => ({ ...p, isLoading: false }))

    if ('error' in res) {
      return setState((p) => ({ ...p, severity: 'error', message: res.error.message }))
    }

    reset()
  }

  return (
    <Fade in>
      <Box component="div" sx={styles.container}>
        <Alert severity={severity}>
          <Typography component="p" variant="subtitle2">
            {message}
          </Typography>
        </Alert>
        <Box component="div" sx={styles.preview}>
          {preview && <Box component="img" src={preview} alt="Preview" sx={styles.image} />}
        </Box>
        <ButtonGroup variant="contained" sx={styles.buttons}>
          <Button component="label" startIcon={<PreviewRounded />} sx={styles.button}>
            Preview
            <Input type="file" onChange={onChange} sx={styles.input} />
          </Button>
          <Button startIcon={<ResetTvRounded />} disabled={!preview} onClick={reset}>
            Reset
          </Button>
          <Button
            startIcon={<CloudUploadRounded />}
            disabled={!file}
            loading={isLoading}
            onClick={onClick}
          >
            Upload
          </Button>
        </ButtonGroup>
      </Box>
    </Fade>
  )
}

export default UploadComponent
