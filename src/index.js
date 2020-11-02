const Map3dEarth = require('./map3d-earth');
// 环境光层
const Ambientlighter = require('./map3d-earth-ambientlighter');
// 球体层
const Globe = require('./map3d-earth-globe');
// 弧线层
const arcLine = require('./map3d-earth-arcline/demo');
// 大气层
const atmosphere = require('./map3d-earth-atmosphere/demo');
// 柱状层
const bar3d = require('./map3d-earth-bar-3d/demo');
// 平行光层
const directlighter = require('./map3d-earth-directlighter/demo');
// 甜甜圈层
const donut = require('./map3d-earth-donut/demo');
// 浮框层
const floatboard = require('./map3d-earth-floatboard/demo');
const flyingline = require('./map3d-earth-flyingline/demo');

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
arcLine(map);
atmosphere(map);
bar3d(map);
directlighter(map);
donut(map);
floatboard(map);
flyingline(map);


// console.log(Map3dEarth);
