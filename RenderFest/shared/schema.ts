import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  gitamId: text("gitam_id").notNull(),
  semester: integer("semester").notNull(),
  attendance: real("attendance").notNull(),
  verified: boolean("verified").default(false),
  verificationCode: text("verification_code"),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  price: integer("price").notNull(),
  maxTeamSize: integer("max_team_size").default(1),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  eventId: integer("event_id").notNull(),
  teamId: integer("team_id"),
  status: text("status").notNull(),
  paymentStatus: text("payment_status").notNull(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  eventId: integer("event_id").notNull(),
  leaderId: integer("leader_id").notNull(),
  description: text("description"),
  requiredSkills: text("required_skills").array(),
  status: text("status").default("forming").notNull(),
  currentSize: integer("current_size").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  userId: integer("user_id").notNull(),
  role: text("role").notNull(),
  skills: text("skills").array(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  gitamId: true,
  semester: true,
  attendance: true,
}).extend({
  email: z.string().email().refine(
    (email) => email.endsWith("@gitam.in") || email.endsWith("@gitam.edu"),
    "Must be a GITAM email address"
  ),
  semester: z.number()
    .int()
    .min(1, "Semester must be between 1 and 10")
    .max(10, "Semester must be between 1 and 10"),
  attendance: z.number()
    .min(0, "Attendance cannot be negative")
    .max(100, "Attendance cannot exceed 100%"),
});

export const insertTeamSchema = createInsertSchema(teams).pick({
  name: true,
  eventId: true,
  description: true,
  requiredSkills: true,
}).extend({
  name: z.string().min(3, "Team name must be at least 3 characters"),
  description: z.string().min(10, "Please provide a brief team description"),
  requiredSkills: z.array(z.string()).min(1, "Select at least one required skill"),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
  skills: true,
  role: true,
}).extend({
  skills: z.array(z.string()).min(1, "Please specify your skills"),
  role: z.enum(["leader", "member"]),
});

export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").notNull(),
  eventId: integer("event_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  price: integer("price").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull(),
  total: integer("total").notNull(),
  paymentId: text("payment_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Registration = typeof registrations.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type Cart = typeof carts.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;