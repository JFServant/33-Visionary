import type { ApiError } from '../../00-global/types'
import { SSEManager } from '../../01-infra/sse/manager'

// Contract
type Data = { data: true }

export interface IDetectionPresenter {
  success(data: Data): Promise<void>
  detectionFail(error: ApiError): Promise<void>
}

// Concrete
export class DetectionPresenter implements IDetectionPresenter {
  constructor(private readonly customerID: string) {}

  async success(data: Data): Promise<void> {
    await SSEManager.write({
      customerID: this.customerID,
      event: 'detection',
      data: JSON.stringify(data),
    })
  }

  async detectionFail(error: ApiError): Promise<void> {
    await SSEManager.write({
      customerID: this.customerID,
      event: 'detection',
      data: JSON.stringify(error),
    })
  }
}
