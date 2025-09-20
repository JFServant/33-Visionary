type Key = 'sub' | 'token'
type Input = { key: Key; data: string }

export class Storer {
  static set({ key, data }: Input): void {
    sessionStorage.setItem(key, data)
  }

  static get(key: Key): string | null {
    return sessionStorage.getItem(key)
  }

  static remove(key: Key): void {
    sessionStorage.removeItem(key)
  }
}
