import { AnyPgColumn, integer, jsonb, pgTable, primaryKey, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// TODO: check out drizzle eslint plugin
// TODO: check out drizzle zod extension
/*
export const usersTable = pgTable('users_table', {
    id: text().primaryKey(), // Cognito user ID, TODO: change to serial
    username: text().notNull(),
});
*/

export const projects = pgTable('projects', {
    id: serial().primaryKey(),
    name: text().notNull(),
    description: text(),
    children: jsonb().default([]).notNull(),
});

// TODO: composite idx on (project_id, path)?
export const documents = pgTable('documents', {
    path: text(),
    content: jsonb(),
    projectId: integer('project_id').references(() => projects.id, {onDelete: 'cascade'}).notNull(),
});


export type InsertProject = typeof projects.$inferInsert;
export type SelectProject = typeof projects.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;
export type SelectDocument = typeof documents.$inferSelect;
