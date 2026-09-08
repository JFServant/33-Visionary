export interface IListingEncoder {
  encode(id: number): string
  decode(token: string): number | null
}
