<script lang="ts">
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import type { PageServerData } from "./$types";

    export let data: PageServerData;

    let showTable = false;

    onMount(() => {
        showTable = true;
    });
</script>

<svelte:head>
    <title>Scoreboard</title>
</svelte:head>

<h1>Fahrrad-Fahr-Wettbewerb</h1>
{#if showTable}
    <table class="scoreboard">
        <tr transition:slide><th>Scoreboard</th></tr>
        {#each data.scoreBoard as entry}
            <tr transition:slide><td>{entry.name}</td><td>{entry.kilometers}km</td></tr>
        {/each}
    </table>
{/if}

<style lang="scss">
    @import "../lib/styles/vars";
    .scoreboard {
        width: 33%;
        margin: 3rem auto 0;
        background: $bg-color;
        border-radius: $default-space;
        border: solid 0.2rem $primary-color;
        tr:first-child {
            display: inherit;
        }
        tr {
            display: flex;
            width: 100%;
        }
        td {
            line-height: 1.5;
            padding: 0 $default-space;
            display: flex;
        }
        td:first-child {
            text-align: left;
            white-space: nowrap;
        }
        td:last-child {
            text-align: right;
            width: 100%;
            &::before {
                content: "";
                width: calc(100% - $default-space * 2);
                transform: translateX(-$default-space);
                border-bottom: dotted #000 0.1rem;
                align-self: center;
                flex: 1 1 auto;
            }
        }
    }
</style>
