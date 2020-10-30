import THREE from 'three'; // h = c("datav:/npm/three/0.97.0")
import Eventemitter from 'eventemitter3'; // j = c("datav:/com/@double11-2017/map3d-earth/0.1.14/utils")
// l = c("datav:/npm/three-orbit-controls/82.1.0")(h)
import ThreeOrbitControlsFactory from 'three-orbit-controls';
import Composer from '../composer'; // k = c("datav:/com/@double11-2017/map3d-earth/0.1.14/composer")
import utils from '../utils'; // i = c("datav:/com/@double11-2017/map3d-earth/0.1.14/utils")

const ThreeOrbitControls = ThreeOrbitControlsFactory(THREE);
const m = 4096;

function defined(a) {
  return null !== a || void 0 !== a;
};

const defaultOptions = {
  autoRotateSpeed: 1,
  projType: 0,
  isInteractive: !0,
  background: {
    clearColor: "#102B42",
  },
  cameraPos: {
    fov: 60,
    lat: 30,
    lng: 115,
    distance: 400
  },
  renderMode: 'normalMode',
  advancedModeOptions: {
      antiAliasType: 'NONE',
      bloomThreshold: 0.7,
      bloomRadius: 0.1,
      bloomStrength: 0.8,
  },
};
class ThreeeMap extends Eventemitter {
  constructor(container, options) { // a, c
    super();
    this.THREE = THREE;
    this.Utils = utils;
    this.container = 'string' === typeof container ? document.querySelector(container) : container;
    this.options = Object.assign(defaultOptions, options);
    this.container.style.pointerEvents = this.options.isInteractive ? 'auto' : 'none';
    this.composer = null;
    this.Projection = null;
    this.unProjection = null;
    this.projType = 0;
    this.init();
    this.loop();
  }

  init() {
    const options = this.options;
    const container = this.container;
          
    const { clientWidth, clientHeight } = container;
    const scene = this.scene = new THREE.Scene();
    const renderer = this.renderer = new THREE.WebGLRenderer({
      canvas: document.createElementNS("http://www.w3.org/1999/xhtml", "canvas"),
      alpha: !0,
      antialias: !0,
      preserveDrawingBuffer: !0
    });
    this.shadowMap.type = THREE.PCFSoftShadowMap;
    this.setSize(clientWidth, clientHeight);
    this.toneMapping = THREE.ReinhardToneMapping;
    this.toneMappingExposure = Math.pow(1.05, 4);
    this.gammaInput = !0;
    this.gammaOutput = !0;
    container.appendChild(f.domElement);
    const camera = this.camera = new THREE.PerspectiveCamera(
      options.cameraPos.fov, 
      clientWidth / clientHeight,
      0.1, 
      1e8,
    );
    const orbitControls = this.orbitControls = new ThreeOrbitControls(g,b);
    orbitControls.maxDistance = 1e4;
    orbitControls.enableKeys = !1;
    this.setRotateSpeed();
    this.updateProjection();
    this.setComposer();
    this.setCameraPos();
    this.setClearColor();
    this.setInteractive();
    this.scaleX = 1;
    this.scaleY = 1;
    // TODO 
    // window.share.event && window.share.event.on('ratio-change', this.ratioChange.bind(this))
  }
  
  ratioChange(ev) {
    this.scaleX = ev.ratioX;
    this.scaleY = ev.ratioY;
    this.resize(this.container.clientWidth, this.container.clientHeight);
  }

  getComposerOpts() {
    const modeOptions = this.options.advancedModeOptions;
    return {
      bloomRadius: modeOptions.bloomRadius,
      bloomStrength: modeOptions.bloomStrength,
      antiAliasType: modeOptions.antiAliasType,
      bloomThreshold: modeOptions.bloomThreshold,
      clearColor: this.renderer.getClearColor(),
      clearAlpha: this.renderer.getClearAlpha(),
    };
  }

  setComposer() {
    const options = this.options;
    if ('advancedMode' === options.renderMode) {
      this.composer && this.composer.remove();
      const opts = this.getComposerOpts();
      this.composer = new Composer(
        this.scene,
        this.camera,
        this.renderer,
        this.container,
        opts,
      );
    }
  }
  
  ll2sphere(a, b, c = 200) {
    const d = (90 - b) * (Math.PI / 180)
    const e = (a + 180) * (Math.PI / 180);
    const x = -(c * Math.sin(d) * Math.cos(e));
    const z = c * Math.sin(d) * Math.sin(e);
    const y = c * Math.cos(d);
    return { x, y, z };
  }

  updateProjection() {
    const { projType } = this.options;
    if (0 === projType) {
      this.Projection = utils.ll2sphere;
      this.unProjection = utils.sphere2ll;
      this.projType = 0;
    } else if (1 === projType) {
      this.Projection = utils.ll2plane;
      this.unProjection = utils.plane2ll;
      this.projType = 1;
    }
  }

  emitProjTrans() {
    const { isProjTrans, projType, transDuration } = this.options;
    if (0 === projType) {
      this.setCameraPos() 
    } else if (1 === projType) {
      this.setCameraLookAtOrigin();
    }
    if (isProjTrans) {
      if (transDuration === 0) {
        this.emit('projChanged', { projType, index: 1 });
      } else {
        this.createEaseFunc(0, 1, transDuration, (index) => {
          this.emit('projChanged', { projType, index });
        });
      }
    }
  }

