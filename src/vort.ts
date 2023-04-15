import express from 'express'
import type { Express } from 'express'
import type * as core from 'express-serve-static-core'

import type { VortConfig } from '@/types'

import { buildRoutes } from '@/routes'
import type { Handler } from '@/routes/types'
import { buildOpenAPI } from './openapi/builder'

// import { initialize } from 'express-openapi'
import swaggerUi from 'swagger-ui-express'

export class Vort {
  appExpress: Express
  handlers: Handler[]
  description_: string = ''
  title_: string = ''
  openAPI: any = {}

  constructor(public config: VortConfig) {
    this.appExpress = express()

    /// init routes
    this.handlers = buildRoutes(config, this.appExpress)
    this.openAPI = buildOpenAPI(this)

    if (config.swaggerRoute)
      this.appExpress.use(
        config.swaggerRoute,
        swaggerUi.serve,
        swaggerUi.setup(this.openAPI)
      )
  }

  listen(port: number, callback?: () => void) {
    this.appExpress.listen(port, callback)
  }

  use(...handlers: core.RequestHandler[]) {
    this.appExpress.use(...handlers)
    return this
  }

  description(description_: string) {
    this.description_ = description_
    return this
  }
  title(title_: string) {
    this.title_ = title_
    return this
  }
}
