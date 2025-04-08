import pool from '../pool.js';

export class Database<T> {
  tableName: string | undefined;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async getById(id: number): Promise<T> {
    const { rows } = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return rows[0];
  }

  async deleteById(id: number): Promise<void> {
    await pool.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
  }
}
