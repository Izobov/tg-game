<h1>Tournament</h1>

<div class="wrapper">
    <div class="tournament">
        <div class="info">
            <div class="name">Binance</div>
            <div class="users">200k users</div>
        </div>
        <div class="pool">
            <div class="name">Prize pool</div>
            <div>20 000 USDT</div>
        </div>
    </div>
    <div class="tournament"></div>
</div>

<style>
    .wrapper {
        color: white;
        background-color: #4b4b4b;
        flex-grow: 1;
        width: 100%;
        display: flex;
        padding: 10px;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        justify-content: start;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    .tournament {
        width: 100%;
        height: 76px;
        border-radius: 10px;
        background: #6a6868;
        display: flex;
        padding:10px 5px;
        align-items: start;
        justify-content: space-between;
    }

    .info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        justify-content: start;
        align-items: start;
    }
    .name {
        font-size: 20px;
        font-weight: 500;
    }
    .users {
        font-size: 16px;
        color: rgb(191, 191, 191);
    }
</style>