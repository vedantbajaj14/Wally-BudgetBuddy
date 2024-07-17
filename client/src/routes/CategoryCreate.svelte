<script>
    import { SheetStore } from './stores.js';
    export let sheetId = '';
    let category = '';
  
    const createCategory = async (event) => {
      event.preventDefault();
      try {
        const res = await fetch(`http://localhost:4001/sheets/${sheetId}/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ category }),
        });
  
        const data = await res.json();
        category = '';
        console.log(`Category service returned data: ${JSON.stringify(data)}`);

        const queryRes = await fetch('http://localhost:4003/sheets');
        const queryData = await queryRes.json();
  
        SheetStore.update((sheets) => {
            sheets = queryData;
            return sheets;
        });
        
      } catch (err) {
        console.log(err);
      }
    }
  </script>
  
  <div class="card">
    <form on:submit={createCategory}>
      <div class="form-group">
        <input bind:value={category} class="form-control" placeholder="Category Name" />
      </div>
      <button class="btn btn-dark btn-group-sm">Add Category</button>
    </form>
  </div>
  
  <style>
    /* Dark theme styles */
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 10px; /* Adjust gap between form elements */
    }
  
    .card {
      background-color: #1e1e1e;
      color: #ffffff;
      margin-bottom: 20px;
      padding: 15px;
      border: none;
    }
  
    .btn {
      color: #ffffff;
      background-color: black;
    }
  
    .btn:hover {
      background-color: #46464600;
      border-color: #2e2c2c ;
    }
  
    .form-control {
      margin-bottom: 0.5rem;
      background-color: #2c2c2c;
      color: #ffffff;
      border: 1px solid #4e4e4e;
    }
  
    .form-control::placeholder {
      color: #b1b1b1;
    }
  
  </style>