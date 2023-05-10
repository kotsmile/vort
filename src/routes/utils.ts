import fsNode from 'fs'
import pathNode from 'path'

import type { PathArray, PathPart, HTTPMethod, PartType } from './types'
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
