import { defineHandler, defineMiddleware, HTTPError } from 'vort'
import { z } from 'zod'

const onlyAdmin = defineMiddleware()
  .locals(
    z.object({
      isAdmin: z.boolean(),
    })
  )
  .query(z.object({ name: z.string() }))
  .middleware((req, res, next) => {
    const { name } = req.query
    res.locals.isAdmin = 1
    if (name !== 'admin') throw new HTTPError('FORBIDDEN', 'Not a admin')
    next()
  })

export default defineHandler()
  .description('Let to post another')
  .use(onlyAdmin)
  .query(z.object({ name: z.string(), hello: z.string() }))
  .output(z.string())
  .handler(async (req, res) => {
    res.send(req.query.name + 'POST')
  })
