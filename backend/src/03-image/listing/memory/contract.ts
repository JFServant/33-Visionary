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

export type Input = { customerID: string; images: Image[]; ttl: number }

export interface IListingMemory {
  findImagesBy(customerID: string): Promise<Image[] | null>
  cacheImages(input: Input): Promise<void>
}
