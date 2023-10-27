import { dbConnect } from "$lib/server/util/db";
import { getAllUsers } from "$lib/server/util/users";
import type { PageServerLoad } from "../$types";

export const load = (async () => {
    const db = dbConnect();
    const allUsers = getAllUsers(db);
    const allUsersWithoutPassword = allUsers.map((user) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    db.close();
    return { users: allUsersWithoutPassword };
}) satisfies PageServerLoad;
