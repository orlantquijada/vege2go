import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import * as v from "valibot";

export const Post = pgTable("posts", (t) => ({
	id: t.uuid().notNull().primaryKey().defaultRandom(),
	title: t.varchar({ length: 256 }).notNull(),
	createdAt: t.timestamp().defaultNow().notNull(),
	updatedAt: t
		.timestamp({ mode: "date", withTimezone: true })
		.$onUpdateFn(() => sql`now()`),
}));

export const CreatePostSchema = v.pick(
	createInsertSchema(Post, {
		title: v.pipe(v.string(), v.maxLength(256)),
	}),
	["title"],
);

export const User = pgTable("users", (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    name: t.varchar({ length: 255 }).notNull(),
    email: t.varchar({ length: 255 }).notNull(),
    passwordHash: t.varchar({ length: 255 }).notNull(),
    phoneNumber: t.varchar({ length: 20 }),
    role: t.varchar({ length: 20, enum: ["Consumer", "Producer", "Logistics"] }).notNull(),
    location: t.point().notNull(),
    createdAt: t.timestamp().defaultNow().notNull()
 
}));
 
export const Produce_Listing = pgTable("produceListings", (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    farmerId: t.integer().references(() => User.id),
    produceName: t.varchar({ length: 255 }).notNull(),
    variety: t.varchar({ length: 255 }).notNull(),
    quantity: t.real().notNull(),
    pricePerKg: t.real().notNull(),
    status: t.varchar({ length: 20, enum: ["available", "partially_sold", "sold"]}).notNull(),
    harvestDate: t.date(),
    expirationDate: t.date(),
    location: t.point().notNull(),
    createdAt: t.timestamp().defaultNow().notNull()
}));
 
export const Buy_Order = pgTable("buyOrders", (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    buyerId: t.integer().references(() => User.id),
    produceName: t.varchar({ length: 255 }).notNull(),
    quantity: t.real().notNull(),
    minPricePerKg: t.real(),
    maxPricePerKg: t.real(),
    status: t.varchar({ length: 20, enum: ["pending", "matched", "completed", "cancelled"]}).notNull(),
    deliveryLocation: t.point().notNull(),
    createdAt: t.timestamp().defaultNow().notNull()
}))
 
export const Match = pgTable("matches", (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    produceListingId: t.integer().references(() => Produce_Listing.id),
    buyOrderId: t.integer().references(() => Buy_Order.id),
    matchedQuantityInKg: t.real().notNull(),
    consumerId: t.integer().references(() => User.id),
    producerId: t.integer().references(() => User.id),
    status: t.varchar({ length: 20, enum: ["pending", "confirmed", "shipped", "delivered"] }).notNull(),
    createdAt: t.timestamp().defaultNow().notNull()
}))
 
export const Transaction = pgTable("transactions", (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    matchId: t.integer().references(() => Match.id),
    amount: t.numeric({ precision: 10, scale: 4}),
    paymentMethod: t.varchar({ length: 20 }).notNull(),
    status: t.varchar({ length: 20, enum: ["pending", "paid", "failed"]}),
    createdAt: t.timestamp().defaultNow().notNull()
}))
 
export const Logistics = pgTable("logistics", (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    matchId: t.integer().references(() => Match.id),
    truckId: t.integer().references(() => Truck.id),
    driverId: t.integer().references(() => User.id),
    status: t.varchar({ length: 20, enum: ["pending", "in transit", "delivered"]})
}))
 
export const Truck = pgTable("trucks", (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    plateNumber: t.varchar({ length: 20 }).notNull(),
    capacityKg: t.numeric({ precision: 10, scale: 2}),
    status: t.varchar({ length: 20, enum: ["available", "in use", "maintenance"]}),
    createdAt: t.timestamp().defaultNow().notNull()
}))