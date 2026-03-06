export interface IDetectionMemory {
  clearImages(customerID: string): Promise<void>
}
