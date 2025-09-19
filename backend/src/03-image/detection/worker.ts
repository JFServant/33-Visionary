import type { Job } from 'bullmq'
import { DetectionUsecase } from '.'
import { getTransaction, Transaction } from '../../01-infra/database/main/drizzle'
import type { DetectionPayload } from '../../01-infra/redis/queue/jobs/detection'
import { DetectionMemory } from './memory'
import { DetectionPresenter } from './presenter'
import { DetectionProcessor } from './processor'
import { DetectionRepository } from './repository'
import { DetectionStorer } from './storer'

export class DetectionWorker {
  @Transaction()
  static run({ data }: Job<DetectionPayload>): Promise<void> {
    return new DetectionUsecase(
      new DetectionStorer('images'),
      new DetectionProcessor(),
      new DetectionPresenter(data.customerID),
      new DetectionRepository(getTransaction()),
      new DetectionMemory('listing')
    ).execute(data)
  }
}
