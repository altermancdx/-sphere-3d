Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/utils/common.js", [], function(a) {
  return a.exports = {
      easyDiff: function(c, a) {
          return c === a
      },
      easyObjDiff: function(a, b) {
          return Object.keys(b).every(function(c) {
              return a.hasOwnProperty(c) && a[c] === b[c]
          })
      },
      deepClone: function(a) {
          return JSON.parse(JSON.stringify(a))
      },
      isValuable: function(a) {
          return null !== a && void 0 !== a
      }
  },
  a.exports
});
;
