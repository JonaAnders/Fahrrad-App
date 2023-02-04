import {
    createConnection,
    type Connection,
    type ResultSetHeader,
    type RowDataPacket
} from "mysql2/promise";
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from "$env/static/private";
import { IdentifierNotFoundError } from "$lib/errors/identifierNotFoundError";
import type { db_mileage, group, mileage } from "../../types";

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
    const id = (
        (await connection.execute("INSERT INTO mileages (group_id, kilometers) VALUES(?, ?);", [
            groupId,
            kilometers
        ])) as ResultSetHeader[]
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
        "SELECT * FROM mileages WHERE group_id = ? ORDER BY kilometers DESC;",
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

export const getScoreboard = async (
    connection: Connection
): Promise<{ kilometers: number; name: string }[]> => {
    const [rows] = (await connection.execute(
        `SELECT SUM(kilometers) AS kilometers, name FROM mileages
        INNER JOIN groups WHERE groups.group_id = mileages.group_id
        GROUP BY mileages.group_id
        ORDER BY kilometers DESC; `,
        []
    )) as RowDataPacket[] as { kilometers: number; name: string }[][];

    return rows;
};