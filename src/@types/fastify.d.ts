import { FastifyRequest } from 'fastify'

export interface CustomFastifyRequest extends FastifyRequest {
  user?: {
    id: string
  }
}
