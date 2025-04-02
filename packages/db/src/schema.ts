import { sql, relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-valibot";
import * as v from "valibot";

const timestampFields = {
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp({ mode: "date", withTimezone: true }).$onUpdateFn(
		() => sql`now()`,
	),
};

export const Post = pgTable("posts", (t) => ({
	id: t.uuid().notNull().primaryKey().defaultRandom(),
	title: t.varchar({ length: 256 }).notNull(),
	...timestampFields,
}));

export const CreatePostSchema = v.pick(
	createInsertSchema(Post, {
		title: v.pipe(v.string(), v.maxLength(256)),
	}),
	["title"],
);

export const userRoles = ["consumer", "producer", "logistics"] as const;
export const rolesEnum = pgEnum("roles_enum", userRoles);

export const User = pgTable("users", (t) => ({
	id: t.uuid().notNull().primaryKey().defaultRandom(),
	name: t.varchar({ length: 255 }).notNull(),
	email: t.varchar({ length: 255 }).notNull(),
	passwordHash: t.varchar({ length: 255 }).notNull(),
	phoneNumber: t.varchar({ length: 20 }).notNull(),
	role: rolesEnum().notNull(),
	location: t.jsonb().notNull(),
	...timestampFields,
}));

export const usersRelations = relations(User, ({ many }) => ({
	produceListings: many(ProduceListings), // One User (Producer) → Many ProduceListings
	buyOrders: many(BuyOrders), // One User (Consumer) → Many BuyOrders
	matchedAsConsumer: many(Matches, { relationName: "matched_as_consumer" }), // One User (Consumer) → Many Matches
	matchedAsProducer: many(Matches, { relationName: "matched_as_producer" }), // One User (Producer) → Many Matches
	driverId: many(Logistics), // One User (Producer) → Many Logistics
}));

export const produceListingStatus = [
	"available",
	"partially_sold",
	"sold",
] as const;
export const produceListingStatusEnum = pgEnum(
	"produce_listing_status_enum",
	produceListingStatus,
);

export const ProduceListings = pgTable("produce_listings", (t) => ({
	id: t.uuid().notNull().primaryKey().defaultRandom(),
	producerId: t.uuid().references(() => User.id),
	produceName: t.varchar({ length: 255 }).notNull(),
	variety: t.varchar({ length: 255 }).notNull(),
	quantity: t.numeric({ mode: "number", precision: 12, scale: 4 }).notNull(),
	pricePerKg: t.numeric({ mode: "number", precision: 12, scale: 2 }).notNull(),
	status: produceListingStatusEnum().notNull(),
	harvestDate: t.date(),
	expirationDate: t.date(),
	location: t.jsonb().notNull(),
	...timestampFields,
}));

export const produceListingsRelations = relations(
	ProduceListings,
	({ one, many }) => ({
		producer: one(User, {
			fields: [ProduceListings.producerId],
			references: [User.id],
		}), // One Producer → Many ProduceListings
		matches: many(Matches), // One ProduceListing → Many Matches
	}),
);

export const buyOrderStatus = [
	"pending",
	"matched",
	"completed",
	"cancelled",
] as const;
export const buyOrderEnum = pgEnum("buy_order_enum", buyOrderStatus);

export const BuyOrders = pgTable("buy_orders", (t) => ({
	id: t.uuid().notNull().primaryKey().defaultRandom(),
	consumerId: t.uuid().references(() => User.id),
	produceName: t.varchar({ length: 255 }).notNull(),
	quantity: t.numeric({ mode: "number", precision: 12, scale: 4 }).notNull(),
	minPricePerKg: t
		.numeric({ mode: "number", precision: 12, scale: 2 })
		.notNull(),
	maxPricePerKg: t
		.numeric({ mode: "number", precision: 12, scale: 2 })
		.notNull(),
	status: buyOrderEnum().notNull(),
	deliveryLocation: t.jsonb().notNull(),
	...timestampFields,
}));

export const buyOrdersRelations = relations(BuyOrders, ({ one, many }) => ({
	consumer: one(User, {
		fields: [BuyOrders.consumerId],
		references: [User.id],
	}), // One Consumer → Many BuyOrders
	matches: many(Matches), // One BuyOrder → Many Matches
}));

export const transactionStatus = ["pending", "paid", "failed"] as const;
export const transactionEnum = pgEnum("transaction_enum", transactionStatus);

export const Transactions = pgTable("transactions", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	matchId: t.uuid().references(() => Matches.id),
	amount: t.numeric({ precision: 10, scale: 4 }).notNull(),
	paymentMethod: t.varchar({ length: 20 }).notNull(),
	status: transactionEnum().notNull(),
	...timestampFields,
}));

