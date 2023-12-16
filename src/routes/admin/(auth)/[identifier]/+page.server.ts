import {
    deleteMileageById,
    getGroupDataByIdentifier,
    getGroupNameByIdentifier
} from "$lib/server/util/admin";
import { dbConnect } from "$lib/server/util/db";
import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
    const { identifier } = params;

    const db = dbConnect();
    const [namePromise, dataPromise] = [
        getGroupNameByIdentifier(db, { identifier }),
        getGroupDataByIdentifier(db, { identifier })
    ];

    const name = namePromise;
    if (name === null) {
        error(404);
    }

    const data = dataPromise.filter((d) => d.mileageId !== null);

    db.close();

    return { name, data };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();

        const mileageId = formData.get("delete");
        if (mileageId === null || mileageId instanceof File) {
            error(400);
        }

        const parsedMileageId = parseInt(mileageId);
        if (isNaN(parsedMileageId)) {
            error(400);
        }
        const db = dbConnect();

        deleteMileageById(db, { mileageId: parsedMileageId });
        db.close();
    }
} satisfies Actions;
