import { httpMethods, partTypes } from '@/routes/consts'

describe('routes', () => {
  describe('consts', () => {
    it('should be correct httpMethods', () => {
      expect(httpMethods.length).toBe(8)

      const httpMethods_ = [
        'all',
        'get',
        'post',
        'delete',
        'put',
        'patch',
        'options',
        'head',
      ]

      for (const httpMethod of httpMethods)
        expect(httpMethods_.indexOf(httpMethod)).toBeGreaterThanOrEqual(0)
    })
    it('should be correct partTypes', () => {
      const partTypes_ = ['simple', 'param', 'multi']
      for (const partType of partTypes)
        expect(partTypes_.indexOf(partType)).toBeGreaterThanOrEqual(0)
    })
  })
})
