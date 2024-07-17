<script>
    import { SheetStore } from './stores.js';
    let title = '';
  
    const makeSheet = async (event) => {
      event.preventDefault();
      try {
        const res = await fetch('http://localhost:4000/sheets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title }),
        });
  
        const data = await res.json();
        title = '';
        console.log(`Client: ${JSON.stringify(data)}`);
  
        SheetStore.update((sheets) => {
          console.log(`SheetStore: ${JSON.stringify({ ...sheets, [data.id]: data })}`);
          return { ...sheets, [data.id]: data };
        });
      } catch (err) {
        console.log(err);
      }
    }
</script>

<div class="form-container">
  <div class="card">
    <form on:submit={makeSheet}>
      <div class="form-group">
        <span>Make a New Tab: {title}</span>
        <input bind:value={title} class="form-control" placeholder="Add Sheet's Title" />
      </div>
      <button class="btn btn-dark btn-group-sm">Create Sheet</button>
    </form>
  </div>
</div>

<style>
  .form-container {
    display: flex;
    justify-content: center; 
    align-items: center; 
    padding-top: 20px;
  }

  /* Dark theme styles */
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 10px; /* Adjust gap between form elements */
  }

  .form-group span {
    margin: 0;
    color: plum;
    font-size: x-large;
    font-weight: 200;
  }

  .card {
    box-shadow: 0 0 10px plum;
    background-color: #1e1e1e;
    color: #ffffff;
    margin-bottom: 20px;
    padding: 15px;
    border: none;
    width: 40%;
  }

  .btn {
    color: #ffffff;
    background-color: black;
    font-size: larger;
    font-weight: 200;
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
  
</style>