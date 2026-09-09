import type { HttpResponseResolver } from 'msw'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { env } from '../src/01-network/env'
import type { Failure, Success } from '../src/types'

export const server = setupServer()

const verbs = {
  GET: http.get,
  POST: http.post,
  PATCH: http.patch,
  PUT: http.put,
  DELETE: http.delete,
}

type Method = keyof typeof verbs

export const mockRequest = (method: Method, path: string, resolver: HttpResponseResolver): void => {
  server.use(verbs[method](`${env.VITE_API_URL}${path}`, resolver))
}

export const ok = <T>(data: T): HttpResponse<Success<T>> => HttpResponse.json({ data })

export const fail = (message: string): HttpResponse<Failure> =>
  HttpResponse.json({ error: { message } })
