import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { nanoid } from '../../../00-global/nanoid'
import { images } from './image'

export const predictions = pgTable('predictions', {
  _id: serial('_id').primaryKey(),
  id: text('id').notNull().unique().$defaultFn(nanoid),
  x: text('x').notNull(),
  y: text('y').notNull(),
  width: text('width').notNull(),
  height: text('height').notNull(),
  classification: text('classification').notNull(),
  confidence: text('confidence').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  imageID: text('image_id')
    .notNull()
    .references(() => images.id),
})
