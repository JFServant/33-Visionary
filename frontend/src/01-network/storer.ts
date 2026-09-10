const KEY = 'token'

export class Storer {
  static setToken(token: string): void {
    sessionStorage.setItem(KEY, token)
  }

  static getToken(): string | null {
    return sessionStorage.getItem(KEY)
  }

  static removeToken(): void {
    sessionStorage.removeItem(KEY)
  }
}
