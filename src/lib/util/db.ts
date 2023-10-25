import { env } from "$env/dynamic/private";
import { IdentifierNotFoundError } from "$lib/errors/identifierNotFoundError";
import crypto from "crypto";
import {
    createConnection,
    type Connection,
    type ResultSetHeader,
    type RowDataPacket
} from "mysql2/promise";
import type { db_mileage, group, mileage } from "../types/types";

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } = env;

if (([DB_HOST, DB_NAME, DB_PASSWORD, DB_USER] as (string | undefined)[]).includes(undefined)) {
    throw new Error("One of the environment variables wasn't set!");
}

export const dbConnect = async (): Promise<Connection> => {
    return createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME
    });
};

export const insertMileage = async (
    connection: Connection,
    { groupId, kilometers }: { groupId: number; kilometers: number }
): Promise<number> => {
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");
    const id = (
        (await connection.execute(
            "INSERT INTO mileages (group_id, date, kilometers) VALUES(?, ?, ?);",
            [groupId, date, kilometers]
        )) as ResultSetHeader[]
    )[0].insertId;
    return id;
};

export const getGroupByIdentifier = async (
    connection: Connection,
    { identifier }: { identifier: string }
): Promise<group> => {
    const [rows] = (await connection.execute("SELECT * FROM groups WHERE identifier = ?;", [
        identifier
    ])) as RowDataPacket[];

    if (rows.length === 0) {
        throw new IdentifierNotFoundError();
    }
    return {
        groupId: rows[0].group_id,
        name: rows[0].name,
        identifier: rows[0].identifier
    };
};

export const getMileageFromGroupId = async (
    connection: Connection,
    { groupId }: { groupId: number }
): Promise<mileage[]> => {
    const [rows] = (await connection.execute(
        "SELECT * FROM mileages WHERE group_id = ? ORDER BY date DESC;",
        [groupId]
    )) as RowDataPacket[];

    return rows.map((row: db_mileage) => {
        return {
            mileageId: row.mileage_id,
            groupId: row.group_id,
            kilometers: row.kilometers
        };
    });
};

export const getRankedGroups = async (connection: Connection): Promise<{ name: string }[]> => {
    const [rows] = (await connection.execute(
        `SELECT groups.name
        FROM groups
        LEFT JOIN mileages ON groups.group_id = mileages.group_id
        GROUP BY groups.group_id, groups.name
        ORDER BY SUM(COALESCE(mileages.kilometers, 0)) DESC, groups.name ASC;`,
        []
    )) as RowDataPacket[] as { name: string }[][];

    return rows;
};

export const addGroup = async (connection: Connection, { groupName }: { groupName: string }) => {
    const identifier = crypto.randomBytes(20).toString("hex");

    await connection.execute("INSERT INTO groups (name, identifier) VALUES (?, ?)", [
        groupName,
        identifier
    ]);
};

export const getSummedMileage = async (connection: Connection): Promise<number> => {
    const [rows] = (await connection.execute(
        `SELECT COALESCE(SUM(kilometers), 0) as kilometers FROM mileages;`,
        []
    )) as RowDataPacket[] as { kilometers: number }[][];

    return rows[0].kilometers;
};