export const transactionsRelations = relations(Transactions, ({ one }) => ({
	match: one(Matches, {
		fields: [Transactions.matchId],
		references: [Matches.id],
	}),
}));

export const logisticsStatus = ["pending", "in_transit", "delivered"] as const;
export const logisticsEnum = pgEnum("logistics_enum", logisticsStatus);

export const Logistics = pgTable("logistics", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	truckId: t.uuid().references(() => Truck.id),
	driverId: t.uuid().references(() => User.id),
	status: logisticsEnum().notNull(),
	...timestampFields,
}));

export const logisticsRelations = relations(Logistics, ({ one, many }) => ({
	matches: many(Matches),
	truck: one(Truck, { fields: [Logistics.truckId], references: [Truck.id] }),
	user: one(User, { fields: [Logistics.driverId], references: [User.id] }),
	waypoints: many(Waypoints),
}));

export const truckStatus = ["available", "in_use", "maintenance"] as const;
export const truckEnum = pgEnum("truck_enum", truckStatus);

export const Truck = pgTable("trucks", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	plateNumber: t.varchar({ length: 20 }).notNull(),
	capacityKg: t.numeric({ precision: 10, scale: 2 }),
	status: truckEnum().notNull(),
	...timestampFields,
}));

export const truckRelations = relations(Truck, ({ one }) => ({
	logistics: one(Logistics, {
		fields: [Truck.id],
		references: [Logistics.truckId],
	}),
}));

export const waypointStatus = ["pickup", "dropoff"] as const;
export const waypointEnum = pgEnum("waypoint_enum", waypointStatus);

export const Waypoints = pgTable("waypoints", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	logisticsId: t.uuid().references(() => Logistics.id),
	location: t.jsonb().notNull(),
	type: waypointEnum().notNull(),
	sequence: t.smallint().notNull(),
	...timestampFields,
}));

export const waypointsRelations = relations(Waypoints, ({ one }) => ({
	logistics: one(Logistics, {
		fields: [Waypoints.logisticsId],
		references: [Logistics.id],
	}),
}));

export const matchStatus = [
	"pending",
	"confirmed",
	"shipped",
	"delivered",
] as const;
export const matchEnum = pgEnum("match_enum", matchStatus);

export const Matches = pgTable("matches", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	produceListingId: t.uuid().references(() => ProduceListings.id),
	buyOrderId: t.uuid().references(() => BuyOrders.id),
	matchedQuantityInKg: t
		.numeric({ mode: "number", precision: 16, scale: 4 })
		.notNull(),
	consumerId: t.uuid().references(() => User.id),
	producerId: t.uuid().references(() => User.id),
	status: matchEnum().notNull(),
	logisticsId: t.uuid().references(() => Logistics.id),
	...timestampFields,
}));

export const matchesRelations = relations(Matches, ({ one, many }) => ({
	produceListing: one(ProduceListings, {
		fields: [Matches.produceListingId],
		references: [ProduceListings.id],
	}), // One Match → One ProduceListing
	buyOrder: one(BuyOrders, {
		fields: [Matches.buyOrderId],
		references: [BuyOrders.id],
	}), // One Match → One BuyOrder
	matchedAsConsumer: one(User, {
		relationName: "matched_as_consumer",
		fields: [Matches.consumerId],
		references: [User.id],
	}), // One Match → One Consumer
	matchedAsProducer: one(User, {
		relationName: "matched_as_producer",
		fields: [Matches.producerId],
		references: [User.id],
	}), // One Match → One Producer
	transaction: one(Transactions, {
		fields: [Matches.id],
		references: [Transactions.id],
	}), // One Match → One Transaction
	logistics: one(Logistics, {
		fields: [Matches.id],
		references: [Logistics.id],
	}), // One logistics → Many Matches loaded into truck
}));
