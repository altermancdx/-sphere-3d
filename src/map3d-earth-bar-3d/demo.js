// 弧线层
const Chart = require('./index.js');
const data = require('./data.json');

const config = {
  "style": {
    "isRadiusTopOpen": true,
    "radiusTop": 0.5,
    "radiusBottom": 0.5,
    "edges": 6,
    "angles": 0,
    "fillColorNumber": 6,
    "heightScale": 1,
    "opacity": 1,
    "fillColorMode": "hsl",
    "minFillColor": "yellow",
    "maxFillColor": "red"
  }
};
const chart = new Chart({}, config);

module.exports = (map) => {
  map.add(chart);
  chart.setData(data);
};
