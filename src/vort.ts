import express, { type Express } from 'express'
import type * as core from 'express-serve-static-core'
import swaggerUi from 'swagger-ui-express'

import fsNode from 'fs'

import type { VortConfig } from '@/types'
import { buildRoutes, type Handler } from '@/routes'
import { buildOpenAPI } from '@/openapi/builder'
import { z } from 'zod'

export class Vort {
  appExpress: Express
  handlers: Handler[]

  openAPI: any = {}

  description_: string = ''
  title_: string = ''
  version_: string = '0.0.0'

  constructor(public config: VortConfig) {
    this.appExpress = express()
    /// init routes
    this.handlers = buildRoutes(config, this.appExpress)
  }

  start() {
    this.openAPI = buildOpenAPI(this)

    if (this.config.openApiFile) {
      console.log('Saving OpenAPI file', this.config.openApiFile, '...')

      fsNode.writeFileSync(
        this.config.openApiFile,
        JSON.stringify(this.openAPI)
      )
    }

    if (this.config.swaggerRoute)
      this.appExpress.use(
        this.config.swaggerRoute,
        swaggerUi.serve,
        swaggerUi.setup(this.openAPI)
      )
  }

  listen(port: number, callback?: () => void) {
    this.start()
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
  version(version_: string) {
    this.version_ = version_
    return this
  }
}
