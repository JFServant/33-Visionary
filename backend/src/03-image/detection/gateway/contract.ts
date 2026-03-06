export type Prediction = {
  x: number
  y: number
  width: number
  height: number
  classification: string
  confidence: number
}

export type Input = { image: Buffer; internalName: string }

export interface IDetectionGateway {
  predict(input: Input): Promise<Prediction[] | null>
}
