# Vort backend framework

Flexible full type-safe backend framework based on express

## Get start

```bash
yarn add vort
```

## Config

```typescript
export const config = {
  routes: path.join(__dirname, './routes'),
}
```

## App

```typescript
import { Vort } from 'vort'
import config from './vort.config'

const app = new Vort(config)
app.listen(3000, () => {
  console.log('listen')
})
```

## Routes

Vort has file base system routing

Folder structure

```text
routes
  - hello/
    - world.get.ts
  - here
    - another
      - get.ts
      - post.ts
  - user/
    - [user]/
      - create.post.ts
```

with such folder structure, will generate express routings:

```text
GET /hello/world
POST /user/:user/create
GET /here/another
POST /here/another
```

## Typings

To use define handler use `handler` function

```typescript
import { handler, HTTPError } from 'vort'
import { z } from 'zod'

export default handler()
  .query(z.object({ name: z.string() })) // type safe query parameters
  .params(z.object({ user: z.string() })) // type safe path parameters
  .body(z.object({ hello: z.string() })) // type safe body parameters
  .output(z.string())
  .callback(async (req, res) => {
    const { name } = req.query
    //      ^ string
    const { user } = req.params
    //      ^ string
    const { hello } = req.body
    //      ^ string

    if (isError) throw new HTTPError('FORBIDDEN', 'Only admin function')
    res.send('Hello') // type checking

    res.send(3) // Error (not a string)
  })
```

## Middlewares

To define middleware use `defineMiddleware` function

```typescript
import { defineMiddleware } from 'vort'
import { z } from 'zod'

const isAdmin = defineMiddleware({
  locals: z.object({
    isAdmin: z.boolean(),
  }),
  middleware(req, res, next) {
    const { userId } = req.query
    res.locals.isAdmin = userId === '1'
    //          ^ boolean
    next()
  },
})
```

Now `isAdmin` can be used in handler definition

```typescript
import { handler, HTTPError } from 'vort'
import { isAdmin } from '@/middlewares'

export default handler()
  .use(isAdmin)
  .query(z.object({ userId: z.string }))
  .callback((req, res) => {
    if (!res.locals.isAdmin) {
      //              ^ boolean
      throw new HTTPError('FORBIDDEN', 'User is not admin')
    }
  })
```
