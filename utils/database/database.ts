import { Pool } from 'pg';

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "passwordIdronight",
    database: "stageProvaDocker"
});

export default pool;