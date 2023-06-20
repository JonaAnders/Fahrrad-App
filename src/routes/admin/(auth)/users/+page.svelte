<script lang="ts">
    import { formatDate } from "$lib/util/functions";
    import type { PageServerData } from "./$types";

    export let data: PageServerData;
</script>

<svelte:head><title>Benutzer</title></svelte:head>
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

<a href="./users/new" class="new" title="Neuen Nutzer erstellen">+</a>

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

    a.new:any-link {
        margin-top: 2rem;
        padding: calc($default-space / 2);
        height: 2.5rem;
        width: 2.5rem;
        line-height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        aspect-ratio: 1/1;
        font-size: 2rem;
        background: $primary-color;
        color: $bg-color;
        transition: 0.3s ease-in-out;
        transition-property: color, background-color;
        &:hover {
            color: $light-bg;
            background: lighten($primary-color, 10);
        }
        &::before {
            content: unset;
        }
    }
</style>
