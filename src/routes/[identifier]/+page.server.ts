import { IdentifierNotFoundError } from "$lib/server/errors/identifierNotFoundError";
import {
    dbConnect,
    getGroupByIdentifier,
    getMileageFromGroupId,
    insertMileage
} from "$lib/server/util/db";
import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const identifier = params.identifier;
    const db = dbConnect();
    try {
        const group = getGroupByIdentifier(db, { identifier });
        const groupMilages = getMileageFromGroupId(db, { groupId: group.groupId });
        const groupScoreboard = groupMilages.slice(0, 10).map((milage) => {
            return milage.kilometers;
        });
        const summedKilometers = groupMilages.reduce((accumulator, object) => {
            return accumulator + object.kilometers;
        }, 0);
        return { groupScoreboard, summedKilometers, groupName: group.name };
    } catch (err) {
        if (err instanceof IdentifierNotFoundError) {
            error(404, "Not Found");
        }
        throw err;
    } finally {
        db.close();
    }
};

export const actions: Actions = {
    default: async ({ params, request }) => {
        const formData = await request.formData();
        const kilometers = formData.get("kilometers") as string | null;
        if (kilometers === null) {
            error(400, "Bad Request");
        }
        const parsedKilometers = Math.round(parseFloat(kilometers) * 100) / 100;
        if (isNaN(parsedKilometers) || parsedKilometers <= 0 || parsedKilometers > 150) {
            error(400, "Bad Request");
        }
        const identifier = params.identifier;
        const db = dbConnect();
        try {
            const group = getGroupByIdentifier(db, { identifier });
            insertMileage(db, {
                groupId: group.groupId,
                kilometers: parsedKilometers
            });
        } finally {
            db.close();
        }
    }
};
