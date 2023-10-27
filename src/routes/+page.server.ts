import { dbConnect, getRankedGroups, getSummedMileage } from "$lib/server/util/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const db = dbConnect();
    try {
        const scoreboard = getRankedGroups(db);
        const summedKilometers = getSummedMileage(db);
        const slicedScoreboard = scoreboard.slice(0, 10);
        return { scoreBoard: slicedScoreboard, summedKilometers };
    } finally {
        db.close();
    }
};
