<template>
    <div>
        <nav-bar/>
        <tabbar/>
    </div>
</template>

<script>
    import NavBar from "@/components/NavBar";
    import Tabbar from "@/components/Tabbar";

    export default {
        name: "Mine",
        components: {
            NavBar, Tabbar
        }
    }
</script>

<style scoped>

</style>