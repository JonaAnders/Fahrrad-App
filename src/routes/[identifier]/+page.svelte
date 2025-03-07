<script lang="ts">
    import { enhance } from "$app/forms";
    import Bicycle from "$lib/assets/img/Bicycle.svelte";
    import { onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    import type { PageServerData } from "./$types";

    interface Props {
        data: PageServerData;
    }

    let { data }: Props = $props();

    let scoreboard = $derived(
        [...data.groupScoreboard].concat(new Array(10 - data.groupScoreboard.length).fill(0))
    );

    let showBicycle = $state(false);
    let showTable = $state(false);
    onMount(() => {
        showBicycle = true;
        showTable = true;
    });

    let loading = $state(false);
    let failure = false;
</script>

<svelte:head>
    <title>{data.groupName}</title>
</svelte:head>

<h1>{data.groupName}</h1>
<a href="/"
    ><svg viewBox="0 0 24 24" class="icon" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8 6H21"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M8 12H21"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M8 18H21"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M3 6H3.01"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M3 12H3.01"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M3 18H3.01"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>Zur Übersicht</a
>
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
<h3>Gefahrene Kilometer: {data.summedKilometers}km</h3>
{#if showTable}
    <table class="scoreboard">
        <thead>
            <tr transition:slide><th>Scoreboard</th></tr>
        </thead>
        <tbody>
            {#each scoreboard as scoreboardEntry}
                <tr transition:slide><td>{scoreboardEntry}km</td></tr>
            {/each}
        </tbody>
    </table>
{/if}

{#if showBicycle}
    <div class="bicycle-wrapper">
        <Bicycle />
    </div>
{/if}

<style lang="scss">
    @use "../../lib/styles/vars";
    h1 {
        align-self: flex-start;
    }
    a {
        display: flex;
        white-space: nowrap;
        align-self: start;
        .icon {
            width: 1rem + vars.$default-space;
            height: 1rem;
            padding-right: vars.$default-space;
        }
    }
    form {
        display: flex;
        max-width: 90%;
        input {
            max-width: 100%;
            padding-right: 2rem;
            position: relative;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        label.kilometer-label {
            position: relative;
            max-width: 100%;
            &::after {
                content: "km";
                position: absolute;
                top: 0;
                right: vars.$default-space;
                transform: translateY(50%);
            }
        }
        button {
            background: vars.$primary-color;
            color: vars.$light-bg;
        }
    }
    h3 {
        margin-top: vars.$default-space * 4;
        text-align: center;
    }
    .scoreboard {
        min-width: 33%;
        max-width: 90%;
        margin: vars.$default-space * 2 auto 0;
        background: vars.$bg-color;
        border-radius: vars.$default-space;
        border: solid 0.2rem vars.$primary-color;
        tr {
            display: flex;
            width: 100%;
        }
        tr:first-child {
            justify-content: center;
        }
        td {
            line-height: 1.5;
            padding: 0 vars.$default-space;
            display: flex;
        }
        td {
            display: flex;
            width: 100%;
            padding: 0 vars.$default-space;
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
        max-width: 100%;
        flex: 1 1 auto;
    }

    @media screen and (max-width: 800px) {
        .scoreboard {
            min-width: 80%;
        }
    }
</style>
