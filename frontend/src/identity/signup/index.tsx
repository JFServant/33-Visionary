import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Box, Button, TextField, Typography, type AlertProps } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useRequest } from '../../global/requester'
import { Storer } from '../../global/storer'
import type { ApiData } from './contract'
import { buttonSX, formSX, h2SX, linkSX } from './style'
import type { Schema } from './validator'
import { schema } from './validator'

type State = {
  severity: AlertProps['severity']
  message: string
}

const SignupComponent = () => {
  const {
    register,
    handleSubmit,
    formState: {
      errors: { username, email, password },
    },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const [alert, setAlert] = useState<State>({
    severity: 'info',
    message: 'Advice: If you use a shared computer, make sure to open a private tab',
  })

  const request = useRequest<ApiData>()
  const navigate = useNavigate()

  const onSubmit = async (data: unknown): Promise<void> => {
    const res = await request({ path: '/identity/signup', method: 'POST', body: data })

    if ('error' in res) return setAlert({ severity: 'error', message: res.error.message })

    Storer.set({ key: 'sub', data: res.data.sub })
    Storer.set({ key: 'token', data: res.data.token })

    navigate('/detection')
  }

  return (
    <Box component="form" sx={formSX} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography component="h2" sx={h2SX}>
        Create your account
      </Typography>
      <Typography component="p" variant="subtitle2">
        Fill up your information:
      </Typography>
      <TextField
        type="text"
        variant="filled"
        label="Username"
        {...register('username')}
        error={!!username}
        helperText={username?.message || ' '}
      />
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
      <Button type="submit" variant="contained" sx={buttonSX}>
        Sign Up
      </Button>
      <Alert severity={alert.severity}>
        <Typography component="p" variant="subtitle2">
          {alert.message}
        </Typography>
      </Alert>
      <Typography component="p" sx={linkSX}>
        Already have an account? <Link to="/identity/login">Log in</Link>
      </Typography>
    </Box>
  )
}

export default SignupComponent
