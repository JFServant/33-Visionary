import { CacheManager, type CacheKey } from '../../01-infra/redis/cache/manager'
import type { Image } from './contract'

// Contract
type Input = { customerID: string; images: Image[]; ttl: number }

export interface IListingMemory {
  findImagesBy(customerID: string): Promise<Image[] | null>
  cacheImages(input: Input): Promise<void>
}

// Concrete
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
