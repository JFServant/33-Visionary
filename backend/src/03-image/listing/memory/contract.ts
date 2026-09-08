import type { Direction, Page } from '../contract'

export type Find = {
  customerID: string
  cursor: string | null
  direction: Direction
}

export type Save = {
  customerID: string
  cursor: string | null
  direction: Direction
  page: Page
  ttl: number
}

export interface IListingMemory {
  findImagesPage(input: Find): Promise<Page | null>
  cacheImagesPage(input: Save): Promise<void>
}
