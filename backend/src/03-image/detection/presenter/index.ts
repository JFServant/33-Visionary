import type { Outcome } from '../contract'
import type { IDetectionPresenter } from './contract'

export class DetectionPresenter implements IDetectionPresenter {
  success(outcome: Outcome): Outcome {
    return outcome
  }

  detectionFail(outcome: Outcome): Outcome {
    return outcome
  }

  imageExists(outcome: Outcome): Outcome {
    return outcome
  }
}
