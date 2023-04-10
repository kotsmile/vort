import { handler } from 'vort'
import { z } from 'zod'

export default handler()
  .description('Let to all worlds')
  .output(z.string())
  .callback((_, res) => {
    res.send('hello')
  })
