const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/map3d-earth-scanner/0.0.12/shader/frag.glsl",[],function(a){return a.exports="#define GLSLIFY 1\nvarying vec2 vUv;\nuniform vec3 uColor;\nuniform float uOpacity;\nuniform sampler2D uTexture;\nuniform float uTimeCounter;\n\nfloat calculateOpacity(float uTimeCounter, vec2 vUv) {\n  float opacity = 0.0;\n  float visibleGap = 0.2;\n\n  if ((vUv.y > uTimeCounter) && (vUv.y < (uTimeCounter + visibleGap))) {\n    opacity = pow((vUv.y - uTimeCounter) / visibleGap, 4.0);\n  }\n\n  return opacity;\n}\n\nvoid main() {\n  float opacity = calculateOpacity(uTimeCounter, vUv);\n  gl_FragColor = vec4(uColor, opacity * uOpacity) * texture2D(uTexture, vUv);\n}",a.exports});;
