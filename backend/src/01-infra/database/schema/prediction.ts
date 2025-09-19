import { relations } from 'drizzle-orm'
import { doublePrecision, index, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { nanoid } from '../nanoid'
import { images } from './image'

export const predictions = pgTable(
  'predictions',
  {
    _id: serial('_id').primaryKey(),
    id: text('id').notNull().unique().$defaultFn(nanoid),
    x: doublePrecision('x').notNull(),
    y: doublePrecision('y').notNull(),
    width: doublePrecision('width').notNull(),
    height: doublePrecision('height').notNull(),
    classification: text('classification').notNull(),
    confidence: doublePrecision('confidence').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    imageID: text('image_id')
      .notNull()
      .references(() => images.id),
  },
  (table) => [index('image_id_idx').on(table.imageID)]
)

export const predictionsRelations = relations(predictions, ({ one }) => ({
  images: one(images, {
    fields: [predictions.imageID],
    references: [images.id],
  }),
}))
