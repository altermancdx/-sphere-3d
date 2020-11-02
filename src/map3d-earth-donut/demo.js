// 甜甜圈层
const Chart = require('./index.js');

const config = {
  "minRadius": 3,
  "maxRadius": 10,
  "donutSize": 3,
  "outerCircleColor": "rgba(202,188,176,0.8)",
  "innerCircleRenderType": "singleColor",
  "innerCircleColor": "rgba(212,20,159,0.8)",
  "startInnerCircleColor": "#58F613",
  "endInnerCircleColor": "#FF4800",
  "tip": {
    "background": "rgba(0,0,0,0.8)",
    "fontFamily": "Microsoft Yahei",
    "fontColor": "#fff",
    "fontSize": "14"
  },
  "donutSeries": [{
    "field": "field1",
    "color": "#eee"
  }, {
    "field": "field2",
    "color": "rgba(212,100,10,0.8)"
  }, {
    "field": "other",
    "color": "rgba(39,97,179,0.8)"
  }]
};
const data = [{"lat":30,"lng":120,"inner":10,"outer":196,"tip":"测试标题<br>测试内容","donut":{"field1":164,"field2":3,"other":47}},{"lat":20,"lng":122,"inner":100,"outer":300,"tip":"测试标题2<br>测试内容2","donut":{"field1":18,"field2":56,"other":47}}];
const chart = new Chart({}, config);

module.exports = (map) => {
  map.add(chart);
  chart.render(data);
};
