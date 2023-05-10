import { defineHandler, defineMiddleware, HTTPError } from 'vort'
import { z } from 'zod'

const onlyAdmin = defineMiddleware()
  .query(z.object({ name: z.string() }))
  .locals(
    z.object({
      isAdmin: z.boolean(),
    })
  )
  .middleware((req, res, next) => {
    const { name } = req.query
    res.locals.isAdmin = true
    if (name !== 'admin') throw new HTTPError('FORBIDDEN', 'Not a admin')
    next()
  })

export default defineHandler()
  .description('Let to post another')
  .use(onlyAdmin)
  .query(z.object({ name: z.string(), hello: z.string() }))
  .output(z.string())
  .handler(async (_, res) => {
    res.send(1 as any)
    // res.send(req.query.hello + 'POST')
  })
