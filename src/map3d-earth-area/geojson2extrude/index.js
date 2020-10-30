const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/map3d-earth-area/0.0.16/geojson2extrude", ["datav:/npm/earcut/2.1.2"], function (a, b, c) {
  var d = require("earcut"),
    e = require("@/map3d-earth-area/extruder.js");
  return a.exports = function (a, b) {
    var c = {
      getRMax: function (a) {
        return a.properties.floor || a.properties.height || 0
      },
      getRMin: function () {
        return 200
      },
      getKey: function (a) {
        return a.properties.id || a.properties.adcode || a.properties.ad_code || a.properties.name
      },
      getVertexColor: function () {
        return [0, 0, 0, 1]
      }
    };
    Object.assign(c, b);
    for (var d = [], f = [], g = [], h = [], i = {}, j = a.features, k = function (a) {
        var b = j[a],
          k = [],
          l = c.getRMax(b, a),
          m = c.getRMin(b, a);
        if (b.geometry) {
          "MultiPolygon" === b.geometry.type ? [].push.apply(k, b.geometry.coordinates) : "Polygon" === b.geometry.type && k.push(b.geometry.coordinates);
          var n = d.length / 3;
          k.forEach(function (a) {
            var b = d.length / 3,
              i = e(a, {
                rMax: l,
                rMin: m,
                project: c.project
              });
            [].push.apply(f, i.planePositions), [].push.apply(d, i.spherePositions), [].push.apply(g, i.uvs);
            var j = i.cells,
              k = j.map(function (a) {
                return a + b
              });
            [].push.apply(h, k)
          });
          var o = d.length / 3,
            p = c.getKey(b, a);
          p && (i[p] = [n, o])
        }
      }, l = 0, m = j.length; l < m; l++) k(l, m);
    return {
      planePositions: f,
      spherePositions: d,
      uvs: g,
      indices_array: h,
      key_index: i
    }
  }, a.exports
});;
