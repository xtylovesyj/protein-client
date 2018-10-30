<template>
  <div class="child">
    <header>
      <span class="back-area">
        <Icon type="ios-arrow-back" :size="30" @click="back" />
      </span>
      <span class="folderName">{{folderName}}</span>
    </header>
    <div class="file-group">
      <div class="check-all">
        <Checkbox class="check-box" :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">
          <span>所有</span>
        </Checkbox>
      </div>
      <CheckboxGroup class="check-box-group" v-model="checkAllGroup" @on-change="checkAllGroupChange">
        <div class="output-files">
          <div class="header">
            输出文件
          </div>
          <div class="default-page" v-if="!outputFiles.length">
            该文件夹为空
          </div>
          <div v-else class="file-item" v-for="(file,key,index) in outputFiles" :key="index">
            <Checkbox :label="file.id">
              <span class="file-name" :title="file.value">
                {{file.value}}
              </span>
            </Checkbox>
          </div>
        </div>
        <div class="input-files">
          <div class="header">
            输入文件
          </div>
          <div class="default-page" v-if="!inputFiles.length">
            该文件夹为空
          </div>
          <div v-else class="file-item" v-for="(file,key,index) in inputFiles" :key="index">
            <Checkbox :label="file.id">
              <span class="file-name" :title="file.value">
                {{file.value}}
              </span>
            </Checkbox>
          </div>
        </div>
      </CheckboxGroup>
    </div>
    <div class="button-option-group">
      <Button :disabled="downloadable" type="success" style="width:120px;margin-right:8%;" v-on:click="downHandler" shape="circle">下载</Button>
      <Button :disabled="deleteable" type="error" style="width:120px;" v-on:click="deleteFileHandler" shape="circle">删除</Button>
    </div>
    <Modal class-name="vertical-center-modal" v-model="deleteConfirm" width="260">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span> 确定删除 ?</span>
      </p>
      <div slot="footer">
        <Button type="error" size="large" long @click="ok">删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "child",
  data: function() {
    return {
      folderName: "",
      indeterminate: false,
      checkAll: false,
      checkAllGroup: [],
      files: [],
      selectedFiles: [],
      deleteConfirm: false,
      deleteable: true,
      downloadable: true,
      inputFiles: [],
      outputFiles: [],
      otherFiles: [],
      allFilesLength: 0
    };
  },
  created: function() {
    this.folderName = this.$route.params.fileName;
    this.$http
      .post("taskManageChildFolder/childFolder", {
        fileName: this.folderName
      })
      .then(data => {
        this.inputFiles = data["data"]["inputFiles"];
        this.inputFiles = this.inputFiles.map((value, index) => {
          return {
            value: value,
            folder: "input",
            id: index + "input"
          };
        });
        this.outputFiles = data["data"]["outputFiles"];
        this.outputFiles = this.outputFiles.map((value, index) => {
          return {
            value: value,
            folder: "output",
            id: index + "output"
          };
        });
        this.allFilesLength = this.inputFiles.length + this.outputFiles.length;
      });
  },
  methods: {
    ok() {
      this.deleteConfirm = false;
      let selectedItems = [];
      this.selectedFiles.forEach(val => {
        this.inputFiles.forEach(value => {
          if (val === value.id) {
            selectedItems.push(value);
          }
        });
        this.outputFiles.forEach(value => {
          if (val === value.id) {
            selectedItems.push(value);
          }
        });
      });
      this.$http
        .post("taskManageChildFolder/delete", {
          folderItems: selectedItems,
          parentFolder: this.folderName
        })
        .then(data => {
          data = data["data"];
          data.forEach(value => {
            if (value.folder === "input") {
              this.inputFiles = this.inputFiles.filter(
                ele => ele.id !== value.id
              );
            } else if (value.folder === "output") {
              this.outputFiles = this.outputFiles.filter(
                ele => ele.id !== value.id
              );
            }
          });
          this.$Message.success(`成功删除${data.length}项文件`);
        });
    },
    back() {
      this.$router.push("/app");
    },
    cancel() {},
    download(fileName) {
      if (!fileName) {
        return;
      }
      let url = `${this.BASE_URL}/taskManageChildFolder/downloads/${fileName}`;
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
        let inputLabels = [];
        let outputLabels = [];
        if (this.inputFiles.length) {
          inputLabels = this.inputFiles.map(value => value.id);
        }
        if (this.outputFiles.length) {
          outputLabels = this.outputFiles.map(value => value.id);
        }
        this.checkAllGroup = inputLabels.concat(outputLabels);
        this.selectedFiles = this.checkAllGroup;
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
      if (data.length === this.allFilesLength) {
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
      let selectedItems = [];
      this.selectedFiles.forEach(val => {
        this.inputFiles.forEach(value => {
          if (val === value.id) {
            selectedItems.push(value);
          }
        });
        this.outputFiles.forEach(value => {
          if (val === value.id) {
            selectedItems.push(value);
          }
        });
      });
      this.$http
        .post("taskManageChildFolder/compressChildFiles", {
          folderItems: selectedItems,
          parentFolder: this.folderName
        })
        .then(data => {
          this.download(data["data"]);
        });
    }
  }
};
</script>

<style scope lang="scss">
.child {
  height: calc(100vh - 58px);
  & > header {
    text-align: left;
    width: 100%;
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
  .default-page {
    height: 40px;
    line-height: 40px;
    color: #d6cdcd;
    font-size: 16px;
  }
  .file-group {
    height: calc(100% - 115px);
    width: 100%;
    & > .check-box-group {
      height: calc(100% -31px);
      overflow-y: auto;
      & > .output-files {
        margin-top: -6px;
        & > .header {
          position: relative;
          padding-left: 20px;
          padding-top: 8px;
          font-size: 16px;
          font-weight: bold;
          height: 40px;
          background-color: #336699;
          color: white;
          text-align: left;
        }
      }
      & > .input-files {
        & > .header {
          position: relative;
          padding-left: 20px;
          padding-top: 8px;
          font-size: 16px;
          font-weight: bold;
          height: 40px;
          background-color: #336699;
          color: white;
          text-align: left;
        }
      }
    }
  }
  .file-item {
    text-align: left;
    padding-left: 22px;
    width: 100%;
    .file-name {
      display: inline-block;
      margin-left: 10px;
      text-align: left;
      font-size: 16px;
    }
  }
  .check-all {
    width: 100%;
    & > .check-box {
      width: 100%;
      text-align: left;
      padding-left: 14px;
      margin-right: 0 !important;
      border-bottom: 1px solid #e9e9e9;
      & > span {
        margin-left: 8px;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
</style>


