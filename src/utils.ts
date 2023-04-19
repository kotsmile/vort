import { httpError } from './handler/consts'
import type { HTTPErrorCode } from './types'

export class VortError extends Error {}

export class HTTPError extends Error {
  numberCode: number = -1
  _type = 'http_error'

  constructor(public code: HTTPErrorCode, message?: string) {
    super(message ?? 'HTTPError')
    this.numberCode = httpError[code]
  }
}

export function isHTTPError(e: any): e is HTTPError {
  return '_type' in e && e._type === 'http_error'
}
