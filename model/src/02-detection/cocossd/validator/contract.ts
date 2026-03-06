export interface ICocoSSDValidator {
  parse(): Promise<Uint8Array | null>
}
