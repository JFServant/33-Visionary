import type { Success } from '../../../signature.js'

export type Prediction = {
  x: number
  y: number
  width: number
  height: number
  classification: string
  confidence: number
}

export interface ICocoSSDPresenter {
  success(data: Success<Prediction[]>): Response
  noPrediction(data: Success<null>): Response
  noImage(data: Success<null>): Response
}
