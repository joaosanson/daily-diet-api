import { FastifyInstance } from 'fastify'
import { ensureAuth } from '../middlewares/ensureAuth'
import { CustomFastifyRequest } from '../@types/fastify'
import crypto from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', ensureAuth)

  app.get('/', async (request: CustomFastifyRequest, reply) => {
    const getUserSchema = z.object({
      id: z.string().uuid(),
    })

    const { id: userId } = getUserSchema.parse(request.user)

    const meals = await knex('meals').select().where({ user_id: userId })

    reply.send(meals)
  })

  app.post('/', async (request: CustomFastifyRequest, reply) => {
    const getMealsSchema = z.object({
      name: z.string(),
      description: z.string(),
      dateTime: z.string().datetime(),
      isOnDiet: z.boolean(),
    })

    const getUserSchema = z.object({
      id: z.string().uuid(),
    })

    const { id: userId } = getUserSchema.parse(request.user)

    const { name, description, dateTime, isOnDiet } = getMealsSchema.parse(
      request.body,
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
