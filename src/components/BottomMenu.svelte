<script>
    import FaTrophy from 'svelte-icons/fa/FaTrophy.svelte'
    import GiDigDug from 'svelte-icons/gi/GiDigDug.svelte'
    import GiDiceSixFacesFive from 'svelte-icons/gi/GiDiceSixFacesFive.svelte'
    import FaList from 'svelte-icons/fa/FaList.svelte'
    import { Router, Link } from "svelte-routing";
    function vibrate() {
        if (navigator.vibrate) {
            // вибрация на 200 миллисекунд
            navigator.vibrate(200);
        } else {
            console.log("Ваш браузер не поддерживает API вибрации.");
        }
    }
</script>
<div class="bottom-menu">
    <Link to="/">
        <div on:click={vibrate} class="icon">
            <GiDigDug  />
        </div>
    </Link>
    <Link to="/battle">
        <div on:click={vibrate} class="icon">
            <GiDiceSixFacesFive  />
        </div>
    </Link>
    <Link to="/tournament">
        <div on:click={vibrate} class="icon">
            <FaTrophy  />
        </div>
    </Link>
    <Link to="/tasks">
        <div on:click={vibrate} class="icon">
            <FaList  />
        </div>
    </Link>   
</div>

<style lang="scss">
    .icon {
        width: 20px;
        height: 20px;
        cursor: pointer;
        &:hover {
            color:#5a5a5a
        }
    }
    .bottom-menu {
        position: fixed;
        bottom: 0;
        left: 0;
        height: 75px;
        width: 100%;
        background-color: #333;
        color: white;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
    }
</style>