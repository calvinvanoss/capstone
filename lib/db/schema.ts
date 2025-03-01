import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

// TODO: check out drizzle eslint plugin
// TODO: check out drizzle zod extension
// TODO: convert aliases to singular to match drizzle studio (make sure doesnt break authjs)
export const roleEnum = pgEnum('role', ['admin', 'editor', 'viewer']);

export const projects = pgTable('project', {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text(),
  currentVersion: text('current_version').notNull(),
});

export const versions = pgTable('version', {
  id: serial().primaryKey(),
  version: text().notNull(), // semantic versioning: MAJOR.MINOR.PATCH
  children: jsonb().default([]).notNull(), // TODO: rename tree?
  parentVersionId: integer('parent_version_id'),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  projectId: integer('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
});

// TODO: composite idx on [projectVersionId, path]?
export const docNodes = pgTable('doc_node', {
  id: serial().primaryKey(),
  path: text(),
  versionId: integer('version_id')
    .references(() => versions.id, { onDelete: 'cascade' })
    .notNull(),
  contentBlockId: integer('content_block_id')
    .references(() => contentBlocks.id, { onDelete: 'cascade' })
    .notNull(),
});

export const contentBlocks = pgTable('content_block', {
  id: serial().primaryKey(),
  content: jsonb(),
  parentVersionId: integer('parent_version_id')
    .references(() => versions.id, { onDelete: 'cascade' })
    .notNull(),
  projectId: integer('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
});

// TODO: composite idx on [userId, projectId]?
export const permissions = pgTable('permission', {
  id: serial().primaryKey(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  projectId: integer('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
  role: roleEnum().notNull(),
});

// automatically filled by authjs
export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

// only used for authjs
export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

// only used for authjs
export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

// only used for authjs
export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

// only used for authjs
export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

export type InsertProject = typeof projects.$inferInsert;
export type SelectProject = typeof projects.$inferSelect;
export type InsertVersion = typeof versions.$inferInsert;
export type SelectVersion = typeof versions.$inferSelect;
export type InsertDocNode = typeof docNodes.$inferInsert;
export type SelectDocNode = typeof docNodes.$inferSelect;
export type InsertContentBlock = typeof contentBlocks.$inferInsert;
export type SelectContentBlock = typeof contentBlocks.$inferSelect;
export type InsertPermission = typeof permissions.$inferInsert;
export type SelectPermission = typeof permissions.$inferSelect;
