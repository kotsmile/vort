import type { Request, Response, NextFunction } from 'express'
import type * as core from 'express-serve-static-core'

import type { z } from 'zod'

export function defineMiddleware<
  P extends core.ParamsDictionary = core.ParamsDictionary,
  Q extends core.Query = core.Query,
  B = {},
  O = {},
  M extends Record<string, any> = {}
>({
  middleware,
  locals,
}: {
  middleware: (
    request: Request<P, O, B, Q>,
    response: Response<O, M>,
    next: NextFunction
  ) => any | Promise<any>
  locals?: z.Schema<M>
}) {
  return { middleware, locals }
}
