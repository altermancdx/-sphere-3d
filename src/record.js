const Map3dEarth = require('./map3d-earth');
// 环境光层
const Ambientlighter = require('./map3d-earth-ambientlighter');
// 球体层
const Globe = require('./map3d-earth-globe');
// 区域热力层
const Area = require('./map3d-earth-area');
// 轨迹层
const ThunderLine = require('./map3d-earth-thunder');
// 扫描线层
const Scanner = require('./map3d-earth-scanner');
// 场景管理器
const SceneControl = require('./map3d-earth-scenecontrol');

const container = document.querySelector('#root');
const map = new Map3dEarth(container, {
  autoRotateSpeed: 0,
  isInteractive: true,
  background: {
    clearColor: "#1a0a2f",
    clearAlpha: 0.9
  },
  cameraPos: {
    fov: 50,
    lat: 30,
    lng: 115,
    distance: 600
  },
  renderMode: "normalMode",
  advancedModeOptions: {
    antiAliasType: "NONE",
    bloomThreshold: 0.7,
    bloomRadius: 0.1,
    bloomStrength: 0.8
  },
  isProjTrans: false,
  projType: 0,
  transDuration: 5
});

const ambientlighter = new Ambientlighter({}, {
  intensity: 0.3,
  color: "#FFFFFF",
});
map.add(ambientlighter, 'map3d-earth-ambientlighter-fda');

const globe = new Globe({}, {
  bumpMapUrl: "https://img.alicdn.com/tfs/TB1Jp7dbsjI8KJjSsppXXXbyVXa-9000-4500.jpg",
  mapUrl: "https://img.alicdn.com/tfs/TB1mR3bX3nH8KJjSspcXXb3QFXa-9000-4500.jpg",
  customMapUrl: "https://img.alicdn.com/tfs/TB1mR3bX3nH8KJjSspcXXb3QFXa-9000-4500.jpg",
  scale: 1,
  lightIntensity: 6,
  roughness: 0.42,
  metalness: 0.36,
  bumpScale: 0.3
});
map.add(globe, 'map3d-earth-globe-fdafa');

const area = new Area({}, {
  chinaGeoJsonApi: "//sh-conf.oss-cn-shanghai.aliyuncs.com/datav-coms-data/china.json",
  height: 2,
  isStokeOnly: false,
  minFillColor: "#33C9FB",
  maxFillColor: "#1F68A7",
  defaultFillColor: "#676767",
  fillOpacity: 1,
  strokeColor: "#E7EE98",
  strokeOpacity: 0.8,
  strokeWidth: 0.05
});
map.add(area, 'map3d-earth-area-fdafa');
area.setGeojson({
  type: "FeatureCollection",
  features: []
});
area.setData(require('./data/map3d-earth-area/index.json'));

const thunderLine = new ThunderLine({}, {
  height: 3,
  lineLength: 0.8,
  intervalFreq: 0.3,
  speed: 0.015,
  trailColor: "#FFFD49",
  opacityFactor: 0.2,
  level: 3,
  trailRadiusSeries: [{
    levelSize: 0.08,
  }, {
    levelSize: 0.12,
  }, {
    levelSize: 0.18,
  }],
});
map.add(thunderLine, 'map3d-earth-thunder');
thunderLine.render({
  type: "FeatureCollection",
  features: Array(0)
});

const scanner = new Scanner({}, {
  isloop: true,
  color: "#DBCBFF",
  textureUrl: "https://img.alicdn.com/tfs/TB1WfbDb8fH8KJjy1XbXXbLdXXa-4096-2048.png",
  opacity: 1,
  speed: 0.003,
  scale: 1.01,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0.4014
});
map.add(scanner, 'map3d-earth-thunder');

const sceneControl = new SceneControl({}, {
  isWork: true,
  tweenMode: "repeat",
  duration: 3000,
  delay: 3000,
  callbackId: ""
});
map.add(sceneControl, 'map3d-earth-scenecontrol');
sceneControl.setData([{"id":"1","name":"beijing","position":{"fov":50,"lat":39,"lng":115,"distance":400},"duration":3000,"delay":3000},{"id":"2","name":"shanghai","position":{"fov":30,"lat":30,"lng":120,"distance":300},"duration":3000,"delay":3000},{"id":"3","name":"guangzhou","position":{"fov":50,"lat":23,"lng":113,"distance":400},"duration":3000,"delay":3000}])
// console.log(Map3dEarth);
