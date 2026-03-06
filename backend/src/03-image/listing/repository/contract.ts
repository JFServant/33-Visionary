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
  internalName: string
  predictions: Prediction[]
}

export interface IListingRepository {
  getImagesBy(customerID: string): Promise<Image[]>
}
