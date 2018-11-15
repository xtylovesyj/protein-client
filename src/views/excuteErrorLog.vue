<template>
    <div class="excute-error-log">
        <header>
            <span class="back-area">
                <Icon type="ios-arrow-back" :size="30" @click="back" />
            </span>
            <span class="folderName">{{folderName.replace(/(_\d+)$/,'')}}</span>
        </header>
        <div class="error-body" v-if="content">
            {{content}}
        </div>
        <div class="no-content" v-else>
            <span class="text">No Content</span>
        </div>
    </div>
</template>

<script>
export default {
  name: "excuteErrorLog",
  data() {
    return {
      content: "",
      folderName: ""
    };
  },
  created() {
    this.folderName = this.$route.query.fileName;
    this.$http
      .get("taskManage/getExcuteErrorLog", {
        params: {
          folderName: this.folderName
        }
      })
      .then(({ data }) => {
        this.content = data["data"]["detail"];
        //   this.folderName = data["data"]["name"];
      });
  },
  methods: {
    back() {
      this.$router.push("/app");
    }
  }
};
</script>
<style lang="scss" scoped>
.excute-error-log {
  height: calc(100vh - 58px);
  width: 100%;
  & > header {
    text-align: left;
    height: 50px;
    background: white;
    line-height: 50px;
    border-bottom: 1px solid #e9e9e9;
    & > .back-area {
      display: inline-block;
      height: 100%;
      width: 50px;
      text-align: center;
      cursor: pointer;
    }
    & > .folderName {
      color: black;
      font-size: 16px;
      position: relative;
      font-weight: 400;
      top: 2px;
    }
  }
  & > .error-body {
    height: calc(100% - 71px);
    overflow-y: auto;
    font-size: 14px;
    line-height: 25px;
    padding: 10px;
    text-align: left;
  }
  & > .no-content {
    height: calc(100% - 71px);
    & > .text {
      position: relative;
      font-size: 30px;
      color: #ddd;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>