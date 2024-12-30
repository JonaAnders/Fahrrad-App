<script lang="ts">
    import { formatDate } from "$lib/util/functions";
    import type { PageServerData } from "./$types";

    interface Props {
        data: PageServerData;
    }

    let { data }: Props = $props();
</script>

<svelte:head><title>Benutzer</title></svelte:head>
<table>
    <thead>
        <tr><th>Nutzername</th><th>Fehlgeschlagene Anmeldeversuche</th><th>Gesperrt bis</th></tr>
    </thead>
    <tbody>
        {#each data.users as user}
            <tr
                ><td>{user.username}</td><td>{user.failedAttempts}</td><td
                    >{user.blockedUntil.getTime() < new Date().getTime()
                        ? "Nicht blockiert"
                        : formatDate(user.blockedUntil)}</td
                ></tr
            >{/each}
    </tbody>
</table>

<a href="./users/new" class="new" title="Neuen Nutzer erstellen">+</a>

<style lang="scss">
    @use "$lib/styles/vars";
    @use "sass:color";
    table {
        border-collapse: collapse;
        margin-top: vars.$default-space;
        th,
        td {
            padding: vars.$default-space;
            border: solid 0.2rem vars.$primary-color;
        }
    }

    a.new:any-link {
        margin-top: 2rem;
        padding: calc(vars.$default-space / 2);
        height: 2.5rem;
        width: 2.5rem;
        line-height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        aspect-ratio: 1/1;
        font-size: 2rem;
        background: vars.$primary-color;
        color: vars.$bg-color;
        transition: 0.3s ease-in-out;
        transition-property: color, background-color;
        &:hover {
            color: vars.$light-bg;
            background: color.adjust(vars.$primary-color, $lightness: -10%);
        }
        &::before {
            content: unset;
        }
    }
</style>
