import type { Success } from '../../../types'

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

export interface IListingPresenter {
  success(data: Success<Image[]>): Response
  memory(data: Success<Image[]>): Response
}
