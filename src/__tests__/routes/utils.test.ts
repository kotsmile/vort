import pathNode from 'path'

import {
  PathPart,
  _buildPaths,
  _parseMethod,
  _parsePathParams,
  _convertToExpressRoute,
  isdir,
  isHTTPMethod,
} from '@/routes'

import { expectedPaths, expectedMethods } from './expected'

const TEST_ROUTES_PATH = pathNode.join(__dirname, 'test-routes')

describe('routes', () => {
  describe('utils', () => {
    it('isdir', () => {
      expect(isdir(pathNode.join(__dirname, 'test-routes'))).toBeTruthy()
    })
    it('isHTTPMethod', () => {
      expect(isHTTPMethod('all')).toBeTruthy()
      expect(isHTTPMethod('get')).toBeTruthy()
      expect(isHTTPMethod('post')).toBeTruthy()
      expect(isHTTPMethod('delete')).toBeTruthy()
      expect(isHTTPMethod('put')).toBeTruthy()
      expect(isHTTPMethod('patch')).toBeTruthy()
      expect(isHTTPMethod('options')).toBeTruthy()
      expect(isHTTPMethod('head')).toBeTruthy()

      expect(isHTTPMethod('_head')).toBeFalsy()
      expect(isHTTPMethod('options_')).toBeFalsy()
      expect(isHTTPMethod('-all-')).toBeFalsy()
    })
    it('_buildPaths()', () => {
      const paths = _buildPaths(TEST_ROUTES_PATH)
      expect(paths).toEqual(expectedPaths)
    })
    it('_parseMethod()', () => {
      const paths = expectedPaths
      for (const path of paths) {
        const key = path.join('/') as keyof typeof expectedMethods
        const [method, file] = _parseMethod(path)
        expect(method).toEqual(expectedMethods[key].method)
        expect(file).toEqual(expectedMethods[key].file)
      }
    })
    it('_parsePathParams() & _convertToExpressRoute()', () => {
      const paths = expectedPaths
      for (const path of paths) {
        const key = path.join('/') as keyof typeof expectedMethods
        const { file, routeExpress } = expectedMethods[key]

        path[path.length - 1] = file
        const clearPath: PathPart[] = []

        for (const part of path) {
          const [name, partType] = _parsePathParams(part)
          clearPath.push({
            name,
            partType,
          })
        }
        let _routeExpress = _convertToExpressRoute(clearPath)
        if (_routeExpress[_routeExpress.length - 1] === '/')
          _routeExpress = _routeExpress.slice(0, -1)

        expect(_routeExpress).toBe(routeExpress)
      }
    })
  })
})
