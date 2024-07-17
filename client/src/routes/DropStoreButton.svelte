<script>
    import { SheetStore } from './stores.js';
  
    const dropStore = async (event) => {
      event.preventDefault();
  
      try {
        const res = await fetch(`http://localhost:4003/sheets`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
      } catch (err) {
        console.error(err);
      }
  
      SheetStore.set({});
    };
  </script>
  
  <div class="form-container">
    <form on:submit={dropStore}>
      <button class="btn btn-dark btn-group-sm">Delete All Sheets</button>
    </form>
  </div>
  
<style>
  /* Dark theme styles */
  .form-container {
    display: flex;
    justify-content: center; 
    align-items: center; 
    padding-top: 20px;
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
</style>