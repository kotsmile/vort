import type { Request, Response, NextFunction } from 'express'
import type { z } from 'zod'

import type { Params, Query, Body, ResponseBody, Locals } from '@/types'
import { HTTPError, VortError, isHTTPError } from '@/utils'
import { httpError } from './consts'
import type { Middleware } from '@/middleware'

export * from './consts'

export type MiddlewareFunction = (
  request: Request,
  response: Response,
  next: NextFunction
) => any | Promise<any>

export type Modifier<
  P extends Params = Params,
  Q extends Query = Query,
  B = Body,
  O = ResponseBody,
  L extends Locals = Locals
> = (
  request: Request<P, O, B, Q>,
  response: Response<O, L>,
  handler: () => Promise<any> | any
) => Promise<any> | any

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
  modifier_: Modifier<P, Q, B, O, L> | undefined = undefined

  description_: string = ''
  routeExpress: string = ''

  example_:
    | {
        params?: P
        query?: Q
        body?: B
        output?: O
      }
    | undefined = undefined

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

  example(e: {
    params?: P
    query?: Q
    body?: B
    output?: O
  }): HandlerRoute<P, Q, B, O, L> {
    this.example_ = e
    return this
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

  injectResponseParser(response: Response) {
    const binedSend = response.send.bind(response)
    const binedJson = response.json.bind(response)

    const customSend = (body: O) => {
      try {
        const parsedBody = this.outputSchema
          ? this.outputSchema.parse(body)
          : body

        response.send = binedSend
        response.json = binedJson

        const result = binedSend(parsedBody)

        response.send = customSend
        response.json = customJson

        return result
      } catch (e) {
        console.error(e)
        throw new HTTPError('INTERNAL_SERVER_ERROR', 'Internal error')
      }
    }

    const customJson = function (body: O) {
      return customSend(body)
    }

    response.send = customSend
    response.json = customJson
  }

  modifier(func: Modifier<P, Q, B, O, L>) {
    this.modifier_ = func
    return this
  }

  async execute(request: Request, response: Response) {
    if (!this.func) throw new VortError('Callback function is not defined')

    const binedSend = response.send.bind(response)

    const func = this.func

    try {
      const parsedRequest = this.checkRequest(request)
      this.injectResponseParser(response)

      if (this.modifier_)
        await this.modifier_(
          parsedRequest,
          response as any,
          () => func(parsedRequest, response) as any
        )
      else await func(parsedRequest, response)
    } catch (e: any) {
      console.error(this.routeExpress)
      console.error(e)
      if (isHTTPError(e)) {
        response.status(e.numberCode)
        binedSend(e.message)
        return
      }

      response.status(httpError.BAD_REQUEST)
      binedSend('Bad request')

      return
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
