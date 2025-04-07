import pool from '../pool';
import { Database } from './Database';
import { Message } from '../models';

class MessageDatabase extends Database<Message> {
  constructor() {
    super('messages');
  }

  async createMessage({
    title,
    body,
    userId,
  }: {
    title: string;
    body: string;
    userId: number;
  }): Promise<void> {
    await pool.query(
      `INSERT INTO ${this.tableName} (title, body_text, author_id) VALUES ($1, $2, $3)`,
      [title, body, userId]
    );
  }

  async getAllMessages(): Promise<Message[]> {
    const { rows } = await pool.query(
      `SELECT m.id, m.title, m.created_at, m.body_text, u.first_name, u.last_name, u.email, u.is_member, u.is_admin
           FROM ${this.tableName} m 
           JOIN users u
           ON m.author_id = u.id`
    );
    return rows;
  }
}

export default new MessageDatabase();
