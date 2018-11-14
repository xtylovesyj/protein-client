<template>
  <div class="option">
    <div class="option-down">
      <div class="down-left">
        <div class="file-group">
          <div v-if="files.length" class="check-all">
            <Checkbox class="check-box" :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">
              <div class="table-header">
                <span class="check-box-name">名称</span>
                <span>状态</span>
                <span>子文件</span>
                <span>统计图</span>
                <span>蛋白图</span>
                <span>文件上传</span>
              </div>
            </Checkbox>
          </div>
          <CheckboxGroup class="check-box-group" v-model="checkAllGroup" @on-change="checkAllGroupChange">
            <div class="file-item" v-for="(file,key,index) in files" :key="index">
              <Checkbox :label="file.name">
                <div class="table-body" v-on:click="stopPrevent">
                  <span :title="file.displayName" @click="enterStatusMonitor(file.name)">
                    {{file.displayName}}
                  </span>
                  <span v-if="file.isDirectory">
                    <Button class="status-button-notstart status-button" v-if="file.status == 0" type="default" size="small" shape="circle">未开始</Button>
                    <Button class="status-button-running status-button" v-else-if="file.status == 1" type="success" size="small" shape="circle">运行中</Button>
                    <Button class="status-button-error status-button" v-if="file.status == 2" type="error" size="small" shape="circle">异常</Button>
                    <Button class="status-button-completed status-button" v-if="file.status == 3" type="warning" size="small" shape="circle">已完成</Button>
                  </span>
                  <span class="file-text" v-else>- -</span>
                  <span @click="enterFolder(file.name)" v-if="file.isDirectory">
                    <Icon type="ios-folder-open" :size="25" />
                  </span>
                  <span class="file-text" v-else>- -</span>
                  <span @click="enterStatistics(file.name)" v-if="file.hasStatistics">
                    <Icon type="ios-stats" :size="25" />
                  </span>
                  <span class="file-text" v-else>- -</span>
                  <span @click="enterProtein3D(file.name)" v-if="file.hasProtein">
                    <Icon type="ios-appstore-outline" :size="25" />
                  </span>
                  <span class="file-text" v-else>- -</span>
                  <span class="upload-span" v-if="file.isDirectory">
                    <Upload multiple :before-upload="beforeUploadHandler" :on-progress="progressHandler" :on-success="successHandler" :show-upload-list="false" style="display:inline-block;height:1px;" :action="BASE_URL+'/taskManage/uploadInputfiles/'+file.name">
                      <Button class="single-upload" type="primary" size="small" icon="ios-cloud-upload-outline"></Button>
                    </Upload>
                  </span>
                  <span class="file-text" v-else>- -</span>
                </div>
              </Checkbox>
            </div>
          </CheckboxGroup>
        </div>
        <div class="button-option-group">
          <Button type="success" style="margin-right:3%;" v-on:click="createHandler" shape="circle">创建任务</Button>
          <Button :disabled="downloadable" type="success" style="margin-right:3%;" v-on:click="runHandler" shape="circle">执行</Button>
          <Button :disabled="downloadable" type="success" style="margin-right:3%;" v-on:click="downHandler" shape="circle">下载</Button>
          <Button :disabled="deleteable" type="error" style="width:100px;margin-right:3%;" v-on:click="deleteFileHandler" shape="circle">删除</Button>
        </div>
      </div>
    </div>

    <Modal class-name="vertical-center-modal" v-model="deleteConfirm" width="260">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>确定删除？</span>
      </p>
      <div slot="footer">
        <Button type="error" size="large" long @click="ok">删除</Button>
      </div>
    </Modal>

    <Modal v-model="createConfirm" @on-cancel="cancelCreateProtein" title="创建蛋白质" @on-ok="createProtein" class-name="vertical-center-modal">
      <div class="create-protein">
        <label>蛋白质名称：</label>
        <Input v-model="proteinName" placeholder="请输入蛋白质名称" style="width: 70%" />
      </div>
    </Modal>

    <Modal class-name="vertical-center-modal" v-model="executeConfirm" width="260">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span> 您已选{{this.selectedFiles.length}}个蛋白，确定执行？</span>
      </p>
      <div slot="footer">
        <Button type="success" size="large" long @click="okExecute">执行</Button>
      </div>
    </Modal>

    <i-circle v-if="isUploadProgress" class="uploadProgress" :percent="percent" :stroke-color="color">
      <Icon v-if="percent == 100" type="ios-checkmark" size="60" style="color:#5cb85c"></Icon>
      <span v-else style="font-size:24px">{{ percent }}%</span>
    </i-circle>

  </div>
