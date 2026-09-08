import { describe, expect, it, mock, type Mock } from 'bun:test'
import { rollbackTXWrapper } from '../../../01-infra/database/test/drizzle'
import { CacheManager } from '../../../01-infra/redis/cache/manager'
import type { Success } from '../../../types'
import type { Page } from '../contract'
import type { IListingPresenter } from '../presenter/contract'
import { run, seed } from './factory'

type PresentPage = (data: Success<Page>) => Response

describe('ListingUsecase', () => {
  const success = mock<PresentPage>()
  const memory = mock<PresentPage>()
  const presenter: IListingPresenter = { success, memory }

  const CUSTOMER_ID = 'customerID'

  const presented = ({ mock: { calls } }: Mock<PresentPage>): Page => {
    const call = calls[calls.length - 1]

    if (!call) throw new Error('presenter was not called')

    return call[0].data
  }

  it('should call presenter.success with the first page when the cache is not available.', async () => {
    await rollbackTXWrapper(async (tx) => {
      await seed({ tx, customerID: CUSTOMER_ID, count: 1 })
      await run({ tx, presenter, customerID: CUSTOMER_ID })

      const signature: Page = {
        images: [
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
        ],
        nextCursor: null,
        prevCursor: null,
        pageCount: 1,
      }

      expect(success).toHaveBeenCalledWith({ data: signature })
    })
  })

  it('should call presenter.memory with the cached page when the cache is available.', async () => {
    await rollbackTXWrapper(async (tx) => {
      const cached: Page = {
        images: [
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
        ],
        nextCursor: null,
        prevCursor: null,
        pageCount: 1,
      }

      await CacheManager.set({
        key: 'test',
        customerID: CUSTOMER_ID,
        segment: 'first',
        value: JSON.stringify(cached),
        ttl: 3600,
      })

      await seed({ tx, customerID: CUSTOMER_ID, count: 1 })
      await run({ tx, presenter, customerID: CUSTOMER_ID })

      expect(memory).toHaveBeenCalledWith({ data: cached })
    })
  })

  it('should page through the listing with the cursor.', async () => {
    await rollbackTXWrapper(async (tx) => {
      await seed({ tx, customerID: CUSTOMER_ID, count: 25 })
      await run({ tx, presenter, customerID: CUSTOMER_ID, direction: 'first' })

      const firstPage = presented(success)

      expect(firstPage.images).toHaveLength(24)
      expect(firstPage.pageCount).toBe(2)
      expect(firstPage.prevCursor).toBeNull()
      expect(firstPage.nextCursor).toEqual(expect.any(String))

      await run({
        tx,
        presenter,
        customerID: CUSTOMER_ID,
        direction: 'next',
        cursor: firstPage.nextCursor,
      })

      const nextPage = presented(success)

      expect(nextPage.images).toHaveLength(1)
      expect(nextPage.prevCursor).toEqual(expect.any(String))
      expect(nextPage.nextCursor).toBeNull()

      await run({ tx, presenter, customerID: CUSTOMER_ID, direction: 'last' })

      const lastPage = presented(success)

      expect(lastPage.images).toHaveLength(1)
      expect(lastPage.nextCursor).toBeNull()
      expect(lastPage.images[0].id).toBe(nextPage.images[0].id)
    })
  })

  it('should cache each page under its own key.', async () => {
    await rollbackTXWrapper(async (tx) => {
      await seed({ tx, customerID: CUSTOMER_ID, count: 60 })
      await run({ tx, presenter, customerID: CUSTOMER_ID, direction: 'first' })

      const firstPage = presented(success)

      await run({
        tx,
        presenter,
        customerID: CUSTOMER_ID,
        direction: 'next',
        cursor: firstPage.nextCursor,
      })

      const secondPage = presented(success)

      await run({
        tx,
        presenter,
        customerID: CUSTOMER_ID,
        direction: 'next',
        cursor: secondPage.nextCursor,
      })

      const thirdPage = presented(success)

      await run({
        tx,
        presenter,
        customerID: CUSTOMER_ID,
        direction: 'next',
        cursor: firstPage.nextCursor,
      })

      expect(presented(memory)).toEqual(secondPage)

      await run({
        tx,
        presenter,
        customerID: CUSTOMER_ID,
        direction: 'next',
        cursor: secondPage.nextCursor,
      })

      expect(presented(memory)).toEqual(thirdPage)
    })
  })
})
