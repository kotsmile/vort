import { defineHandler } from 'vort'
import { z } from 'zod'

export default defineHandler()
  .output(z.string())
  .modifier(async (_req, _res, _handler) => {})
  .handler(async (_, _res) => {
    // res.send('helo')
    throw new Error('hello')
  })
