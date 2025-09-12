import { write } from 'bun'
import { join } from 'path'
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator'

const fileNameGenerator = (): string =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: '-',
    style: 'lowerCase',
  })

// Contract
type Input = { image: File; customerID: string }
type Data = { tmpPath: string; internalName: string }

export interface IUploadStorer {
  saveToDisk(input: Input): Promise<Data>
}

// Concrete
type Folder = 'tmp' | 'tmp-test'

export class UploadStorer implements IUploadStorer {
  constructor(private readonly folder: Folder) {}

  async saveToDisk({ image, customerID }: Input): Promise<Data> {
    const extension = image.type.split('/')[1]
    const internalName = `${customerID}-${fileNameGenerator()}.${extension}`
    const tmpPath = join(__dirname, this.folder, internalName)

    const stream = image.stream()
    const response = new Response(stream)

    await write(tmpPath, response)

    return { tmpPath, internalName }
  }
}
