<script lang="ts">
    import type { ActionData } from "./$types";

    export let form: ActionData;

    let loading = false;
</script>

<form method="post">
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
    @import "../../../lib/styles/vars";
    form {
        display: flex;
        flex-direction: column;
        gap: $default-space * 2;
        padding: 2rem;
        background: $bg-color;
        border: 0.2rem solid $primary-color;
        input,
        button {
            border: 0.2rem solid $primary-color;
            background: $light-bg;
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
