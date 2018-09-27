<template>
  <div class="monitor">
    <div class="usage">
      <div class="progress">
        <div class="circle-text">
          <div class="name">处理器</div>
          <i-circle :percent="cpuUsage" :stroke-color="cpuStrokeColor">
            <span class="demo-Circle-inner" style="font-size:24px">{{cpuUsage}}%</span>
          </i-circle>
          <div class="text">
            <span>处理器数量:</span>
            <span>{{cpuCount}}</span>
          </div>
          <div class="text">
            <span>平台名称:</span>
            <span>{{platformName}}</span>
          </div>
        </div>
      </div>
      <div class="progress">
        <div class="circle-text">
          <div class="name">磁盘</div>
          <i-circle :percent="diskUsage" :stroke-color="diskStrokeColor">
            <span class="demo-Circle-inner" style="font-size:24px">{{diskUsage}}%</span>
          </i-circle>
          <div class="text">
            <span>全部:</span>
            <span>{{diskTotal}}G</span>
          </div>
          <div class="text">
            <span>剩余:</span>
            <span>{{diskFree}}G</span>
          </div>
        </div>
      </div>
      <div class="progress">
        <div class="circle-text">
          <div class="name">缓存</div>
          <i-circle :percent="memoryUsage" :stroke-color="memoryStrokeColor">
            <span class="demo-Circle-inner" style="font-size:24px">{{memoryUsage}}%</span>
          </i-circle>
          <div class="text">
            <span>全部:</span>
            <span>{{memoryTotal}}G</span>
          </div>
          <div class="text">
            <span>剩余:</span>
            <span>{{memoryFree}}G</span>
          </div>
        </div>
      </div>
    </div>
    <div class="current-task">
      <div class="header">当前任务</div>
      <div class="task-body">
        <ol>
          <li>
            <span>名称:</span>
            <div>{{runningProteinName}}</div>
          </li>
          <li>
            <span>开始时间:</span>
            <div>{{startTime}}</div>
          </li>
          <li>
            <span>预计完成时间:</span>
            <div>{{endTime}}</div>
          </li>
          <li>
            <span>迭代次数:</span>
            <div>{{iterationNum}}</div>
          </li>
          <li>
            <span>预计进度:</span>
            <div>
              <Progress :percent="finishedPercent" status="active" style="width:250px;" />
            </div>
          </li>
        </ol>
      </div>
      <div class="log">
        <header>
          <span>日志分析</span>
          <RadioGroup class="radio-group" v-model="logType" @on-change="logTypeHandler">
            <Radio label="蛋白日志"></Radio>
            <Radio label="系统日志"></Radio>
          </RadioGroup>
          <Dropdown style="margin-left: 20px">
            <a href="javascript:void(0)">
              选择行数
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem>100</DropdownItem>
              <DropdownItem>200</DropdownItem>
              <DropdownItem>400</DropdownItem>
              <DropdownItem>800</DropdownItem>
              <DropdownItem>1000</DropdownItem>
              <DropdownItem>全部</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </header>
        <div class="log-body">
          <ol class="log-ol">
            <li v-for="(value,index) in logs" :key="index">{{value}}</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WebSocketService from "../services/websocket.js";
