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
  _id: number
  id: string
  internalName: string
  predictions: Prediction[]
}

export type Scan = 'forward' | 'backward'

export type Stats = {
  total: number
  minID: number | null
  maxID: number | null
}

export type PageQuery = {
  customerID: string
  cursorID: number | null
  scan: Scan
  limit: number
}

export interface IListingRepository {
  getImagesStats(customerID: string): Promise<Stats>
  getImagesPage(query: PageQuery): Promise<Image[]>
}
