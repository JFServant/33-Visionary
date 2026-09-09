import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Box, Button, Slide, TextField, Typography } from '@mui/material'
import type { AlertProps } from '@mui/material'
import { useState } from 'react'
import type { JSX } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useRequest } from '../../01-network/requester'
import { Storer } from '../../01-network/storer'
import { formSX, h2SX, linkSX } from './style'
import type { Schema } from './validator'
import { schema } from './validator'

type State = {
  severity: AlertProps['severity']
  message: string
}

type Customer = { sub: string; token: string }

const SignupComponent = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: {
      errors: { username, email, password },
      isSubmitting,
    },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const [alert, setAlert] = useState<State>({
    severity: 'info',
    message: 'Advice: If you use a shared computer, make sure to open a private tab',
  })

  const request = useRequest<Customer>()
  const navigate = useNavigate()

  const onSubmit = async (data: unknown): Promise<void> => {
    const res = await request({ path: '/identity/signup', method: 'POST', body: data })

    if ('error' in res) return setAlert({ severity: 'error', message: res.error.message })

    Storer.set({ key: 'sub', data: res.data.sub })
    Storer.set({ key: 'token', data: res.data.token })

    navigate('/image', { replace: true })
  }

  return (
    <Slide in direction="right">
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
        <Button type="submit" variant="contained" loading={isSubmitting}>
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
    </Slide>
  )
}

export default SignupComponent
