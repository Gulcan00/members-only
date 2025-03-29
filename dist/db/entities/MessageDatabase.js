import pool from '../pool';
import { Database } from './Database';
class MessageDatabase extends Database {
    constructor() {
        super('messages');
    }
    async createMessage({ title, body, userId, }) {
        await pool.query(`INSERT INTO ${this.tableName} (title, body_text, author_id) VALUES ($1, $2, $3)`, [title, body, userId]);
    }
    async getAllMessages() {
        const { rows } = await pool.query(`SELECT *
           FROM ${this.tableName} m 
           JOIN users u
           ON m.author_id = u.id`);
        return rows;
    }
}
export default new MessageDatabase();
