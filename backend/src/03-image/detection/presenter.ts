import { SSEManager } from '../../01-infra/sse/manager'

// Contract
export interface IDetectionPresenter {
  success(data: string): Promise<void>
  detectionFail(error: string): Promise<void>
}

// Concrete
export class DetectionPresenter implements IDetectionPresenter {
  constructor(private readonly customerID: string) {}

  async success(data: string): Promise<void> {
    await SSEManager.write({
      customerID: this.customerID,
      event: 'detection',
      message: data,
    })
  }

  async detectionFail(error: string): Promise<void> {
    await SSEManager.write({
      customerID: this.customerID,
      event: 'detection',
      message: error,
    })
  }
}
