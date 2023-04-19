import express, { type Express } from 'express'
import type * as core from 'express-serve-static-core'
import swaggerUi from 'swagger-ui-express'

import fsNode from 'fs'

import type { VortConfig } from '@/types'
import { buildRoutes, type Handler } from '@/routes'
import { buildOpenAPI } from '@/openapi/builder'
import { OpenAPIDescription } from '@/openapi/objects'

export class Vort extends OpenAPIDescription {
  appExpress: Express
  handlers: Handler[]

  openAPI: any = {}

  constructor(public config: VortConfig) {
    super()

    this.appExpress = express()
    this.handlers = buildRoutes(config, this.appExpress)
  }

  start() {
    this.openAPI = buildOpenAPI(this)

    if (this.config.openApiFile) {
      // console.log('Saving OpenAPI file', this.config.openApiFile, '...')
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
}
