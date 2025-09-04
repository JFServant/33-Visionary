import { customAlphabet } from 'nanoid'

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const nanoid = customAlphabet(alphabet, 10)
