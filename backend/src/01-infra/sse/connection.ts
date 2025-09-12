import type { Context } from 'hono'
import type { ApiError } from '../../00-global/types'
import { SSEManager } from './manager'

export const sseConnection = ({ req, json }: Context): Response => {
  const customerID = req.param('customerID')

  if (!customerID) {
    return json({ error: { message: 'Connection failed.' } } satisfies ApiError, 400)
  }

  const { writable, readable } = new TextEncoderStream()
  const writer = writable.getWriter()

  SSEManager.connect({ customerID, writer })

  req.raw.signal.addEventListener('abort', () => {
    SSEManager.disconnect(customerID)
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
