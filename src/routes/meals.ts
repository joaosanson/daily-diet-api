import { FastifyInstance } from 'fastify'
import { ensureAuth } from '../middlewares/ensureAuth'
import { CustomFastifyRequest } from '../@types/fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', ensureAuth)

  app.post('/', async (request: CustomFastifyRequest, reply) => {
    const getMealsQuerySchema = z.object({
      name: z.string(),
      description: z.string(),
      dateTime: z.string().datetime(),
      isOnDiet: z.boolean(),
    })

    const getUserSchema = z.object({
      id: z.string().uuid(),
    })

    const { id: userId } = getUserSchema.parse(request.user)

    const { name, description, dateTime, isOnDiet } = getMealsQuerySchema.parse(
      request.query,
    )

    const mealsId = crypto.randomUUID()

    await knex('meals').insert({
      id: mealsId,
      user_id: userId,
      name,
      description,
      date: dateTime,
      isOnDiet,
    })
    reply.send()
  })
}
