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

export function buildOpenAPI(vortApp: Vort) {
  const api: any = {}

  api.openapi = OPENAPI_VERSION

  api.info = {
    title: vortApp.title_,
    description: vortApp.description_,
    version: vortApp.version_,
  }

  api.paths = {}

  for (const handler of vortApp.handlers) {
    api.paths[handler.routeExpress] = {
      [handler.httpMethod]: {
        description: handler.handlerRoute.description_,

        requestBody: contentJSON(
          zodToJsonSchema(handler.handlerRoute.bodySchema ?? z.any(), 'body')
            .definitions?.body ?? {}
        ),

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
      },
    }
  }

  return api
}
