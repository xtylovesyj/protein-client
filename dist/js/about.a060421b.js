(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["about"],{"015f":function(t,e,s){},3268:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"monitor"},[s("div",{staticClass:"usage"},[s("div",{staticClass:"progress"},[s("div",{staticClass:"circle-text"},[s("div",{staticClass:"name"},[t._v("处理器")]),s("i-circle",{attrs:{percent:t.cpuUsage,"stroke-color":t.cpuStrokeColor}},[s("span",{staticClass:"demo-Circle-inner",staticStyle:{"font-size":"24px"}},[t._v(t._s(t.cpuUsage)+"%")])]),s("div",{staticClass:"text"},[s("span",[t._v("处理器数量:")]),s("span",[t._v(t._s(t.cpuCount))])]),s("div",{staticClass:"text"},[s("span",[t._v("平台名称:")]),s("span",[t._v(t._s(t.platformName))])])],1)]),s("div",{staticClass:"progress"},[s("div",{staticClass:"circle-text"},[s("div",{staticClass:"name"},[t._v("磁盘")]),s("i-circle",{attrs:{percent:t.diskUsage,"stroke-color":t.diskStrokeColor}},[s("span",{staticClass:"demo-Circle-inner",staticStyle:{"font-size":"24px"}},[t._v(t._s(t.diskUsage)+"%")])]),s("div",{staticClass:"text"},[s("span",[t._v("全部:")]),s("span",[t._v(t._s(t.diskTotal)+"G")])]),s("div",{staticClass:"text"},[s("span",[t._v("剩余:")]),s("span",[t._v(t._s(t.diskFree)+"G")])])],1)]),s("div",{staticClass:"progress"},[s("div",{staticClass:"circle-text"},[s("div",{staticClass:"name"},[t._v("缓存")]),s("i-circle",{attrs:{percent:t.memoryUsage,"stroke-color":t.memoryStrokeColor}},[s("span",{staticClass:"demo-Circle-inner",staticStyle:{"font-size":"24px"}},[t._v(t._s(t.memoryUsage)+"%")])]),s("div",{staticClass:"text"},[s("span",[t._v("全部:")]),s("span",[t._v(t._s(t.memoryTotal)+"G")])]),s("div",{staticClass:"text"},[s("span",[t._v("剩余:")]),s("span",[t._v(t._s(t.memoryFree)+"G")])])],1)])]),s("div",{staticClass:"current-task"},[s("div",{staticClass:"header"},[t._v("当前任务")]),s("div",{staticClass:"task-body"},[s("ol",[s("li",[s("span",[t._v("名称:")]),s("div",[t._v(t._s(t.runningProteinName))])]),s("li",[s("span",[t._v("开始时间:")]),s("div",[t._v(t._s(t.startTime))])]),s("li",[s("span",[t._v("预计完成时间:")]),s("div",[t._v(t._s(t.endTime))])]),s("li",[s("span",[t._v("迭代次数:")]),s("div",[t._v(t._s(t.iterationNum))])]),s("li",[s("span",[t._v("预计进度:")]),s("div",[s("Progress",{staticStyle:{width:"250px"},attrs:{percent:t.finishedPercent,status:"active"}})],1)])])]),s("div",{staticClass:"log"},[s("header",[t._v("日志分析")]),s("div",{staticClass:"log-body"},[s("ol",{staticClass:"log-ol"},t._l(t.logs,function(e,a){return s("li",{key:a},[t._v(t._s(e))])}))])])])])},i=[];s("7f7f"),s("28a5"),s("cadf"),s("551c"),s("097d"),s("4f7f"),s("ac6a"),s("f400");function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t,e){for(var s=0;s<e.length;s++){var a=e[s];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}function r(t,e,s){return e&&n(t.prototype,e),s&&n(t,s),t}var c=function(){function t(e){var s=this;o(this,t),this.commandToCallbacks=new Map,this.ws=new WebSocket(e),this.connected=!1,this.ws.onopen=function(){s.connected=!1,s.ws.send(JSON.stringify({command:"init",data:"init"}))},this.ws.onmessage=function(t){if(t&&t["data"]){t=JSON.parse(t["data"]);var e=t["command"];e&&s.commandToCallbacks.forEach(function(s,a){a==e&&s.forEach(function(e){e(t["data"])})})}},this.ws.onclose=function(){console.log("websocket is closed")},this.ws.onerror=function(){console.log("websocket is error")}}return r(t,[{key:"addListener",value:function(t,e){this.commandToCallbacks.has(t)?this.commandToCallbacks.get(t).set(e):this.commandToCallbacks.set(t,(new Set).add(e))}},{key:"close",value:function(){this.ws.close()}},{key:"send",value:function(t){var e=this,s=null;s=s(function(){e.connected&&(e.ws.send(t),clearInterval(s))},100)}}]),t}(),l={name:"about",data:function(){return{cpuUsage:0,memoryUsage:0,diskUsage:0,diskTotal:0,diskFree:0,memoryTotal:0,memoryFree:0,cpuCount:0,platformName:"",cpuStrokeColor:"red",diskStrokeColor:"red",memoryStrokeColor:"red",logs:"",runningProteinName:"",startTime:"",endTime:"",iterationNum:"",finishedPercent:0,folderName:""}},created:function(){var t=this;this.folderName=this.$route.query.fileName,this.websocket=new c(this.SOCKET_URL+":9090"),this.websocket.addListener("init",function(e){t.cpuUsage=parseInt(100*e["cpu"]["usage"]),t.cpuCount=e["cpu"]["cpuNumber"],t.platformName=e["cpu"]["platformName"];var s=e["disk"];t.diskTotal=+s.total.toFixed(2),t.diskFree=+s.free.toFixed(2),t.diskUsage=parseInt(100*(1-t.diskFree/t.diskTotal));var a=e["memory"];t.memoryTotal=+a.total.toFixed(2),t.memoryFree=+a.free.toFixed(2),t.memoryUsage=parseInt(100*(1-t.memoryFree/t.memoryTotal)),t.cpuUsage>80?t.cpuStrokeColor="red":t.cpuStrokeColor="#007aff",t.diskUsage>80?t.diskStrokeColor="red":t.diskStrokeColor="#007aff",t.memoryUsage>80?t.memoryStrokeColor="red":t.memoryStrokeColor="#007aff"}),this.$http.get("statusMonitor/readLog/"+this.folderName).then(function(e){t.logs=e["data"].split("\n")}),this.$http.get("statusMonitor/proteinStatus").then(function(e){e=e["data"],t.runningProteinName=e.name,t.finishedPercent=e.finishedPercent,t.endTime=e.elapseTime,t.iterationNum=e.iterationNum,t.startTime=e.runningTime})},destroyed:function(){this.websocket&&(this.websocket.close(),this.websocket=null)}},d=l,u=(s("5112"),s("2877")),m=Object(u["a"])(d,a,i,!1,null,"ae13dd9a",null);m.options.__file="statusMonitor.vue";e["default"]=m.exports},5112:function(t,e,s){"use strict";var a=s("015f"),i=s.n(a);i.a},"7f7f":function(t,e,s){var a=s("86cc").f,i=Function.prototype,o=/^\s*function ([^ (]*)/,n="name";n in i||s("9e1e")&&a(i,n,{configurable:!0,get:function(){try{return(""+this).match(o)[1]}catch(t){return""}}})},f400:function(t,e,s){"use strict";var a=s("c26b"),i=s("b39a"),o="Map";t.exports=s("e0b8")(o,function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},{get:function(t){var e=a.getEntry(i(this,o),t);return e&&e.v},set:function(t,e){return a.def(i(this,o),0===t?0:t,e)}},a,!0)}}]);
//# sourceMappingURL=about.a060421b.js.map