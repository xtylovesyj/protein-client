<template>
  <div id="app">
    <div id="nav">
      <span class="nav-title">PPMS</span>
      <!-- <router-link class="link" to="/taskManage">
        任务管理
      </router-link> |
      <router-link class="link" to="/statusMonitor">状态监控</router-link> |
      <router-link class="link" to="/statistics">数据统计</router-link> | -->
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
import WebSocketService from "./services/websocket.js";
export default {
  name: "app",
  data() {
    return {
      name: "unknow"
    };
  },
  created() {
    this.name = sessionStorage.getItem("user");
    this.websocket = new WebSocketService(this.SOCKET_URL + ":9090", "home");
    this.websocket.addListener("errorTask", data => {
      this.renderFunc(data["proteinName"]);
    });
  },
  destroyed() {
    sessionStorage.clear();
  },
  methods: {
    renderFunc(name) {
      this.$Notice.error({
        title: `${name.replace(/(_\d+)$/,'')}运行错误`,
        desc: "<a>点击查看详细信息</a>",
        duration: 0,
        render: h => {
          return h("span", [
            "查看详细错误信息请",
            h(
              "a",
              {
                attrs: {
                  href:`taskManage/excuteErrorLog?fileName=${name}`
                },
                style: {
                  color: "red"
                }
              },
              "点击这里"
            )
          ]);
        }
      });
    }
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
