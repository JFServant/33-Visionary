import type { Context } from 'hono'
import { Authenticator } from '../authenticator'
import { SSEManager } from './manager'

export const sseConnection = ({ req, get }: Context): Response => {
  const customerID = Authenticator.getCustomerID(get)

  const { writable, readable } = new TextEncoderStream()
  const writer = writable.getWriter()

  SSEManager.connect({ customerID, writer })

  req.raw.signal.addEventListener('abort', () => {
    SSEManager.disconnect({ customerID, writer })
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
