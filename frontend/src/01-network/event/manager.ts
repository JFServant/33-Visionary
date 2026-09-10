import { env } from '../env'
import { Storer } from '../storer'

type Event = 'detection'
type Message = 'success' | 'failure'
type Handler = (event: MessageEvent<Message>) => void
export type Listen = { event: Event; onSuccess: () => void; onFailure: () => void }

export class EventManager {
  private static source: EventSource | null = null
  private static events = new Map<Event, Handler>()

  static listen({ event, onSuccess, onFailure }: Listen): void {
    this.connect()

    const handler: Handler = ({ data }) => {
      if (data === 'failure') {
        onFailure()
        return
      }
      onSuccess()
    }

    this.events.set(event, handler)
    this.source?.addEventListener(event, handler)
  }

  static unlisten(event: Event): void {
    const handler = this.events.get(event)

    if (!handler) return

    this.source?.removeEventListener(event, handler)
    this.events.delete(event)
  }

  static disconnect(): void {
    this.source?.close()
    this.source = null
  }

  private static connect(): void {
    const token = Storer.getToken()
    if (!token || this.source) return
    this.source = new EventSource(`${env.VITE_API_URL}/event?token=${token}`)
  }
}
