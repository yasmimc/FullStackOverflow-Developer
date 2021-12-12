import connection from '../database/connection';
import User from '../protocols/User';
import UserDB from '../protocols/UserDB';
import { v4 as uuid } from 'uuid';

async function insertUser(user: User): Promise<UserDB> {
    const token = uuid();
    const result = await connection.query(
        `INSERT INTO users(name, class, token) VALUES ($1, $2, $3) RETURNING *`,
        [user.name, user.class, token]
    );
    if (!result) {
        return null;
    }
    return result.rows[0];
}

async function fetchUserByToken(token: string): Promise<UserDB> {
    const result = await connection.query(
        `SELECT * FROM users WHERE token = $1`,
        [token]
    );

    if (!result) {
        return null;
    }
    return result.rows[0];
}

export { insertUser, fetchUserByToken };
