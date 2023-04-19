# Vort backend framework

Flexible full type-safe backend framework based on express

## TODO

- [ ] tests
- [ ] add example requests and responses
- [x] response body `zod` checking
- [x] OpenAPI params (query, path, body)

## Get started

```bash
yarn add vort
```

## Config

```typescript
export const config = {
  routes: path.join(__dirname, './routes'), // routes folder
  swaggerRoute: '/swagger', // route to render swagger
}
```

## App

```typescript
import { Vort } from 'vort'
import config from './vort.config'

const app = new Vort(config)
app
  .title('Best app') // title for openapi
  .description('App for testing') // description for openapi
  .version('1.0.0') // version for openapi
  .listen(3000, () => {
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
    - all-methods
      - all.ts
    - all-methods
      - with-name.all.ts
  - user/
    - [user]/
      - create.post.ts
```

with such folder structure, will generate express routings:

```text
GET     /hello/world
GET     /here/another
POST    /here/another

GET     /here/all-methods
POST    /here/all-methods
PUT     /here/all-methods
PATCH   /here/all-methods
DELETE  /here/all-methods
HEAD    /here/all-methods
OPTIONS /here/all-methods

GET     /here/all-methods/with-name
POST    /here/all-methods/with-name
PUT     /here/all-methods/with-name
PATCH   /here/all-methods/with-name
DELETE  /here/all-methods/with-name
HEAD    /here/all-methods/with-name
OPTIONS /here/all-methods/with-name

POST    /user/:user/create
```

## Typings

To use define handler use `handler` function

```typescript
import { defineHandler, HTTPError } from 'vort'
import { z } from 'zod'

export default defineHandler()
  .description('Best handler ever') // description of handler (for openapi generator)
  .query(z.object({ name: z.string() })) // type safe query parameters
  .params(z.object({ user: z.string() })) // type safe path parameters
  .body(z.object({ hello: z.string() })) // type safe body parameters
  .output(z.string())
  .handler(async (req, res) => {
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

const isAdmin = defineMiddleware()
  .locals(
    z.object({
      isAdmin: z.boolean(),
    })
  )
  .middleware((req, res, next) => {
    const { userId } = req.query
    res.locals.isAdmin = userId === '1'
    //          ^ boolean
    next()
  })
```

Now `isAdmin` can be used in handler definition

```typescript
import { defineHandler, HTTPError } from 'vort'
import { isAdmin } from '@/middlewares'

export default defineHandler()
  .use(isAdmin)
  .query(z.object({ userId: z.string }))
  .callback((req, res) => {
    if (!res.locals.isAdmin) {
      //              ^ boolean
      throw new HTTPError('FORBIDDEN', 'User is not admin')
    }
  })
```

## Swagger doc support

Add [Swagger](https://swagger.io/) doc host on `/swagger` generated by zod schemas (Based on [OpenAPI](https://www.openapis.org/) 3.0.0)
