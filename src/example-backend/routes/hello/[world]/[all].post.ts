import { defineHandler } from 'vort'
import { z } from 'zod'

export default defineHandler()
  .description('Let to all worlds')
  .query(z.object({ a: z.string(), b: z.string().optional() }))
  .params(z.object({ world: z.string(), all: z.string() }))
  .output(z.string())
  .handler((req, res) => {
    res.send('hello, ' + req.params.world + req.params.all)
  })
