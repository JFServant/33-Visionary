export type Input = { fileName: string; ttl: number }

export interface IListingStorer {
  getSignedUrl(input: Input): Promise<string>
}
