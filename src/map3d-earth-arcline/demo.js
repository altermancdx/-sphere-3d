// 弧线层
const Arcline = require('./index.js');

const config = {
  "flyingline": {
      "radius": 0.4,
      "dashRatio": 4,
      "dashSliceCount": 40,
      "speed": 0.001,
      "height": 0.1,
      "lineArc": 3.14,
      "opacity": 1,
      "defaulColor": "#0AF32B",
      "flyinglineTypeSeries": [{
          "flyinglineType": "type1",
          "flyinglineColor": "#0AF32B"
      }, {
          "flyinglineType": "type2",
          "flyinglineColor": "#FF0B00"
      }]
  },
  "marker": {
      "mapUrl": "https://img.alicdn.com/tfs/TB14LWbkER1BeNjy0FmXXb0wVXa-20-10.png",
      "height": 10,
      "size": 15,
      "speed": 0.01
  }
};
const data = [{"from":"116.40717,39.90469","to":"135.4297234,34.6332068","type":1},{"from":"113.26436,23.12908","to":"-3.7480742,40.236221","type":1},{"from":"100.75009,13.586577","to":"114.05956,22.54286","type":1},{"from":"121.4737,31.23037","to":"174.8201408,-36.9227234","type":2},{"from":"120.15515,30.27415","to":"55.6520743,37.8878377","type":2},{"to":"48.9577222,2.3692212","from":"113.26436,23.12908","type":2},{"from":"113.26436,23.12908","to":"106.850457,-6.4172491","type":3},{"from":"121.4737,31.23037","to":"-117.8611635,34.0046923","type":3},{"to":"55.6520743,37.887837","from":"116.40717,39.90469","type":3},{"from":"116.40717,39.90469","to":"151.2195772,-33.9605978","type":4},{"from":"120.15515,30.27415","to":"103.9086882,1.3691942","type":4},{"to":"55.6520743,37.887837","from":"113.26436,23.12908","type":4},{"from":"120.15515,30.27415","to":"101.597015,3.03198","type":5},{"from":"114.05956,22.54286","to":"52.36218322,4.872436523","type":5},{"to":"8.7910385,50.0168619","from":"121.4737,31.23037","type":5}]
const arcline = new Arcline({}, config);

module.exports = (map) => {
  map.add(arcline);
  arcline.setData(data);
};
