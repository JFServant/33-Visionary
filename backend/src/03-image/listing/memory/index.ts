import type { CacheKey } from '../../../01-infra/redis/cache/manager'
import { CacheManager } from '../../../01-infra/redis/cache/manager'
import type { Direction, Page } from '../contract'
import type { Find, IListingMemory, Save } from './contract'

const pageSegment = (direction: Direction, cursor: string | null): string => {
  if (direction === 'first' || direction === 'last') return direction
  return `${direction}:${cursor}`
}

export class ListingMemory implements IListingMemory {
  constructor(private readonly key: CacheKey) {}

  async findImagesPage({ customerID, cursor, direction }: Find): Promise<Page | null> {
    const segment = pageSegment(direction, cursor)
    const cache = await CacheManager.get({ key: this.key, customerID, segment })

    if (!cache) return null

    return JSON.parse(cache)
  }

  async cacheImagesPage({ customerID, cursor, direction, page, ttl }: Save): Promise<void> {
    const segment = pageSegment(direction, cursor)

    await CacheManager.set({ key: this.key, customerID, segment, value: JSON.stringify(page), ttl })
  }
}
