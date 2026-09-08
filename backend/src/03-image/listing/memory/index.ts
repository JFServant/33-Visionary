import type { CacheKey } from '../../../01-infra/redis/cache/manager'
import { CacheManager } from '../../../01-infra/redis/cache/manager'
import type { Page } from '../contract'
import type { Find, IListingMemory, Save } from './contract'

export class ListingMemory implements IListingMemory {
  constructor(private readonly key: CacheKey) {}

  async findImagesPage({ customerID, direction }: Find): Promise<Page | null> {
    // #1 caches the first page only, #2 keys every page by cursor
    if (direction !== 'first') return null

    const cache = await CacheManager.get({ key: this.key, customerID })

    if (!cache) return null

    return JSON.parse(cache)
  }

  async cacheImagesPage({ customerID, direction, page, ttl }: Save): Promise<void> {
    // #1 caches the first page only, #2 keys every page by cursor
    if (direction !== 'first') return

    await CacheManager.set({ key: this.key, customerID, value: JSON.stringify(page), ttl })
  }
}
