import type * as core from 'express-serve-static-core'

import type { httpError } from '@/handler/consts'

export type VortConfig = {
  routes: string
}

export type HTTPErrorCode = keyof typeof httpError

export type Params = core.ParamsDictionary
export type Query = core.Query
export type Body = any
export type ResponseBody = any
export type Locals = Record<string, any>
