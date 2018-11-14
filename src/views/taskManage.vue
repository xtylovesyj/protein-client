<template>
  <div class="home">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "home"
};
</script>
<style scoped lang="scss">
.home {
  height: calc(100% - 60px);
}
</style>

