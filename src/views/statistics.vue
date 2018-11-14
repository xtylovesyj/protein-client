<template>
  <div class="chart" ref="chart">
    <header v-if="folderName">
      <span class="back-area">
        <Icon type="ios-arrow-back" :size="30" @click="back" />
      </span>
      <span class="folderName">{{folderName.replace(/(_\d+)$/,'')}}</span>
    </header>
    <div class="chart-group">
      <div class="line-chart-container">
        <highcharts :options="energyOptions" ref="highcharts"></highcharts>
      </div>
      <div class="line-chart-container">
        <highcharts :options="rmsdOptions" ref="highcharts"></highcharts>
      </div>
      <div style="height:2px;background:#e9e9e9; width:100%;position:relative;top:-3px;"></div>
      <ScatterChart :data="scatterDatas" :type="2" style="border-right:2px solid #e9e9e9;"></ScatterChart>
      <ScatterChart :data="scatterDatas" :type="1"></ScatterChart>
    </div>
  </div>
</template>
<script>
import Highcharts from "highcharts";
import WebSocketService from "../services/websocket.js";
var energyOptions = {
  chart: {
    zoomType: "x",
    type: "spline"
  },
  title: {
    text: "Energy"
  },
  credits: {
    enabled: false
  },
  tooltip: {
    dateTimeLabelFormats: {
      millisecond: "%H:%M:%S.%L",
      second: "%H:%M:%S",
      minute: "%H:%M",
      hour: "%H:%M",
      day: "%Y-%m-%d",
      week: "%m-%d",
      month: "%Y-%m",
      year: "%Y"
    }
  },
  yAxis: {
    title: {
      text: "Energy"
    }
  },
  legend: {
    enabled: false
  },
  plotOptions: {
    area: {
      fillColor: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },
        stops: [
          [0, Highcharts.getOptions().colors[0]],
          [
            1,
            Highcharts.Color(Highcharts.getOptions().colors[0])
              .setOpacity(0)
              .get("rgba")
          ]
        ]
      },
      marker: {
        radius: 2
      },
      lineWidth: 1,
      states: {
        hover: {
          lineWidth: 1
        }
      },
      threshold: null
    }
  },
  series: [
    {
      type: "spline",
      name: "Energy",
      data: []
    }
  ]
};
var rmsdOptions = {
  chart: {
    zoomType: "x",
    type: "spline"
  },
  title: {
    text: "RMSD"
  },
  credits: {
    enabled: false
  },
  tooltip: {
    dateTimeLabelFormats: {
      millisecond: "%H:%M:%S.%L",
      second: "%H:%M:%S",
      minute: "%H:%M",
      hour: "%H:%M",
      day: "%Y-%m-%d",
      week: "%m-%d",
      month: "%Y-%m",
      year: "%Y"
    }
  },
  yAxis: {
    title: {
      text: "RMSD"
    }
  },
  legend: {
    enabled: false
  },
  plotOptions: {
    area: {
      fillColor: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },
        stops: [
          [0, Highcharts.getOptions().colors[0]],
          [
            1,
            Highcharts.Color(Highcharts.getOptions().colors[0])
              .setOpacity(0)
              .get("rgba")
          ]
        ]
      },
      marker: {
        radius: 2
      },
      lineWidth: 1,
      states: {
        hover: {
          lineWidth: 1
        }
      },
      threshold: null
    }
  },
  series: [
    {
      type: "spline",
      name: "RMSD",
      data: []
    }
  ]
};
import ScatterChart from "@/components/scatterChart.vue";
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  components: {
    ScatterChart
  },
  data: function() {
    return {
      energyOptions: energyOptions,
      rmsdOptions: rmsdOptions,
      data: "yaojun",
      drawDate: new Date(),
      scatterDatas: null,
      folderName: null
    };
  },
  beforeCreate() {
    this.drawDate = new Date();
  },
  created: function() {
    this.folderName = this.$route.query.fileName;
    this.$http
      .get("statistics/getLineData", {
        params: {
          folderName: this.folderName
        }
      })
      .then(data => {
        if (data.status !== 200) {
          return;
        }
        data = data["data"]["data"];
        this.drawLine(data);
      });
    this.$http
      .get("statistics/getScatterData", {
        params: {
          folderName: this.folderName
        }
      })
      .then(data => {
        if (data.status !== 200) {
          return;
        }
        data = data["data"]["data"];
        this.scatterDatas = data;
      });
    if (this.folderName) {
      this.websocket = new WebSocketService(
        this.SOCKET_URL + ":9090",
        "statistics",
        { folderName: this.folderName }
      );
      this.websocket.addListener("init", data => {
        if ((new Date().getTime() - this.drawDate.getTime()) / 1000 / 60 > 2) {
          this.drawDate = new Date();
          if (data["scatterData"]["code"] === 200) {
            this.scatterDatas = data["scatterData"]["data"];
          }
        }
        if (data["lineData"]["code"] === 200) {
          this.drawLine(data["lineData"]["data"]);
        }
      });
    }
  },
  methods: {
    back() {
      this.$router.push("/app");
    },
    isEqualArray(array1, array2) {
      let isEqual = false;
      if (array1.length === array2.length) {
        let count = 0;
        for (let i = 0; i < array1.length; i++) {
          if (array1[i][0] === array2[i][0] && array1[i][1] === array2[i][1]) {
            count++;
          } else {
            break;
          }
        }
        if (count === array1.length) {
          isEqual = true;
        }
      }
      return isEqual;
    },
    drawLine(data) {
      let arrayData = data.split("\n");
      let realData = arrayData.map(value => {
        let returnArray = [];
        const arrays = value.split(/\s+/g);
        if (arrays[1]) {
          returnArray[0] = +arrays[1].replace(",", "");
        }
        if (arrays[2]) {
          returnArray[1] = +arrays[2].replace(",", "");
        }
        return returnArray;
      });

      let realData1 = realData.map(value => {
        return value.join(",");
      });
      let realData2 = Array.from(new Set(realData1))
        .map(value => {
          let arrays = value.split(",");
          arrays[0] = +arrays[0];
          arrays[1] = +arrays[1];
          return arrays;
        })
        .filter(value => {
          return (value[0] === 0 || value[0]) && (value[1] === 0 || value[1]);
        });
      let lineChart = [];
      let rmsdChart = [];
      let x = 1;
      realData2.forEach(value => {
        let arrays = [];
        let rmsdArray = [];
        arrays[0] = x;
        arrays[1] = value[1];

        rmsdArray[0] = arrays[0];
        rmsdArray[1] = value[0];

        lineChart.push(arrays);
        rmsdChart.push(rmsdArray);
        x++;
      });
      if (!this.isEqualArray(this.energyOptions["series"][0].data, lineChart)) {
        this.energyOptions["series"][0].data = lineChart;
      }
      if (!this.isEqualArray(this.rmsdOptions["series"][0].data, rmsdChart)) {
        this.rmsdOptions["series"][0].data = rmsdChart;
      }
    }
  },
  destroyed() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }
};
</script>

<style scoped lang="scss">
.hasFolderNameHeight {
  height: 500px !important;
}
.chart {
  width: calc(100% - 3px);
  height: calc(100vh - 108px);
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
  & > .chart-group {
    width: 100%;
    height: calc(100%);
    overflow-y: auto;
    & > .line-chart-container {
      position: relative;
      display: inline-block;
      border-right: 2px solid #e9e9e9;
      width: 50%;
      height: 400px;
    }
  }

  & > .scatter-chart-container {
    border-top: 1px solid #bbb;
  }
}
</style>
