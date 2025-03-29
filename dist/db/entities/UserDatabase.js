import { Database } from './Database';
import pool from '../pool';
class UserDatabase extends Database {
    constructor() {
        super('users');
    }
    async createUser({ firstName, lastName, email, password, }) {
        await pool.query(`INSERT INTO ${this.tableName} (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)`, [firstName, lastName, email, password]);
    }
    async getUserByEmail({ email }) {
        const { rows } = await pool.query(`SELECT * FROM ${this.tableName} WHERE email = $1`, [email]);
        return rows[0];
    }
}
export default new UserDatabase();
