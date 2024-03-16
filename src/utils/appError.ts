import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import * as z from 'zod'
import { fromZodError } from 'zod-validation-error'

export const errorHandler = (
  error: FastifyError | z.ZodError,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (error instanceof z.ZodError) {
    const validationError = fromZodError(error)

    switch (validationError.name) {
      case 'ZodValidationError':
        reply.status(400).send(validationError.toString())
        break

      default:
        reply.status(500).send(validationError.toString())
        break
    }
  } else {
    switch (error.message) {
      case 'Multipart avatar not informed.':
      case 'Password incorrect.':
      case 'Old password must be informed to change current password.':
        error.statusCode = 400
        reply.status(error.statusCode).send(error)
        break

      case 'JWT Token not informed.':
      case 'Invalid JWT Token.':
      case 'Email and/or password incorrect.':
        error.statusCode = 401
        reply.status(error.statusCode).send(error)
        break

      case 'One of the fields must be defined.':
      case 'Filename not provided.':
      case 'Tag not found.':
      case 'Note not found.':
      case 'User not found.':
        error.statusCode = 404
        reply.status(error.statusCode).send(error)
        break

      case 'Email already in use.':
        error.statusCode = 409
        reply.status(error.statusCode).send(error)
        break

      default:
        reply.status(500).send(error)
        break
    }
  }
}
