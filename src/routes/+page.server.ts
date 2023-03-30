import { dbConnect, getRankedGroups } from "$lib/util/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const connection = await dbConnect();
    try {
        const scoreboard = await getRankedGroups(connection);
        const slicedScoreboard = scoreboard.slice(0, 10);
        return { scoreBoard: slicedScoreboard };
    } finally {
        connection.end();
    }
};
