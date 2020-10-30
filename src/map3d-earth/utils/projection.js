const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/utils/projection.js",[],function(a){var b=3.141592653589793;return a.exports={ll2sphere:function(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:200,d=(90-b)*(Math.PI/180),e=(0<=a?a:360+a)*(Math.PI/180),f=c*Math.sin(d)*Math.sin(e),g=c*Math.cos(d),h=c*Math.sin(d)*Math.cos(e);return{x:f,y:g,z:h}},ll2plane:function(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:200,d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:2;return{x:a*d,y:b*d,z:c}},sphere2ll:function(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:200,e=Math.acos(b/d),f=90-180*e/Math.PI;if(0===Math.sin(e))return{lat:90,lng:0};var g=Math.atan2(a,c),h=180*g/Math.PI,i=180<h?h-360:h;return{lat:f,lng:i}},plane2ll:function(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:2;return{lat:b/d,lng:a/d,z:c}}},a.exports});;