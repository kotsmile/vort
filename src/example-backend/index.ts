import path from 'path'

import { Vort } from 'vort'

const app = new Vort({
  routes: path.join(__dirname, './routes'),
  swaggerRoute: '/swagger',
  openApiFile: path.join(__dirname, 'openapi.json'),
})

app
  .title('Title of test backend')
  .description('Example backend for vort framework, backend')
  .version('1.1.1')
  .listen(3000, () => {
    console.log('Listen on', 3000, 'port')
  })
