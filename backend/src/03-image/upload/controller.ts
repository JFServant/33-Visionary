import type { Context } from 'hono'
import { UploadUsecase } from '.'
import { Authenticator } from '../../00-global/authenticator'
import { UploadPresenter } from './presenter'
import { UploadQueuer } from './queuer'
import { UploadStorer } from './storer'
import { UploadValidator } from './validator'

export class UploadController {
  static async run(c: Context): Promise<Response> {
    return new UploadUsecase(
      new UploadValidator(await c.req.formData()),
      new UploadPresenter(c),
      new UploadStorer('tmp'),
      new UploadQueuer()
    ).execute(Authenticator.getCustomerID(c))
  }
}
