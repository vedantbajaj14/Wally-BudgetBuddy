<script>
    import { SheetStore } from './stores.js';
    export let sheetID = '';
    export let categoryID = '';
    let item = '';
    let amount = '';
    console.log(`sheetID: ${sheetID}`);
    console.log(`categoryID: ${categoryID}`);

    const addItem = async (event) => {
      event.preventDefault();
      try {
        const res = await fetch(`http://localhost:4002/sheets/${sheetID}/categories/${categoryID}/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ item, amount }),
        });
  
        const data = await res.json();
        item = '';
        amount = '';
        console.log(`Items service returned data: ${JSON.stringify(data)}`);

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
    <form on:submit={addItem}>
      <div class="input">
        <input bind:value={item} class="form-control" placeholder="Item" />
        <input bind:value={amount} class="form-control" placeholder="Amount" />
      </div>
      <button class="btn btn-dark btn-group-sm">Add Item</button>
    </form>
  </div>
  
<style>
    /* Dark theme styles */
  .card {
    background-color: #1e1e1e;
    color: #ffffff;
    margin-bottom: 20px;
    padding: 15px;
    border: none;
    width: 80%;
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
    font-style: italic;
  }

  input:focus {
    background-color: #2c2c2c;
    color: #ffffff;
    border: 1px solid #4e4e4e;
  }

  .input {
    display: flex;
    flex-direction: row;
    width: 90%;
  }

  
</style>