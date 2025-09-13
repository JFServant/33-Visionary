import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { nanoid } from '../nanoid'

export const customers = pgTable('customers', {
  _id: serial('_id').primaryKey(),
  id: text('id').notNull().unique().$defaultFn(nanoid),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  username: text('username').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
