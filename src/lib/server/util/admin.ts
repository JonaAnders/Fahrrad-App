import type { Connection, RowDataPacket } from "mysql2/promise";

export const getInformationTable = async (connection: Connection) => {
    const [rows] = (await connection.execute(`SELECT groups.name,
        groups.identifier,
        SUM(COALESCE(mileages.kilometers, 0)) as kilometers,
        COUNT(mileages.mileage_id) as mileageCount
        FROM groups
        LEFT JOIN mileages ON groups.group_id = mileages.group_id
        GROUP BY groups.group_id, groups.name
        ORDER BY kilometers DESC, groups.name ASC;`)) as RowDataPacket[] as {
        name: string;
        identifier: string;
        kilometers: number;
        mileageCount: number;
    }[][];
    return rows;
};

export const getGroupNameByIdentifier = async (
    connection: Connection,
    { identifier }: { identifier: string }
): Promise<string | null> => {
    const [rows] = (await connection.execute(
        `SELECT name FROM groups WHERE groups.identifier = ?;`,
        [identifier]
    )) as RowDataPacket[] as {
        name: string;
    }[][];
    if (rows.length === 0) {
        return null;
    }
    return rows[0].name;
};

export const getGroupDataByIdentifier = async (
    connection: Connection,
    { identifier }: { identifier: string }
): Promise<{ mileageId: number; kilometers: number; date: Date }[]> => {
    const [rows] = (await connection.execute(
        `SELECT mileages.mileage_id,
        mileages.kilometers,
        mileages.date
        FROM groups
        LEFT JOIN mileages ON groups.group_id = mileages.group_id WHERE groups.identifier = ?
        ORDER BY mileages.date DESC, mileages.kilometers ASC;`,
        [identifier]
    )) as RowDataPacket[] as {
        mileage_id: number;
        kilometers: number;
        date: Date;
    }[][];
    return rows.map((row) => {
        return { mileageId: row.mileage_id, kilometers: row.kilometers, date: row.date };
    });
};

export const deleteMileageById = async (
    connection: Connection,
    { mileageId }: { mileageId: number }
) => {
    await connection.execute("DELETE FROM mileages WHERE mileage_id = ?;", [mileageId]);
};
