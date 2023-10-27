<script lang="ts">
    import type { PageServerData } from "./$types";

    export let data: PageServerData;
</script>

<svelte:head>
    <title>Admin Panel</title>
</svelte:head>

<h2>Hallo, {data.username}</h2>

<a href="/admin/users" class="user-management"
    >Zur Benutzerverwaltung <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
</a>
<table>
    <tr>
        <th>Platz</th>
        <th>Gruppe</th>
        <th>Kilometer</th>
        <th>Anzahl der Einträge</th>
        <th>Link</th>
        <th>Team Übersicht</th>
    </tr>
    {#each data.tableInformation as row, i}
        <tr
            ><td>{i + 1}</td><td>{row.name}</td><td>{row.kilometers}</td><td>{row.mileageCount}</td
            ><td><a href="/{row.identifier}">{row.identifier}</a></td><td
                ><a href="/admin/{row.identifier}" class="link-icon-wrapper"
                    ><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11"
                            stroke="black"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M15 3H21V9"
                            stroke="black"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M10 14L21 3"
                            stroke="black"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </a></td
            ></tr
        >
    {/each}
</table>

<style lang="scss">
    @import "$lib/styles/vars";
    .user-management {
        align-self: center;
        display: flex;
        white-space: nowrap;
        margin: $default-space;
        svg {
            width: 1rem + $default-space;
            height: 1rem;
            padding-left: calc($default-space / 2);
        }
    }
    table {
        border-collapse: collapse;
        margin-top: $default-space;
        th,
        td {
            padding: $default-space;
            border: solid 0.2rem $primary-color;
        }
    }
    .link-icon-wrapper {
        display: flex;
        justify-content: center;
        &::before {
            content: unset;
        }
        svg {
            height: 1rem;
        }
    }
</style>
