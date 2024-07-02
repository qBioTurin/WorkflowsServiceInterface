import { Pool } from 'pg';

const pool = new Pool({
    host: 'postgres',
    port: 5432,
    user: 'postgres',
    password: 'password2',
    database: 'postgres'
});

export const query = (text: string, params: any[]) => pool.query(text, params);
export default pool;
