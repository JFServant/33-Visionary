import { write } from 'bun'
import { join } from 'path'
import { nanoid } from '../../00-global/nanoid'

// Contract
type ImageData = { internalName: string; tmpPath: string }

export interface IUploadStorer {
  saveToDisk(image: File): Promise<ImageData>
}

// Concrete
type Folder = 'tmp' | 'tmp-test'

export class UploadStorer implements IUploadStorer {
  constructor(private readonly folder: Folder) {}

  async saveToDisk(image: File): Promise<ImageData> {
    const extension = image.type.split('/')[1]
    const internalName = `${nanoid()}.${extension}`
    const tmpPath = join(__dirname, this.folder, internalName)

    const stream = image.stream()
    const response = new Response(stream)

    await write(tmpPath, response)

    return { internalName, tmpPath }
  }
}
