import { handler } from 'vort'
import { z } from 'zod'

export default handler()
  .output(z.string())
  .callback((_, res) => {
    res.send('hello')
  })
