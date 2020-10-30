const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/map3d-earth-thunder/0.0.19/shader/frag.glsl",[],function(a){return a.exports="\n#ifdef GL_ES\n  precision highp float;\n#define GLSLIFY 1\n#endif\n\nuniform vec3 uColor;\nuniform float uTimeCounter;\nuniform float uTrailLength;\nuniform float uOpacityFactor;\nuniform sampler2D tDiffuse;\nvarying vec2 vUv;\n\nfloat calculateTimeContrlOpacity(float timeCounter, vec2 vUv){\n  float uvGap = uTrailLength;\n  float uvTail = timeCounter - uvGap;\n\n  if((vUv.x < timeCounter) && (vUv.x > uvTail)) {\n    float opacity = (1.0 - (timeCounter - vUv.x) / uvGap);\n    opacity *= opacity;\n    opacity /= 1.3;\n\n    return opacity;\n  } else {\n    return 0.0;\n  }\n}\n\nvoid main() {\n  float currentOpacity = calculateTimeContrlOpacity(uTimeCounter, vUv);\n  gl_FragColor = vec4(uColor, currentOpacity * uOpacityFactor);  \n}",a.exports});;