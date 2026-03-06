export type Input = { image: File; customerID: string }
export type Data = { tmpPath: string; internalName: string }

export interface IUploadStorer {
  saveToDisk(input: Input): Promise<Data>
}
