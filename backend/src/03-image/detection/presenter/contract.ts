export interface IDetectionPresenter {
  success(message: 'success'): Promise<void>
  detectionFail(message: 'failure'): Promise<void>
}
