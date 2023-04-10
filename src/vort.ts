import express from 'express'
import type { Express } from 'express'
import type * as core from 'express-serve-static-core'

import type { VortConfig } from '@/types'

import { buildRoutes } from '@/routes'
import type { Handler } from '@/routes/types'

export class Vort {
  appExpress: Express
  handlers: Handler[]
  desc: string = ''

  constructor(public config: VortConfig) {
    this.appExpress = express()

    /// init routes
    this.handlers = buildRoutes(config, this.appExpress)
  }

  listen(port: number, callback?: () => void) {
    this.appExpress.listen(port, callback)
  }

  use(...handlers: core.RequestHandler[]) {
    this.appExpress.use(...handlers)
    return this
  }

  description(desc: string) {
    this.desc = desc
    return this
  }
}
