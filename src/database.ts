import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  pool: {
    // @ts-expect-error no use
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb)
    },
  },
  migrations: {
    extension: 'ts',
    directory: './src/database/migrations',
  },
}

export const knex = setupKnex(config)
