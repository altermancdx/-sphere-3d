const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/FXAAShader",["datav:/npm/three/0.97.0"],function(a,b,c){var d=require("three");return d.FXAAShader={uniforms:{tDiffuse:{value:null},resolution:{value:new d.Vector2(1/1024,1/512)}},vertexShader:"void main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform sampler2D tDiffuse;\nuniform vec2 resolution;\n#define FXAA_REDUCE_MIN   (1.0/128.0)\n#define FXAA_REDUCE_MUL   (1.0/8.0)\n#define FXAA_SPAN_MAX     8.0\nvoid main() {\nvec3 rgbNW = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( -1.0, -1.0 ) ) * resolution ).xyz;\nvec3 rgbNE = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( 1.0, -1.0 ) ) * resolution ).xyz;\nvec3 rgbSW = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( -1.0, 1.0 ) ) * resolution ).xyz;\nvec3 rgbSE = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( 1.0, 1.0 ) ) * resolution ).xyz;\nvec4 rgbaM  = texture2D( tDiffuse,  gl_FragCoord.xy  * resolution );\nvec3 rgbM  = rgbaM.xyz;\nvec3 luma = vec3( 0.299, 0.587, 0.114 );\nfloat lumaNW = dot( rgbNW, luma );\nfloat lumaNE = dot( rgbNE, luma );\nfloat lumaSW = dot( rgbSW, luma );\nfloat lumaSE = dot( rgbSE, luma );\nfloat lumaM  = dot( rgbM,  luma );\nfloat lumaMin = min( lumaM, min( min( lumaNW, lumaNE ), min( lumaSW, lumaSE ) ) );\nfloat lumaMax = max( lumaM, max( max( lumaNW, lumaNE) , max( lumaSW, lumaSE ) ) );\nvec2 dir;\ndir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\ndir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\nfloat dirReduce = max( ( lumaNW + lumaNE + lumaSW + lumaSE ) * ( 0.25 * FXAA_REDUCE_MUL ), FXAA_REDUCE_MIN );\nfloat rcpDirMin = 1.0 / ( min( abs( dir.x ), abs( dir.y ) ) + dirReduce );\ndir = min( vec2( FXAA_SPAN_MAX,  FXAA_SPAN_MAX),\nmax( vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\ndir * rcpDirMin)) * resolution;\nvec4 rgbA = (1.0/2.0) * (\ntexture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (1.0/3.0 - 0.5)) +\ntexture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (2.0/3.0 - 0.5)));\nvec4 rgbB = rgbA * (1.0/2.0) + (1.0/4.0) * (\ntexture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (0.0/3.0 - 0.5)) +\ntexture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (3.0/3.0 - 0.5)));\nfloat lumaB = dot(rgbB, vec4(luma, 0.0));\nif ( ( lumaB < lumaMin ) || ( lumaB > lumaMax ) ) {\ngl_FragColor = rgbA;\n} else {\ngl_FragColor = rgbB;\n}\n}"},a.exports=d.FXAAShader,a.exports});;
