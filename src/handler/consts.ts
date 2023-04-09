export const httpError = {
  PARSE_ERROR: -32700,
  BAD_REQUEST: 400, // 400
  INTERNAL_SERVER_ERROR: -32603,
  UNAUTHORIZED: 401, // 401
  FORBIDDEN: 403, // 403
  NOT_FOUND: 404, // 404
  METHOD_NOT_SUPPORTED: 405, // 405
  TIMEOUT: 408, // 408
  CONFLICT: 409, // 409
  PRECONDITION_FAILED: 412, // 412
  PAYLOAD_TOO_LARGE: 413, // 413
  UNPROCESSABLE_CONTENT: 422, // 422
  TOO_MANY_REQUESTS: 429, // 429
  CLIENT_CLOSED_REQUEST: 499, // 499
} as const
