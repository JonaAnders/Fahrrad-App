import { dbConnect, getRankedGroups, getSummedMileage } from "$lib/util/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const connection = await dbConnect();
    try {
        const scoreboard = await getRankedGroups(connection);
        const summedKilometers = await getSummedMileage(connection);
        const slicedScoreboard = scoreboard.slice(0, 10);
        return { scoreBoard: slicedScoreboard, summedKilometers };
    } finally {
        void connection.end();
    }
};
