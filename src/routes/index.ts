import type { Express } from 'express'

import pathNode from 'path'

import type { VortConfig } from '@/types'
import type { HandlerRoute } from '@/handler'

import type { Handler, PathArray, PathPart } from './types'
import {
  _buildPaths,
  _convertToExpressRoute,
  _parseMethod,
  _parsePathParams,
} from './utils'

export * from './consts'
export * from './types'
export * from './utils'

function buildHandlers(paths: PathArray[], config: VortConfig) {
  const handlers: Handler[] = []
  for (const path of paths) {
    const handlerRoute = require(pathNode.join(config.routes, path.join('/')))
      .default as HandlerRoute

    const [httpMethod, file] = _parseMethod(path)

    let ignore = false
    path[path.length - 1] = file
    const clearPath: PathPart[] = []
    for (const part of path) {
      const [name, partType] = _parsePathParams(part)
      clearPath.push({
        name,
        partType,
      })
      if (name.startsWith('-')) ignore = true
    }
    if (ignore) continue

    let routeExpress = _convertToExpressRoute(clearPath)
    if (routeExpress[routeExpress.length - 1] === '/')
      routeExpress = routeExpress.slice(0, -1)
    handlerRoute.routeExpress = routeExpress
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
  const paths = _buildPaths(config.routes)
  const handlers = buildHandlers(paths, config)
  for (const handler of handlers) {
    app[handler.httpMethod](
      handler.routeExpress,
      ...handler.handlerRoute.middlewares.map((m) => m.execute.bind(m)),
      handler.handlerRoute.execute.bind(handler.handlerRoute)
    )
  }
  return handlers
}
