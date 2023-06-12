import { argon2id, hash } from "argon2";
import type { Connection, RowDataPacket } from "mysql2/promise";

import type { dbUser, user } from "$lib/types/types";

export const getUserByUsername = async (
    connection: Connection,
    { username }: { username: string }
): Promise<user | null> => {
    const [rows] = (await connection.execute("SELECT * FROM users WHERE user_name = ?;", [
        username
    ])) as RowDataPacket[] as dbUser[][];
    if (rows.length === 0) {
        return null;
    }
    const user = rows[0];
    return {
        userId: user.user_id,
        username: user.user_name,
        password: user.password,
        failedAttempts: user.failed_attempts,
        blockedUntil: user.blocked_until ?? new Date(0)
    };
};

export const rehashUserPassword = async (
    connection: Connection,
    { userId, password }: { userId: number; password: string }
) => {
    const rehashedPassword = hash(password, { type: argon2id });
    await connection.execute("UPDATE users SET password = ? WHERE user_id = ?;", [
        rehashedPassword,
        userId
    ]);
};

export const userFailedLogin = async (
    connection: Connection,
    { userId, attempt }: { userId: number; attempt: number }
) => {
    const blockedUntil = new Date();
    const currentSeconds = blockedUntil.getUTCSeconds();

    // 5 free tries, after that each failed login attempt is punished with 5 seconds (1 failed = 0s, 5 failed = 0s, 6 = 5s 7 = 10s, ...)
    const addedSeconds = Math.max(attempt - 5, 0) * 5;
    blockedUntil.setUTCSeconds(currentSeconds + addedSeconds);

    await connection.execute(
        "UPDATE users SET failed_attempts = ?, blocked_until = ? WHERE user_id = ?;",
        [attempt, blockedUntil, userId]
    );
};

export const loggedInSuccessFully = async (
    connection: Connection,
    { userId }: { userId: number }
) => {
    await connection.execute(
        "UPDATE users SET failed_attempts = 0, blocked_until = 2000-01-01 00:00:00 WHERE user_id = ?;",
        [userId]
    );
};

export const getAllUsers = async (connection: Connection): Promise<user[]> => {
    const [rows] = (await connection.execute(
        "SELECT * FROM users"
    )) as RowDataPacket[][] as dbUser[][];
    return rows.map((row) => {
        return {
            userId: row.user_id,
            username: row.user_name,
            password: row.password,
            failedAttempts: row.failed_attempts,
            blockedUntil: row.blocked_until ?? new Date(0)
        };
    });
};

export const createUser = async (
    connection: Connection,
    { username, password }: { username: string; password: string }
) => {
    await connection.execute("INSERT INTO users (user_name, password) VALUES(?, ?);", [
        username,
        password
    ]);
};