export default {
  name: "about",
  data: function() {
    return {
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      diskTotal: 0,
      diskFree: 0,
      memoryTotal: 0,
      memoryFree: 0,
      cpuCount: 0,
      platformName: "",
      cpuStrokeColor: "red",
      diskStrokeColor: "red",
      memoryStrokeColor: "red",
      logs: "",
      runningProteinName: "",
      startTime: "",
      endTime: "",
      iterationNum: "",
      finishedPercent: 0,
      folderName: "",
      logType: "蛋白日志"
    };
  },
  created: function() {
    this.folderName = this.$route.query.fileName;
    this.websocket = new WebSocketService(this.SOCKET_URL + ":9090");
    this.websocket.addListener("init", data => {
      this.cpuUsage = parseInt(data["cpu"]["usage"] * 100);
      this.cpuCount = data["cpu"]["cpuNumber"];
      this.platformName = data["cpu"]["platformName"];
      let disk = data["disk"];
      this.diskTotal = +disk.total.toFixed(2);
      this.diskFree = +disk.free.toFixed(2);
      this.diskUsage = parseInt((1 - this.diskFree / this.diskTotal) * 100);
      let memory = data["memory"];
      this.memoryTotal = +memory.total.toFixed(2);
      this.memoryFree = +memory.free.toFixed(2);
      this.memoryUsage = parseInt(
        (1 - this.memoryFree / this.memoryTotal) * 100
      );
      if (this.cpuUsage > 80) {
        this.cpuStrokeColor = "red";
      } else {
        this.cpuStrokeColor = "#007aff";
      }
      if (this.diskUsage > 80) {
        this.diskStrokeColor = "red";
      } else {
        this.diskStrokeColor = "#007aff";
      }
      if (this.memoryUsage > 80) {
        this.memoryStrokeColor = "red";
      } else {
        this.memoryStrokeColor = "#007aff";
      }
    });
    this.$http
      .get("statusMonitor/readLog/" + this.folderName, {
        params: {
          lineNum: 100
        }
      })
      .then(data => {
        this.logs = data["data"].split("\n");
      });
    this.$http.get("statusMonitor/proteinStatus").then(data => {
      data = data["data"];
      this.runningProteinName = data.name;
      this.finishedPercent = data.finishedPercent;
      this.endTime = data.elapseTime;
      this.iterationNum = data.iterationNum;
      this.startTime = data.runningTime;
    });
  },
  destroyed: function() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  },
  methods: {
    logTypeHandler(data) {
      if (data === "蛋白日志") {
        this.$http
          .get("statusMonitor/readLog/" + this.folderName, {
            params: {
              lineNum: 100
            }
          })
          .then(data => {
            data = data["data"];
            if (data["code"] === 200) {
              this.logs = data["data"].split("\n").reverse();
            } else {
              this.logs = [];
            }
          });
      } else {
        this.$http
          .get("statusMonitor/readAppLog", {
            params: {
              lineNum: 100
            }
          })
          .then(data => {
            data = data["data"];
            if (data["code"] === 200) {
              this.logs = data["data"].split("\n").reverse();
            } else {
              this.logs = [];
            }
          });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.monitor {
  height: calc(100vh - 58px);
  width: 100%;
  text-align: left;
  min-width: 721px;
  & > .usage {
    width: 100%;
    height: 40%;
    min-height: 240px;
    // background: #dcdbdb;
    border-bottom: 1px solid #e9e9e9;
    margin-right: 20px;
    border-radius: 3px;
    & > .progress {
      position: relative;
      float: left;
      width: 33.3%;
      // min-width: 246px;
      top: 50%;
      transform: translateY(-50%);
      // height: 100%;
      border-right: 1px solid #e9e9e9;
      text-align: center;
      & > .circle-text {
        position: relative;
        & > .text {
          margin-top: 20px;
          font-size: 12px;
          font-weight: bold;
          & > span:first-of-type {
            display: inline-block;
            // width: 70px;
            text-align: right;
          }
          & > span:last-of-type {
            display: inline-block;
            // width: 80px;
            text-align: left;
            margin-left: 5px;
          }
        }
        & > .name {
          margin-bottom: 10px;
          font-size: 16px;
          font-weight: bolder;
        }
      }
    }

    & > .task-info {
      & > h2 {
        height: 40px;
        padding-left: 20px;
        line-height: 40px;
        border-bottom: 1px solid #ccc;
      }
      position: relative;
      float: left;
      width: 576px;
      border-right: 2px solid #bbb;
      height: calc(100% - 4px);
      & > ol {
        position: relative;
        padding: 0;
        margin: 0;
        width: 100%;
        top: 50%;
        transform: translateY(-55%);
        // height:100%;
        & > li {
          padding-left: 8%;
          margin-bottom: 22px;
          font-size: 22px;
          font-weight: bold;
          & > .name {
            display: inline-block;
            width: 160px;
            text-align: right;
            color: #007aff;
          }
          & > .value {
            color: #42b983;
          }
        }
        & > li:last-of-type {
          margin-bottom: 0;
        }
      }
    }
    & > .logs-info {
      margin-left: 576px;
      height: calc(100% - 4px);
      & > h2 {
        height: 40px;
        padding-left: 20px;
        line-height: 40px;
        border-bottom: 1px solid #ccc;
      }
      & > .log-content {
        height: calc(100% - 40px);
        padding-left: 30px;
        padding-top: 20px;
        font-size: 16px;
        color: #007aff;
        overflow-y: auto;
      }
    }
  }
  & > .usage:last-of-type {
    margin-right: 0;
  }
  & > .current-task {
    height: calc(60% - 40px);
    & > .header {
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      font-size: 14px;
      font-weight: bold;
      color: white;
      background-color: #336699;
    }
    & > .task-body {
      float: left;
      width: 400px;
      border-right: 1px solid #e9e9e9;
      height: 100%;
      & > ol {
        padding: 0;
        margin: 0;
        & > li {
          padding-left: 30px;
          height: 50px;
          line-height: 50px;
          border-bottom: 1px solid #e9e9e9;
          & > span {
            display: inline-block;
            width: 80px;
            text-align: right;
            font-size: 12px;
            font-weight: bolder;
          }
          & > div {
            display: inline-block;
            margin-left: 10px;
            font-size: 13px;
          }
        }
      }
    }
    & > .log {
      margin-left: 400px;
      height: 100%;
      & > header {
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
        font-weight: bolder;
        border-bottom: 1px solid #e9e9e9;
        & > .radio-group {
          position: relative;
          margin-left: 10px;
          top: -2px;
          font-size: 8px;
          font-weight: normal;
        }
      }
      & > .log-body {
        height: calc(100% - 50px);
        overflow-y: auto;
        padding: 30px;
        font-size: 13px;
        & > .log-ol {
          list-style-type: none;
        }
      }
    }
  }
}
</style>