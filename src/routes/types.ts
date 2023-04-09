import type { HTTPMethod, PartType } from './consts'

export type PathPart = {
  name: string
  partType: PartType
}

export type Handler = {
  path: PathPart[]
  httpMethod: HTTPMethod
  routeExpress: string
  handlerFunc: (...args: any) => any | Promise<any>
}

export type PathArray = string[]
