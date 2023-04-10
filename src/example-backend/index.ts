import path from 'path'

import { Vort } from 'vort'

const app = new Vort({
  routes: path.join(__dirname, './routes'),
})

app.listen(3000, () => {
  console.log('Listen on', 3000, 'port')
})
