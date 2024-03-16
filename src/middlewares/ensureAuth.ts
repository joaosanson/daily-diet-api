import { verify } from 'jsonwebtoken'
import { z } from 'zod'
import { auth } from '../config/auth'
import { CustomFastifyRequest } from '../@types/fastify'

const jwtPayloadSchema = z.object({
  sub: z.string().uuid(),
})

export async function ensureAuth(request: CustomFastifyRequest) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw Error('JWT Token not informed.')
  }

  const token = authHeader.split(' ')['1']

  try {
    const { sub: userId } = jwtPayloadSchema.parse(
      verify(token, auth.jwt.secret),
    )

    request.user = {
      id: String(userId),
    }
  } catch (error) {
    console.log(error)

    throw Error('Invalid JWT Token.')
  }
}
