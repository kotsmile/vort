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

export function buildOpenAPI(vortApp: Vort) {
  const api: any = {}

  api.openapi = '3.0.0'
  api.info = {
    version: '1.0.0',
    title: 'Backend Vort',
    description: vortApp.desc,
  }

  api.paths = {}

  for (const handler of vortApp.handlers) {
    api.paths[handler.routeExpress] = {
      [handler.httpMethod]: {
        description: handler.handlerRoute.desc,
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
            description: handler.handlerRoute.desc,
          },
        },
      },
    }
  }

  return api
}
