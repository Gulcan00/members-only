import { Database } from './Database.js';
import { User } from '../models.js';
import pool from '../pool.js';

class UserDatabase extends Database<User> {
  constructor() {
    super('users');
  }

  async createUser({
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
      `INSERT INTO ${this.tableName} (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)`,
      [firstName, lastName, email, password]
    );
  }

  async getUserByEmail({ email }: { email: string }): Promise<User> {
    const { rows } = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE email = $1`,
      [email]
    );
    return rows[0];
  }

  async becomeMember(id: number): Promise<void> {
    await pool.query(
      `UPDATE ${this.tableName} SET is_member = true WHERE id = $1`,
      [id]
    );
  }

  async becomeAdmin(id: number): Promise<void> {
    await pool.query(
      `UPDATE ${this.tableName} SET is_admin = true WHERE id = $1`,
      [id]
    );
  }
}

export default new UserDatabase();
