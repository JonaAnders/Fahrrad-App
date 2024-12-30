<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";

    interface Props {
        form: ActionData;
    }

    let { form }: Props = $props();

    let loading = $state(false);
</script>

<svelte:head><title>Anmelden</title></svelte:head>
<form
    method="post"
    use:enhance={() => {
        loading = true;
        return async ({ update }) => {
            loading = false;
            await update();
        };
    }}
>
    <h2>Login</h2>
    <div class="errors">
        {#each form?.errors ?? [] as error}
            <span class="error">{error}</span>
        {/each}
    </div>
    <input
        type="text"
        name="username"
        minlength="1"
        maxlength="50"
        required
        placeholder="Nutzername"
        value={form?.data.username ?? ""}
    />
    <input
        type="password"
        name="password"
        minlength="1"
        maxlength="50"
        required
        placeholder="Passwort"
    />
    {#if !loading}
        <button type="submit">Anmelden</button>
    {:else}
        <button type="submit" disabled>...</button>
    {/if}
</form>

<style lang="scss">
    @use "../../../lib/styles/vars";
    form {
        display: flex;
        flex-direction: column;
        gap: vars.$default-space * 2;
        padding: 2rem;
        background: vars.$bg-color;
        border: 0.2rem solid vars.$primary-color;
        input,
        button {
            border: 0.2rem solid vars.$primary-color;
            background: vars.$light-bg;
        }
        .errors {
            display: flex;
            flex-direction: column;
            .error {
                color: #f00;
            }
        }
    }
</style>
