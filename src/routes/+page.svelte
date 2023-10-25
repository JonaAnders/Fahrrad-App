<script lang="ts">
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import type { PageServerData } from "./$types";

    export let data: PageServerData;

    let showScoreBoard = false;

    onMount(() => {
        showScoreBoard = true;
    });
</script>

<svelte:head>
    <title>Scoreboard</title>
</svelte:head>

<h1>Fahrrad-Fahr-Wettbewerb</h1>
<div class="summed-kilometers">Insgesamt gefahren: {data.summedKilometers} Kilometer</div>
{#if showScoreBoard}
    <div class="scoreboard">
        <h3 transition:slide>Scoreboard</h3>
        <ol>
            {#each data.scoreBoard as entry}
                <li transition:slide>{entry.name}</li>
            {/each}
        </ol>
    </div>
{/if}

<style lang="scss">
    @import "../lib/styles/vars";
    h1 {
        align-self: start;
    }
    .summed-kilometers {
        margin-top: $default-space * 2;
        font-weight: bold;
        font-size: 1.5rem;
        text-align: center;
    }
    .scoreboard {
        width: 33%;
        margin: $default-space * 4 auto 0;
        background: $bg-color;
        border-radius: $default-space;
        border: solid 0.2rem $primary-color;
        h3 {
            text-align: center;
        }
        ol {
            width: 100%;
            list-style-position: inside;
            margin: $default-space;
        }
        li {
            line-height: 1.5;
        }
    }
    @media screen and (max-width: 800px) {
        .scoreboard {
            width: 90%;
        }
    }
</style>
