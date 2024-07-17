<script>
    import SheetCreate from './SheetCreate.svelte';
    import SheetList from './SheetList.svelte';
    import DropStoreButton from './DropStoreButton.svelte';
</script>

<div class="container">
    <h1>Wally: Your BudgetBuddy</h1>
    <SheetCreate />
    <DropStoreButton /> 
    <hr />
    <h2>Expense Sheets</h2>
    <SheetList />
</div>

<style>
    h1 {    
        align-content: center;
        text-align: center;
        color: plum;
        font-weight: 200;
        font-style: italic;
    }

    h2 {
        align-content: center;
        text-align: center;
        color: rgb(255, 255, 255);
        font-weight: 100;
    }

    .container {
        justify-content: center;
        margin: 0;
        width: 100%;
        height: 100%;
        background-color: #121212;
        color: #ffffff;
        min-height: 100vh;
    }
</style>