<template>
  <div class="chart" ref="chart">
    <div class="line-chart-container">
      <highcharts :options="lineOptions" ref="highcharts"></highcharts>
    </div>
    <div class="scatter-chart-container">
      <highcharts :options="options" ref="highcharts"></highcharts>
    </div>
  </div>
</template>
<script>
import Highcharts from "highcharts";
import WebSocketService from "../services/websocket.js";
var lineOptions = {
  chart: {
    zoomType: "x",
    type: "line"
  },
  title: {
    text: "RMSD & Energy 时间走势图"
  },
  credits: {
    enabled: false
  },
  subtitle: {
    text:
      document.ontouchstart === undefined
        ? "鼠标拖动可以进行缩放"
        : "手势操作进行缩放"
  },
  xAxis: {
    type: "datetime",
    dateTimeLabelFormats: {
      millisecond: "%H:%M:%S.%L",
      second: "%H:%M:%S",
      minute: "%H:%M",
      hour: "%H:%M",
      day: "%m-%d",
      week: "%m-%d",
      month: "%Y-%m",
      year: "%Y"
    }
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
      text: "Energy & RMSD"
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
      type: "line",
      name: "Energy",
      data: []
    },
    {
      type: "line",
      name: "RMSD",
      data: []
    }
  ]
};
var options = {
  chart: {
    type: "scatter",
    zoomType: "xy"
  },
  title: {
    text: "RMSD & Energy 散点图"
  },
  credits: {
    enabled: false
  },
  xAxis: {
    title: {
      enabled: true,
      text: "RMSD"
    },
    startOnTick: true,
    endOnTick: true,
    showLastLabel: true
  },
  yAxis: {
    title: {
      text: "Energy"
    }
  },
  legend: {
    layout: "vertical",
    align: "left",
    verticalAlign: "top",
    x: 100,
    y: 70,
    floating: true,
    backgroundColor: "#FFFFFF",
    borderWidth: 1
  },
  plotOptions: {
    scatter: {
      marker: {
        radius: 5,
        states: {
          hover: {
            enabled: true,
            lineColor: "rgb(100,100,100)"
          }
        }
      },
      states: {
        hover: {
          marker: {
            enabled: false
          }
        }
      },
      tooltip: {
        headerFormat: "<b>{series.name}</b><br>",
        pointFormat: "{point.x}, {point.y}"
      }
    }
  },
  series: [
    {
      name: "energy",
      color: "rgba(223, 83, 83, .5)",
      data: []
    }
  ]
};
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data: function() {
    return {
      options: options,
      lineOptions: lineOptions,
      data: "yaojun",
      drawDate: new Date(),
      folderName: null
    };
  },
  beforeCreate() {
    this.drawDate = new Date();
  },
  created: function() {
    this.folderName = this.$route.query.fileName;
    this.$http
      .get("statistics/getData", {
        folderName: this.folderName
      })
      .then(data => {
        if (data.status !== 200) {
          return;
        }
        data = data["data"];
        let arrayData = data.data.split("\n");
        let realData = arrayData.map(value => {
          const arrays = value.split(/\s+/g);
          if (arrays[0]) {
            arrays[0] = +(+arrays[0]).toFixed(1);
          }
          if (arrays[1]) {
            arrays[1] = +(+arrays[1]).toFixed(1);
          }
          return arrays;
        });

        let realData1 = realData.map(value => {
          return value.join(",");
        });
        let realData2 = Array.from(new Set(realData1)).map(value => {
          let arrays = value.split(",");
          arrays[0] = +arrays[0];
          arrays[1] = +arrays[1];
          return arrays;
        });
        this.options["series"][0].data = realData2;

        //////
        let lineChart = [];
        let rmsdChart = [];
        let x = 1;
        // let leftMax = 0;
        // let leftMin = 0;
        // let rightMax = 0;
        // let rightMin = 0;
        // realData2.forEach(value=>{
        //   if(value[0] > leftMax){
        //     leftMax = value[0];
        //   }
        //   if(value[0] < leftMin){
        //     leftMin = value[0];
        //   }
        //   if(value[1] > rightMax){
        //     rightMax = value[1];
        //   }
        //   if(value[1] < rightMin){
        //     rightMin = value[1];
        //   }
        // });

        // const rmsdDistance = leftMax - leftMin;
        // const lineDistance = rightMax - rightMin;
        realData2.forEach(value => {
          let arrays = [];
          let rmsdArray = [];
          arrays[0] = 1370131200000 + x * 1000;
          arrays[1] = value[1];

          rmsdArray[0] = arrays[0];
          rmsdArray[1] = value[0];

          lineChart.push(arrays);
          rmsdChart.push(rmsdArray);
          x++;
        });
        this.lineOptions["series"][0].data = lineChart;
        this.lineOptions["series"][1].data = rmsdChart;
      });

    this.websocket = new WebSocketService(
      this.SOCKET_URL + ":9090",
      "statistics"
    );
    this.websocket.addListener("init", data => {
      if (data.code !== 200) {
        return;
      }
      data = data["data"];
      if ((new Date().getTime() - this.drawDate.getTime()) / 1000 / 60 > 2) {
        this.drawDate = new Date();
        this.draw(data);
      }
    });
  },
  methods: {
    draw(data) {
      let arrayData = data.split("\n");
      let realData = arrayData.map(value => {
        const arrays = value.split(/\s+/g);
        if (arrays[0]) {
          arrays[0] = +(+arrays[0]).toFixed(1);
        }
        if (arrays[1]) {
          arrays[1] = +(+arrays[1]).toFixed(1);
        }
        return arrays;
      });

      let realData1 = realData.map(value => {
        return value.join(",");
      });
      let realData2 = Array.from(new Set(realData1)).map(value => {
        let arrays = value.split(",");
        arrays[0] = +arrays[0];
        arrays[1] = +arrays[1];
        return arrays;
      });
      this.options["series"][0].data = realData2;
      let lineChart = [];
      let rmsdChart = [];
      let x = 1;
      realData2.forEach(value => {
        let arrays = [];
        let rmsdArray = [];
        arrays[0] = 1370131200000 + x * 1000;
        arrays[1] = value[1];

        rmsdArray[0] = arrays[0];
        rmsdArray[1] = value[0];

        lineChart.push(arrays);
        rmsdChart.push(rmsdArray);
        x++;
      });
      this.lineOptions["series"][0].data = lineChart;
      this.lineOptions["series"][1].data = rmsdChart;
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
.chart {
  width: 100%;
  height: calc(100vh - 78px);
  & > .line-chart-container,
  & > .scatter-chart-container {
    width: 100%;
    height: 50%;
  }
  & > .scatter-chart-container {
    border-top: 1px solid #bbb;
  }
}
</style>
