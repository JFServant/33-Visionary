import type { Outcome } from '../contract'

export interface IDetectionPresenter {
  success(outcome: Outcome): Outcome
  detectionFail(outcome: Outcome): Outcome
  imageExists(outcome: Outcome): Outcome
}
