export type Input = { internalName: string; image: Buffer }

export interface IDetectionStorer {
  getLocalImage(imagePath: string): Promise<Buffer>
  sendImageToBucket(image: Input): Promise<void>
  deleteLocalImage(imagePath: string): Promise<void>
}
