import { CacheManager, type CacheKey } from '../../01-infra/redis/cache/manager'

// Contract
export interface IDetectionMemory {
  clearImages(customerID: string): Promise<void>
}

// Concrete
export class DetectionMemory implements IDetectionMemory {
  constructor(private readonly key: CacheKey) {}

  async clearImages(customerID: string): Promise<void> {
    await CacheManager.del({ key: this.key, customerID })
  }
}
