<template>
    <van-nav-bar
            :border="false"
            @click-left="onClickLeft"
    >
        <template #left v-if="goBack">
            <van-icon name="arrow-left" size="24px"/>
        </template>
        <template #title>
            <img src="../assets/images/logo_long.png" style="padding-top: 10px;" alt="">
        </template>
    </van-nav-bar>
</template>

<script>
    export default {
        name: "NavBar",
        props: {
            goBack: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            onClickLeft() {
                this.$router.go(-1);
            }
        }
    }
</script>

<style scoped>

</style>