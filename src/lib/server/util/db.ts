import DatabaseConstructor, { type Database } from "better-sqlite3";
import { DB_PATH } from "$env/static/private";
import { IdentifierNotFoundError } from "$lib/server/errors/identifierNotFoundError";
import crypto from "crypto";
import type { db_group, db_mileage, group, mileage } from "../../types/types";

export const dbConnect = (): Database => {
    const db = new DatabaseConstructor(DB_PATH, { fileMustExist: false });
    db.pragma("journal_mode = WAL");
    return db;
};

export const insertMileage = (
    db: Database,
    { groupId, kilometers }: { groupId: number; kilometers: number }
): number => {
    // get date as seconds since 1970-01-01 00:00:00 UTC
    const date = Math.floor(new Date().getTime() / 1000);
    const id = db
        .prepare("INSERT INTO mileages (date, kilometers, group_id) VALUES(?, ?, ?);")
        .run(date, kilometers, groupId).lastInsertRowid;
    return Number(id);
};

export const getGroupByIdentifier = (
    db: Database,
    { identifier }: { identifier: string }
): group => {
    const row = db
        .prepare("SELECT * FROM groups WHERE identifier = ?;")
        .get(identifier) as db_group;

    if (row === undefined) {
        throw new IdentifierNotFoundError();
    }
    return {
        groupId: row.group_id,
        name: row.name,
        identifier: row.identifier
    };
};

export const getMileageFromGroupId = (
    db: Database,
    { groupId }: { groupId: number }
): mileage[] => {
    const rows = db
        .prepare("SELECT * FROM mileages WHERE group_id = ? ORDER BY date DESC;")
        .all(groupId) as db_mileage[];

    return rows.map((row) => {
        return {
            mileageId: row.mileage_id,
            date: new Date(row.date * 1000),
            groupId: row.group_id,
            kilometers: row.kilometers
        };
    });
};

export const getRankedGroups = (db: Database): { name: string }[] => {
    const rows = db
        .prepare(
            `SELECT groups.name
            FROM groups
            LEFT JOIN mileages ON groups.group_id = mileages.group_id
            GROUP BY groups.group_id, groups.name
            ORDER BY SUM(COALESCE(mileages.kilometers, 0)) DESC, groups.name ASC;`
        )
        .all() as { name: string }[];

    return rows;
};

export const addGroup = (db: Database, { groupName }: { groupName: string }): void => {
    const identifier = crypto.randomBytes(20).toString("hex");

    db.prepare("INSERT INTO groups (name, identifier) VALUES (?, ?);").run(groupName, identifier);
};

export const getSummedMileage = (db: Database): number => {
    const row = db
        .prepare("SELECT COALESCE(SUM(kilometers), 0) as kilometers FROM mileages;")
        .get() as { kilometers: number };

    return row.kilometers;
};
