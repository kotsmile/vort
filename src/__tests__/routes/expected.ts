export const expectedPaths = [
  ['[with-params]', '[with-all]', '[with-direct-all]', 'all.ts'],
  ['[with-params]', '[with-all]', 'all.all.ts'],
  ['[with-params]', '[with-direct]', 'delete.ts'],
  ['[with-params]', '[with-direct]', 'get.ts'],
  ['[with-params]', '[with-direct]', 'head.ts'],
  ['[with-params]', '[with-direct]', 'options.ts'],
  ['[with-params]', '[with-direct]', 'patch.ts'],
  ['[with-params]', '[with-direct]', 'post.ts'],
  ['[with-params]', '[with-direct]', 'put.ts'],
  ['[with-params]', 'delete.delete.ts'],
  ['[with-params]', 'get.get.ts'],
  ['[with-params]', 'head.head.ts'],
  ['[with-params]', 'options.options.ts'],
  ['[with-params]', 'patch.patch.ts'],
  ['[with-params]', 'post.post.ts'],
  ['[with-params]', 'put.put.ts'],
  ['without-params', 'delete.delete.ts'],
  ['without-params', 'get.get.ts'],
  ['without-params', 'head.head.ts'],
  ['without-params', 'options.options.ts'],
  ['without-params', 'patch.patch.ts'],
  ['without-params', 'post.post.ts'],
  ['without-params', 'put.put.ts'],
  ['without-params', 'with-all', 'all.all.ts'],
  ['without-params', 'with-all', 'with-direct-all', 'all.ts'],
  ['without-params', 'with-direct', 'delete.ts'],
  ['without-params', 'with-direct', 'get.ts'],
  ['without-params', 'with-direct', 'head.ts'],
  ['without-params', 'with-direct', 'options.ts'],
  ['without-params', 'with-direct', 'patch.ts'],
  ['without-params', 'with-direct', 'post.ts'],
  ['without-params', 'with-direct', 'put.ts'],
]

export const expectedMethods = {
  '[with-params]/[with-all]/[with-direct-all]/all.ts': {
    method: 'all',
    routeExpress: '/:with-params/:with-all/:with-direct-all',
    file: '',
  },
  '[with-params]/[with-all]/all.all.ts': {
    method: 'all',
    routeExpress: '/:with-params/:with-all/all',
    file: 'all',
  },
  '[with-params]/[with-direct]/delete.ts': {
    method: 'delete',
    routeExpress: '/:with-params/:with-direct',
    file: '',
  },
  '[with-params]/[with-direct]/get.ts': {
    method: 'get',
    routeExpress: '/:with-params/:with-direct',
    file: '',
  },
  '[with-params]/[with-direct]/head.ts': {
    method: 'head',
    routeExpress: '/:with-params/:with-direct',
    file: '',
  },
  '[with-params]/[with-direct]/options.ts': {
    method: 'options',
    routeExpress: '/:with-params/:with-direct',
    file: '',
  },
  '[with-params]/[with-direct]/patch.ts': {
    method: 'patch',
    routeExpress: '/:with-params/:with-direct',
    file: '',
  },
  '[with-params]/[with-direct]/post.ts': {
    method: 'post',
    routeExpress: '/:with-params/:with-direct',
    file: '',
  },
  '[with-params]/[with-direct]/put.ts': {
    method: 'put',
    routeExpress: '/:with-params/:with-direct',
    file: '',
  },
  '[with-params]/delete.delete.ts': {
    method: 'delete',
    routeExpress: '/:with-params/delete',
    file: 'delete',
  },
  '[with-params]/get.get.ts': {
    method: 'get',
    routeExpress: '/:with-params/get',
    file: 'get',
  },
  '[with-params]/head.head.ts': {
    method: 'head',
    routeExpress: '/:with-params/head',
    file: 'head',
  },
  '[with-params]/options.options.ts': {
    method: 'options',
    routeExpress: '/:with-params/options',
    file: 'options',
  },
  '[with-params]/patch.patch.ts': {
    method: 'patch',
    routeExpress: '/:with-params/patch',
    file: 'patch',
  },
  '[with-params]/post.post.ts': {
    method: 'post',
    routeExpress: '/:with-params/post',
    file: 'post',
  },
  '[with-params]/put.put.ts': {
    method: 'put',
    routeExpress: '/:with-params/put',
    file: 'put',
  },
  'without-params/delete.delete.ts': {
    method: 'delete',
    routeExpress: '/without-params/delete',
    file: 'delete',
  },
  'without-params/get.get.ts': {
    method: 'get',
    routeExpress: '/without-params/get',
    file: 'get',
  },
  'without-params/head.head.ts': {
    method: 'head',
    routeExpress: '/without-params/head',
    file: 'head',
  },
  'without-params/options.options.ts': {
    method: 'options',
    routeExpress: '/without-params/options',
    file: 'options',
  },
  'without-params/patch.patch.ts': {
    method: 'patch',
    routeExpress: '/without-params/patch',
    file: 'patch',
  },
  'without-params/post.post.ts': {
    method: 'post',
    routeExpress: '/without-params/post',
    file: 'post',
  },
  'without-params/put.put.ts': {
    method: 'put',
    routeExpress: '/without-params/put',
    file: 'put',
  },
  'without-params/with-all/all.all.ts': {
    method: 'all',
    routeExpress: '/without-params/with-all/all',
    file: 'all',
  },
  'without-params/with-all/with-direct-all/all.ts': {
    method: 'all',
    routeExpress: '/without-params/with-all/with-direct-all',
    file: '',
  },
  'without-params/with-direct/delete.ts': {
    method: 'delete',
    routeExpress: '/without-params/with-direct',
    file: '',
  },
  'without-params/with-direct/get.ts': {
    method: 'get',
    routeExpress: '/without-params/with-direct',
    file: '',
  },
  'without-params/with-direct/options.ts': {
    method: 'options',
    routeExpress: '/without-params/with-direct',
    file: '',
  },
  'without-params/with-direct/patch.ts': {
    method: 'patch',
    routeExpress: '/without-params/with-direct',
    file: '',
  },
  'without-params/with-direct/head.ts': {
    method: 'head',
    routeExpress: '/without-params/with-direct',
    file: '',
  },
  'without-params/with-direct/post.ts': {
    method: 'post',
    routeExpress: '/without-params/with-direct',
    file: '',
  },
  'without-params/with-direct/put.ts': {
    method: 'put',
    routeExpress: '/without-params/with-direct',
    file: '',
  },
}
