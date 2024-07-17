<script>
    import { onMount } from 'svelte';
    import { SheetStore } from './stores.js';
    import CategoryCreate from './CategoryCreate.svelte';
    import CategoryList from './CategoryList.svelte';
    import Chart from './Chart.svelte';
    let sheets = {};
  
    onMount(async () => {
      const res = await fetch('http://localhost:4003/sheets');
      const data = await res.json();
      SheetStore.set(data);
    });
  
    SheetStore.subscribe((_sheets) => {
      sheets = _sheets;
    });

    function transformData(categories) {
      return categories.map(category => ({
        category: category.category,
        amount: category.items.reduce((sum, item) => sum + parseFloat(item.amount), 0)
      })).filter(category => category.amount > 0);
    }
  </script>
  
  <div class="d-flex flex-row flex-wrap justify-content-between">
    {#each Object.entries(sheets) as [_, sheet] (sheet.id)}
      <div class="card sheet">
        <div class="card-body">
          <h3>{sheet.title}</h3>
          <CategoryList categories={sheet.categories || []} sheetID={sheet.id} />
          <CategoryCreate sheetId={sheet.id} />
          {#if sheet.categories && sheet.categories.length > 0}
            <Chart data={transformData(sheet.categories)} />
          {/if}
        </div>
      </div>
    {/each}
  </div>
  
  <style>
  
    h3 {
        margin: 0;
        text-align: center;
        color: plum;
    }

    .sheet {
        margin-bottom: 20px;
        width: 30%;
        display: flex;
        flex-direction: column;
    }

    /* Dark theme styles */
    .card {
        background-color: #1e1e1e;
        color: #ffffff;
    }

    .card-body {
        border-color: black;
        display: flex;
        flex-direction: column;
    }
  
    .d-flex {
        flex-wrap: wrap;
        gap: 20px;
        flex-grow: 1;
    }

    .sheet {
        box-shadow: 0 0 10px plum;
        flex-basis: calc(33.33% - 20px); /* Adjust sheet width */
        max-width: calc(33.33% - 20px); /* Prevent sheets from being too wide */
        min-width: 250px; /* Minimum width for smaller screens */
    }
  </style>
  