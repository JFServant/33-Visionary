import { DetectionScheduler } from '../../01-infra/redis/queue/jobs/detection'

// Contract
type Payload = {
  originalName: string
  internalName: string
  tmpPath: string
  size: number
  mimeType: string
  requesterID: string
}

export interface IUploadQueuer {
  detection(payload: Payload): Promise<void>
}

// Concrete
export class UploadQueuer implements IUploadQueuer {
  async detection(payload: Payload): Promise<void> {
    await DetectionScheduler(payload)
  }
}
