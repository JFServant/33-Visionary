import { QueueManager } from '../manager'

export type DetectionPayload = {
  tmpPath: string
  originalName: string
  internalName: string
  customerID: string
}

export const DetectionScheduler = QueueManager.schedule<DetectionPayload>('detection')
export const DetectionAssigner = QueueManager.assign<DetectionPayload>('detection')
