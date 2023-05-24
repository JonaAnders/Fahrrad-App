import {
    deleteMileageById,
    getGroupDataByIdentifier,
    getGroupNameByIdentifier
} from "$lib/util/admin";
import { dbConnect } from "$lib/util/db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load = (async ({ params }) => {
    const { identifier } = params;

    const connection = await dbConnect();
    const [namePromise, dataPromise] = [
        getGroupNameByIdentifier(connection, { identifier }),
        getGroupDataByIdentifier(connection, { identifier })
    ];

    const name = await namePromise;
    if (name === null) {
        throw error(404);
    }

    const data = await dataPromise;

    void connection.end();

    return { name, data };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();

        const mileageId = formData.get("delete");
        if (mileageId === null || mileageId instanceof File) {
            throw error(400);
        }

        const parsedMileageId = parseInt(mileageId);
        if (isNaN(parsedMileageId)) {
            throw error(400);
        }
        const connection = await dbConnect();

        await deleteMileageById(connection, { mileageId: parsedMileageId });
        void connection.end();
    }
} satisfies Actions;
