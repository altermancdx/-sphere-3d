const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/map3d-earth-area/0.0.16/extrude-line", ["datav:/npm/gl-vec2/1.0.0/distance", "datav:/npm/gl-vec2/1.0.0/copy", "datav:/npm/gl-vec2/1.0.0/scaleAndAdd", "datav:/npm/gl-vec2/1.0.0/dot", "datav:/npm/as-number/1.0.0", "datav:/npm/polyline-miter-util/1.0.1"], function (a, b, c) {
  function d(a, b) {
    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
  }
  var e = function () {
      function a(a, b) {
        for (var c, d = 0; d < b.length; d++) c = b[d], c.enumerable = c.enumerable || !1, c.configurable = !0, "value" in c && (c.writable = !0), Object.defineProperty(a, c.key, c)
      }
      return function (b, c, d) {
        return c && a(b.prototype, c), d && a(b, d), b
      }
    }(),
    f = {
      create: function () {
        return [0, 0]
      },
      distance: require("gl-vec2/distance"),
      clone: function (a) {
        return [a[0], a[1]]
      },
      copy: require("gl-vec2/copy"),
      scaleAndAdd: require("gl-vec2/scaleAndAdd"),
      dot: require("gl-vec2/dot")
    },
    g = require("as-number"),
    h = f.create(),
    i = f.create(),
    j = f.create(),
    k = f.create(),
    l = f.create(),
    m = f.create(),
    n = require("polyline-miter-util");
  _sphereProject = null, _planeProject = null, _R = null;
  var o = n.computeMiter,
    p = n.normal,
    q = n.direction,
    r = function () {
      function a(b) {
        d(this, a), b = b || {}, this.miterLimit = g(b.miterLimit, 10), this.thickness = g(b.thickness, 1), this.join = b.join || "miter", this.cap = b.cap || "butt", this._normal = null, this._lastFlip = -1, this._started = !1, _R = b.R, _sphereProject = b.project.ll2sphere, _planeProject = b.project.ll2plane
      }
      return e(a, [{
        key: "mapThickness",
        value: function () {
          return this.thickness
        }
      }, {
        key: "sphereProject",
        value: function (a) {
          var b = _sphereProject(a[0], a[1], _R);
          return [b.x, b.y, b.z]
        }
      }, {
        key: "planeProject",
        value: function (a) {
          var b = _planeProject(a[0], a[1], _R);
          return [b.x, b.y, b.z]
        }
      }, {
        key: "build",
        value: function (a) {
          var b = {
            spherePositions: [],
            planePositions: [],
            cells: [],
            uvs: []
          };
          if (1 >= a.length) return b;
          var c = a.length;
          this._lastFlip = -1, this._started = !1, this._normal = null;
          for (var d = 0, e = 0; e < c - 1; e++) d += f.distance(a[e], a[e + 1]);
          for (var g = 0, h = 1, i = 0; h < c; h++) {
            var j = a[h - 1],
              k = a[h],
              l = h < a.length - 1 ? a[h + 1] : null,
              m = this.mapThickness(k, h, a);
            g += f.distance(j, k) / d;
            var n = this._seg(b, i, j, k, l, m / 2, g);
            i += n
          }
          return b
        }
      }, {
        key: "_seg",
        value: function (a, b, c, d, e, g, n) {
          var r = 0,
            s = a.cells,
            t = a.planePositions,
            u = a.spherePositions,
            v = a.uvs,
            w = "square" === this.cap,
            x = "bevel" === this.join;
          if (q(j, d, c), this._normal || (this._normal = f.create(), p(this._normal, j)), this._started || (this._started = !0, w && (f.scaleAndAdd(i, c, j, -g), c = i), this.extrusions(t, v, c, this._normal, g, 0, this.planeProject), this.extrusions(u, v, c, this._normal, g, 0, this.sphereProject)), s.push(b + 0, b + 1, b + 2), !e) p(this._normal, j), w && (f.scaleAndAdd(i, d, j, g), d = i), this.extrusions(t, v, c, this._normal, g, 1, this.planeProject), this.extrusions(u, v, c, this._normal, g, 1, this.sphereProject), [].push.apply(s, 1 === this._lastFlip ? [b, b + 2, b + 3] : [b + 2, b + 1, b + 3]), r += 2;
          else {
            q(k, e, d);
            var y = o(l, m, j, k, g),
              z = 0 > f.dot(l, this._normal) ? -1 : 1,
              A = x;
            if (!A && "miter" === this.join) {
              y / g > this.miterLimit && (A = !0)
            }
            A ? (f.scaleAndAdd(h, d, this._normal, -g * z), [].push.apply(u, this.sphereProject(f.clone(h))), [].push.apply(t, this.planeProject(f.clone(h))), v.push(n, 1), f.scaleAndAdd(h, d, m, y * z), [].push.apply(u, this.sphereProject(f.clone(h))), [].push.apply(t, this.planeProject(f.clone(h))), v.push(n, 0), [].push.apply(s, this._lastFlip === -z ? [b + 2, b + 1, b + 3] : [b, b + 2, b + 3]), s.push(b + 2, b + 3, b + 4), p(h, k), f.copy(this._normal, h), f.scaleAndAdd(h, d, h, -g * z), [].push.apply(u, this.sphereProject(f.clone(h))), [].push.apply(t, this.planeProject(f.clone(h))), v.push(n, 0), r += 3) : (this.extrusions(t, v, d, m, y, n, this.planeProject), this.extrusions(u, v, d, m, y, n, this.sphereProject), [].push.apply(s, 1 === this._lastFlip ? [b, b + 2, b + 3] : [b + 2, b + 1, b + 3]), z = -1, f.copy(this._normal, m), r += 2), this._lastFlip = z
          }
          return r
        }
      }, {
        key: "extrusions",
        value: function (a, b, c, d, e, g, i) {
          f.scaleAndAdd(h, c, d, -e), [].push.apply(a, i(f.clone(h))), b.push(g, 1), f.scaleAndAdd(h, c, d, e), [].push.apply(a, i(f.clone(h))), b.push(g, 0)
        }
      }]), a
    }();
  return a.exports = function (a, b) {
    var c = new r(b);
    return c.build(a)
  }, a.exports
});;
