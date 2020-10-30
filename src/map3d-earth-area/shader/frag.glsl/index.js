const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/map3d-earth-area/0.0.16/shader/frag.glsl",[],function(a){return a.exports="#define GLSLIFY 1\n varying vec4 vColor;\n\nvoid main() {\n  gl_FragColor = vColor;\n}",a.exports});;
