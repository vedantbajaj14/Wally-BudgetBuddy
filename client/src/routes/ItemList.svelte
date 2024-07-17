<script>
    import { SheetStore } from './stores.js';
    import { onMount } from 'svelte';
    export let items = [];
    export let sheetID = '';
    export let categoryID = '';
    console.log(`sheetID: ${sheetID}`);
    console.log(`categoryID: ${categoryID}`);

    onMount(async () => {
        const res = await fetch('http://localhost:4003/sheets');
        const data = await res.json();
        SheetStore.set(data);
    });

    console.log(`items: ${JSON.stringify(items)}`);
</script>

{#if items.length === 0}
    <p></p>
{:else}
    <div class="item-container">
        {#each items as itemObj (itemObj.id)}
            <div class="item">
                <p class="content">{itemObj.item}</p>
                <p class="amount">${itemObj.amount}</p>
            </div>
        {/each}
    </div>
{/if}

<style>
    .item-container {
        display: flex;
        flex-direction: column;
    }

    .item {
        display: flex;
        flex-direction: row;
        margin-right: 10px;
    }

    p {
        margin-right: 10px;
    }

    .amount {
        margin-left: 10px;
    }

    .content {
        flex-grow: 1;
        flex-wrap: wrap;
        text-align: left;
    }
</style>