import type { HandlerRoute } from '..'
import type { httpMethods, partTypes } from './consts'

export type HTTPMethod = (typeof httpMethods)[number]
export type PartType = (typeof partTypes)[number]

export type PathPart = {
  name: string
  partType: PartType
}

export type Handler = {
  path: PathPart[]
  httpMethod: HTTPMethod
  routeExpress: string
  handlerRoute: HandlerRoute
}

export type PathArray = string[]
