const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/map3d-earth-bar-3d/0.1.9/shader/frag.glsl",[],function(a){return a.exports="#define GLSLIFY 1\nuniform float uOpacity;\nvarying vec3 vColor;\n\nvoid main() {\n  gl_FragColor = vec4(vColor, uOpacity);\n}",a.exports});;
