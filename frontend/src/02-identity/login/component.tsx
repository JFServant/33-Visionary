import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Box, Button, TextField, Typography, type AlertProps } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useRequest } from '../../00-global/requester'
import { Storer } from '../../00-global/storer'
import type { Data } from './contract'
import { buttonSX, formSX, h2SX, linkSX } from './style'
import { schema, type Schema } from './validator'

type State = {
  severity: AlertProps['severity']
  message: string
}

const LoginComponent = () => {
  const {
    register,
    handleSubmit,
    formState: {
      errors: { email, password },
      isSubmitting,
    },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const [alert, setAlert] = useState<State>({
    severity: 'info',
    message: 'Advice: If you use a shared computer, make sure to open a private tab',
  })

  const request = useRequest<Data>()
  const navigate = useNavigate()

  const onSubmit = async (data: unknown): Promise<void> => {
    const res = await request({ path: '/identity/login', method: 'POST', body: data })

    if ('error' in res) return setAlert({ severity: 'error', message: res.error.message })

    Storer.set({ key: 'sub', data: res.data.sub })
    Storer.set({ key: 'token', data: res.data.token })

    navigate('/detection', { replace: true })
  }

  return (
    <Box component="form" sx={formSX} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography component="h2" sx={h2SX}>
        Use your account
      </Typography>
      <Typography component="p" variant="subtitle2">
        Enter your credentials:
      </Typography>
      <TextField
        type="email"
        variant="filled"
        label="Email"
        {...register('email')}
        error={!!email}
        helperText={email?.message || ' '}
      />
      <TextField
        type="password"
        variant="filled"
        label="Password"
        {...register('password')}
        error={!!password}
        helperText={password?.message || ' '}
      />
      <Button type="submit" variant="contained" sx={buttonSX} loading={isSubmitting}>
        Log in
      </Button>
      <Alert severity={alert.severity}>
        <Typography component="p" variant="subtitle2">
          {alert.message}
        </Typography>
      </Alert>
      <Typography component="p" sx={linkSX}>
        No account yet? <Link to="/identity/signup">Sign up</Link>
      </Typography>
    </Box>
  )
}

export default LoginComponent
