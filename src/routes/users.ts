import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import crypto from 'node:crypto'
import { hash } from 'bcrypt'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const user = await knex('users').select()

    if (user.length === 0) {
      throw new Error('User not found!')
    }

    reply.send(user)
  })

  app.post('/', async (request, reply) => {
    const createUsersBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { name, email, password } = createUsersBodySchema.parse(request.body)
    const hashedPassword = await hash(password, 8)
    const user = await knex('users').select().where({ email })

    if (user.length !== 0) {
      throw new Error('Email already in use.')
    }

    await knex('users').insert({
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
    })

    reply.status(201).send({ message: 'User created successfully!' })
  })
}
