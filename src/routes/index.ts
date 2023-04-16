import fsNode from 'fs'
import pathNode from 'path'

import type { Express, Request, Response, NextFunction } from 'express'

import { isHTTPMethod, isdir } from './utils'
import type { Handler, PathArray, PathPart } from './types'
import type { HTTPMethod, PartType } from './consts'

import type { VortConfig } from '@/types'
import type { HandlerRoute, MiddlewareFunction } from '@/handler'
import type { z } from 'zod'

export * from './consts'
export * from './types'
export * from './utils'

function buildPaths(routesPath: string) {
  if (!isdir(routesPath)) return []

  const paths: PathArray[] = []

  const internal = (pathArray: PathArray = []) => {
    const path_ = pathNode.join(routesPath, ...pathArray)
    if (!isdir(path_)) return paths.push(pathArray)
    fsNode.readdirSync(path_).forEach((f) => internal([...pathArray, f]))
  }
  internal()

  return paths
}

function parseMethod(path: PathArray): [HTTPMethod, string] {
  const file = path[path.length - 1]
  const part = file.split('.')
  const length = part.length

  const extension = part[length - 1]
  const method = part[length - 2]

  if (!isHTTPMethod(method))
    return ['all', file.split('.').slice(0, -1).join('.')]

  return [method, file.split('.').slice(0, -2).join('.')]
}

function parsePathParams(part: string): [string, PartType] {
  const pathParamRegExp = /^\[(.*)\]$/
  const pathParamAnyRegExp = /^\[\.\.\.(.*)\]$/

  const pathParamAny = part.match(pathParamAnyRegExp)
  const pathParam = part.match(pathParamRegExp)

  if (pathParamAny) return [pathParamAny[1], 'multi']
  if (pathParam) return [pathParam[1], 'param']
  return [part, 'simple']
}

function convertToExpressRoute(path: PathPart[]): string {
  return `/${path
    .map((p) => {
      if (p.partType === 'multi') return `:${p.name}*`
      if (p.partType === 'param') return `:${p.name}`
      return p.name
    })
    .join('/')}`
}

function buildHandlers(paths: PathArray[], config: VortConfig) {
  const handlers: Handler[] = []
  for (const path of paths) {
    const handlerRoute = require(pathNode.join(config.routes, path.join('/')))
      .default as HandlerRoute

    const [httpMethod, file] = parseMethod(path)

    path[path.length - 1] = file
    const clearPath: PathPart[] = []
    for (const part of path) {
      const [name, partType] = parsePathParams(part)
      clearPath.push({
        name,
        partType,
      })
    }

    let routeExpress = convertToExpressRoute(clearPath)
    if (routeExpress[routeExpress.length - 1] === '/')
      routeExpress = routeExpress.slice(0, -1)
    handlerRoute.routeExpress = routeExpress
    console.log(`[${httpMethod}] ${routeExpress}`)
    handlers.push({
      httpMethod,
      handlerRoute,
      path: clearPath,
      routeExpress,
    })
  }
  return handlers
}

export function buildRoutes(config: VortConfig, app: Express) {
  const paths = buildPaths(config.routes)
  const handlers = buildHandlers(paths, config)
  for (const handler of handlers) {
    // const m = handler.handlerRoute.middlewares.map(({ func, schema }) => {
    //   return async (req: Request, res: Response, next: NextFunction) => {
    //     await func(req, res, (args: any) => {
    //       if (schema) schema.parse(res.locals)
    //       next(args)
    //     })
    //   }
    // })
    app[handler.httpMethod](
      handler.routeExpress,
      ...handler.handlerRoute.middlewares.map((m) => m.execute.bind(m)),
      handler.handlerRoute.execute.bind(handler.handlerRoute)
    )
  }
  return handlers
}
