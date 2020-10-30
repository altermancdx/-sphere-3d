const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/map3d-earth-thunder/0.0.19", ["datav:/npm/eventemitter3/2.0.3"], function (a, b, c) {
  function d(a, b) {
    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
  }

  function e(a, b) {
    if (!a) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return b && ("object" === typeof b || "function" === typeof b) ? b : a
  }

  function f(a, b) {
    if ("function" !== typeof b && null !== b) throw new TypeError("Super expression must either be null or a function, not " + typeof b);
    a.prototype = Object.create(b && b.prototype, {
      constructor: {
        value: a,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b)
  }
  var g = function () {
      function a(a, b) {
        for (var c, d = 0; d < b.length; d++) c = b[d], c.enumerable = c.enumerable || !1, c.configurable = !0, "value" in c && (c.writable = !0), Object.defineProperty(a, c.key, c)
      }
      return function (b, c, d) {
        return c && a(b.prototype, c), d && a(b, d), b
      }
    }(),
    h = null,
    j = null,
    i = require("eventemitter3"),
    k = require("@/map3d-earth-thunder/beijing-road-300"),
    l = function (a) {
      function b(a, c) {
        d(this, b);
        var f = e(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this));
        return f.options = Object.assign({
          visible: !0,
          speed: 9e-3,
          level: 3,
          minRadius: 0.01,
          maxRadius: 0.2,
          radiusSegments: 3,
          closed: !1,
          intervalFreq: 0.9,
          lineLength: 0.9,
          height: 3,
          opacityFactor: 1,
          trailColor: "#FFFD49",
          lightness: 1
        }, c || {}), f.tubeTrailGroup = [], f
      }
      return f(b, a), g(b, [{
        key: "addTo",
        value: function (a) {
          return a ? void(h = a.THREE, j = a.Utils, this.map = a, this.scene = a.scene, this.initEvent()) : console.log("thunder layer needs map layer")
        }
      }, {
        key: "initEvent",
        value: function () {
          this.map.on("animationFrame", this.animation.bind(this)), this.map.on("projChanged", this.updatePostions.bind(this))
        }
      }, {
        key: "render",
        value: function (a) {
          var b = this;
          if (!a) return console.log("trail layer no data");
          if (Array.isArray(a) && !a.length) return this.clean(), console.log("trail layer no data");
          this._data = a && a.features && Array.isArray(a.features) && 0 < a.features.length ? a : k, this.clean();
            type: "text/javascript"
          })));
          c.postMessage({
            ds: this._data,
            options: JSON.parse(JSON.stringify(this.options))
          }), c.onmessage = function (a) {
            for (var c = a.data.data, e = 0; e < c.length; e++) {
              var f = c[e],
                d = b.createTrail(f.tubeGeometry);
              b.scene.add(d), b.tubeTrailGroup.push(d)
            }
            b.checkVisible()
          }
        }
      }, {
        key: "createTrail",
        value: function (a) {
          var b = new h.BufferGeometry;
          b.setIndex(new h.BufferAttribute(new Uint32Array(a.index), 1)), b.addAttribute("sphere_position", new h.BufferAttribute(a.spherePositions, 3).setDynamic(!0)), b.addAttribute("plane_position", new h.BufferAttribute(a.planePositions, 3).setDynamic(!0)), b.addAttribute("uv", new h.BufferAttribute(new Float32Array(a.uv), 2).setDynamic(!0)), b.computeBoundingSphere(), b.computeBoundingBox();
          var c = new h.Mesh(b, this.getMaterial());
          return c.renderOrder = 3e3 + Math.round(2e3 * Math.random()), c
        }
      }, {
        key: "getMaterial",
        value: function () {
          var a = this.options,
            b = a.lineLength,
            d = a.opacityFactor,
            e = j.Chroma(a.trailColor).gl();
          return new h.ShaderMaterial({
            uniforms: {
              uColor: {
                type: "vec3",
                value: new h.Vector3(e[0], e[1], e[2])
              },
              uTrailLength: {
                type: "f",
                value: b
              },
              uTimeCounter: {
                type: "f",
                value: -Math.random()
              },
              uOpacityFactor: {
                type: "f",
                value: d
              },
              u_ease_index: {
                value: 1
              },
              u_proj_type: {
                value: this.map.projType
              }
            },
            vertexShader: require("@/map3d-earth-thunder/shader/vert.glsl"),
            fragmentShader: require("@/map3d-earth-thunder/shader/frag.glsl"),
            side: h.DoubleSide,
            blending: h.AdditiveBlending,
            depthTest: !0,
            depthWrite: !0,
            transparent: !0
          })
        }
      }, {
        key: "animation",
        value: function () {
          if (this.options.visible) {
            var a = this.options,
              b = a.speed,
              c = a.intervalFreq + 1,
              d = this.tubeTrailGroup;
            if (d.length)
              for (var e, f = 0; f < d.length; f++) e = d[f], e.material.uniforms.uTimeCounter.value += b, e.material.uniforms.uTimeCounter.value > c + 4 * b && (e.material.uniforms.uTimeCounter.value = 0)
          }
        }
      }, {
        key: "updatePostions",
        value: function (a) {
          var b = a.projType,
            c = a.index,
            d = this.tubeTrailGroup;
          if (d.length)
            for (var e, f = 0; f < d.length; f++) e = d[f], e.material.uniforms.u_ease_index.value = c, e.material.uniforms.u_proj_type.value = b
        }
      }, {
        key: "updateOptions",
        value: function (a) {
          var b = this.options.speed,
            c = this.options.lineLength,
            d = this.options.intervalFreq,
            e = this.options.opacityFactor,
            f = j.Chroma(this.options.trailColor).gl();
          this.options = j.mergeOptions(this.options, a || {});
          var g = j.Chroma(a.trailColor).gl();
          b !== a.speed || c !== a.lineLength || d !== a.intervalFreq || e !== a.opacityFactor || f[0] !== g[0] || f[1] !== g[1] || f[2] !== g[2] ? this.updateTrails() : this.render(this._data), this.checkVisible()
        }
      }, {
        key: "checkVisible",
        value: function () {
          var a = this.options;
          a.visible ? this.show() : this.hide()
        }
      }, {
        key: "hide",
        value: function () {
          var a = this.tubeTrailGroup;
          if (a.length)
            for (var b, c = 0; c < a.length; c++) b = a[c], b.visible = !1
        }
      }, {
        key: "show",
        value: function () {
          var a = this.tubeTrailGroup;
          if (a.length)
            for (var b, c = 0; c < a.length; c++) b = a[c], b.visible = !0
        }
      }, {
        key: "updateTrails",
        value: function () {
          var a = this.options,
            b = j.Chroma(a.trailColor).gl(),
            c = this.tubeTrailGroup;
          if (c.length)
            for (var d, e = 0; e < c.length; e++) d = c[e], d.material.uniforms.uTrailLength.value = a.lineLength, d.material.uniforms.uOpacityFactor.value = a.opacityFactor, d.material.uniforms.uColor.value = new h.Vector3(b[0], b[1], b[2]), d.material.needsUpdate = !0
        }
      }, {
        key: "clean",
        value: function () {
          var a = this.tubeTrailGroup;
          if (a.length)
            for (var b, c = 0; c < a.length; c++) b = a[c], this.scene.remove(b), b && b.dispose && b.dispose(), b.geometry && b.geometry.dispose && b.geometry.dispose(), b.material && b.material.dispose && b.material.dispose();
          this.tubeTrailGroup = []
        }
      }, {
        key: "remove",
        value: function () {
          this.map.off("animationFrame", this.animation), this.map.off("projChanged", this.updatePostions), this.clean(), this._data = null
        }
      }]), b
    }(i);
  return a.exports = l, a.exports
});