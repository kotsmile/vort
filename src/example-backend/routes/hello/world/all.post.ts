import { defineHandler } from 'vort'
import { z } from 'zod'

export default defineHandler()
  .description('Let to all worlds')
  .output(z.string())
  .handler((_, res) => {
    res.send('hello')
  })
