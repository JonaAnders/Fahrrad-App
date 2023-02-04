import { dbConnect, getScoreboard } from "$lib/util/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const connection = await dbConnect();
    try {
        const scoreboard = await getScoreboard(connection);
        const slicedScoreboard = scoreboard.slice(0, 10);

        const summedKilometers = scoreboard.reduce((accumulator, object) => {
            return accumulator + object.kilometers;
        }, 0);
        return { scoreBoard: slicedScoreboard, summedKilometers };
    } finally {
        connection.end();
    }
};