</template>

<script>
import WebSocketService from "../services/websocket.js";
export default {
  name: "TaskManageMain",
  props: {
    msg: String
  },
  data: function() {
    return {
      isDetail: false,
      detailContent: "fdsfds",
      percent: 0,
      isUploadProgress: false,
      populationSize: "",
      backgroundPointSize: "",
      interationSize: "",
      indeterminate: false,
      checkAll: false,
      checkAllGroup: [],
      files: [],
      selectedFiles: [],
      deleteConfirm: false,
      deleteable: true,
      downloadable: true,
      uploadPath: this.BASE_URL + "/taskManage/profile",
      createConfirm: false,
      proteinName: "",
      executeConfirm: false
    };
  },
  created: function() {
    this.getFolders();
    this.websocket = new WebSocketService(
      this.SOCKET_URL + ":9090",
      "taskManage"
    );
    this.websocket.addListener("init", data => {
      this.files = data;
      this.files.map(val => {
        let name = val["name"];
        let displayName = name.replace(/(_\d+)$/, "");
        val["displayName"] = displayName;
      });
    });
  },
  mounted() {},
  methods: {
    getFolders() {
      this.$http.get("taskManage/readFolder").then(data => {
        this.files = data["data"];
        this.files.map(val => {
          let name = val["name"];
          let displayName = name.replace(/(_\d+)$/, "");
          val["displayName"] = displayName;
        });
      });
    },
    stopPrevent(event) {
      const target = event.target || event.srcElement;
      if (target.type !== "file") {
        return event.preventDefault();
      }
    },
    enterStatusMonitor(fileName) {
      this.$router.push({
        path: "taskManage/statusMonitor",
        query: {
          fileName: fileName
        }
      });
    },
    okExecute() {
      this.executeConfirm = false;
      this.$http
        .post("taskManage/excuteTasks", {
          proteins: this.selectedFiles
        })
        .then(data => {
          this.$Message.success(data["data"]);
          this.$http.get("taskManage/readFolder").then(data => {
            this.files = data["data"];
          });
        });
    },
    runHandler() {
      this.executeConfirm = true;
    },
    enterStatistics(fileName) {
      this.$router.push({
        path: "taskManage/statistics",
        query: {
          fileName: fileName
        }
      });
    },
    enterProtein3D(fileName) {
      this.$router.push({
        path: "taskManage/protein3D",
        query: {
          fileName: fileName
        }
      });
    },
    enterFolder(fileName) {
      this.$router.push(`taskManage/taskManageChildFolder/${fileName}`);
    },
    cancelCreateProtein() {
      this.proteinName = "";
    },
    createProtein() {
      this.$http
        .post("taskManage/createProtein", {
          proteinName: this.proteinName
        })
        .then(({ data }) => {
          console.log(data);
          this.$Message.success("蛋白质创建成功");
          // this.files.push(data);
          this.proteinName = "";
          this.getFolders();
        });
    },
    createHandler() {
      this.createConfirm = true;
    },
    ok() {
      this.deleteConfirm = false;
      this.$http
        .post("taskManage/delete", {
          fileName: this.selectedFiles
        })
        .then(data => {
          const deletedData = data["data"];
          this.files = this.files.filter(
            value => !deletedData.includes(value.name)
          );
          this.checkAllGroup = [];
          this.indeterminate = false;
          this.downloadable = true;
          this.deleteable = true;
          this.$Message.success("文件删除成功");
        });
    },
    cancel() {},
    download(fileName) {
      if (!fileName) {
        return;
      }
      let url = `${this.BASE_URL}/taskManage/uploads/${fileName}`;
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      document.body.appendChild(link);
      link.click();
    },
    deleteFileHandler() {
      this.deleteConfirm = true;
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;
      if (this.checkAll) {
        this.checkAllGroup = this.files.map(value => value.name);
        this.deleteable = false;
        this.downloadable = false;
      } else {
        this.checkAllGroup = [];
        this.deleteable = true;
        this.downloadable = true;
      }
    },
    checkAllGroupChange(data) {
      this.selectedFiles = data;
      if (data.length === this.files.length) {
        this.indeterminate = false;
        this.checkAll = true;
        this.deleteable = false;
        this.downloadable = false;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
        this.deleteable = false;
        this.downloadable = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
        this.deleteable = true;
        this.downloadable = true;
      }
    },
    downHandler: function() {
      this.$http
        .post("taskManage/compressFiles", {
          fileName: this.selectedFiles
        })
        .then(data => {
          this.download(data["data"]);
        });
    },
    detailHandler: function() {
      this.isDetail = true;
    },
    closeDetailHandler: function() {
      this.isDetail = false;
    },
    progressHandler: function(data) {
      this.percent = +data["percent"].toFixed();
      if (this.percent === 100) {
        setTimeout(() => {
          this.isUploadProgress = false;
        }, 1000);
      }
    },
    successHandler: function() {
      console.log("success");

      setTimeout(() => {
        this.isUploadProgress = false;
      }, 1000);
    },
    beforeUploadHandler: function() {
      this.isUploadProgress = true;
      console.log("before");
    },
    startHanler: function() {
      console.log("start");
      this.$http.get("taskManage/info").then(data => {
        console.log(data.data);
      });
      console.log(this.populationSize);
      console.log(this.interationSize);
    },
    cancelHandler: function() {
      console.log("cancel");
      this.$http
        .get("http://192.168.1.100:3000/taskManage/uploads/111.doc")
        .then(data => {
          console.log(data);
        });
    }
  },
  computed: {
    color() {
      let color = "#2db7f5";
      if (this.percent == 100) {
        color = "#5cb85c";
      }
      return color;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.file-item {
  text-align: left;
  padding-left: 22px;
  width: 100%;
  .file-name {
    display: inline-block;
    margin-left: 10px;
    text-align: left;
    font-size: 16px;
    & > .file-name-a {
      display: inline-block;
      width: 100%;
      color: black;
    }
  }
  .table-body {
    display: inline-block;
    margin-left: 10px;
    width: calc(100vw - 72.5px);
    height: 45px;
    &:hover {
      cursor: default;
    }
    & > span {
      display: inline-block;
      width: 16.66%;
      font-size: 16px;
      &:hover {
        cursor: pointer;
      }
      & > .status-button {
        width: 52px;
      }
      & > .status-button-notstart {
        &:hover,
        &:active {
          color: #515a6e;
          border-color: #dcdee2;
          cursor: default;
        }
        &:focus {
          box-shadow: none;
        }
      }
    }
    & > .file-text {
      padding-left: 4px !important;
      &:hover {
        cursor: default;
      }
    }
    & > span:first-of-type {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      position: relative;
      top: 9px;
    }
    .upload-span:hover {
      cursor: defalut !important;
    }
  }
}
.option {
  height: calc(100vh - 78px);
  width: 100%;
  position: relative;
  & > .uploadProgress {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    z-index: 1000;
  }
  & > .option-down {
    width: 100%;
    height: 100%;
    & > .down-left {
      width: 100%;
      height: calc(100vh - 60px);
      & > .file-group {
        height: calc(100% - 55px);
        // overflow-y: auto;
        border-bottom: 1px solid #e9e9e9;
        & > .check-box-group {
          height: calc(100% - 45px);
          overflow-y: auto;
        }
        & > .check-all {
          width: 100%;
          padding-top: 8px;
          & > .check-box {
            width: 100%;
            border-bottom: 1px solid #e9e9e9;
            padding-bottom: 6px;
            margin-bottom: 6px;
            text-align: left;
            padding-left: 22px;
            margin-right: 0 !important;

            .table-header {
              display: inline-block;
              margin-left: 10px;
              width: calc(100% - 46px);
              & > span {
                display: inline-block;
                width: 16.66%;
                font-size: 16px;
              }
            }
          }
        }
      }
      & > .button-option-group {
        line-height: 55px;
        button {
          width: 100px;
        }
        .upload-file {
          border-radius: 30px;
          background-color: #007aff;
          color: white;
        }
      }
    }
  }
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #bbb;
}
.hello {
  position: relative;
  min-width: 660px;
  height: 300px;
  background-color: white;
  margin: 0 auto;
  // border:1px solid red;
  // border-radius: 10px;
  & > .upload-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 100;
    transform: translate(-50%, -50%);
  }
  & > .detail {
    & > .detail-close {
      position: absolute;
      top: 8px;
      right: 10px;
      &:hover {
        cursor: pointer;
      }
    }
    position: absolute;
    width: 300px;
    height: 200px;
    z-index: 2;
    background-color: white;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // border-radius: 10px;
    border: 1px solid #ccc;
    & > .detail-header {
      height: 30px;
      line-height: 30px;
      text-align: left;
      padding-left: 10px;
      border-bottom: 2px solid #007aff;
      font-weight: bold;
    }
    & > .detail-content {
      padding: 10px;
      text-align: left;
      height: 120px;
      overflow-y: auto;
      font-size: 10px;
    }
  }
  & > .left {
    float: left;
    background: #eee;
    height: 100%;
    width: 300px;
    border: 2px solid #bbb;
    border-right-width: 0;
    // border-radius: 10px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    & > .list {
      text-align: left;
      padding-left: 20px;
      padding-top: 30px;
      & > .label {
        display: inline-block;
        font-size: 10px;
        margin-right: 10px;
        width: 60px;
        text-align: left;
      }
      & > input {
        // border-radius: 3px;
        // border-color:white;
        // border-radius: 2px;
        // box-shadow: inherit;
      }
      & > #name {
        width: 200px;
      }
      & > button {
        margin-right: 10px;
        width: 80px;
        // border-radius: 20px;
        background: #007aff;
        color: white;
        height: 30px;
        font-weight: bold;
      }
      & > button:last-of-type {
        background: red;
      }
      & > button:first-of-type {
        background-color: #2ad329;
      }
      & > .process {
        position: relative;
        top: 4px;
      }
    }
    & > .list:last-of-type {
      padding-top: 20px;
    }
    & > .process {
      display: inline-block;
      width: 150px;
      height: 150px;
      background-color: #948484;
      // border-radius: 50%;
      margin-top: 5px;
      & > span {
        color: white;
        display: inline-block;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        font-size: 30px;
      }
    }
  }
  & > .right {
    height: 100%;
    margin-left: 300px;
    border: 2px solid #bbb;
    // border-radius: 10px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    & > .image {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      height: 290px;
    }
  }
}
</style>
<style lang="scss">
.single-upload {
  border-radius: 20px !important;
  &:hover {
    cursor: pointer !important;
  }
}

.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal-body {
    padding: 0 !important;
  }
  .ivu-modal {
    top: 0;
  }
  .create-protein {
    width: 100%;
    height: 100px;
    padding-top: 35px;
    padding-left: 20px;
  }
}
</style>
