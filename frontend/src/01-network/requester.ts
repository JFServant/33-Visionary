import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import type { Failure, Success } from '../types'
import { env } from './env'
import { Storer } from './storer'

type Options = {
  path: string
  method: 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
}

type Request<T> = (options: Options) => Promise<Success<T> | Failure>

const isFormData = (body: unknown): body is FormData => body instanceof FormData

export const useRequest = <T>(): Request<T> => {
  const navigate = useNavigate()

  return useCallback(
    async ({ path, method, body }: Options): Promise<Success<T> | Failure> => {
      const token = Storer.getToken()

      try {
        const res = await fetch(`${env.VITE_API_URL}${path}`, {
          method,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(body && !isFormData(body) ? { 'Content-Type': 'application/json' } : {}),
          },
          ...(body ? (!isFormData(body) ? { body: JSON.stringify(body) } : { body }) : {}),
        })

        if (res.status === 401 && token) {
          Storer.removeToken()
          navigate('/identity', { replace: true })
        }

        return res.json()
      } catch {
        return {
          error: { message: 'Something went wrong... Try again later or contact the support.' },
        }
      }
    },
    [navigate]
  )
}
