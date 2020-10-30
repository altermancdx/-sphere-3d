const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/map3d-earth-area/0.0.16/geojson2extrudeline", [], function (a, b, c) {
  var d = require("@/map3d-earth-area/extrude-line");
  return a.exports = function (a, b) {
    var c = {
      getR: function () {
        return 200 + 0.01
      },
      getThickness: function () {
        return 0.05
      },
      getCap: function () {
        return "square"
      },
      getJoin: function () {
        return "bevel"
      },
      getMiterLimit: function () {
        return 0.2
      },
      getKey: function (a) {
        return a.properties.id || a.properties.adcode
      }
    };
    Object.assign(c, b);
    for (var e, f = {
        spherePositions: [],
        planePositions: [],
        uv: [],
        index: [],
        key_index: {}
      }, g = a.features, h = function (a) {
        var b = g[a],
          e = [];
        if (!b.geometry) return "continue";
        switch (b.geometry.type) {
          case "MultiLineString":
            [].push.apply(e, b.geometry.coordinates);
            break;
          case "LineString":
            e.push(b.geometry.coordinates);
            break;
          case "Polygon":
            [].push.apply(e, b.geometry.coordinates);
            break;
          case "MultiPolygon":
            b.geometry.coordinates.forEach(function (a) {
              [].push.apply(e, a)
            });
            break;
          default:
        }
        for (var h = f.spherePositions.length / 3, j = function (g) {
            var h = e[g],
              i = f.spherePositions.length / 3,
              j = {
                project: c.project,
                R: c.getR(b, a),
                thickness: c.getThickness(b, a),
                cap: c.getCap(b, a),
                join: c.getJoin(b, a),
                miterLimit: c.getMiterLimit(b, a)
              },
              k = d(h, j);
            k.spherePositions.map(function (a) {
              return f.spherePositions.push(a)
            }), k.planePositions.map(function (a) {
              return f.planePositions.push(a)
            }), k.uvs.map(function (a) {
              return f.uv.push(a)
            });
            var l = k.cells.map(function (a) {
              return a + i
            });
            l.map(function (a) {
              return f.index.push(a)
            })
          }, k = 0; k < e.length; k++) j(k);
        var i = f.spherePositions.length / 3,
          l = c.getKey(b, a);
        f.key_index[l] = {
          range: [h, i],
          userData: b.properties
        }
      }, i = 0; i < g.length; i++) e = h(i), "continue" === e;
    return f
  }, a.exports
});;
