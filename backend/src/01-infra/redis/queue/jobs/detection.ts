import { QueueManager } from '../manager'

type DetectionPayload = {
  originalName: string
  internalName: string
  tmpPath: string
  size: number
  mimeType: string
  requesterID: string
}

export const DetectionScheduler = QueueManager.schedule<DetectionPayload>('detection')
