import type { Request, Response, NextFunction } from 'express'
import type * as core from 'express-serve-static-core'
import type { z } from 'zod'

import { VortError } from '@/utils'
import { httpError } from './consts'

export * from './consts'
export * from './utils'

export type MiddlewareFunction = (
  request: Request,
  response: Response,
  next: NextFunction
) => any | Promise<any>

export class HandlerRoute<
  P extends core.ParamsDictionary = core.ParamsDictionary,
  Q extends core.Query = core.Query,
  B = {},
  O = {},
  M extends Record<string, any> = {}
> {
  paramsSchema: z.Schema<P> | undefined = undefined
  querySchema: z.Schema<Q> | undefined = undefined
  bodySchema: z.Schema<B> | undefined = undefined

  outputSchema: z.Schema<O> | undefined = undefined

  middlewares: { func: MiddlewareFunction; schema?: z.Schema }[] = []

  func:
    | ((
        request: Request<P, O, B, Q>,
        response: Response<O>
      ) => any | Promise<any>)
    | undefined = undefined

  params<P_ extends core.ParamsDictionary = P>(
    p: z.Schema<P_>
  ): HandlerRoute<P_, Q, B, O, M> {
    this.paramsSchema = p as any
    return this as any
  }
  query<Q_ extends core.Query = Q>(
    q: z.Schema<Q_>
  ): HandlerRoute<P, Q_, B, O, M> {
    this.querySchema = q as any
    return this as any
  }
  body<B_ = B>(b: z.Schema<B_>): HandlerRoute<P, Q, B_, O, M> {
    this.bodySchema = b as any
    return this as any
  }
  output<O_ = O>(o: z.Schema<O_>): HandlerRoute<P, Q, B, O_, M> {
    this.outputSchema = o as any
    return this as any
  }

  use<M_ extends Record<string, any> = {}>({
    middleware,
    locals,
  }: {
    middleware: (
      request: Request<P, O, B, Q>,
      response: Response<O, M & M_>,
      next: NextFunction
    ) => any | Promise<any>
    locals?: z.Schema<M_>
  }): HandlerRoute<P, Q, B, O, M & M_> {
    this.middlewares.push({
      func: middleware as any,
      schema: locals,
    })
    return this as HandlerRoute<P, Q, B, O, M & M_>
  }

  callback(
    func: (
      request: Request<P, O, B, Q>,
      response: Response<O, M>
    ) => any | Promise<any>
  ): HandlerRoute<P, Q, B, O, M> {
    this.func = func as any
    return this
  }

  checkRequest(request: Request): Request<P, O, B, Q> {
    request.params = this.paramsSchema
      ? this.paramsSchema.parse(request.params)
      : ({} as P)

    request.query = this.querySchema
      ? this.querySchema.parse(request.query)
      : ({} as Q)

    request.body = this.bodySchema
      ? this.bodySchema.parse(request.body)
      : ({} as B)

    return request as Request<P, O, B, Q>
  }

  injectResponseParser(response: Response): Response<O, M> {
    // const send = response.send
    // response.send = (body: O) => {
    //   try {
    //     send.bind(response)(
    //       this.outputSchema ? this.outputSchema.parse(body) : body
    //     )
    //     return response
    //   } catch (e) {
    //     console.error(e)
    //     throw new VortError('Response body parsing error')
    //   }
    // }
    return response as Response<O, M>
  }

  async execute(request: Request, response: Response) {
    if (!this.func) throw new VortError('Callback function is not defined')

    try {
      const parsedRequest = this.checkRequest(request)
      await this.func(parsedRequest, this.injectResponseParser(response))
    } catch (e: any) {
      console.error(e)
      if ('message' in e && 'numberCode' in e)
        return response.status(e.numberCode).send(e.message)
      return response.status(httpError.BAD_REQUEST).send('Bad request')
    }
  }
}

export function handler() {
  return new HandlerRoute()
}
