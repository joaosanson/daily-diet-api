import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const user = await knex('users').select()

    if (user.length === 0) {
      throw new Error('User not found.')
    }

    reply.send(user)
  })
}
