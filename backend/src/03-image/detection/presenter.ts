import { SSEManager } from '../../01-infra/sse/manager'

// Contract
export interface IDetectionPresenter {
  success(message: 'success'): Promise<void>
  detectionFail(message: 'failure'): Promise<void>
}

// Concrete
export class DetectionPresenter implements IDetectionPresenter {
  constructor(private readonly customerID: string) {}

  async success(message: 'success'): Promise<void> {
    await SSEManager.write({
      customerID: this.customerID,
      event: 'detection',
      message,
    })
  }

  async detectionFail(message: 'failure'): Promise<void> {
    await SSEManager.write({
      customerID: this.customerID,
      event: 'detection',
      message,
    })
  }
}
