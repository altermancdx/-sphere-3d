// 弧线层
const Atmosphere = require('./index.js');

const config = {
  "atmosphereColor": "#FFFFFF",
  "atmosphereOpacity": 0.8,
  "atmosphereIntensity": 1,
  "atmosphereScale": 1.5
};
const atmosphere = new Atmosphere({}, config);

module.exports = (map) => {
  map.add(atmosphere);
  // atmosphere.setData(data);
};
