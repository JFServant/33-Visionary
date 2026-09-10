export type Image = {
  originalName: string
  internalName: string
  customerID: string
}

export type ImageID = string

export type Prediction = {
  x: number
  y: number
  width: number
  height: number
  classification: string
  confidence: number
  imageID: string
}

export interface IDetectionRepository {
  imageExists(internalName: string): Promise<boolean>
  createImage(input: Image): Promise<ImageID>
  createPredictions(input: Prediction[]): Promise<void>
}
