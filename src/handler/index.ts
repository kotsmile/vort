import type { Request, Response, NextFunction } from 'express'
import type { z } from 'zod'

import type { Params, Query, Body, ResponseBody, Locals } from '@/types'
import { VortError } from '@/utils'
import { httpError } from './consts'
import type { Middleware } from '@/middleware'

export * from './consts'

export type MiddlewareFunction = (
  request: Request,
  response: Response,
  next: NextFunction
) => any | Promise<any>

export class HandlerRoute<
  P extends Params = Params,
  Q extends Query = Query,
  B = Body,
  O = ResponseBody,
  L extends Locals = Locals
> {
  paramsSchema: z.Schema<P> | undefined = undefined
  querySchema: z.Schema<Q> | undefined = undefined
  bodySchema: z.Schema<B> | undefined = undefined

  outputSchema: z.Schema<O> | undefined = undefined

  middlewares: Middleware<P, Q, B, L>[] = []

  description_: string = ''

  func:
    | ((
        request: Request<P, O, B, Q>,
        response: Response<O>
      ) => any | Promise<any>)
    | undefined = undefined

  params<P_ extends Params = P>(p: z.Schema<P_>): HandlerRoute<P_, Q, B, O, L> {
    this.paramsSchema = p as any
    return this as any
  }
  query<Q_ extends Query = Q>(q: z.Schema<Q_>): HandlerRoute<P, Q_, B, O, L> {
    this.querySchema = q as any
    return this as any
  }
  body<B_ = B>(b: z.Schema<B_>): HandlerRoute<P, Q, B_, O, L> {
    this.bodySchema = b as any
    return this as any
  }
  output<O_ = O>(o: z.Schema<O_>): HandlerRoute<P, Q, B, O_, L> {
    this.outputSchema = o as any
    return this as any
  }

  use<
    P_ extends Params = Params,
    Q_ extends Query = Query,
    B_ = any,
    L_ extends Locals = {}
  >(middleware: Middleware<P_, Q_, B_, L_>): HandlerRoute<P, Q, B, O, L & L_> {
    this.middlewares.push(middleware as any)
    return this as HandlerRoute<P, Q, B, O, L & L_>
  }

  handler(
    func: (
      request: Request<P, O, B, Q>,
      response: Response<O, L>
    ) => any | Promise<any>
  ): HandlerRoute<P, Q, B, O, L> {
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

  // TODO
  injectResponseParser(response: Response): Response<O, L> {
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
    return response as Response<O, L>
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

  description(description_: string) {
    this.description_ = description_
    return this
  }
}

export function defineHandler() {
  return new HandlerRoute()
}
