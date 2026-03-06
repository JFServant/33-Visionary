export type Payload = {
  tmpPath: string
  originalName: string
  internalName: string
  customerID: string
}

export interface IUploadQueuer {
  detection(payload: Payload): Promise<void>
}
