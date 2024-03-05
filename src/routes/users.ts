import { FastifyInstance } from 'fastify'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    reply.send()
  })
}
