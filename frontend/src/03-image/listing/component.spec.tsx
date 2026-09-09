import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { HttpResponseResolver } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { fail, mockRequest, ok } from '../../../test/msw'
import { render } from '../../../test/render'
import ListingComponent from './component'
import type { Image, Page } from './contract'

const PAGE_COUNT = 3
const LISTING_URI = '/image/listing'

const params = (url: string): URLSearchParams => new URL(url).searchParams

const emptyPage: Page = { images: [], nextCursor: null, prevCursor: null, pageCount: 0 }

const respondWithPage: HttpResponseResolver = ({ request }) => {
  const _image = (id: string): Image => ({
    id,
    url: `https://cdn.test/${id}.jpg`,
    predictions: [
      { id: `${id}-p`, x: 0, y: 0, width: 0, height: 0, classification: 'dog', confidence: 0.9 },
    ],
  })

  const _page = (n: number): Page => ({
    images: [_image(`p${n}-a`), _image(`p${n}-b`), _image(`p${n}-c`)],
    nextCursor: n < PAGE_COUNT ? `cursor-p${n}` : null,
    prevCursor: n > 1 ? `cursor-p${n}` : null,
    pageCount: PAGE_COUNT,
  })

  const search = params(request.url)
  const direction = search.get('direction')
  const cursor = search.get('cursor')

  if (direction === 'first') return ok(_page(1))
  if (direction === 'last') return ok(_page(PAGE_COUNT))

  const fromPage = cursor ? Number(cursor.replace('cursor-p', '')) : 1

  return ok(_page(direction === 'next' ? fromPage + 1 : fromPage - 1))
}

describe('ListingComponent', () => {
  beforeEach(() => mockRequest('GET', LISTING_URI, respondWithPage))

  it('loads the first page on mount', async () => {
    render(<ListingComponent />)

    expect(await screen.findByText('1 / 3')).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(3)
  })

  it('walks pages with the right direction and cursor', async () => {
    const urls: string[] = []

    mockRequest('GET', LISTING_URI, (info) => {
      urls.push(info.request.url)
      return respondWithPage(info)
    })

    const user = userEvent.setup()

    render(<ListingComponent />)

    await screen.findByText('1 / 3')

    await user.click(screen.getByRole('button', { name: 'Next page' }))
    await screen.findByText('2 / 3')

    await user.click(screen.getByRole('button', { name: 'Next page' }))
    await screen.findByText('3 / 3')

    await user.click(screen.getByRole('button', { name: 'Previous page' }))
    await screen.findByText('2 / 3')

    await user.click(screen.getByRole('button', { name: 'Last page' }))
    await screen.findByText('3 / 3')

    await user.click(screen.getByRole('button', { name: 'First page' }))
    await screen.findByText('1 / 3')

    expect(urls.map((url) => params(url).get('direction'))).toEqual([
      'first',
      'next',
      'next',
      'prev',
      'last',
      'first',
    ])

    expect(urls.map((url) => params(url).get('cursor'))).toEqual([
      null,
      'cursor-p1',
      'cursor-p2',
      'cursor-p3',
      null,
      null,
    ])
  })

  it('disables first/prev on the first page and next/last on the last page', async () => {
    const user = userEvent.setup()

    render(<ListingComponent />)

    await screen.findByText('1 / 3')

    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()

    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Last page' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'Last page' }))
    await screen.findByText('3 / 3')

    expect(screen.getByRole('button', { name: 'First page' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled()

    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled()
  })

  it('shows an empty state and no pager when there are no images', async () => {
    mockRequest('GET', LISTING_URI, () => ok(emptyPage))

    render(<ListingComponent />)

    expect(await screen.findByText('No images found.')).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Pagination' })).not.toBeInTheDocument()
  })

  it('surfaces the error message from a failed request', async () => {
    mockRequest('GET', LISTING_URI, () => fail('Boom'))

    render(<ListingComponent />)

    expect(await screen.findByText('Boom')).toBeInTheDocument()
  })
})
