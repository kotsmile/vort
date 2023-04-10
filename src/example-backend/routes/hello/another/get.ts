import { handler } from 'vort'
import { z } from 'zod'

export default handler()
  .query(z.object({ name: z.string() }))
  .output(z.string())
  .callback(async (req, res) => {
    res.send(req.query.name)
  })
