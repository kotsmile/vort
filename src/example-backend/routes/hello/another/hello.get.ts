import { defineHandler } from 'vort'
import { z } from 'zod'

export default defineHandler()
  .output(z.string())
  .modifier(async (_req, _res, _handler) => {
    try {
      await _handler()
    } catch (e) {
      _res.send('catch')
    }
  })
  .handler(async (_, _res) => {
    await new Promise((_, rej) => setTimeout(() => rej('some'), 1000))
  })
