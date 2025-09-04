import type { ValidationFail } from '../../00-global/types'

// Contract
type ValidationSuccess = { success: true; image: File }
type Output = ValidationSuccess | ValidationFail

export interface IUploadValidator {
  parse(): Output
}

// Concrete
export class UploadValidator implements IUploadValidator {
  constructor(private readonly input: FormData) {}

  parse(): Output {
    const image = this.input.get('image')

    if (!this.isFileProvided(image) || !this.isImageType(image) || !this.isSizeUnder10MB(image)) {
      return { success: false, error: { message: 'Image Upload input validation failed.' } }
    }

    return { success: true, image }
  }

  private isFileProvided(input: FormDataEntryValue | null): input is File {
    return !!input && input instanceof File
  }

  private isImageType(input: File): boolean {
    return input.type.startsWith('image/')
  }

  private isSizeUnder10MB(image: File): boolean {
    return image.size <= 10 * 1024 * 1024
  }
}
