const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/SMAAShader.js",["datav:/npm/three/0.97.0"],function(a,b,c){var d=require("three");return d.SMAAShader=[{defines:{SMAA_THRESHOLD:"0.11"},uniforms:{tDiffuse:{value:null},resolution:{value:new d.Vector2(1/1024,1/512)}},vertexShader:"uniform vec2 resolution;\nvarying vec2 vUv;\nvarying vec4 vOffset[ 3 ];\nvoid SMAAEdgeDetectionVS( vec2 texcoord ) {\nvOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0,  1.0 );\nvOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4(  1.0, 0.0, 0.0, -1.0 );\nvOffset[ 2 ] = texcoord.xyxy + resolution.xyxy * vec4( -2.0, 0.0, 0.0,  2.0 );\n}\nvoid main() {\nvUv = uv;\nSMAAEdgeDetectionVS( vUv );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform sampler2D tDiffuse;\nvarying vec2 vUv;\nvarying vec4 vOffset[ 3 ];\nvec4 SMAAColorEdgeDetectionPS( vec2 texcoord, vec4 offset[3], sampler2D colorTex ) {\nvec2 threshold = vec2( SMAA_THRESHOLD, SMAA_THRESHOLD );\nvec4 delta;\nvec3 C = texture2D( colorTex, texcoord ).rgb;\nvec3 Cleft = texture2D( colorTex, offset[0].xy ).rgb;\nvec3 t = abs( C - Cleft );\ndelta.x = max( max( t.r, t.g ), t.b );\nvec3 Ctop = texture2D( colorTex, offset[0].zw ).rgb;\nt = abs( C - Ctop );\ndelta.y = max( max( t.r, t.g ), t.b );\nvec2 edges = step( threshold, delta.xy );\nif ( dot( edges, vec2( 1.0, 1.0 ) ) == 0.0 )\ndiscard;\nvec3 Cright = texture2D( colorTex, offset[1].xy ).rgb;\nt = abs( C - Cright );\ndelta.z = max( max( t.r, t.g ), t.b );\nvec3 Cbottom  = texture2D( colorTex, offset[1].zw ).rgb;\nt = abs( C - Cbottom );\ndelta.w = max( max( t.r, t.g ), t.b );\nfloat maxDelta = max( max( max( delta.x, delta.y ), delta.z ), delta.w );\nvec3 Cleftleft  = texture2D( colorTex, offset[2].xy ).rgb;\nt = abs( C - Cleftleft );\ndelta.z = max( max( t.r, t.g ), t.b );\nvec3 Ctoptop = texture2D( colorTex, offset[2].zw ).rgb;\nt = abs( C - Ctoptop );\ndelta.w = max( max( t.r, t.g ), t.b );\nmaxDelta = max( max( maxDelta, delta.z ), delta.w );\nedges.xy *= step( 0.5 * maxDelta, delta.xy );\nreturn vec4( edges, 0.0, 0.0 );\n}\nvoid main() {\ngl_FragColor = SMAAColorEdgeDetectionPS( vUv, vOffset, tDiffuse );\n}"},{defines:{SMAA_MAX_SEARCH_STEPS:"8",SMAA_AREATEX_MAX_DISTANCE:"16",SMAA_AREATEX_PIXEL_SIZE:"( 1.0 / vec2( 160.0, 560.0 ) )",SMAA_AREATEX_SUBTEX_SIZE:"( 1.0 / 7.0 )"},uniforms:{tDiffuse:{value:null},tArea:{value:null},tSearch:{value:null},resolution:{value:new d.Vector2(1/1024,1/512)}},vertexShader:"uniform vec2 resolution;\nvarying vec2 vUv;\nvarying vec4 vOffset[ 3 ];\nvarying vec2 vPixcoord;\nvoid SMAABlendingWeightCalculationVS( vec2 texcoord ) {\nvPixcoord = texcoord / resolution;\nvOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.25, 0.125, 1.25, 0.125 );\nvOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.125, 0.25, -0.125, -1.25 );\nvOffset[ 2 ] = vec4( vOffset[ 0 ].xz, vOffset[ 1 ].yw ) + vec4( -2.0, 2.0, -2.0, 2.0 ) * resolution.xxyy * float( SMAA_MAX_SEARCH_STEPS );\n}\nvoid main() {\nvUv = uv;\nSMAABlendingWeightCalculationVS( vUv );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"#define SMAASampleLevelZeroOffset( tex, coord, offset ) texture2D( tex, coord + float( offset ) * resolution, 0.0 )\nuniform sampler2D tDiffuse;\nuniform sampler2D tArea;\nuniform sampler2D tSearch;\nuniform vec2 resolution;\nvarying vec2 vUv;\nvarying vec4 vOffset[3];\nvarying vec2 vPixcoord;\nvec2 round( vec2 x ) {\nreturn sign( x ) * floor( abs( x ) + 0.5 );\n}\nfloat SMAASearchLength( sampler2D searchTex, vec2 e, float bias, float scale ) {\ne.r = bias + e.r * scale;\nreturn 255.0 * texture2D( searchTex, e, 0.0 ).r;\n}\nfloat SMAASearchXLeft( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {\nvec2 e = vec2( 0.0, 1.0 );\nfor ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) {\ne = texture2D( edgesTex, texcoord, 0.0 ).rg;\ntexcoord -= vec2( 2.0, 0.0 ) * resolution;\nif ( ! ( texcoord.x > end && e.g > 0.8281 && e.r == 0.0 ) ) break;\n}\ntexcoord.x += 0.25 * resolution.x;\ntexcoord.x += resolution.x;\ntexcoord.x += 2.0 * resolution.x;\ntexcoord.x -= resolution.x * SMAASearchLength(searchTex, e, 0.0, 0.5);\nreturn texcoord.x;\n}\nfloat SMAASearchXRight( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {\nvec2 e = vec2( 0.0, 1.0 );\nfor ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) {\ne = texture2D( edgesTex, texcoord, 0.0 ).rg;\ntexcoord += vec2( 2.0, 0.0 ) * resolution;\nif ( ! ( texcoord.x < end && e.g > 0.8281 && e.r == 0.0 ) ) break;\n}\ntexcoord.x -= 0.25 * resolution.x;\ntexcoord.x -= resolution.x;\ntexcoord.x -= 2.0 * resolution.x;\ntexcoord.x += resolution.x * SMAASearchLength( searchTex, e, 0.5, 0.5 );\nreturn texcoord.x;\n}\nfloat SMAASearchYUp( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {\nvec2 e = vec2( 1.0, 0.0 );\nfor ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) {\ne = texture2D( edgesTex, texcoord, 0.0 ).rg;\ntexcoord += vec2( 0.0, 2.0 ) * resolution;\nif ( ! ( texcoord.y > end && e.r > 0.8281 && e.g == 0.0 ) ) break;\n}\ntexcoord.y -= 0.25 * resolution.y;\ntexcoord.y -= resolution.y;\ntexcoord.y -= 2.0 * resolution.y;\ntexcoord.y += resolution.y * SMAASearchLength( searchTex, e.gr, 0.0, 0.5 );\nreturn texcoord.y;\n}\nfloat SMAASearchYDown( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {\nvec2 e = vec2( 1.0, 0.0 );\nfor ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) {\ne = texture2D( edgesTex, texcoord, 0.0 ).rg;\ntexcoord -= vec2( 0.0, 2.0 ) * resolution;\nif ( ! ( texcoord.y < end && e.r > 0.8281 && e.g == 0.0 ) ) break;\n}\ntexcoord.y += 0.25 * resolution.y;\ntexcoord.y += resolution.y;\ntexcoord.y += 2.0 * resolution.y;\ntexcoord.y -= resolution.y * SMAASearchLength( searchTex, e.gr, 0.5, 0.5 );\nreturn texcoord.y;\n}\nvec2 SMAAArea( sampler2D areaTex, vec2 dist, float e1, float e2, float offset ) {\nvec2 texcoord = float( SMAA_AREATEX_MAX_DISTANCE ) * round( 4.0 * vec2( e1, e2 ) ) + dist;\ntexcoord = SMAA_AREATEX_PIXEL_SIZE * texcoord + ( 0.5 * SMAA_AREATEX_PIXEL_SIZE );\ntexcoord.y += SMAA_AREATEX_SUBTEX_SIZE * offset;\nreturn texture2D( areaTex, texcoord, 0.0 ).rg;\n}\nvec4 SMAABlendingWeightCalculationPS( vec2 texcoord, vec2 pixcoord, vec4 offset[ 3 ], sampler2D edgesTex, sampler2D areaTex, sampler2D searchTex, ivec4 subsampleIndices ) {\nvec4 weights = vec4( 0.0, 0.0, 0.0, 0.0 );\nvec2 e = texture2D( edgesTex, texcoord ).rg;\nif ( e.g > 0.0 ) {\nvec2 d;\nvec2 coords;\ncoords.x = SMAASearchXLeft( edgesTex, searchTex, offset[ 0 ].xy, offset[ 2 ].x );\ncoords.y = offset[ 1 ].y;\nd.x = coords.x;\nfloat e1 = texture2D( edgesTex, coords, 0.0 ).r;\ncoords.x = SMAASearchXRight( edgesTex, searchTex, offset[ 0 ].zw, offset[ 2 ].y );\nd.y = coords.x;\nd = d / resolution.x - pixcoord.x;\nvec2 sqrt_d = sqrt( abs( d ) );\ncoords.y -= 1.0 * resolution.y;\nfloat e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 1, 0 ) ).r;\nweights.rg = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.y ) );\n}\nif ( e.r > 0.0 ) {\nvec2 d;\nvec2 coords;\ncoords.y = SMAASearchYUp( edgesTex, searchTex, offset[ 1 ].xy, offset[ 2 ].z );\ncoords.x = offset[ 0 ].x;\nd.x = coords.y;\nfloat e1 = texture2D( edgesTex, coords, 0.0 ).g;\ncoords.y = SMAASearchYDown( edgesTex, searchTex, offset[ 1 ].zw, offset[ 2 ].w );\nd.y = coords.y;\nd = d / resolution.y - pixcoord.y;\nvec2 sqrt_d = sqrt( abs( d ) );\ncoords.y -= 1.0 * resolution.y;\nfloat e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 0, 1 ) ).g;\nweights.ba = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.x ) );\n}\nreturn weights;\n}\nvoid main() {\ngl_FragColor = SMAABlendingWeightCalculationPS( vUv, vPixcoord, vOffset, tDiffuse, tArea, tSearch, ivec4( 0.0 ) );\n}"},{uniforms:{tDiffuse:{value:null},tColor:{value:null},resolution:{value:new d.Vector2(1/1024,1/512)}},vertexShader:"uniform vec2 resolution;\nvarying vec2 vUv;\nvarying vec4 vOffset[ 2 ];\nvoid SMAANeighborhoodBlendingVS( vec2 texcoord ) {\nvOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0, 1.0 );\nvOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( 1.0, 0.0, 0.0, -1.0 );\n}\nvoid main() {\nvUv = uv;\nSMAANeighborhoodBlendingVS( vUv );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform sampler2D tDiffuse;\nuniform sampler2D tColor;\nuniform vec2 resolution;\nvarying vec2 vUv;\nvarying vec4 vOffset[ 2 ];\nvec4 SMAANeighborhoodBlendingPS( vec2 texcoord, vec4 offset[ 2 ], sampler2D colorTex, sampler2D blendTex ) {\nvec4 a;\na.xz = texture2D( blendTex, texcoord ).xz;\na.y = texture2D( blendTex, offset[ 1 ].zw ).g;\na.w = texture2D( blendTex, offset[ 1 ].xy ).a;\nif ( dot(a, vec4( 1.0, 1.0, 1.0, 1.0 )) < 1e-5 ) {\nreturn texture2D( colorTex, texcoord, 0.0 );\n} else {\nvec2 offset;\noffset.x = a.a > a.b ? a.a : -a.b;\noffset.y = a.g > a.r ? -a.g : a.r;\nif ( abs( offset.x ) > abs( offset.y )) {\noffset.y = 0.0;\n} else {\noffset.x = 0.0;\n}\nvec4 C = texture2D( colorTex, texcoord, 0.0 );\ntexcoord += sign( offset ) * resolution;\nvec4 Cop = texture2D( colorTex, texcoord, 0.0 );\nfloat s = abs( offset.x ) > abs( offset.y ) ? abs( offset.x ) : abs( offset.y );\nC.xyz = pow(C.xyz, vec3(2.2));\nCop.xyz = pow(Cop.xyz, vec3(2.2));\nvec4 mixed = mix(C, Cop, s);\nmixed.xyz = pow(mixed.xyz, vec3(1.0 / 2.2));\nreturn mixed;\n}\n}\nvoid main() {\ngl_FragColor = SMAANeighborhoodBlendingPS( vUv, vOffset, tColor, tDiffuse );\n}"}],a.exports=d.SMAAShader,a.exports});;