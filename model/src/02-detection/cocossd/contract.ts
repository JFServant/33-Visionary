type Prediction = {
  x: number
  y: number
  width: number
  height: number
  classification: string
  confidence: number
}

export type Data = Prediction[]
