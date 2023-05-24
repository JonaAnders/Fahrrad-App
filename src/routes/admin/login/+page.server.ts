import {
    getUserByUsername,
    loggedInSuccessFully,
    rehashUserPassword,
    userFailedLogin
} from "$lib/util/users";
import { redirect } from "@sveltejs/kit";
import { needsRehash, verify } from "argon2";
import { z } from "zod";
import type { Actions, PageServerLoad } from "./$types";

import { WEB_TOKEN_MAX_AGE, WEB_TOKEN_SECRET } from "$env/static/private";

import { dbConnect } from "$lib/util/db";
import { sign } from "jsonwebtoken";

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.authorized) {
        throw redirect(307, "/admin");
    }
};

export const actions: Actions = {
    default: async ({ locals, request, cookies }) => {
        if (locals.authorized) {
            throw redirect(307, "/admin");
        }

        const body = await request.formData();

        const username = body.get("username");
        const password = body.get("password");

        const pattern = z.object({
            username: z
                .string({
                    invalid_type_error: "Der Nutzername muss eine Zeichenkette sein.",
                    required_error: "Du musst einen Nutzernamen angeben."
                })
                .min(1, "Der Nutzername muss mindestens ein Zeichen haben.")
                .max(50, "Der Nutzername darf maximal 50 Zeichen haben.")
                .trim(),
            password: z
                .string({
                    invalid_type_error: "Das Passwort muss eine Zeichenkette sein.",
                    required_error: "Du musst ein Passwort angeben."
                })
                .min(1, "Das Passwort muss mindestens ein Zeichen haben.")
                .max(50, "Das Passwort darf maximal 50 Zeichen haben.")
                .trim()
        });

        const result = await pattern.safeParseAsync({ username, password });
        if (!result.success) {
            return {
                errors: result.error.issues.map((issue) => issue.message),
                data: { username }
            };
        }

        const { username: parsedUsername, password: parsedPassword } = result.data;

        const connection = await dbConnect();
        const user = await getUserByUsername(connection, { username: parsedUsername });

        if (user === null) {
            // ? Very cheap hack to prevent timing attacks to find out usernames, could be optimized or even removed
            await verify(
                "$argon2id$v=19$m=65536,t=3,p=4$xsPh1qo13IUGFTNs5LoOZA$gapvVq/vaNfYNR5dHCVxOaf50KYtdHZqkrOTW36pqvc",
                "1234"
            );
            void connection.end();
            return { errors: ["Falscher Nutzername oder falsches Passwort."], data: { username } };
        }

        if (user.blockedUntil.getTime() > new Date().getTime()) {
            void connection.end();
            return {
                errors: [
                    `Du musst noch ${Math.round(
                        (user.blockedUntil.getTime() - new Date().getTime()) / 1000
                    )} Sekunden warten, bis du erneut versuchen kannst dich anzumelden.`
                ],
                data: { username }
            };
        }

        if (await verify(user.password, parsedPassword)) {
            if (needsRehash(user.password)) {
                await rehashUserPassword(connection, {
                    userId: user.userId,
                    password: parsedPassword
                });
            }
            await loggedInSuccessFully(connection, { userId: user.userId });
            void connection.end();
            cookies.set(
                "admin",
                sign({ userId: user.userId, username: user.username }, WEB_TOKEN_SECRET, {
                    expiresIn: parseInt(WEB_TOKEN_MAX_AGE)
                }),
                { maxAge: parseInt(WEB_TOKEN_MAX_AGE), path: "/admin" }
            );
            throw redirect(302, "/admin");
        } else {
            await userFailedLogin(connection, {
                userId: user.userId,
                attempt: user.failedAttempts + 1
            });
            void connection.end();
            return { errors: ["Falscher Nutzername oder falsches Passwort."], data: { username } };
        }
    }
};
