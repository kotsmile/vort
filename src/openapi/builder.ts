import type { Vort } from '@/vort'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

function contentJSON(schema: any) {
  return {
    content: {
      'application/json': {
        schema,
      },
    },
  }
}

const OPENAPI_VERSION = '3.0.0'

function expressToSwagger(route: string) {
  const regexp = /:([\w\d]+)/g
  return route.replace(regexp, `{$1}`)
}

export function buildOpenAPI(vortApp: Vort) {
  const api: any = {}

  api.openapi = OPENAPI_VERSION

  api.info = {
    title: vortApp.title_,
    summery: vortApp.summery_,
    description: vortApp.description_,
    version: vortApp.version_,
    license: vortApp.license_,
    contact: vortApp.contact_,
    termsOfService: vortApp.termsOfService_,
  }

  api.paths = {}

  for (const handler of vortApp.handlers) {
    const querySchema = zodToJsonSchema(
      handler.handlerRoute.querySchema ?? z.any(),
      'query'
    ).definitions?.query as any
    const paramsSchema = zodToJsonSchema(
      handler.handlerRoute.paramsSchema ?? z.any(),
      'params'
    ).definitions?.params as any

    if (!api.paths[expressToSwagger(handler.routeExpress)])
      api.paths[expressToSwagger(handler.routeExpress)] = {}

    api.paths[expressToSwagger(handler.routeExpress)][handler.httpMethod] = {
      description: handler.handlerRoute.description_,

      parameters: [
        ...Object.entries(querySchema.properties ?? {}).map(([k, v]) => {
          return {
            name: k,
            in: 'query',
            schema: v,
          }
        }),
        ...Object.entries(paramsSchema.properties ?? {}).map(([k, v]) => {
          return {
            name: k,
            in: 'path',
            schema: v,
          }
        }),
      ],

      responses: {
        '200': {
          ...contentJSON(
            zodToJsonSchema(
              handler.handlerRoute.outputSchema ?? z.any(),
              'response'
            ).definitions?.response ?? {}
          ),
          description: handler.handlerRoute.description_,
        },
      },
    }

    if (handler.handlerRoute.bodySchema) {
      api.paths[expressToSwagger(handler.routeExpress)][
        handler.httpMethod
      ].requestBody = contentJSON(
        zodToJsonSchema(handler.handlerRoute.bodySchema ?? z.any(), 'body')
          .definitions?.body ?? {}
      )
    }
  }

  return api
}
