import ThreeMap from './ThreeMap'; // h = c("datav:/com/@double11-2017/map3d-earth/0.1.14/map")
import eventemitter3 from 'eventemitter3'; // i = c("datav:/npm/eventemitter3/2.0.3")
import merge from 'safely-merge'; // j = c("datav:/npm/safely-merge/1.0.1")

const defaultOptions = { // k
  autoRotateSpeed: 1,
  isInteractive: !0,
  background: {
      clearColor: "#102B42",
      clearAlpha: 0.9
  },
  cameraPos: {
      fov: 60,
      lat: 30,
      lng: 115,
      distance: 400
  },
  renderMode: "normalMode",
  advancedModeOptions: {
      antiAliasType: "NONE",
      bloomThreshold: 0.7,
      bloomRadius: 0.1,
      bloomStrength: 0.8,
  }
};

export default class SphereMap extends eventemitter3 {
  constructor(container, options) { // a c
    this.container = container;
    this.apis = options.apis;
    this.options = merge(defaultOptions, options);
    this.subcoms = {};
    this.init();
  }
  init() {
    this.threeMap = new ThreeMap(this.container, this.options);
  }

  get(sid) {
    return this.subcoms[sid];
  }

  add(subcom, sid) {
    if (subcom) {
      subcom.addTo(this.threeMap),
      this.subcoms[sid] = subcom;
    } else {
      console.log('layer 没有定义');
    }
  }

  remove(subcom, sid) {
    subcom.remove && subcom.remove();
    delete this.subcoms[sid];
  }

  resizefunction(a, b) {
    this.threeMap.resize(a, b)
  }

  updateOptions(newOptions) {
    if (newOptions) {
      this.options = merge(this.options, newOptions)
    }
    this.threeMap.updateOptions(this.options);
  }
}
