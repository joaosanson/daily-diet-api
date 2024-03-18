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

  app.get('/:id', async (request: CustomFastifyRequest, reply) => {
    const getUserSchema = z.object({
      id: z.string().uuid(),
    })

    const getQueryParams = z.object({
      id: z.string().uuid(),
    })

    const { id: userId } = getUserSchema.parse(request.user)

    const { id } = getQueryParams.parse(request.params)

    const meal = await knex('meals').select().where({ user_id: userId, id })

    if (meal.length === 0) {
      throw Error('Note not found.')
    }

    reply.send(meal)
  })

  app.get('/metrics', async (request: CustomFastifyRequest, reply) => {
    const getUserSchema = z.object({
      id: z.string().uuid(),
    })

    const { id: userId } = getUserSchema.parse(request.user)

    const meals = await knex('meals').select().where({ user_id: userId })

    if (meals.length === 0) {
      throw Error('Meals not found.')
    }

    // Sort meals based on date
    const sortedMeals = meals.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateA - dateB
    })

    const mealsQuantity = sortedMeals.length

    let mealsQuantityOnDiet = 0
    let mealsQuantityNotOnDiet = 0

    for (const meal of sortedMeals) {
      if (meal.isOnDiet) {
        mealsQuantityOnDiet++
      } else {
        mealsQuantityNotOnDiet++
      }
    }

    reply.send({
      total: mealsQuantity,
      onDiet: mealsQuantityOnDiet,
      notOnDiet: mealsQuantityNotOnDiet,
    })
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

  app.delete('/:id', async (request: CustomFastifyRequest, reply) => {
    const getUserSchema = z.object({
      id: z.string().uuid(),
    })

    const getQueryParams = z.object({
      id: z.string().uuid(),
    })

    const { id: userId } = getUserSchema.parse(request.user)

    const { id } = getQueryParams.parse(request.params)

    const meal = await knex('meals').select().where({ user_id: userId, id })

    if (meal.length === 0) {
      throw Error('Note not found.')
    }

    await knex('meals').delete().where({ id })

    reply.status(204).send('Note deleted successfully.')
  })
}
