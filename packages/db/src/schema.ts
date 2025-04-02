import { match } from "assert";
import { sql } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
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

export const userRoles = ["Consumer", "Producer", "Logistics"] as const;
const rolesEnum = pgEnum("rolesEnum", userRoles);

export const User = pgTable("users", (t) => ({
	id: t.uuid().notNull().primaryKey().defaultRandom(),
	name: t.varchar({ length: 255 }).notNull(),
	email: t.varchar({ length: 255 }).notNull(),
	passwordHash: t.varchar({ length: 255 }).notNull(),
	phoneNumber: t.varchar({ length: 20 }),
	role: rolesEnum().notNull(),
	location: t.point().notNull(),
	createdAt: t.timestamp().defaultNow().notNull(),
}));

export const produceListingStatus = [
	"available",
	"partially_sold",
	"sold",
] as const;
const produceListingStatusEnum = pgEnum(
	"produce_listing_status_enum",
	produceListingStatus,
);

export const ProduceListing = pgTable("produce_listings", (t) => ({
	id: t.uuid().notNull().primaryKey().defaultRandom(),
	farmerId: t.integer().references(() => User.id),
	produceName: t.varchar({ length: 255 }).notNull(),
	variety: t.varchar({ length: 255 }).notNull(),
	quantity: t.numeric({ mode: "number", precision: 12, scale: 4 }).notNull(),
	pricePerKg: t.numeric({ mode: "number", precision: 12, scale: 2 }).notNull(),
	status: produceListingStatusEnum().notNull(),
	harvestDate: t.date(),
	expirationDate: t.date(),
	location: t.point().notNull(),
	createdAt: t.timestamp().defaultNow().notNull(),
}));

export const buyOrderStatus = [
	"pending",
	"matched",
	"completed",
	"cancelled",
] as const;
const buyOrderEnum = pgEnum("buy_order_enum", buyOrderStatus);

export const BuyOrder = pgTable("buyOrders", (t) => ({
	id: t.uuid().notNull().primaryKey().defaultRandom(),
	buyerId: t.integer().references(() => User.id),
	produceName: t.varchar({ length: 255 }).notNull(),
	quantity: t.numeric({ mode: "number", precision: 12, scale: 4 }).notNull(),
	minPricePerKg: t.numeric({ mode: "number", precision: 8, scale: 2 }),
	maxPricePerKg: t.numeric({ mode: "number", precision: 8, scale: 2 }),
	status: buyOrderEnum().notNull(),
	deliveryLocation: t.point().notNull(),
	createdAt: t.timestamp().defaultNow().notNull(),
}));

export const matchStatus = [
	"pending",
	"confirmed",
	"shipped",
	"delivered",
] as const;
const matchEnum = pgEnum("matchEnum", matchStatus);

export const Match = pgTable("matches", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	produceListingId: t.integer().references(() => ProduceListing.id),
	buyOrderId: t.integer().references(() => BuyOrder.id),
	matchedQuantityInKg: t
		.numeric({ mode: "number", precision: 16, scale: 4 })
		.notNull(),
	consumerId: t.integer().references(() => User.id),
	producerId: t.integer().references(() => User.id),
	status: matchEnum().notNull(),
	createdAt: t.timestamp().defaultNow().notNull(),
}));

export const transactionStatus = ["pending", "paid", "failed"] as const;
const transactionEnum = pgEnum("transactionEnum", transactionStatus);

export const Transaction = pgTable("transactions", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	matchId: t.integer().references(() => Match.id),
	amount: t.numeric({ precision: 10, scale: 4 }),
	paymentMethod: t.varchar({ length: 20 }).notNull(),
	status: transactionEnum().notNull(),
	createdAt: t.timestamp().defaultNow().notNull(),
}));

export const logisticsStatus = ["pending", "in transit", "delivered"] as const;
const logisticsEnum = pgEnum("logisticsEnum", logisticsStatus);

export const Logistics = pgTable("logistics", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	matchId: t.integer().references(() => Match.id),
	truckId: t.integer().references(() => Truck.id),
	driverId: t.integer().references(() => User.id),
	status: logisticsEnum().notNull(),
}));

export const truckStatus = ["available", "in use", "maintenance"] as const;
const truckEnum = pgEnum("truckEnum", truckStatus);

export const Truck = pgTable("trucks", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	plateNumber: t.varchar({ length: 20 }).notNull(),
	capacityKg: t.numeric({ precision: 10, scale: 2 }),
	status: truckEnum().notNull(),
	createdAt: t.timestamp().defaultNow().notNull(),
}));
