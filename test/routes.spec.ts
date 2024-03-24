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

interface UserSchema {
  user: {
    id: string
    name: string
    email: string
    password: string
  }
  token: string
}

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

describe('Users/Session route', () => {
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

  it('should be able to log in', async () => {
    await request(app.server).post('/users').send({
      name: 'john',
      email: 'johndoe@email.com',
      password: 'john123',
    })

    await request(app.server)
      .post('/sessions')
      .send({ email: 'johndoe@email.com', password: 'john123' })
      .expect(200)
  })
})

describe('Meals routes', () => {
  it('should be able to create a meal', async () => {
    await request(app.server).post('/users').send({
      name: 'john',
      email: 'johndoe@email.com',
      password: 'john123',
    })

    const session = await request(app.server)
      .post('/sessions')
      .send({ email: 'johndoe@email.com', password: 'john123' })

    const userDataResponse: UserSchema = JSON.parse(session.text)

    const { token } = userDataResponse

    await request(app.server)
      .post('/meals')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Cachorro Quente',
        description: 'Cachorro quente com batatas fritas e molho barbecue',
        dateTime: '2022-01-10T00:00:00.000Z',
        isOnDiet: true,
      })
      .expect(204)
  })

  it('should be able to list all the meals', async () => {
    await request(app.server).post('/users').send({
      name: 'john',
      email: 'johndoe@email.com',
      password: 'john123',
    })

    const session = await request(app.server)
      .post('/sessions')
      .send({ email: 'johndoe@email.com', password: 'john123' })

    const userDataResponse: UserSchema = JSON.parse(session.text)

    const { token } = userDataResponse

    await request(app.server)
      .post('/meals')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Cachorro Quente',
        description: 'Cachorro quente com batatas fritas e molho barbecue',
        dateTime: '2022-01-10T00:00:00.000Z',
        isOnDiet: true,
      })

    await request(app.server)
      .get('/meals')
      .set('Authorization', `bearer ${token}`)
      .expect(200)
  })

  it('should be able to show one meal', async () => {
    await request(app.server).post('/users').send({
      name: 'john',
      email: 'johndoe@email.com',
      password: 'john123',
    })
    const session = await request(app.server)
      .post('/sessions')
      .send({ email: 'johndoe@email.com', password: 'john123' })

    const userDataResponse: UserSchema = JSON.parse(session.text)

    const { token } = userDataResponse

    await request(app.server)
      .post('/meals')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Cachorro Quente',
        description: 'Cachorro quente com batatas fritas e molho barbecue',
        dateTime: '2022-01-10T00:00:00.000Z',
        isOnDiet: true,
      })

    const mealData = await request(app.server)
      .get('/meals')
      .set('Authorization', `bearer ${token}`)

    const mealsResponse = mealData.text
    const [meal] = JSON.parse(mealsResponse)
    await request(app.server)
      .get(`/meals/${meal.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
  })

  it('should be able to show meals metrics', async () => {
    await request(app.server).post('/users').send({
      name: 'john',
      email: 'johndoe@email.com',
      password: 'john123',
    })

    const session = await request(app.server)
      .post('/sessions')
      .send({ email: 'johndoe@email.com', password: 'john123' })

    const userDataResponse: UserSchema = JSON.parse(session.text)

    const { token } = userDataResponse

    await request(app.server)
      .post('/meals')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Cachorro Quente',
        description: 'Cachorro quente com batatas fritas e molho barbecue',
        dateTime: '2022-01-10T00:00:00.000Z',
        isOnDiet: true,
      })

    await request(app.server)
      .get(`/meals/metrics`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
  })

  it('should be able to edit a meal', async () => {
    await request(app.server).post('/users').send({
      name: 'john',
      email: 'johndoe@email.com',
      password: 'john123',
    })

    const session = await request(app.server)
      .post('/sessions')
      .send({ email: 'johndoe@email.com', password: 'john123' })

    const userDataResponse: UserSchema = JSON.parse(session.text)

    const { token } = userDataResponse

    await request(app.server)
      .post('/meals')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Cachorro Quente',
        description: 'Cachorro quente com batatas fritas e molho barbecue',
        dateTime: '2022-01-10T00:00:00.000Z',
        isOnDiet: true,
      })

    const mealData = await request(app.server)
      .get('/meals')
      .set('Authorization', `bearer ${token}`)

    const mealsResponse = mealData.text
    const [meal] = JSON.parse(mealsResponse)
    await request(app.server)
      .put(`/meals/${meal.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Cachorro Fio',
        description: 'Teste',
        dateTime: '2024-01-10T00:00:00.000Z',
        isOnDiet: false,
      })
      .expect(201)
  })

  it('should be able to delete meals', async () => {
    await request(app.server).post('/users').send({
      name: 'john',
      email: 'johndoe@email.com',
      password: 'john123',
    })

    const session = await request(app.server)
      .post('/sessions')
      .send({ email: 'johndoe@email.com', password: 'john123' })

    const userDataResponse: UserSchema = JSON.parse(session.text)

    const { token } = userDataResponse

    await request(app.server)
      .post('/meals')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Cachorro Quente',
        description: 'Cachorro quente com batatas fritas e molho barbecue',
        dateTime: '2022-01-10T00:00:00.000Z',
        isOnDiet: true,
      })

    const mealData = await request(app.server)
      .get('/meals')
      .set('Authorization', `bearer ${token}`)

    const mealsResponse = mealData.text
    const [meal] = JSON.parse(mealsResponse)
    await request(app.server)
      .delete(`/meals/${meal.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)
  })
})
