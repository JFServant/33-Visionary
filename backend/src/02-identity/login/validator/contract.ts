export type Output =
  | { success: true; data: { email: string; password: string } }
  | { success: false; error: { message: string } }

export interface ILoginValidator {
  parse(): Output
}
