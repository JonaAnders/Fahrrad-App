import { getInformationTable } from "$lib/server/util/admin";
import { dbConnect, getSummedMileage } from "$lib/server/util/db";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    const db = dbConnect();
    const tableInformation = getInformationTable(db);
    const summedKilometers = getSummedMileage(db);
    db.close();

    const username = locals.username;

    return { tableInformation, summedKilometers, username };
}) satisfies PageServerLoad;
