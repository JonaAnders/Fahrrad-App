import { dbConnect } from "$lib/util/db";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    const connection = await dbConnect();
}) satisfies PageServerLoad;
