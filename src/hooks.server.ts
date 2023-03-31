import type { Handle } from "@sveltejs/kit";
import { verify } from "jsonwebtoken";

import { WEB_TOKEN_SECRET, WEB_TOKEN_MAX_AGE } from "$env/static/private";
import type { jwtPayLoad } from "./lib/types/types";

export const handle = (async ({ event, resolve }) => {
    const adminCookie = event.cookies.get("admin");
    if (!adminCookie) {
        return await resolve(event);
    }
    try {
        const payload = verify(adminCookie, WEB_TOKEN_SECRET, {
            maxAge: parseInt(WEB_TOKEN_MAX_AGE)
        }) as jwtPayLoad;
        console.log(payload);
        event.locals.authorized = true;
        event.locals.userId = payload.userId;
        event.locals.username = payload.username;
    } catch {
        event.cookies.delete("admin");
    }
    return await resolve(event);
}) satisfies Handle;