;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/composer", ["datav:/npm/three/0.97.0", "datav:/npm/eventemitter3/2.0.3", "datav:/npm/safely-merge/1.0.1"], function(a, b, c) {
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
    , i = c("datav:/npm/eventemitter3/2.0.3")
    , j = c("datav:/npm/safely-merge/1.0.1")
    , k = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/EffectComposer")
    , l = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/RenderPass")
    , m = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/CopyShader")
    , n = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/ShaderPass")
    , o = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/LuminosityHighPassShader")
    , p = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/UnrealBloomPass")
    , q = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/SMAAPass")
    , r = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/TAARenderPass")
    , s = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/FXAAShader")
    , t = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/MaskPass")
    , u = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/FilmPass")
    , v = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/OutlinePass")
    , w = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/SSAOShader")
    , x = {
      bloomThreshold: 0.8,
      bloomStrength: 1.8,
      bloomRadius: 0.3,
      antiAliasType: "NONE"
  }
    , y = function(a) {
      function b(a, c, f, g, h) {
          var i;
          d(this, b);
          var k = e(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this));
          return f && g && a && c ? (k.options = j(x, h || {}),
          k.scene = a,
          k.camera = c,
          k.renderer = f,
          k.container = g,
          k.init(),
          k) : (i = console.log("init composer failed"),
          e(k, i))
      }
      return f(b, a),
      g(b, [{
          key: "init",
          value: function() {
              var a = this.options
                , b = this.offsetWidth = this.container.offsetWidth
                , c = this.offsetHeight = this.container.offsetHeight
                , d = this.renderer.getClearColor()
                , e = this.renderer.getClearAlpha()
                , f = this.renderScene = new l(this.scene,this.camera,null,d,e);
              f.enabled = !1;
              var g = a.bloomRadius
                , i = a.bloomStrength
                , j = a.bloomThreshold
                , o = new h.Vector2(b,c)
                , q = this.bloomPass = new p(o,i,g,j)
                , r = new n(m);
              r.renderToScreen = !0;
              var s = this.composer = new k(this.renderer);
              s.setSize(b, c),
              s.addPass("renderScene", f),
              s.addPass("bloomPass", q),
              s.addPass("copyShader", r),
              this.addAntiAliasPass(),
              this.addSpecialEffectPass()
          }
      }, {
          key: "addAntiAliasPass",
          value: function() {
              var a = this.options.antiAliasType;
              switch (this.removeAntiAliasPass(),
              a) {
              case "SMAA":
                  {
                      var b = new q(this.offsetWidth,this.offsetHeight);
                      b.renderToScreen = !0,
                      this.composer.addPass("smaaRenderPass", b)
                  }
                  break;
              case "TAA":
                  {
                      var c = this.renderer.getClearColor().getHex()
                        , d = this.renderer.getClearAlpha()
                        , e = new r(this.scene,this.camera);
                      e.unbiased = !1,
                      e.sampleLevel = 4,
                      e.accumulate = !0,
                      e.accumulateIndex = -1,
                      e.renderToScreen = !1,
                      this.composer.addPass("taaRenderPass", e),
                      this.switchRenderScene(!1)
                  }
                  break;
              case "FXAA":
                  {
                      var f = new n(s)
                        , g = new h.Vector2(1 / this.offsetWidth,1 / this.offsetHeight);
                      f.uniforms.resolution.value = g,
                      this.composer.addPass("fxaaRenderPass", f)
                  }
                  break;
              default:
              }
          }
      }, {
          key: "addSpecialEffectPass",
          value: function() {}
      }, {
          key: "removeAntiAliasPass",
          value: function() {
              this.composer.remove("smaaRenderPass"),
              this.composer.remove("taaRenderPass"),
              this.composer.remove("fxaaRenderPass"),
              this.switchRenderScene(!0)
          }
      }, {
          key: "switchRenderScene",
          value: function(a) {
              this.renderScene && (this.renderScene.enabled = a)
          }
      }, {
          key: "renderToScreen",
          value: function(a) {
              a.renderToScreen = !0
          }
      }, {
          key: "removeFromScreen",
          value: function(a) {
              a.renderToScreen = !1
          }
      }, {
          key: "render",
          value: function() {
              this.composer && this.composer.render()
          }
      }, {
          key: "updateOptions",
          value: function(a) {
              this.options = j(this.options, a || {}),
              this.bloomPass && (this.bloomPass.radius = this.options.bloomRadius,
              this.bloomPass.strength = this.options.bloomStrength,
              this.bloomPass.threshold = this.options.bloomThreshold),
              this.addAntiAliasPass(),
              this.addSpecialEffectPass(),
              this.updateRenderPassClear()
          }
      }, {
          key: "updateRenderPassClear",
          value: function() {
              this.renderScene && this.renderScene.updateClear(this.options.clearColor, this.options.clearAlpha)
          }
      }, {
          key: "remove",
          value: function() {
              this.composer.dispose(),
              this.composer = null
          }
      }]),
      b
  }(i);
  return a.exports = y,
  a.exports
});
