import type { Express } from 'express'

import type { VortConfig } from '@/types'

import {
  _buildPaths,
  _convertToExpressRoute,
  _parseMethod,
  _parsePathParams,
  _buildHandlers,
} from './utils'

export * from './consts'
export * from './types'
export * from './utils'

export function buildRoutes(config: VortConfig, app: Express) {
  const paths = _buildPaths(config.routes)
  const handlers = _buildHandlers(paths, config)
  for (const handler of handlers) {
    app[handler.httpMethod](
      handler.routeExpress,
      ...handler.handlerRoute.middlewares.map((m) => m.execute.bind(m)),
      handler.handlerRoute.execute.bind(handler.handlerRoute)
    )
  }
  return handlers
}
