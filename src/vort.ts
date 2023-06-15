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
  handlers: Handler[] = []

  openAPI: any = {}

  constructor(public config: VortConfig) {
    super()

    this.appExpress = express()
  }

  prepare() {
    this.handlers = buildRoutes(this.config, this.appExpress)
    this.openAPI = buildOpenAPI(this)

    if (this.config.openApiFile) {
      console.log('Saving OpenAPI file', this.config.openApiFile, '...')
      fsNode.writeFileSync(
        this.config.openApiFile,
        JSON.stringify(this.openAPI)
      )
    }
  }

  listen(port_: number, callback?: () => void) {
    this.prepare()

    if (this.config.swagger) {
      const { route = '/swagger', port = 3000 } = this.config.swagger

      if (port === port_) {
        this.appExpress.use(
          route,
          swaggerUi.serve,
          swaggerUi.setup(this.openAPI)
        )
      } else {
        express()
          .use(route, swaggerUi.serve, swaggerUi.setup(this.openAPI))
          .listen(port, () => {})
      }
    }

    this.appExpress.listen(port_, callback)
  }

  use(...handlers: core.RequestHandler[]) {
    this.appExpress.use(...handlers)
    return this
  }
}
