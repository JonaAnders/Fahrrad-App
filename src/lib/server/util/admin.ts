import type { group, mileage } from "$lib/types/types";
import type { Database } from "better-sqlite3";

export const getInformationTable = (
    db: Database
): Omit<group & mileage & { mileageCount: number }, "groupId" | "mileageId" | "date">[] => {
    const rows = db
        .prepare(
            `SELECT groups.name,
            groups.identifier,
            SUM(COALESCE(mileages.kilometers, 0)) as kilometers,
            COUNT(mileages.mileage_id) as mileageCount
            FROM groups
            LEFT JOIN mileages ON groups.group_id = mileages.group_id
            GROUP BY groups.group_id, groups.name
            ORDER BY kilometers DESC, groups.name ASC;`
        )
        .all() as {
        name: string;
        identifier: string;
        kilometers: number;
        mileageCount: number;
    }[];
    return rows;
};

export const getGroupNameByIdentifier = (
    db: Database,
    { identifier }: { identifier: string }
): string | null => {
    const row = db
        .prepare("SELECT name FROM groups WHERE groups.identifier = ?;")
        .get(identifier) as {
        name: string;
    };

    if (row === undefined) {
        return null;
    }
    return row.name;
};

export const getGroupDataByIdentifier = (
    db: Database,
    { identifier }: { identifier: string }
): Omit<mileage, "groupId">[] => {
    const rows = db
        .prepare(
            `SELECT mileages.mileage_id,
            mileages.kilometers,
            mileages.date
            FROM groups
            LEFT JOIN mileages ON groups.group_id = mileages.group_id WHERE groups.identifier = ?
            ORDER BY mileages.date DESC, mileages.kilometers ASC;`
        )
        .all(identifier) as {
        mileage_id: number;
        kilometers: number;
        date: number;
    }[];
    return rows.map((row) => {
        return {
            mileageId: row.mileage_id,
            kilometers: row.kilometers,
            // convert date from seconds to Date
            date: new Date(row.date * 1000)
        };
    });
};

export const deleteMileageById = (db: Database, { mileageId }: { mileageId: number }): void => {
    db.prepare("DELETE FROM mileages WHERE mileage_id = ?;").run(mileageId);
};
