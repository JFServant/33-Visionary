type Key = 'sub' | 'token'
type Input = { key: Key; data: string }

export class Storer {
  static set({ key, data }: Input): void {
    localStorage.setItem(key, data)
  }

  static get(key: Key): string | null {
    return localStorage.getItem(key)
  }

  static remove(key: Key): void {
    localStorage.removeItem(key)
  }
}
