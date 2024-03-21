import {
  describe,
  beforeAll,
  afterAll,
  beforeEach,
  it,
  afterEach,
} from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'

beforeAll(async () => {
  await app.ready()
})

beforeEach(() => {
  execSync('npm run knex migrate:latest')
})

afterEach(() => {
  execSync('npm run knex migrate:rollback --all')
})

afterAll(async () => {
  await app.close()
})

describe('Users route', () => {
  it('should be able to create e new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'john',
        email: 'johndoe@email.com',
        password: 'john123',
      })
      .expect(201)
  })
})
