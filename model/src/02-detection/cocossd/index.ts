import type { ICocoSSDPresenter } from './presenter/contract.js'
import type { ICocoSSDProcessor } from './processor/contract.js'
import type { ICocoSSDValidator } from './validator/contract.js'

export class CocoSSDUsecase {
  constructor(
    private readonly validator: ICocoSSDValidator,
    private readonly presenter: ICocoSSDPresenter,
    private readonly processor: ICocoSSDProcessor
  ) {}

  async execute(): Promise<Response> {
    const image = await this.validator.parse()

    if (!image) return this.presenter.noImage({ data: null })

    const predictions = await this.processor.predict(image)

    if (!predictions) return this.presenter.noPrediction({ data: null })

    return this.presenter.success({ data: predictions })
  }
}
