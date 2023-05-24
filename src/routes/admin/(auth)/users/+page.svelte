<script lang="ts">
    import { formatDate } from "$lib/util/functions";
    import type { PageServerData } from "./$types";

    export let data: PageServerData;
</script>

<table>
    <tr><th>Nutzername</th><th>Fehlgeschlagene Anmeldeversuche</th><th>Gesperrt bis</th></tr>
    {#each data.users as user}
        <tr
            ><td>{user.username}</td><td>{user.failedAttempts}</td><td
                >{user.blockedUntil.getTime() < new Date().getTime()
                    ? "Nicht blockiert"
                    : formatDate(user.blockedUntil)}</td
            ></tr
        >{/each}
</table>

<style lang="scss">
    @import "../../../../lib/styles/vars";
    table {
        border-collapse: collapse;
        margin-top: $default-space;
        th,
        td {
            padding: $default-space;
            border: solid 0.2rem $primary-color;
        }
    }
</style>
