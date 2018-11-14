<template>
    <div class="scatter-chart">
        <div class="color-bar" :style="colorBarStyle">
            <span class="top">{{barCount.start}}</span>
            <span class="middle">{{barCount.middle}}</span>
            <span class="bottom">{{barCount.end}}</span>
        </div>
        <highcharts :options="options" ref="highcharts"></highcharts>
    </div>
</template>
<script>
var options_energy = {
  chart: {
    type: "scatter",
    zoomType: "xy"
  },
  title: {
    text: "RMSD & Energy"
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
    enable: false
  },
  plotOptions: {
    scatter: {
      marker: {
        radius: 3,
        states: {
          hover: {
            enabled: true
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
      name: "energy & rmsd",
      color: "rgba(223, 83, 83, .5)",
      data: []
    }
  ]
};
var options_score = {
  chart: {
    type: "scatter",
    zoomType: "xy"
  },
  title: {
    text: "RMSD & Score_c"
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
      text: "Score_c"
    }
  },
  legend: {
    enable: false
  },
  plotOptions: {
    scatter: {
      marker: {
        radius: 3,
        states: {
          hover: {
            enabled: true
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
      name: "Score_c & rmsd",
      color: "rgba(223, 83, 83, .5)",
      data: []
    }
  ]
};
export default {
  name: "ScatterChart",
  props: ["data", "type", "name"],
  data() {
    return {
      options: null,
      colorBarStyle: null,
      barCount: {
        start: 0,
        middle: 50,
        end: 100
      }
    };
  },
  created() {
    this.options = options_energy;
  },
  mounted() {
    setTimeout(() => {
      if (this.type === 1) {
        this.options = options_energy;
      }else{
          this.options = options_score;
      }
    }, 0);
  },
  watch: {
    data: function(val) {
      let arrayData = val.split("\n");
      let realData = null;
      if (this.type === 1) {
        realData = arrayData.map(value => {
          let energy = [];
          const arrays = value.split(/\s+/g);
          if (arrays[1]) {
            energy[0] = +(+arrays[1].replace(",", "")).toFixed(1);
          }
          if (arrays[2]) {
            energy[1] = +(+arrays[2].replace(",", "")).toFixed(1);
          }
          return energy;
        });
      } else {
        realData = arrayData
          .map(value => {
            let score_c = [];
            const arrays = value.split(/\s+/g);
            if (arrays[1] && arrays[3]) {
              score_c[0] = +(+arrays[1].replace(",", "")).toFixed(1);
              score_c[1] = +(+arrays[3].replace(",", "")).toFixed(1);
              return score_c;
            } else {
              return null;
            }
          })
          .filter((value) => {
            return value;
          });
      }
      let realData2 = distinct(realData);
      this.options["series"].length = 0;
      let range = Math.floor(realData2.length / 100);
      let color = null;
      let t = 0;
      this.barCount.middle = (realData2.length / 2).toFixed();
      this.barCount.end = realData2.length;
      let linear = `linear-gradient(to right,`;
      realData2.forEach((value, index) => {
        if (index % range === 0) {
          color = this.numberToColorHsl(t);
          linear += color + ",";
          t++;
        }
        if (index === realData2.length - 1) {
          linear = linear.replace(/,$/gi, ")");
          this.colorBarStyle = { background: linear };
        }
        this.options["series"].push({
          data: [value],
          color: color,
          showInLegend: false,
          marker: {
            symbol: "cross",
            lineColor: null,
            lineWidth: 0
          }
        });
      });
      function distinct(arrs) {
        return Array.from(new Set(arrs.map(value => value.join(","))))
          .map(value => {
            let arrays = value.split(",");
            arrays[0] = +arrays[0];
            arrays[1] = +arrays[1];
            return arrays;
          })
          .filter(value => {
            return (value[0] === 0 || value[0]) && (value[1] === 0 || value[1]);
          });
      }
    }
  },
  methods: {
    hslToRgb(h, s, l) {
      var r, g, b;
      if (s == 0) {
        r = g = b = l; // achromatic
      } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }
      return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
    },

    // convert a number to a color using hsl
    numberToColorHsl(i) {
      // as the function expects a value between 0 and 1, and red = 0° and green = 120°
      // we convert the input to the appropriate hue value
      var hue = (i * 1.2) / 360;
      // we convert hsl to rgb (saturation 100%, lightness 50%)
      var rgb = this.hslToRgb(hue, 1, 0.5);
      // we format to css value and return
      return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
    },

    // convert a color to a number using hsl
    // based on formula as provided by @KamilT
    numberToColorRgb(i) {
      // we calculate red and green
      var red = Math.floor(255 - (255 * i) / 100);
      var green = Math.floor((255 * i) / 100);
      // we format to css value and return
      return "rgb(" + red + "," + green + ",0)";
    }
  }
};
</script>
<style scope lang="scss">
.scatter-chart {
  position: relative;
  display: inline-block;
  height: 400px;
  width:50%;
  & > .color-bar {
    position: absolute;
    width: 200px;
    height: 20px;
    right: 50px;
    top: 60%;
    z-index: 10;
    text-align: center;
    & > span {
      position: relative;
      font-size: 12px;
      font-weight: bold;
      color: black;
      top: 2px;
    }
    & > .top {
      float: left;
    }
    & > .middle {
      text-align: center;
    }

    & > .bottom {
      float: right;
    }
  }
}
</style>
