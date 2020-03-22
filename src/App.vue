<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  html,
  body,
  #app {
    height: 100%;
  }
  .van-nav-bar {
    height: 74px;
    line-height: 74px;
  }
  .van-tabs__wrap {
    margin-bottom: 60px;
  }
  .van-tabs__content {
    height: inherit;
  }
</style>
