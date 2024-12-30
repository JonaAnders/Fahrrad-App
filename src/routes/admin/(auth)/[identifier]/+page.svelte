<script lang="ts">
    import { enhance } from "$app/forms";
    import { formatDate } from "$lib/util/functions";
    import type { PageServerData } from "./$types";

    interface Props {
        data: PageServerData;
    }

    let { data }: Props = $props();
</script>

<a href="/admin">← Zurück zum Admin-Panel</a>

<h2>{data.name}</h2>
{#if data.data.length > 0}
    <table>
        <thead>
            <tr><th>Kilometer</th><th>Datum</th><th>Löschen</th></tr>
        </thead>
        <tbody>
            {#each data.data as row}
                <tr
                    ><td>{row.kilometers}</td><td>{formatDate(row.date)}</td><td
                        ><form method="post" use:enhance>
                            <button name="delete" value={row.mileageId}>X</button>
                        </form></td
                    ></tr
                >
            {/each}
        </tbody>
    </table>
{:else}
    <p class="empty">Dieses Team hat noch keine Einträge.</p>
{/if}

<style lang="scss">
    @use "../../../../lib/styles/vars";
    a {
        margin: vars.$default-space vars.$default-space;
        align-self: start;
    }
    table {
        margin-top: vars.$default-space;
        border-collapse: collapse;
        th,
        td {
            padding: vars.$default-space;
            border: solid 0.2rem vars.$primary-color;
        }
        button {
            margin: 0 auto;
            background: vars.$red;
            color: white;
        }
    }
    .empty {
        margin-top: vars.$default-space;
    }
</style>
