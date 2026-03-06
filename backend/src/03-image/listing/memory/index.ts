import type { CacheKey } from '../../../01-infra/redis/cache/manager'
import { CacheManager } from '../../../01-infra/redis/cache/manager'
import type { IListingMemory, Image, Input } from './contract'

export class ListingMemory implements IListingMemory {
  constructor(private readonly key: CacheKey) {}

  async findImagesBy(customerID: string): Promise<Image[] | null> {
    const cache = await CacheManager.get({ key: this.key, customerID })

    if (!cache) return null

    return JSON.parse(cache)
  }

  async cacheImages({ customerID, images, ttl }: Input): Promise<void> {
    await CacheManager.set({ key: this.key, customerID, value: JSON.stringify(images), ttl })
  }
}
