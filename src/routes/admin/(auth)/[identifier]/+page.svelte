<script lang="ts">
    import { enhance } from "$app/forms";
    import { formatDate } from "$lib/util/functions";
    import type { PageServerData } from "./$types";

    export let data: PageServerData;
</script>

<a href="/admin">← Zurück zum Admin-Panel</a>

<h2>{data.name}</h2>
{#if data.data.length > 0}
    <table>
        <tr><th>Kilometer</th><th>Datum</th><th>Löschen</th></tr>
        {#each data.data as row}
            <tr
                ><td>{row.kilometers}</td><td>{formatDate(row.date)}</td><td
                    ><form method="post" use:enhance>
                        <button name="delete" value={row.mileageId}>X</button>
                    </form></td
                ></tr
            >
        {/each}
    </table>
{:else}
    <p class="empty">Dieses Team hat noch keine Einträge.</p>
{/if}

<style lang="scss">
    @import "../../../../lib/styles/vars";
    a {
        margin: $default-space $default-space;
        align-self: start;
    }
    table {
        margin-top: $default-space;
        border-collapse: collapse;
        th,
        td {
            padding: $default-space;
            border: solid 0.2rem $primary-color;
        }
        button {
            margin: 0 auto;
            background: $red;
            color: white;
        }
    }
    .empty {
        margin-top: $default-space;
    }
</style>
