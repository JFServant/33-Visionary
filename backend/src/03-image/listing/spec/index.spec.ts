import { describe, expect, it, mock } from 'bun:test'
import { rollbackTXWrapper } from '../../../01-infra/database/test/drizzle'
import { CacheManager } from '../../../01-infra/redis/cache/manager'
import type { Image } from '../contract'
import type { IListingPresenter } from '../presenter/contract'
import { factory } from './factory'

describe('ListingUsecase', async () => {
  const MockedListingPresenter: IListingPresenter = {
    success: mock(),
    memory: mock(),
  }

  const CUSTOMER_ID = 'customerID'

  it('should call presenter.success when the cache is not available.', async () => {
    await rollbackTXWrapper(async (tx) => {
      await factory({
        tx,
        presenter: MockedListingPresenter,
        customerID: CUSTOMER_ID,
      })

      const signature: Image[] = [
        {
          id: expect.any(String),
          url: expect.any(String),
          predictions: [
            {
              id: expect.any(String),
              x: expect.any(Number),
              y: expect.any(Number),
              width: expect.any(Number),
              height: expect.any(Number),
              classification: expect.any(String),
              confidence: expect.any(Number),
            },
          ],
        },
      ]

      expect(MockedListingPresenter.success).toHaveBeenCalledWith({ data: signature })
    })
  })

  it('should call presenter.memory when the cache is available.', async () => {
    await rollbackTXWrapper(async (tx) => {
      const payload: Image[] = [
        {
          id: 'id',
          url: 'url',
          predictions: [
            {
              id: 'id',
              x: 0.1,
              y: 0.1,
              width: 0.1,
              height: 0.1,
              classification: 'classification',
              confidence: 0.1,
            },
          ],
        },
      ]

      await CacheManager.set({
        key: 'test',
        customerID: CUSTOMER_ID,
        value: JSON.stringify(payload),
        ttl: 3600,
      })

      await factory({
        tx,
        presenter: MockedListingPresenter,
        customerID: CUSTOMER_ID,
      })

      expect(MockedListingPresenter.memory).toHaveBeenCalledWith({ data: payload })
    })
  })
})
