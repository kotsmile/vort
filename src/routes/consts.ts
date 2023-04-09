export const httpMethods = [
  'all',
  'get',
  'post',
  'delete',
  'put',
  'patch',
  'options',
  'head',
] as const

export const partTypes = ['simple', 'param', 'multi'] as const

export type HTTPMethod = typeof httpMethods[number]
export type PartType = typeof partTypes[number]
