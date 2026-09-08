type Prediction = {
  id: string
  x: number
  y: number
  width: number
  height: number
  classification: string
  confidence: number
}

export type Image = {
  id: string
  url: string
  predictions: Prediction[]
}

export type Direction = 'first' | 'prev' | 'next' | 'last'

export type Page = {
  images: Image[]
  nextCursor: string | null
  prevCursor: string | null
  pageCount: number
}
