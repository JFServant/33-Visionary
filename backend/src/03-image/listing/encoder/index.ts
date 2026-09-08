import { Cursor } from '../../../01-infra/cursor'
import type { IListingEncoder } from './contract'

export class ListingEncoder implements IListingEncoder {
  encode(id: number): string {
    return Cursor.encode(id)
  }

  decode(token: string): number | null {
    return Cursor.decode(token)
  }
}
