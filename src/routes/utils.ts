import fsNode from 'fs'
import pathNode from 'path'

import type { VortConfig } from '@/types'
import type { HandlerRoute } from '@/handler'

import type {
  PathArray,
  PathPart,
  HTTPMethod,
  PartType,
  Handler,
} from './types'

import { httpMethods } from './consts'

export function isdir(path: string): boolean {
  return fsNode.statSync(path).isDirectory()
}

export function isHTTPMethod(susp: string): susp is HTTPMethod {
  return httpMethods.indexOf(susp as HTTPMethod) >= 0
}

export function _buildPaths(routesPath: string) {
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

export function _parseMethod(path: PathArray): [HTTPMethod, string] {
  const file = path[path.length - 1]
  const part = file.split('.')
  const length = part.length

  const extension = part[length - 1]
  const method = part[length - 2]

  if (!isHTTPMethod(method))
    return ['all', file.split('.').slice(0, -1).join('.')]

  return [method, file.split('.').slice(0, -2).join('.')]
}

export function _parsePathParams(part: string): [string, PartType] {
  const pathParamRegExp = /^\[(.*)\]$/
  const pathParamAnyRegExp = /^\[\.\.\.(.*)\]$/

  const pathParamAny = part.match(pathParamAnyRegExp)
  const pathParam = part.match(pathParamRegExp)

  if (pathParamAny) return [pathParamAny[1], 'multi']
  if (pathParam) return [pathParam[1], 'param']
  return [part, 'simple']
}

export function _convertToExpressRoute(path: PathPart[]): string {
  return `/${path
    .map((p) => {
      if (p.partType === 'multi') return `:${p.name}*`
      if (p.partType === 'param') return `:${p.name}`
      return p.name
    })
    .join('/')}`
}

export function _buildHandlers(paths: PathArray[], config: VortConfig) {
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
