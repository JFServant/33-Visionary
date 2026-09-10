import type { Job } from 'bullmq'
import { DetectionUsecase } from '.'
import { getTransaction, Transaction } from '../../01-infra/database/main/drizzle'
import type { DetectionPayload } from '../../01-infra/redis/queue/jobs/detection'
import { SSEManager } from '../../01-infra/sse/manager'
import type { Outcome } from './contract'
import { DetectionGateway } from './gateway'
import { DetectionMemory } from './memory'
import { DetectionPresenter } from './presenter'
import { DetectionRepository } from './repository'
import { DetectionStorer } from './storer'

export class DetectionWorker {
  @Transaction()
  static run({ data }: Job<DetectionPayload>): Promise<Outcome> {
    return new DetectionUsecase(
      new DetectionStorer('images'),
      new DetectionGateway(),
      new DetectionPresenter(),
      new DetectionRepository(getTransaction()),
      new DetectionMemory('listing')
    ).execute(data)
  }

  static handleFailed(job?: Job<DetectionPayload>): void {
    if (!job || job.attemptsMade < (job.opts.attempts ?? 1)) return

    SSEManager.failure({ customerID: job.data.customerID, event: 'detection' })
  }

  static handleCompleted(job: Job<DetectionPayload>, outcome: Outcome): void {
    if (outcome === 'fail') {
      SSEManager.failure({ customerID: job.data.customerID, event: 'detection' })
      return
    }

    SSEManager.success({ customerID: job.data.customerID, event: 'detection' })
  }
}
