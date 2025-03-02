import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
// TODO: switch to websockets to allow transactions https://orm.drizzle.team/docs/connect-neon
// doesnt work with next-auth, need to investigate further...

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema: schema });
