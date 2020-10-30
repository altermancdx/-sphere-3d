;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/map", ["datav:/npm/three/0.97.0", "datav:/npm/eventemitter3/2.0.3", "datav:/npm/three-orbit-controls/82.1.0"], function(a, b, c) {
  function d(a, b) {
      if (!(a instanceof b))
          throw new TypeError("Cannot call a class as a function")
  }
  function e(a, b) {
      if (!a)
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return b && ("object" === typeof b || "function" === typeof b) ? b : a
  }
  function f(a, b) {
      if ("function" !== typeof b && null !== b)
          throw new TypeError("Super expression must either be null or a function, not " + typeof b);
      a.prototype = Object.create(b && b.prototype, {
          constructor: {
              value: a,
              enumerable: !1,
              writable: !0,
              configurable: !0
          }
      }),
      b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b)
  }
  var g = function() {
      function a(a, b) {
          for (var c, d = 0; d < b.length; d++)
              c = b[d],
              c.enumerable = c.enumerable || !1,
              c.configurable = !0,
              "value"in c && (c.writable = !0),
              Object.defineProperty(a, c.key, c)
      }
      return function(b, c, d) {
          return c && a(b.prototype, c),
          d && a(b, d),
          b
      }
  }()
    , h = c("datav:/npm/three/0.97.0")
    , i = c("datav:/com/@double11-2017/map3d-earth/0.1.14/utils")
    , j = c("datav:/npm/eventemitter3/2.0.3")
    , k = c("datav:/com/@double11-2017/map3d-earth/0.1.14/composer")
    , l = c("datav:/npm/three-orbit-controls/82.1.0")(h)
    , m = 4096
    , n = function(a) {
      return null === a || void 0 === a
  }
    , o = function(a) {
      function b(a, c) {
          d(this, b);
          var f = e(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this));
          return f.THREE = h,
          f.Utils = i,
          f.container = "string" === typeof a ? document.querySelector(a) : a,
          f.options = Object.assign({
              autoRotateSpeed: 1,
              projType: 0,
              isInteractive: !0,
              background: {
                  clearColor: "#102B42"
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
                  bloomStrength: 0.8
              }
          }, c),
          f.container.style.pointerEvents = f.options.isInteractive ? "auto" : "none",
          f.composer = null,
          f.Projection = null,
          f.unProjection = null,
          f.projType = 0,
          f.init(),
          f.loop(),
          f
      }
      return f(b, a),
      g(b, [{
          key: "init",
          value: function() {
              var a = this.options
                , b = this.container
                , c = b.clientWidth
                , d = b.clientHeight
                , e = this.scene = new h.Scene
                , f = this.renderer = new h.WebGLRenderer({
                  canvas: document.createElementNS("http://www.w3.org/1999/xhtml", "canvas"),
                  alpha: !0,
                  antialias: !0,
                  preserveDrawingBuffer: !0
              });
              f.shadowMap.type = h.PCFSoftShadowMap,
              f.setSize(c, d),
              f.toneMapping = h.ReinhardToneMapping,
              f.toneMappingExposure = Math.pow(1.05, 4),
              f.gammaInput = !0,
              f.gammaOutput = !0,
              b.appendChild(f.domElement);
              var g = this.camera = new h.PerspectiveCamera(a.cameraPos.fov,c / d,0.1,1e8)
                , i = this.orbitControls = new l(g,b);
              i.maxDistance = 1e4,
              i.enableKeys = !1,
              this.setRotateSpeed(),
              this.updateProjection(),
              this.setComposer(),
              this.setCameraPos(),
              this.setClearColor(),
              this.setInteractive(),
              this.scaleX = 1,
              this.scaleY = 1,
              window.share.event && window.share.event.on("ratio-change", this.ratioChange.bind(this))
          }
      }, {
          key: "ratioChange",
          value: function(a) {
              this.scaleX = a.ratioX,
              this.scaleY = a.ratioY,
              this.resize(this.container.clientWidth, this.container.clientHeight)
          }
      }, {
          key: "getComposerOpts",
          value: function() {
              var a = this.options.advancedModeOptions;
              return {
                  bloomRadius: a.bloomRadius,
                  bloomStrength: a.bloomStrength,
                  antiAliasType: a.antiAliasType,
                  bloomThreshold: a.bloomThreshold,
                  clearColor: this.renderer.getClearColor(),
                  clearAlpha: this.renderer.getClearAlpha()
              }
          }
      }, {
          key: "setComposer",
          value: function() {
              var a = this.options;
              if ("advancedMode" === a.renderMode) {
                  this.composer && this.composer.remove();
                  var b = this.getComposerOpts();
                  this.composer = new k(this.scene,this.camera,this.renderer,this.container,b)
              }
          }
      }, {
          key: "ll2sphere",
          value: function(a, b) {
              var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 200
                , d = (90 - b) * (Math.PI / 180)
                , e = (a + 180) * (Math.PI / 180)
                , f = -(c * Math.sin(d) * Math.cos(e))
                , g = c * Math.sin(d) * Math.sin(e)
                , h = c * Math.cos(d);
              return {
                  x: f,
                  y: h,
                  z: g
              }
          }
      }, {
          key: "updateProjection",
          value: function() {
              var a = this.options.projType;
              0 === a ? (this.Projection = i.ll2sphere,
              this.unProjection = i.sphere2ll,
              this.projType = 0) : 1 === a ? (this.Projection = i.ll2plane,
              this.unProjection = i.plane2ll,
              this.projType = 1) : void 0
          }
      }, {
          key: "emitProjTrans",
          value: function() {
              var a = this
                , b = this.options
                , c = b.isProjTrans
                , d = b.projType
                , e = b.transDuration;
              0 === d ? this.setCameraPos() : 1 === d && this.setCameraLookAtOrigin(),
              c && (0 === e ? this.emit("projChanged", {
                  projType: d,
                  index: 1
              }) : this.createEaseFunc(0, 1, e, function(b) {
                  a.emit("projChanged", {
                      projType: d,
                      index: b
                  })
              }))
          }
      }, {
          key: "createEaseFunc",
          value: function(a, b, c, d) {
              new i.TWEEN.Tween({
                  value: a
              }).to({
                  value: b
              }, 1e3 * c).delay(0).onStart(function() {}).easing(i.TWEEN.Easing.Linear.None).onStart(function() {
                  d && d(0)
              }).onUpdate(function() {
                  d && d(this.value)
              }).onComplete(function() {
                  d && d(1),
                  i.TWEEN.remove()
              }).start()
          }
      }, {
          key: "resize",
          value: function(a, b) {
              this.renderer.setSize(a, b),
              (a > m || b > m) && (a > b ? (b = b / a * m,
              a = m) : (a = a / b * m,
              b = m)),
              this.renderer.setSize(a, b, !1),
              this.camera.aspect = a / b,
              this.camera.updateProjectionMatrix()
          }
      }, {
          key: "updateOptions",
          value: function(a) {
              var b = i.deepClone(this.options);
              this.options = i.mergeOptions(this.options, a || {}),
              i.easyDiff(b.projType, a.projType) || (this.updateProjection(),
              this.emitProjTrans()),
              i.easyDiff(b.isInteractive, a.isInteractive) || this.setInteractive(),
              i.easyObjDiff(b.background, a.background) || this.setClearColor(),
              i.easyObjDiff(b.cameraPos, a.cameraPos) || this.setCameraPos(),
              i.easyDiff(b.autoRotateSpeed, a.autoRotateSpeed) || this.setRotateSpeed(),
              i.easyDiff(b.renderMode, a.renderMode) && i.easyObjDiff(b.advancedModeOptions, a.advancedModeOptions) || this.updateComposer()
          }
      }, {
          key: "updateComposer",
          value: function() {
              var a = this.options.renderMode;
              if ("normalMode" === a)
                  this.composer && (this.composer.remove(),
                  this.composer = null);
              else if ("advancedMode" === a) {
                  this.composer || this.setComposer();
                  var b = this.getComposerOpts();
                  this.composer.updateOptions(b)
              }
          }
      }, {
          key: "setInteractive",
          value: function() {
              this.container.style.pointerEvents = this.options.isInteractive ? "auto" : "none"
          }
      }, {
          key: "setClearColor",
          value: function() {
              var a = this.options.background.clearColor
                , b = i.Chroma(a).rgba()
                , c = void 0 === b[3] ? 1 : b[3];
              this.renderer.setClearColor(new h.Color(a), c)
          }
      }, {
          key: "setRotateSpeed",
          value: function() {
              var a = this.options.autoRotateSpeed;
              this.orbitControls.autoRotate = !0,
              this.orbitControls.autoRotateSpeed = a
          }
      }, {
          key: "getContainerCoord",
          value: function(a, b) {
              if (!(n(b) || n(a))) {
                  var c = this.Projection(a, b)
                    , d = new h.Vector3(c.x,c.y,c.z)
                    , e = d.project(this.camera)
                    , f = this.renderer.getSize();
                  return [(e.x + 1) / 2 * f.width, -(e.y - 1) / 2 * f.height]
              }
          }
      }, {
          key: "setCameraPos",
          value: function() {
              var a = this.options.cameraPos
                , b = this.Projection(a.lng, a.lat)
                , c = new h.Vector3(b.x,b.y,b.z)
                , d = c.distanceTo(new h.Vector3(0,0,0))
                , e = c.clone().multiplyScalar(a.distance / d);
              this.orbitControls.object.fov = a.fov,
              this.orbitControls.object.position.set(e.x, e.y, e.z),
              this.orbitControls.target.set(0, 0, 0),
              this.orbitControls.object.updateProjectionMatrix()
          }
      }, {
          key: "setCameraLookAtOrigin",
          value: function() {
              var a = this.options.cameraPos
                , b = a.distance
                , c = a.fov
                , d = this.Projection(0, 0)
                , e = new h.Vector3(d.x,d.y,d.z)
                , f = e.distanceTo(new h.Vector3(0,0,0))
                , g = e.clone().multiplyScalar(b / f);
              this.orbitControls.object.fov = c,
              this.orbitControls.object.position.set(g.x, g.y, g.z),
              this.orbitControls.target.set(0, 0, 0),
              this.orbitControls.object.updateProjectionMatrix()
          }
      }, {
          key: "render",
          value: function() {
              var a = this.options.renderMode;
              "normalMode" === a ? this.renderer.render(this.scene, this.camera) : "advancedMode" === a && this.composer && this.composer.render()
          }
      }, {
          key: "loop",
          value: function() {
              this.orbitControls.update(),
              this.render(),
              this.emit("animationFrame"),
              i.TWEEN && i.TWEEN.update(),
              window.requestAnimationFrame(this.loop.bind(this))
          }
      }]),
      b
  }(j);
  return a.exports = o,
  a.exports
});
;
