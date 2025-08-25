export type Output =
  | { success: true; data: { username: string; email: string; password: string } }
  | { success: false; error: { message: string } }

export interface ISignupValidator {
  parse(): Output
}
