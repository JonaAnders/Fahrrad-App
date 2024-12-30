<script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
        children: Snippet;
    };
    let { children }: Props = $props();
</script>

<h1>Admin</h1>

{@render children()}

<style lang="scss">
    h1 {
        align-self: start;
    }
</style>
