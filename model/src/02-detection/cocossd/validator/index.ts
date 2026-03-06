import type { ICocoSSDValidator } from './contract.js'

export class CocoSSDValidator implements ICocoSSDValidator {
  constructor(private readonly input: unknown) {}

  async parse(): Promise<Uint8Array | null> {
    if (!this.isFormData(this.input)) return null

    const image = this.input.get('image')

    if (!image || !this.isFile(image)) return null

    const convert = await image.arrayBuffer()

    return new Uint8Array(convert)
  }

  private isFormData(input: unknown): input is FormData {
    return input instanceof FormData
  }

  private isFile(input: FormDataEntryValue): input is File {
    return input instanceof File
  }
}
