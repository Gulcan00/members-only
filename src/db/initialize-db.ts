import { argv } from 'node:process';
import pg from 'pg';

const SQL = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    is_member BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    body_text TEXT,
    author_id INTEGER REFERENCES users
);
`;

async function main() {
  const [, , connectionString] = argv;
  const client = new pg.Client({ connectionString });
  await client.connect();
  await client.query(SQL);
  await client.end();
}

main();
