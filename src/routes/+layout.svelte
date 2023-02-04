<script lang="ts">
    import "$lib/styles/styles.scss";
</script>

<main><slot /></main>

<style lang="scss">
    @import "../lib/styles/vars.scss";
    main {
        margin: 0 16.5%;
        min-height: 100vh;
        min-height: 100svh;
        flex: 1 1 auto;
        background: $light-bg;
    }
</style>
