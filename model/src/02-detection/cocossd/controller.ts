import type { Context } from 'hono'
import { CocoSSDUsecase } from './index.js'
import { CocoSSDPresenter } from './presenter/index.js'
import { CocoSSDProcessor } from './processor/index.js'
import { CocoSSDValidator } from './validator/index.js'

export class CocoSSDController {
  static async run({ req, json: response }: Context): Promise<Response> {
    const input = await req.formData()

    return new CocoSSDUsecase(
      new CocoSSDValidator(input),
      new CocoSSDPresenter(response),
      new CocoSSDProcessor()
    ).execute()
  }
}
