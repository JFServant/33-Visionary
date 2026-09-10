const MIME_BY_EXTENSION: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
}

export class Mime {
  static resolve(fileName: string): string | undefined {
    const segments = fileName.split('.')

    if (segments.length < 2) return undefined

    const extension = segments[segments.length - 1].toLowerCase()

    return MIME_BY_EXTENSION[extension]
  }
}
