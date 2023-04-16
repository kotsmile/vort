import { _buildPaths, _parseMethod } from '@/routes'
import pathNode from 'path'

import { expectedPaths, expectedMethods } from './expected'

const TEST_ROUTES_PATH = pathNode.join(__dirname, 'test-routes')

describe('Routes', () => {
  it('_buildPaths function', () => {
    const paths = _buildPaths(TEST_ROUTES_PATH)
    expect(paths).toEqual(expectedPaths)
  })
  it('_parseMethod', () => {
    const paths = _buildPaths(TEST_ROUTES_PATH)
    for (const path of paths) {
      const key = path.join('/') as keyof typeof expectedMethods
      const [method, route] = _parseMethod(path)
      expect(method).toEqual(expectedMethods[key].method)
      expect(route).toEqual(expectedMethods[key].route)
    }
  })
})
