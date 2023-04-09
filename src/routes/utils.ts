import fsNode from 'fs'
import { type HTTPMethod, httpMethods } from './consts'

export function isdir(path: string): boolean {
  return fsNode.statSync(path).isDirectory()
}

export function isHTTPMethod(susp: string): susp is HTTPMethod {
  return httpMethods.indexOf(susp as HTTPMethod) >= 0
}
