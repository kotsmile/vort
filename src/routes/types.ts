import type { HandlerRoute } from '..'
import type { HTTPMethod, PartType } from './consts'

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
