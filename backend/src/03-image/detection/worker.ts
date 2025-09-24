import type { Job } from 'bullmq'
import { DetectionUsecase } from '.'
import { getTransaction, Transaction } from '../../01-infra/database/main/drizzle'
import type { DetectionPayload } from '../../01-infra/redis/queue/jobs/detection'
import { DetectionGateway } from './gateway'
import { DetectionMemory } from './memory'
import { DetectionPresenter } from './presenter'
import { DetectionRepository } from './repository'
import { DetectionStorer } from './storer'

export class DetectionWorker {
  @Transaction()
  static run({ data }: Job<DetectionPayload>): Promise<void> {
    return new DetectionUsecase(
      new DetectionStorer('images'),
      new DetectionGateway(),
      new DetectionPresenter(data.customerID),
      new DetectionRepository(getTransaction()),
      new DetectionMemory('listing')
    ).execute(data)
  }
}
