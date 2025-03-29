import pool from '../pool';
export class Database {
    tableName;
    constructor(tableName) {
        this.tableName = tableName;
    }
    async getById(id) {
        const { rows } = await pool.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
        return rows[0];
    }
    async deleteById(id) {
        await pool.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
    }
}
