import pool from './pool';
export async function createUser({ firstName, lastName, email, password, }) {
    await pool.query('INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)', [firstName, lastName, email, password]);
}
