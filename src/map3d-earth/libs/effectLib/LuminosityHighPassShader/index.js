const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/LuminosityHighPassShader",["datav:/npm/three/0.97.0"],function(a,b,c){var d=require("three");return d.LuminosityHighPassShader={shaderID:"luminosityHighPass",uniforms:{tDiffuse:{type:"t",value:null},luminosityThreshold:{type:"f",value:1},smoothWidth:{type:"f",value:1},defaultColor:{type:"c",value:new d.Color(0)},defaultOpacity:{type:"f",value:0}},vertexShader:"varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform sampler2D tDiffuse;\nuniform vec3 defaultColor;\nuniform float defaultOpacity;\nuniform float luminosityThreshold;\nuniform float smoothWidth;\nvarying vec2 vUv;\nvoid main() {\nvec4 texel = texture2D( tDiffuse, vUv );\nvec3 luma = vec3( 0.299, 0.587, 0.114 );\nfloat v = dot( texel.xyz, luma );\nvec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );\nfloat alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );\ngl_FragColor = mix( outputColor, texel, alpha );\n}"},a.exports=d.LuminosityHighPassShader,a.exports});;