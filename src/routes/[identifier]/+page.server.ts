import { IdentifierNotFoundError } from "$lib/errors/identifierNotFoundError";
import {
    dbConnect,
    getGroupByIdentifier,
    getMileageFromGroupId,
    insertMileage
} from "$lib/util/db";
import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const identifier = params.identifier;
    const connection = await dbConnect();
    try {
        const group = await getGroupByIdentifier(connection, { identifier });
        const groupMilages = await getMileageFromGroupId(connection, { groupId: group.groupId });
        const groupScoreboard = groupMilages.slice(0, 10).map((milage) => {
            return milage.kilometers;
        });
        const summedKilometers = groupMilages.reduce((accumulator, object) => {
            return accumulator + object.kilometers;
        }, 0);
        return { groupScoreboard, summedKilometers, groupName: group.name };
    } catch (err) {
        if (err instanceof IdentifierNotFoundError) {
            throw error(404, "Not Found");
        }
        throw err;
    } finally {
        void connection.end();
    }
};

export const actions: Actions = {
    default: async ({ params, request }) => {
        const formData = await request.formData();
        const kilometers = formData.get("kilometers") as string | null;
        if (kilometers === null) {
            throw error(400, "Bad Request");
        }
        const parsedKilometers = Math.round(parseFloat(kilometers) * 100) / 100;
        if (isNaN(parsedKilometers) || parsedKilometers <= 0 || parsedKilometers > 150) {
            throw error(400, "Bad Request");
        }
        const identifier = params.identifier;
        const connection = await dbConnect();
        try {
            const group = await getGroupByIdentifier(connection, { identifier });
            await insertMileage(connection, {
                groupId: group.groupId,
                kilometers: parsedKilometers
            });
        } finally {
            void connection.end();
        }
    }
};
