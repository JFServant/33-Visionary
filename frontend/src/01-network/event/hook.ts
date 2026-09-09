import { useEffect } from 'react'
import { EventManager } from './manager'
import type { Listen } from './manager'

export const useRealtime = ({ event, handler }: Listen): void => {
  useEffect(() => {
    EventManager.listen({ event, handler })
    return (): void => EventManager.unlisten(event)
  }, [event, handler])
}
