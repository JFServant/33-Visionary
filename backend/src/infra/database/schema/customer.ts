import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { nanoid } from '../utils/nanoid'

export const customers = pgTable('customers', {
  _id: serial('_id').primaryKey(),
  id: varchar('id', { length: 10 }).notNull().unique().$defaultFn(nanoid),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  username: varchar('username', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
