const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/CopyShader",["datav:/npm/three/0.97.0"],function(a,b,c){var d=require("three");return d.CopyShader={uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:"varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform float opacity;\nuniform sampler2D tDiffuse;\nvarying vec2 vUv;\nvoid main() {\nvec4 texel = texture2D( tDiffuse, vUv );\ngl_FragColor = opacity * texel;\n}"},a.exports=d.CopyShader,a.exports});;