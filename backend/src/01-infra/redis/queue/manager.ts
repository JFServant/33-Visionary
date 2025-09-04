import type { Job } from 'bullmq'
import { Queue, Worker } from 'bullmq'
import { connection } from './connection'

type QueueName = 'detection'

type Callback<T> = (job: Job<T>) => Promise<void>
type AssignCallback<T> = (callback: Callback<T>) => Worker
type ScheduleCallback<T> = (data: T) => Promise<Job<T>>

export class QueueManager {
  static assign<T>(queueName: QueueName): AssignCallback<T> {
    return (callback: Callback<T>) => new Worker(queueName, callback, { connection })
  }

  static schedule<T>(queueName: QueueName): ScheduleCallback<T> {
    const queue = new Queue(queueName, {
      connection,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 100,
      },
    })

    return (data: T) => queue.add('default', data)
  }
}
