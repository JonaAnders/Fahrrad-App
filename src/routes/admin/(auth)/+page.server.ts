import { getInformationTable } from "$lib/util/admin";
import { dbConnect, getSummedMileage } from "$lib/util/db";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    const connection = await dbConnect();
    const tableInformation = await getInformationTable(connection);
    const summedKilometers = await getSummedMileage(connection);
    void connection.end();

    const username = locals.username;

    return { tableInformation, summedKilometers, username };
}) satisfies PageServerLoad;
