export class Cursor {
  static encode(id: number): string {
    return Buffer.from(String(id)).toString('base64url')
  }

  static decode(token: string): number | null {
    const id = Number(Buffer.from(token, 'base64url').toString())
    if (!Number.isInteger(id) || id <= 0) return null
    return id
  }
}
