import { dbConnect } from "$lib/server/util/db";
import { getAllUsers } from "$lib/server/util/users";
import type { PageServerLoad } from "../$types";

export const load = (async () => {
    const connection = await dbConnect();
    const allUsers = await getAllUsers(connection);
    const allUsersWithoutPassword = allUsers.map((user) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    void connection.end();
    return { users: allUsersWithoutPassword };
}) satisfies PageServerLoad;
