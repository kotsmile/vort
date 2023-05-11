import { defineHandler } from 'vort'
import { z } from 'zod'

export default defineHandler()
  .output(z.string())
  .handler(async (_, res) => {
    res.send('hello')
  })
