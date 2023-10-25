import {
    getUserByUsername,
    loggedInSuccessFully,
    rehashUserPassword,
    userFailedLogin
} from "$lib/util/users";
import { redirect } from "@sveltejs/kit";
import argon2 from "argon2";
import { z } from "zod";
import type { Actions, PageServerLoad } from "./$types";

import { WEB_TOKEN_MAX_AGE, WEB_TOKEN_SECRET } from "$env/static/private";

import { dbConnect } from "$lib/util/db";
import jsonwebtoken from "jsonwebtoken";

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
            void connection.end();
            return { errors: ["Falscher Nutzername oder falsches Passwort."], data: { username } };
        }

        //? prevent brute force attacks by creating delay
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

        //? verify password
        if (await argon2.verify(user.password, parsedPassword, { type: argon2.argon2id })) {
            if (argon2.needsRehash(user.password)) {
                await rehashUserPassword(connection, {
                    userId: user.userId,
                    password: parsedPassword
                });
            }
            await loggedInSuccessFully(connection, { userId: user.userId });
            void connection.end();
            cookies.set(
                "admin",
                jsonwebtoken.sign(
                    { userId: user.userId, username: user.username },
                    WEB_TOKEN_SECRET,
                    {
                        expiresIn: parseInt(WEB_TOKEN_MAX_AGE)
                    }
                ),
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
