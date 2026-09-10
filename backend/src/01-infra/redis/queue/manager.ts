import type { Job } from 'bullmq'
import { Queue, Worker } from 'bullmq'
import { connection } from './connection'

type QueueName = 'detection'

type Callback<T, R> = (job: Job<T>) => Promise<R>
type AssignCallback<T> = <R>(callback: Callback<T, R>) => Worker
type ScheduleCallback<T> = (data: T) => Promise<Job<T>>

export class QueueManager {
  static assign<T>(queueName: QueueName): AssignCallback<T> {
    return (callback) => new Worker(queueName, callback, { connection })
  }

  static schedule<T>(queueName: QueueName): ScheduleCallback<T> {
    const queue = new Queue(queueName, {
      connection,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 100,
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      },
    })

    return (data: T) => queue.add('default', data)
  }
}
