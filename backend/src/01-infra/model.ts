import type { Success } from '../types'
import { env } from './env'

type Request = {
  domain: 'detection'
  model: 'cocossd'
  body: FormData
}

export class Model {
  static async request<T>({ domain, model, body }: Request): Promise<Success<T | null>> {
    const res = await fetch(`${env.MODEL_URL}/${domain}/${model}`, {
      method: 'POST',
      headers: {
        'System-Authorization': `Secret ${env.MODEL_SECRET}`,
      },
      body,
    })

    if (!res.ok) return { data: null }

    return res.json()
  }
}
