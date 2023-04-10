import { handler } from 'vort'
import { z } from 'zod'

export default handler()
  .description('Let to get another')
  .query(z.object({ name: z.string() }))
  .output(z.string())
  .callback(async (req, res) => {
    res.send(req.query.name)
  })
