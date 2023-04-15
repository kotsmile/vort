import path from 'path'

import { Vort } from 'vort'

const app = new Vort({
  routes: path.join(__dirname, './routes'),
  swaggerRoute: '/swagger',
})

app
  .title('Test backend')
  .description('Example backend for vort framework, backend')
  .version('1.0.0')
  .listen(3000, () => {
    console.log('Listen on', 3000, 'port')
  })
