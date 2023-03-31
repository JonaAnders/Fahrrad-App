<script lang="ts">
    import "$lib/styles/styles.scss";
</script>

<svelte:head>
    <title>Fahrrad-Wettbewerb</title>
</svelte:head>
<main><slot /></main>

<style lang="scss">
    @import "../lib/styles/vars.scss";
    main {
        margin: 0 16.5%;
        min-height: 100vh;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1 1 auto;
        background: $light-bg;
    }
    @media screen and (max-width: 800px) {
        main {
            margin: 0 0;
        }
    }
</style>
