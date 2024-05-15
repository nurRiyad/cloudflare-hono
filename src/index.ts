import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { Hono } from 'hono'
import { users } from './schema'

export type Env = {
  DATABASE_URL: string
}

const app = new Hono<{Bindings: Env}>()

app.get('/', async(c) => {
  const sql = neon(c.env.DATABASE_URL)
  const db = drizzle(sql)

  const allUser = await db.select().from(users) || []
  return c.json(allUser)
})

export default app
