<template>
  <div id="app">
    <div id="nav">
      <span class="nav-title">PPMS</span>
      <router-link class="link" to="/taskManage">
        任务管理
      </router-link> |
      <router-link class="link" to="/statusMonitor">状态监控</router-link> |
      <router-link class="link" to="/statistics">数据统计</router-link> |
      <!-- <router-link class="link" to="/predict">结果预测</router-link> |
      <router-link class="link" to="/dataAnalysis">数据分析</router-link> |
      <router-link class="link" to="/tools">工具箱</router-link> -->
      <div class="user">
        <Icon type="ios-contact" style="font-size:40px;margin-right:5px;" />{{name}}
      </div>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  name: "app",
  data() {
    return {
      name: "unknow"
    };
  },
  created() {
    this.name = sessionStorage.getItem("user");
  },
  destroyed() {
    sessionStorage.clear();
  }
};
</script>


<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  min-width: 480px;
}
#nav {
  position: relative;
  padding-left: 20px;
  padding-right: 20px;
  height: 58px;
  line-height: 58px;
  background-color: black;
  & > .nav-title {
    // position: absolute;
    // top:19px;
    // left:22px;
    float: left;
    font-size: 14px;
    font-weight: bolder;
    color: white;
  }
  & > .user {
    float: right;
    font-size: 14px;
    font-weight: bolder;
    color: white;
    height: 100%;
  }
  a {
    font-weight: bold;
    color: white;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