  createEaseFunc(from, to, during, timer) {
    new utils.TWEEN
      .Tween({ value: from })
      .to({ value: to }, 1e3 * during)
      .delay(0)
      .onStart(function() {})
      .easing(utils.TWEEN.Easing.Linear.None)
      .onStart(function() { timer && timer(0) })
      .onUpdate(function() { timer && timer(this.value) })
      .onComplete(function() { timer && timer(1), utils.TWEEN.remove(); })
      .start();
  }

  resize(a, b) {
    this.renderer.setSize(a, b);
    if (a > m || b > m) {
      a > b 
      ? (b = b / a * m, a = m) 
      : (a = a / b * m, b = m)
    }
    this.renderer.setSize(a, b, !1);
    this.camera.aspect = a / b;
    this.camera.updateProjectionMatrix();
  }

  updateOptions(newOptions) {
    const oldOptions = utils.deepClone(this.options);
    this.options = utils.mergeOptions(this.options, newOptions || {});
    if (!utils.easyDiff(oldOptions.projType, newOptions.projType)) {
      this.updateProjection();
      this.emitProjTrans());
    }
    
    if (!utils.easyDiff(oldOptions.isInteractive, newOptions.isInteractive)) {
      this.setInteractive()
    }

    if (!utils.easyObjDiff(oldOptions.background, newOptions.background)) {
      this.setClearColor()
    }

    if (!utils.easyObjDiff(oldOptions.cameraPos, newOptions.cameraPos)) {
      this.setCameraPos()
    }

    if (!utils.easyDiff(oldOptions.autoRotateSpeed, newOptions.autoRotateSpeed)) {
      this.setRotateSpeed();
    }
    if (!utils.easyDiff(oldOptions.renderMode, newOptions.renderMode) 
    || !utils.easyObjDiff(oldOptions.advancedModeOptions, newOptions.advancedModeOptions)) {
      this.updateComposer()
    }
  }
  
  updateComposer() {
    const { renderMode } = this.options;
    if ('normalMode' === renderMode) {
      this.composer && this.composer.remove();
      this.composer = null;
    } else if ('advancedMode' === renderMode) {
      this.composer || this.setComposer();
      const opts = this.getComposerOpts();
      this.composer.updateOptions(opts);
    }
  }

  setInteractive() {
    this.container.style.pointerEvents = this.options.isInteractive ? 'auto' : 'none';
  }

  setClearColor() {
    const { clearColor } = this.options.background;
    const color = utils.Chroma(a).rgba();
    const opacity = void 0 === color[3] ? 1 : color[3];
    this.renderer.setClearColor(new THREE.Color(clearColor), opacity);
  }

  setRotateSpeed() {
    const autoRotateSpeed = this.options.autoRotateSpeed;
    this.orbitControls.autoRotate = !0;
    this.orbitControls.autoRotateSpeed = autoRotateSpeed;
  }

  getContainerCoord(lng, lat) {
    if (defined(lng) && defined(lat))) {
      const projection = this.Projection(lng, lat);
      const coord = new THREE.Vector3(
        projection.x,
        projection.y,
        projection.z,
      );
      const e = coord.project(this.camera);
      const size = this.renderer.getSize();
      return [
        (e.x + 1) / 2 * size.width, 
        -(e.y - 1) / 2 * size.height,
      ];
    }
  }

  setCameraPos() {
    const { cameraPos } = this.options;
    const projection = this.Projection(cameraPos.lng, cameraPos.lat);
    const from = new THREE.Vector3(projection.x, projection.y, projection.z);
    const distance = from.distanceTo(new THREE.Vector3(0,0,0));
    const position = from.clone().multiplyScalar(cameraPos.distance / distance);
    this.orbitControls.object.fov = cameraPos.fov;
    this.orbitControls.object.position.set(position.x, position.y, position.z);
    this.orbitControls.target.set(0, 0, 0);
    this.orbitControls.object.updateProjectionMatrix();
  }

  setCameraLookAtOrigin() {
    const { cameraPos } = this.options;
    const { distance, fov } = cameraPos;
    const projection = this.Projection(0, 0);
    const end = new THREE.Vector3(d.x,d.y,d.z);
    const distance = end.distanceTo(new THREE.Vector3(0,0,0));
    const position = end.clone().multiplyScalar(distance / distance);
    
    this.orbitControls.object.fov = fov;
    this.orbitControls.object.position.set(position.x, position.y, position.z);
    this.orbitControls.target.set(0, 0, 0);
    this.orbitControls.object.updateProjectionMatrix();
  }

  render() {
    const renderMode = this.options.renderMode;
    if ('normalMode' === renderMode) {
      this.renderer.render(this.scene, this.camera);
    } else if ('advancedMode' === renderMode && this.composer) {
      this.composer.render();
    }
  }

  loop() {
    this.orbitControls.update();
    this.render();
    this.emit('animationFrame');
    utils.TWEEN && utils.TWEEN.update();
    window.requestAnimationFrame(this.loop.bind(this));
  }
}
