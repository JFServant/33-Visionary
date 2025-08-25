export type Error = { error: { message: string } }
export type Data = { data: { sub: string; token: string } }

export interface ISignupPresenter {
  validationFail(error: Error): Response
  emailAlreadyTaken(error: Error): Response
  success(data: Data): Response
}
