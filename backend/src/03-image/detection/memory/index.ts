import type { CacheKey } from '../../../01-infra/redis/cache/manager'
import { CacheManager } from '../../../01-infra/redis/cache/manager'
import type { IDetectionMemory } from './contract'

export class DetectionMemory implements IDetectionMemory {
  constructor(private readonly key: CacheKey) {}

  async clearImages(customerID: string): Promise<void> {
    await CacheManager.invalidate({ key: this.key, customerID })
  }
}
