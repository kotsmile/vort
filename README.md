# Vort backend framework

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
routes/
    - hello/
        - world.get.ts
    - user/
        - [user]/
            - create.post.ts
```

with such folder structure, will generate express routings:

```text
GET /hello/world
POST /user/:user/create
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

    if (isError) throw new Error('FORBIDDEN', 'Only admin function')
    res.send('Hello') // type checking

    res.send(3) // Error (not a string)
  })
```
