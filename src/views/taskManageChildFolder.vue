<template>
  <div class="child">
    <header>
      <span class="back-area">
        <Icon type="ios-arrow-back" :size="30" @click="back" />
      </span>
      <span class="folderName">{{folderName.replace(/(_\d+)$/,'')}}</span>
    </header>
    <div class="file-group">
      <div class="check-all" v-if="outputFiles.length || inputFiles.length">
        <Checkbox class="check-box" :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">
          <span>所有</span>
        </Checkbox>
      </div>
      <div class="check-box-group">
        <div class="header">
          <Checkbox class="check-box" :indeterminate="indeterminateOutput" :value="checkOutputAll" @click.prevent.native="handleCheckOutputAll">
            <span class="check-text">输出文件</span>
          </Checkbox>
        </div>
        <CheckboxGroup class="check-box-group-out" v-model="checkAllOutputGroup" @on-change="checkAllOutputGroupChange">
          <div class="output-files">
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
        </CheckboxGroup>
      </div>
      <div class="check-box-group">
        <div class="header">
          <Checkbox class="check-box" :indeterminate="indeterminateInput" :value="checkInputAll" @click.prevent.native="handleCheckInputAll">
            <span class="check-text">输入文件</span>
          </Checkbox>
        </div>
        <CheckboxGroup class="check-box-group-in check-box-group" v-model="checkAllInputGroup" @on-change="checkAllInputGroupChange">
          <div class="input-files">
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
      indeterminateInput: false,
      indeterminateOutput: false,
      checkAll: false,
      checkInputAll: false,
      checkOutputAll: false,
      checkAllGroup: [],
      checkAllInputGroup: [],
      checkAllOutputGroup: [],
      files: [],
      selectedFiles: [],
      selectedInputFiles: [],
      selectedOutputFiles: [],
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
        .then(({ data }) => {
          console.log(data);
          data.forEach(value => {
            if (value.folder === "input") {
              this.inputFiles = this.inputFiles.filter(
                ele => ele.id != value.id
              );
            } else if (value.folder === "output") {
              this.outputFiles = this.outputFiles.filter(
                ele => ele.id != value.id
              );
            }
          });
          this.allFilesLength =
            this.inputFiles.length + this.outputFiles.length;
          this.indeterminateOutput = false;
          this.checkOutputAll = false;
          this.indeterminate = false;
          this.selectedInputFiles = [];
          this.selectedOutputFiles = [];
          this.selectedFiles = [];
          this.checkAll = false;
          this.indeterminateInput = false;
          this.checkInputAll = false;
          this.deleteable = true;
          this.downloadable = true;
          this.checkAllGroup = [];
          this.checkAllInputGroup = [];
          this.checkAllOutputGroup = [];
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
        this.checkAllInputGroup = this.inputFiles.map(value => value.id);
        this.selectedInputFiles = this.checkAllInputGroup;
        this.checkAllOutputGroup = this.outputFiles.map(value => value.id);
        this.selectedOutputFiles = this.checkAllOutputGroup;
        this.checkInputAll = true;
        this.checkOutputAll = true;
        this.deleteable = false;
        this.downloadable = false;
      } else {
        this.checkAllInputGroup = [];
        this.selectedInputFiles = [];
        this.checkAllOutputGroup = [];
        this.selectedOutputFiles = [];
        this.deleteable = true;
        this.downloadable = true;
        this.checkInputAll = false;
        this.checkOutputAll = false;
      }
      this.indeterminateInput = false;
      this.indeterminateOutput = false;
      this.changeAllStatus();
    },
    handleCheckInputAll() {
      if (!this.inputFiles.length) {
        return;
      }
      if (this.indeterminateInput) {
        this.checkInputAll = false;
      } else {
        this.checkInputAll = !this.checkInputAll;
      }
      this.indeterminateInput = false;
      if (this.checkInputAll) {
        this.checkAllInputGroup = this.inputFiles.map(value => value.id);
        this.selectedInputFiles = this.checkAllInputGroup;
        this.deleteable = false;
        this.downloadable = false;
      } else {
        this.checkAllInputGroup = [];
        this.selectedInputFiles = [];
        if (this.selectedOutputFiles.length === 0) {
          this.deleteable = true;
          this.downloadable = true;
        }
      }
      this.changeAllStatus();
    },
    handleCheckOutputAll() {
      if (!this.outputFiles.length) {
        return;
      }
      if (this.indeterminateOutput) {
        this.checkOutputAll = false;
      } else {
        this.checkOutputAll = !this.checkOutputAll;
      }
      this.indeterminateOutput = false;
      if (this.checkOutputAll) {
        this.checkAllOutputGroup = this.outputFiles.map(value => value.id);
        this.selectedOutputFiles = this.checkAllOutputGroup;
        this.deleteable = false;
        this.downloadable = false;
      } else {
        this.checkAllOutputGroup = [];
        this.selectedOutputFiles = [];
        if (this.selectedInputFiles.length === 0) {
          this.deleteable = true;
          this.downloadable = true;
        }
      }
      this.changeAllStatus();
    },
    checkAllInputGroupChange(data) {
      this.selectedInputFiles = data;
      if (data.length === this.inputFiles.length) {
        setValue.call(this, false, true, false, false);
      } else if (data.length > 0) {
        setValue.call(this, true, false, false, false);
      } else {
        if (this.selectedOutputFiles.length !== 0) {
          this.indeterminateInput = false;
          this.checkInputAll = false;
        } else {
          setValue.call(this, false, false, true, true);
        }
      }
      function setValue(val1, val2, val3, val4) {
        this.indeterminateInput = val1;
        this.checkInputAll = val2;
        this.deleteable = val3;
        this.downloadable = val4;
      }
      this.changeAllStatus();
    },
    checkAllOutputGroupChange(data) {
      this.selectedOutputFiles = data;
      if (data.length === this.outputFiles.length) {
        setValue.call(this, false, true, false, false);
      } else if (data.length > 0) {
        setValue.call(this, true, false, false, false);
      } else {
        if (this.selectedInputFiles.length !== 0) {
          this.indeterminateOutput = false;
          this.checkOutputAll = false;
        } else {
          setValue.call(this, false, false, true, true);
        }
      }
      function setValue(val1, val2, val3, val4) {
        this.indeterminateOutput = val1;
        this.checkOutputAll = val2;
        this.deleteable = val3;
        this.downloadable = val4;
      }
      this.changeAllStatus();
    },
    changeAllStatus() {
      this.selectedFiles = this.selectedInputFiles.concat(
        this.selectedOutputFiles
      );
      if (this.selectedFiles.length === this.allFilesLength) {
        this.checkAll = true;
        this.indeterminate = false;
      } else if (
        this.selectedFiles.length > 0 &&
        this.selectedFiles.length < this.allFilesLength
      ) {
        this.checkAll = false;
        this.indeterminate = true;
      } else {
        this.checkAll = false;
        this.indeterminate = false;
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
        .then(({ data }) => {
          if (data["folderType"]) {
            let url = `${this.BASE_URL}/taskManageChildFolder/download/${
              data["parentFolder"]
            }/${data["folderType"]}/${data["fileName"]}`;
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            document.body.appendChild(link);
            link.click();
          } else {
            this.download(data);
          }
        });
    }
  }
};
</script>

<style scope lang="scss">
.check-text {
  font-size: 14px;
  position: relative;
  margin-left: 5px;
}
.button-option-group {
  position: relative;
  z-index: 1;
  border-top: 1px solid #e9e9e9;
  line-height: 64px;
  background-color: white;
}
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
      height: calc((100vh - 195px) / 2);
      // overflow-y: auto;
      & > .check-box-group-out,
      & > .check-box-group-in {
        height: calc(100% - 40px);
        overflow-y: auto;
      }
      & > .header {
        position: relative;
        padding-left: 22px;
        padding-top: 10px;
        font-size: 16px;
        font-weight: bold;
        height: 40px;
        background-color: #336699;
        color: white;
        text-align: left;
      }
      & > .output-files {
        margin-top: -6px;
      }
      & > .input-files {
        & > .header {
          position: relative;
          padding-left: 22px;
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


