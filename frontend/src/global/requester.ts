import { useNavigate } from 'react-router'
import { env } from '../env'
import { Storer } from './storer'

type Options = {
  path: string
  method: 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
}

type ApiError = { error: { message: string } }

type Request<T> = (options: Options) => Promise<T | ApiError>

export const useRequest = <T>(): Request<T> => {
  const navigate = useNavigate()

  return async ({ path, method, body }: Options): Promise<T | ApiError> => {
    const token = Storer.get('token')

    try {
      const res = await fetch(`${env.VITE_API_URL}${path}`, {
        method,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      })

      if (res.status === 401) {
        Storer.remove('token')
        Storer.remove('sub')
        navigate('/identity')
      }

      return res.json()
    } catch {
      return {
        error: { message: 'Something went wrong... Try again later or contact the support.' },
      }
    }
  }
}
