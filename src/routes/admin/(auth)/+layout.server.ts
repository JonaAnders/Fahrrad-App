import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
    if (!locals.authorized) {
        redirect(307, "/admin/login");
    }
};
