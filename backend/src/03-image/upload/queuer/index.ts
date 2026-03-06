import { DetectionScheduler } from '../../../01-infra/redis/queue/jobs/detection'
import type { IUploadQueuer, Payload } from './contract'

export class UploadQueuer implements IUploadQueuer {
  async detection(payload: Payload): Promise<void> {
    await DetectionScheduler(payload)
  }
}
