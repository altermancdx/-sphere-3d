// 平行光层
const Chart = require('./index.js');

const config = {
  "intensity": 0.3,
  "color": "green",
  "positionX": 0,
  "positionY": 1,
  "positionZ": 0
};
const chart = new Chart({}, config);

module.exports = (map) => {
  map.add(chart);
};
