type Prediction = {
  x: number
  y: number
  width: number
  height: number
  classification: string
  confidence: number
}

export type Data = Prediction[]

export interface ICocoSSDProcessor {
  predict(image: Uint8Array): Promise<Data | null>
}
