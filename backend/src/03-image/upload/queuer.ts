import { DetectionScheduler } from '../../01-infra/redis/queue/jobs/detection'

// Contract
type Payload = {
  tmpPath: string
  originalName: string
  internalName: string
  customerID: string
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
