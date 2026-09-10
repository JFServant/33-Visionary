import { useEffect } from 'react'
import { EventManager } from './manager'
import type { Listen } from './manager'

export const useRealtime = ({ event, onSuccess, onFailure }: Listen): void => {
  useEffect(() => {
    EventManager.listen({ event, onSuccess, onFailure })
    return (): void => EventManager.unlisten(event)
  }, [event, onSuccess, onFailure])
}
