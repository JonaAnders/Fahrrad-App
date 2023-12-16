import argon2 from "argon2";
import type { dbUser, user } from "$lib/types/types";
import type { Database } from "better-sqlite3";

export const getUserByUsername = (
    db: Database,
    { username }: { username: string }
): user | null => {
    const row = db.prepare("SELECT * FROM users WHERE user_name = ?;").get(username) as dbUser;

    if (row === undefined) {
        return null;
    }

    return {
        userId: row.user_id,
        username: row.user_name,
        password: row.password,
        failedAttempts: row.failed_attempts,
        blockedUntil: new Date(row.blocked_until * 1000)
    };
};

export const rehashUserPassword = async (
    db: Database,
    { userId, password }: { userId: number; password: string }
): Promise<void> => {
    const rehashedPassword = await argon2.hash(password, { type: argon2.argon2id });
    db.prepare("UPDATE users SET password = ? WHERE user_id = ?;").run(rehashedPassword, userId);
};

export const userFailedLogin = (
    db: Database,
    { userId, attempt }: { userId: number; attempt: number }
): void => {
    const blockedUntil = new Date();
    const currentSeconds = blockedUntil.getUTCSeconds();

    // 5 free tries, after that each failed login attempt is punished with 5 seconds (1 failed = 0s, 5 failed = 0s, 6 = 5s, 7 = 10s, ...)
    const addedSeconds = Math.max(attempt - 5, 0) * 5;
    blockedUntil.setUTCSeconds(currentSeconds + addedSeconds);

    db.prepare("UPDATE users SET failed_attempts = ?, blocked_until = ? WHERE user_id = ?;").run(
        attempt,
        // convert to seconds after 1970
        Math.floor(blockedUntil.getTime() / 1000),
        userId
    );
};

export const loggedInSuccessFully = (db: Database, { userId }: { userId: number }): void => {
    db.prepare("UPDATE users SET failed_attempts = 0, blocked_until = 0 WHERE user_id = ?;").run(
        userId
    );
};

export const getAllUsers = (db: Database): user[] => {
    const rows = db.prepare("SELECT * FROM users;").all() as dbUser[];

    return rows.map((row) => {
        return {
            userId: row.user_id,
            username: row.user_name,
            password: row.password,
            failedAttempts: row.failed_attempts,
            blockedUntil: new Date(row.blocked_until * 1000)
        };
    });
};

export const createUser = (
    db: Database,
    { username, password }: { username: string; password: string }
): void => {
    db.prepare("INSERT INTO users (user_name, password) VALUES(?, ?);").run(username, password);
};
