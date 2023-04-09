import type { httpError } from './handler/consts'

export type VortConfig = {
  routes: string
}

export type HTTPErrorCode = keyof typeof httpError
