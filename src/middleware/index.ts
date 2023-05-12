import type { Request, Response, NextFunction } from 'express'
import type * as core from 'express-serve-static-core'
import type { z } from 'zod'

import { VortError, isHTTPError } from '@/utils'
import { httpError } from '@/handler/consts'

import type { Params, Query, Body, Locals } from '@/types'

export class Middleware<
  P extends Params = Params,
  Q extends Query = Query,
  B = any,
  L extends Locals = Locals
> {
  paramsSchema: z.Schema<P> | undefined = undefined
  querySchema: z.Schema<Q> | undefined = undefined
  bodySchema: z.Schema<B> | undefined = undefined

  localsSchema: z.Schema<L> | undefined = undefined

  func:
    | ((
        request: Request<P, {}, B, Q>,
        response: Response<{}, L>,
        next: NextFunction
      ) => any | Promise<any>)
    | undefined = undefined

  params<P_ extends Params = P>(p: z.Schema<P_>): Middleware<P_, Q, B, L> {
    this.paramsSchema = p as any
    return this as any
  }
  query<Q_ extends Query = Q>(q: z.Schema<Q_>): Middleware<P, Q_, B, L> {
    this.querySchema = q as any
    return this as any
  }
  body<B_ = B>(b: z.Schema<B_>): Middleware<P, Q, B_, L> {
    this.bodySchema = b as any
    return this as any
  }
  locals<L_ extends Locals = L>(l: z.Schema<L_>): Middleware<P, Q, B, L_> {
    this.localsSchema = l as any
    return this as any
  }

  middleware(
    func: (
      request: Request<P, {}, B, Q>,
      response: Response<{}, L>,
      next: NextFunction
    ) => any | Promise<any>
  ) {
    this.func = func
    return this
  }

  checkRequest(request: Request): Request<P, {}, B, Q> {
    request.params = {
      ...request.params,
      ...(this.paramsSchema
        ? this.paramsSchema.parse(request.params)
        : ({} as P)),
    }

    request.query = {
      ...request.query,
      ...(this.querySchema ? this.querySchema.parse(request.query) : ({} as Q)),
    }

    request.body = {
      ...request.body,
      ...(this.bodySchema ? this.bodySchema.parse(request.body) : ({} as B)),
    }

    return request as Request<P, {}, B, Q>
  }

  async execute(
    request: Request<P, {}, B, Q>,
    response: Response<{}, L>,
    next: NextFunction
  ) {
    if (!this.func) throw new VortError('Middleware function is not defined')

    const next_: NextFunction = (...args) => {
      if (this.localsSchema) this.localsSchema.parse(response.locals)
      next(...args)
    }

    try {
      const request_ = this.checkRequest(request)
      await this.func(request_, response, next_)
    } catch (e: any) {
      console.error(e)
      if (isHTTPError(e)) return response.status(e.numberCode).send(e.message)
      throw e
    }
  }
}

export function defineMiddleware() {
  return new Middleware()
}
