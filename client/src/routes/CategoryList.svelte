<script>
    import { onMount } from 'svelte';
    import { SheetStore } from './stores.js';
    import ItemList from './ItemList.svelte';
    import ItemCreate from './ItemCreate.svelte';
    export let categories = [];
    export let sheetID;

    onMount(async () => {
        const res = await fetch('http://localhost:4003/sheets');
        const data = await res.json();
        SheetStore.set(data);
    });

    console.log(`sheetID: ${sheetID}`);
    console.log(`categories: ${JSON.stringify(categories)}`);
  </script>
  
  <ul class="list-unstyled">
    {#each categories as categoryObj (categoryObj.id)}
      <li class="mb-2">
        <div class="card container d-flex align-items-center">
            <div class="card-body category-content mr-2">
                <span class="category">{categoryObj.category}</span>
            </div>
            <ItemList items={categoryObj.items || []} sheetID={sheetID} categoryID={categoryObj.id} />
            <ItemCreate sheetID={sheetID} categoryID={categoryObj.id}/>
        </div>
      </li>
    {/each}
  </ul>
  
  <style>
  
    .category-content {
      flex-grow: 1;
      margin-left: 0.5rem;
      font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: larger;
    }

    .card {
        margin-bottom: 20px;
        width: 80%;
        background-color: rgb(16, 16, 16);
        color: #ffffff;
    }

    .card-body {
        border-color: #080808;
        justify-content: center;
    }
  
    ul.list-unstyled {
      padding-left: 0;
    }
  
    ul.list-unstyled li {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #333;
      padding: 10px 0;
    }

    span {
      text-align: center;
      align-content: center;
    }
    
  </style>
  