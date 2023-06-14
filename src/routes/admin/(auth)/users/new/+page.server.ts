import { dbConnect } from "$lib/util/db";
import { z } from "zod";
import type { Actions } from "./$types";

import { createUser } from "$lib/util/users";
import argon2 from "argon2";

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const username = formData.get("username");
        const password = formData.get("password");
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
                .min(12, "Das Passwort muss mindestens zwölf Zeichen haben.")
                .max(50, "Das Passwort darf maximal 50 Zeichen haben.")
                .trim()
        });

        const result = await pattern.safeParseAsync({ username, password });
        if (!result.success) {
            return {
                errors: result.error.issues.map((issue) => issue.message),
                data: { username: username as string }
            };
        }

        const conn = await dbConnect();
        try {
            await createUser(conn, {
                username: username as string,
                password: await argon2.hash(password as string, { type: argon2.argon2id })
            });
        } catch {
            return {
                errors: [
                    "Ein Fehler ist aufgetreten. Überprüfe ob der Nutzername bereits vergeben wurde oder versuche es später erneut."
                ],
                data: { username: username as string }
            };
        }
        void conn.end();
        return { success: "Benutzer erfolgreich erstellt", data: {} };
    }
} satisfies Actions;
