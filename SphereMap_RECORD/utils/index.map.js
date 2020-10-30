Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/utils", ["datav:/npm/tween.js/16.6.0", "datav:/npm/chroma-js/1.3.4", "datav:/npm/safely-merge/1.0.1"], function(a, b, c) {
  var d = c("datav:/npm/tween.js/16.6.0")
    , e = c("datav:/npm/chroma-js/1.3.4")
    , f = c("datav:/com/@double11-2017/map3d-earth/0.1.14/utils/common.js")
    , g = c("datav:/com/@double11-2017/map3d-earth/0.1.14/utils/projection.js")
    , h = c("datav:/npm/safely-merge/1.0.1");
  return a.exports = Object.assign({
      TWEEN: d,
      Chroma: e,
      mergeOptions: h
  }, g, f),
  a.exports
});
;