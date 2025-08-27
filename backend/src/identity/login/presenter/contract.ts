export type Error = { error: { message: string } }
export type Data = { data: { sub: string; token: string } }

export interface ILoginPresenter {
  validationFail(error: Error): Response
  invalidEmail(error: Error): Response
  invalidPassword(error: Error): Response
  success(data: Data): Response
}
