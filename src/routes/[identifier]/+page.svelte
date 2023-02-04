<script lang="ts">
    import { enhance } from "$app/forms";
    import Bicycle from "$lib/assets/img/Bicycle.svelte";
    import { onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    import type { PageServerData } from "./$types";

    export let data: PageServerData;
    let showBicycle = false;
    let showTable = false;
    onMount(() => {
        showBicycle = true;
        showTable = true;
    });

    let loading = false;
    let failure = false;
</script>

<svelte:head>
    <title>{data.groupName}</title>
</svelte:head>

<h1>{data.groupName}</h1>
<form
    method="post"
    use:enhance={() => {
        loading = true;
        return async ({ update }) => {
            loading = false;
            update({ reset: true });
        };
    }}
>
    {#if failure}
        <div class="error" transition:fade>
            Die Daten konnten nicht übertragen werden. Bitte versuche es später erneut.
        </div>
    {/if}
    <label class="kilometer-label"
        ><input
            type="number"
            name="kilometers"
            min="0"
            max="150"
            step="0.01"
            placeholder="12,34"
            required
        /></label
    ><button type="submit">
        {#if loading}
            ...
        {:else}
            Speichern
        {/if}</button
    >
</form>
{#if showTable}
    <table class="scoreboard">
        <tr transition:slide><th>Scoreboard</th></tr>
        {#each data.groupScoreboard as scoreboardEntry}
            <tr transition:slide><td>{scoreboardEntry}km</td></tr>
        {/each}
    </table>
{/if}

{#if showBicycle}
    <div class="bicycle-wrapper">
        <Bicycle />
    </div>
{/if}

<style lang="scss">
    @import "../../lib/styles/vars";
    :global(main) {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    h1 {
        align-self: flex-start;
    }
    form {
        display: flex;
        width: 33%;
        input {
            width: 100%;
            padding-right: 2rem;
            position: relative;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        label.kilometer-label {
            position: relative;
            width: 100%;
            &::after {
                content: "km";
                position: absolute;
                top: 0;
                right: $default-space;
                transform: translateY(50%);
            }
        }
        button {
            background: $primary-color;
            color: $light-bg;
        }
    }
    .scoreboard {
        width: 33%;
        margin: 3rem auto 0;
        background: $bg-color;
        border-radius: $default-space;
        border: solid 0.2rem $primary-color;
        tr {
            display: flex;
            width: 100%;
        }
        tr:first-child {
            justify-content: center;
        }
        td {
            line-height: 1.5;
            padding: 0 $default-space;
            display: flex;
        }
        td {
            display: flex;
            width: 100%;
            padding: 0 $default-space;
            line-height: 1.5;
            text-align: right;
            &::before {
                content: "";
                width: 100%;
                border-bottom: dotted #000 0.1rem;
                align-self: center;
            }
        }
    }
    .bicycle-wrapper {
        width: 33%;
        flex: 1 1 auto;
    }
</style>
