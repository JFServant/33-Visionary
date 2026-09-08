import { relations } from 'drizzle-orm'
import { index, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { nanoid } from '../nanoid'
import { customers } from './customer'
import { predictions } from './prediction'

export const images = pgTable(
  'images',
  {
    _id: serial('_id').primaryKey(),
    id: text('id').notNull().unique().$defaultFn(nanoid),
    originalName: text('original_name').notNull(),
    internalName: text('internal_name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    customerID: text('customer_id')
      .notNull()
      .references(() => customers.id),
  },
  (table) => [index('customer_id__id_idx').on(table.customerID, table._id)]
)

export const imagesRelations = relations(images, ({ many }) => ({
  predictions: many(predictions),
}))
