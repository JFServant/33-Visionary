import type { IUploadValidator, Validation } from './contract'

export class UploadValidator implements IUploadValidator {
  constructor(private readonly input: unknown) {}

  parse(): Validation {
    try {
      if (!this.isFormData(this.input)) throw 'Wrong format.'

      const image = this.input.get('image')

      if (!this.isFileProvided(image)) throw 'Missing file.'
      if (!this.isImageType(image)) throw 'Wrong type.'
      if (!this.isSizeUnder10MB(image)) throw 'Max 10MB.'

      return { data: image }
    } catch {
      return { error: { message: 'Image Upload input validation failed.' } }
    }
  }

  private isFormData(input: unknown): input is FormData {
    return input instanceof FormData
  }

  private isFileProvided(input: FormDataEntryValue | null): input is File {
    return !!input && input instanceof File
  }

  private isImageType(input: File): boolean {
    return ['image/png', 'image/jpeg'].includes(input.type)
  }

  private isSizeUnder10MB(image: File): boolean {
    return image.size <= 10 * 1024 * 1024
  }
}
