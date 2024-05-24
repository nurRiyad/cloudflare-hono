import { text, timestamp, integer, pgTable, uuid, pgEnum } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull().default("12345"),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const incomesTable = pgTable("incomes", {
  id: uuid("id").primaryKey().defaultRandom(),
  from: text("from").notNull(),
  amount: integer("amount").notNull(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const expensesTable = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  on: text("on").notNull(),
  amount: integer("amount").notNull(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const savingsTable = pgTable("savings", {
  id: uuid("id").primaryKey().defaultRandom(),
  topic: text("topic").notNull(),
  amount: integer("amount").notNull(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const shareType = pgEnum("type", ["lend", "borrow"]);

export const sharesTable = pgTable("shares", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: shareType("type").notNull(),
  who: text("who").notNull(),
  amount: integer("amount").notNull(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  resolveAt: timestamp("resolve_at").defaultNow(),
});
