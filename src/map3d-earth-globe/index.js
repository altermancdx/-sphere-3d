const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/map3d-earth-globe/0.0.17", ["datav:/npm/eventemitter3/2.0.3"], function (a, b, c) {
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
    k = null,
    i = require("eventemitter3"),
    j = null,
    l = null,
    m = null,
    n = null,
    o = function (a) {
      function b(a, c) {
        d(this, b);
        var f = e(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this));
        return f.options = Object.assign({
          visible: !0,
          specular: "#868686",
          globeColor: "#47576A",
          emissive: "#23232A",
          lightColor: 4210752,
          lightIntensity: 2,
          radius: 200,
          scale: 1,
          mapUrl: "http://datavmap-public.oss-cn-hangzhou.aliyuncs.com/mapping/1/earth.topo.bathy.200407.3x4096x2048.jpg",
          bumpMapUrl: "https://img.alicdn.com/tfs/TB1Jp7dbsjI8KJjSsppXXXbyVXa-9000-4500.jpg"
        }, c || {}), f
      }
      return f(b, a), g(b, [{
        key: "addTo",
        value: function (a) {
          return a ? void(this.map = a, h = a.THREE, k = a.Utils, this.scene = a.scene, this.init(), this.initEvent()) : console.log("globe layer needs map layer")
        }
      }, {
        key: "initEvent",
        value: function () {
          this.map.on("projChanged", this.updatePostions.bind(this))
        }
      }, {
        key: "init",
        value: function () {
          var a = this.options,
            b = a.lightColor,
            c = a.lightIntensity,
            d = new h.Color(b),
            e = this.ambient = new h.AmbientLight(d, c);
          this.scene.add(e), this.createDoubleGeometry();
          var f = this.material = new h.MeshStandardMaterial({
              roughness: a.roughness,
              metalness: a.metalness,
              bumpScale: a.bumpScale,
              side: h.FrontSide,
              depthTest: !0,
              transparent: !0
            }),
            g = this.backMaterial = new h.MeshStandardMaterial({
              roughness: a.roughness,
              metalness: a.metalness,
              bumpScale: a.bumpScale,
              side: h.BackSide,
              depthTest: !0,
              transparent: !0
            });
          this.updateMaterial(f, g);
          var i = this.backGlobeMesh = new h.Mesh(this.backGlobeGeometry, g);
          i.scale.set(a.scale, a.scale, a.scale), i.renderOrder = 1, this.scene.add(i);
          var j = this.frontGlobeMesh = new h.Mesh(this.globeGeometry, f);
          j.scale.set(a.scale, a.scale, a.scale), this.scene.add(j), f.needsUpdate = !0, g.needsUpdate = !0, this.checkVisible()
        }
      }, {
        key: "createSphereGeometry",
        value: function (e, f, g) {
          for (var h, l = Math.floor(e), m = Math.floor(f), n = [], o = [], p = [], q = [], r = 0, s = [], t = 0; t <= m; t++) {
            h = [];
            for (var i = 0; i <= l; i++) {
              var j = -90 + i * (180 / m),
                u = -180 + t * (360 / l),
                v = k.ll2sphere(u, j, g);
              p.push(v.x, v.y, v.z);
              var w = k.ll2plane(u, j, g);
              q.push(w.x, w.y, w.z), n.push(t / l, i / m), h.push(r++)
            }
            s.push(h)
          }
          for (var x = 0; x < m; x++)
            for (var y = 0; y < l; y++) {
              var z = s[x][y + 1],
                a = s[x][y],
                b = s[x + 1][y],
                c = s[x + 1][y + 1];
              o.push(z, a, c), o.push(a, b, c)
            }
          this.uvs = new Float32Array(n), this.indexs = new Uint16Array(o), this.planePositionArray = new Float32Array(q), this.spherePositionArray = new Float32Array(p)
        }
      }, {
        key: "createDoubleGeometry",
        value: function () {
          var a = this.options.radius;
          this.createSphereGeometry(64, 64, a);
          var b = this.globeGeometry = new h.BufferGeometry;
          b.setIndex(new h.BufferAttribute(this.indexs, 1)), b.addAttribute("uv", new h.BufferAttribute(this.uvs, 2).setDynamic(!0)), 0 === this.map.projType ? b.addAttribute("position", new h.BufferAttribute(this.spherePositionArray.slice(), 3).setDynamic(!0)) : 1 === this.map.projType ? b.addAttribute("position", new h.BufferAttribute(this.planePositionArray.slice(), 3).setDynamic(!0)) : console.error(" Projection type error in globe "), b.computeVertexNormals(), this.backGlobeGeometry = b.clone()
        }
      }, {
        key: "updatePostions",
        value: function (a) {
          var b = a.projType,
            c = a.index,
            d = this.globeGeometry.attributes.position.array,
            e = this.backGlobeGeometry.attributes.position.array,
            f = this.spherePositionArray,
            g = this.planePositionArray;
          if (0 === b)
            for (var h = 0; h < d.length; h += 3) d[h + 0] = f[h + 0] * c + (1 - c) * g[h + 0], d[h + 1] = f[h + 1] * c + (1 - c) * g[h + 1], d[h + 2] = f[h + 2] * c + (1 - c) * g[h + 2], e[h + 0] = f[h + 0] * c + (1 - c) * g[h + 0], e[h + 1] = f[h + 1] * c + (1 - c) * g[h + 1], e[h + 2] = f[h + 2] * c + (1 - c) * g[h + 2];
          else if (1 === b)
            for (var i = 0; i < d.length; i += 3) d[i + 0] = g[i + 0] * c + (1 - c) * f[i + 0], d[i + 1] = g[i + 1] * c + (1 - c) * f[i + 1], d[i + 2] = g[i + 2] * c + (1 - c) * f[i + 2], e[i + 0] = g[i + 0] * c + (1 - c) * f[i + 0], e[i + 1] = g[i + 1] * c + (1 - c) * f[i + 1], e[i + 2] = g[i + 2] * c + (1 - c) * f[i + 2];
          this.globeGeometry.attributes.position.needsUpdate = !0, this.backGlobeGeometry.attributes.position.needsUpdate = !0
        }
      }, {
        key: "updateMaterial",
        value: function (a, b) {
          if (a && b) {
            var c = this.options,
              d = null;
            d = "customMap" === c.mapUrl ? c.customMapUrl : c.mapUrl;
            var e = c.bumpMapUrl,
              f = new h.TextureLoader().setCrossOrigin("*");
            l === d && j || (j = f.load(d, function () {
              j.needsUpdate = !0
            }), l = d), n === e && m || (m = f.load(e, function () {
              m.needsUpdate = !0
            }), n = e), a.map = j, a.bumpMap = m, a.roughness = c.roughness, a.metalness = c.metalness, a.bumpScale = c.bumpScale, b.map = j, b.bumpMap = m, b.roughness = c.roughness, b.metalness = c.metalness, b.bumpScale = c.bumpScale, a.needsUpdate = !0, b.needsUpdate = !0
          }
        }
      }, {
        key: "updateLight",
        value: function () {
          var a = this.options,
            b = a.lightIntensity;
          this.ambient.intensity = b
        }
      }, {
        key: "updateGlobe",
        value: function () {
          var a = this.options,
            b = a.scale;
          this.updateMaterial(this.material, this.backMaterial), this.backGlobeMesh && this.backGlobeMesh.scale.set(b, b, b), this.frontGlobeMesh && this.frontGlobeMesh.scale.set(b, b, b), this.material.needsUpdate = !0, this.backMaterial.needsUpdate = !0
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
          this.options.visible = !1, this.backGlobeMesh && (this.backGlobeMesh.visible = !1), this.frontGlobeMesh && (this.frontGlobeMesh.visible = !1)
        }
      }, {
        key: "show",
        value: function () {
          this.options.visible = !0, this.backGlobeMesh && (this.backGlobeMesh.visible = !0), this.frontGlobeMesh && (this.frontGlobeMesh.visible = !0)
        }
      }, {
        key: "updateOptions",
        value: function (a) {
          this.options = k.mergeOptions(this.options, a || {}), this.updateLight(), this.updateGlobe(), this.checkVisible()
        }
      }, {
        key: "remove",
        value: function () {
          this.map.off("projChanged", this.updatePostions), this.ambient && this.scene.remove(this.ambient), this.backGlobeMesh && this.scene.remove(this.backGlobeMesh), this.frontGlobeMesh && this.scene.remove(this.frontGlobeMesh), this.backGlobeMesh && this.backGlobeMesh.dispose && this.backGlobeMesh.dispose(), this.backMaterial && this.backMaterial.dispose && this.backMaterial.dispose(), this.backGlobeGeometry && this.backGlobeGeometry.dispose && this.backGlobeGeometry.dispose(), this.frontGlobeMesh && this.frontGlobeMesh.dispose && this.frontGlobeMesh.dispose(), this.material && this.material.dispose && this.material.dispose(), this.globeGeometry && this.globeGeometry.dispose && this.globeGeometry.dispose(), this.ambient && this.ambient.dispose && this.ambient.dispose(), this.ambient = null, this.backGlobeMesh = null, this.backMaterial = null, this.backGlobeGeometry = null, this.frontGlobeMesh = null, this.material = null, this.globeGeometry = null, l = null, n = null, j = null, m = null
        }
      }]), b
    }(i);
  return a.exports = o, a.exports
});
