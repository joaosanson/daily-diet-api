import { FastifyInstance } from 'fastify'
import { auth } from '../config/auth'
import { z } from 'zod'
import { knex } from '../database'
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'

export async function sessionRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = createBodySchema.parse(request.body)

    const user = await knex('users').select().where({ email }).first()

    if (!user) {
      throw Error('Email and/or password incorrect.')
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw Error('Email and/or password incorrect.')
    }

    const { secret, expiresIn } = auth.jwt
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    })

    reply.send({ user, token })
  })
}
