import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'
import { sessionRoutes } from './routes/sessions'

export const app = fastify()

app.register(usersRoutes, {
  prefix: 'users',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})

app.register(sessionRoutes, {
  prefix: 'sessions',
})
