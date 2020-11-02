const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/map3d-earth-atmosphere/0.0.8/shader/frag.glsl",[],function(a){return a.exports="#define GLSLIFY 1\nvarying vec3 vNormal;\nuniform vec3 uColor;\nuniform float intensity;\nuniform float maxOpacity;\n\nvoid main() {\n  float k = pow(0.51 - dot( vNormal, vec3(0, 0, 1.0)), intensity);\n  gl_FragColor = vec4(uColor * k * k, maxOpacity * 0.5) * k;\n}",a.exports});;
