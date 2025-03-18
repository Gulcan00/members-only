import { User } from './models';
import pool from './pool';

export async function createUser({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  await pool.query(
    'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)',
    [firstName, lastName, email, password]
  );
}

export async function getUserByEmail({email}: {email: string}): Promise<User> {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
}

export async function getUserById({id}: {id: number}): Promise<User> {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
}