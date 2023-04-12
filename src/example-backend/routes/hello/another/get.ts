import { defineHandler } from 'vort'
import { z } from 'zod'

export default defineHandler()
  .description('Let to get another')
  .query(z.object({ name: z.string() }))
  .output(z.string())
  .handler(async (req, res) => {
    res.send(req.query.name)
  })
