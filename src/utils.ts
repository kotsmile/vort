import { httpError } from './handler/consts'
import type { HTTPErrorCode } from './types'

export class VortError extends Error {}

export class HTTPError extends Error {
  numberCode: number = -1

  constructor(public code: HTTPErrorCode, message?: string) {
    super(message ?? 'HTTPError')
    this.numberCode = httpError[code]
  }
}
