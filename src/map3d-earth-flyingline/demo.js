// 飞线层
const Chart = require('./index.js');
const data = require('./data.json');
const config = {
  "radius": 0.4,
  "lineLength": 0.6,
  "speed": 0.01,
  "height": 0.1,
  "lineArc": 2.5,
  "opacity": 0.8,
  "defaulColor": "#E7EE98",
  "flyinglineTypeSeries": [{
    "flyinglineType": "type2",
    "flyinglineColor": "#E7EE98"
  }, {
    "flyinglineType": "type1",
    "flyinglineColor": "#E83B46"
  }]
};
const chart = new Chart({}, config);

module.exports = (map) => {
  console.log('render fly line')
  map.add(chart);
  chart.setData(data);
};
