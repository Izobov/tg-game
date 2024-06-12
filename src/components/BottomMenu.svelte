<script>
    import FaTrophy from 'svelte-icons/fa/FaTrophy.svelte'
    import GiDigDug from 'svelte-icons/gi/GiDigDug.svelte'
    import GiDiceSixFacesFive from 'svelte-icons/gi/GiDiceSixFacesFive.svelte'
    import FaList from 'svelte-icons/fa/FaList.svelte'
    import { Router, Link } from "svelte-routing";

</script>
<div class="bottom-menu">
    <Link to="/">
        <div class="icon">
            <GiDigDug  />
        </div>
    </Link>
    <Link to="/battle">
        <div class="icon">
            <GiDiceSixFacesFive  />
        </div>
    </Link>
    <Link to="/tournament">
        <div class="icon">
            <FaTrophy  />
        </div>
    </Link>
    <Link to="/tasks">
        <div class="icon">
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
        width: 100%;
        height: 50px;
        background-color: #333;
        color: white;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
    }
</style>