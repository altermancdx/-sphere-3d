Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/SMAAShader.js", ["datav:/npm/three/0.97.0"], function(a, b, c) {
  var d = c("datav:/npm/three/0.97.0");
  return d.SMAAShader = [{
      defines: {
          SMAA_THRESHOLD: "0.11"
      },
      uniforms: {
          tDiffuse: {
              value: null
          },
          resolution: {
              value: new d.Vector2(1 / 1024,1 / 512)
          }
      },
      vertexShader: "uniform vec2 resolution;\nvarying vec2 vUv;\nvarying vec4 vOffset[ 3 ];\nvoid SMAAEdgeDetectionVS( vec2 texcoord ) {\nvOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0,  1.0 );\nvOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4(  1.0, 0.0, 0.0, -1.0 );\nvOffset[ 2 ] = texcoord.xyxy + resolution.xyxy * vec4( -2.0, 0.0, 0.0,  2.0 );\n}\nvoid main() {\nvUv = uv;\nSMAAEdgeDetectionVS( vUv );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
      fragmentShader: "uniform sampler2D tDiffuse;\nvarying vec2 vUv;\nvarying vec4 vOffset[ 3 ];\nvec4 SMAAColorEdgeDetectionPS( vec2 texcoord, vec4 offset[3], sampler2D colorTex ) {\nvec2 threshold = vec2( SMAA_THRESHOLD, SMAA_THRESHOLD );\nvec4 delta;\nvec3 C = texture2D( colorTex, texcoord ).rgb;\nvec3 Cleft = texture2D( colorTex, offset[0].xy ).rgb;\nvec3 t = abs( C - Cleft );\ndelta.x = max( max( t.r, t.g ), t.b );\nvec3 Ctop = texture2D( colorTex, offset[0].zw ).rgb;\nt = abs( C - Ctop );\ndelta.y = max( max( t.r, t.g ), t.b );\nvec2 edges = step( threshold, delta.xy );\nif ( dot( edges, vec2( 1.0, 1.0 ) ) == 0.0 )\ndiscard;\nvec3 Cright = texture2D( colorTex, offset[1].xy ).rgb;\nt = abs( C - Cright );\ndelta.z = max( max( t.r, t.g ), t.b );\nvec3 Cbottom  = texture2D( colorTex, offset[1].zw ).rgb;\nt = abs( C - Cbottom );\ndelta.w = max( max( t.r, t.g ), t.b );\nfloat maxDelta = max( max( max( delta.x, delta.y ), delta.z ), delta.w );\nvec3 Cleftleft  = texture2D( colorTex, offset[2].xy ).rgb;\nt = abs( C - Cleftleft );\ndelta.z = max( max( t.r, t.g ), t.b );\nvec3 Ctoptop = texture2D( colorTex, offset[2].zw ).rgb;\nt = abs( C - Ctoptop );\ndelta.w = max( max( t.r, t.g ), t.b );\nmaxDelta = max( max( maxDelta, delta.z ), delta.w );\nedges.xy *= step( 0.5 * maxDelta, delta.xy );\nreturn vec4( edges, 0.0, 0.0 );\n}\nvoid main() {\ngl_FragColor = SMAAColorEdgeDetectionPS( vUv, vOffset, tDiffuse );\n}"
  }, {
      defines: {
          SMAA_MAX_SEARCH_STEPS: "8",
          SMAA_AREATEX_MAX_DISTANCE: "16",
          SMAA_AREATEX_PIXEL_SIZE: "( 1.0 / vec2( 160.0, 560.0 ) )",
          SMAA_AREATEX_SUBTEX_SIZE: "( 1.0 / 7.0 )"
      },
      uniforms: {
          tDiffuse: {
              value: null
          },
          tArea: {
              value: null
          },
          tSearch: {
              value: null
          },
          resolution: {
              value: new d.Vector2(1 / 1024,1 / 512)
          }
      },
      vertexShader: "uniform vec2 resolution;\nvarying vec2 vUv;\nvarying vec4 vOffset[ 3 ];\nvarying vec2 vPixcoord;\nvoid SMAABlendingWeightCalculationVS( vec2 texcoord ) {\nvPixcoord = texcoord / resolution;\nvOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.25, 0.125, 1.25, 0.125 );\nvOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.125, 0.25, -0.125, -1.25 );\nvOffset[ 2 ] = vec4( vOffset[ 0 ].xz, vOffset[ 1 ].yw ) + vec4( -2.0, 2.0, -2.0, 2.0 ) * resolution.xxyy * float( SMAA_MAX_SEARCH_STEPS );\n}\nvoid main() {\nvUv = uv;\nSMAABlendingWeightCalculationVS( vUv );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
      fragmentShader: "#define SMAASampleLevelZeroOffset( tex, coord, offset ) texture2D( tex, coord + float( offset ) * resolution, 0.0 )\nuniform sampler2D tDiffuse;\nuniform sampler2D tArea;\nuniform sampler2D tSearch;\nuniform vec2 resolution;\nvarying vec2 vUv;\nvarying vec4 vOffset[3];\nvarying vec2 vPixcoord;\nvec2 round( vec2 x ) {\nreturn sign( x ) * floor( abs( x ) + 0.5 );\n}\nfloat SMAASearchLength( sampler2D searchTex, vec2 e, float bias, float scale ) {\ne.r = bias + e.r * scale;\nreturn 255.0 * texture2D( searchTex, e, 0.0 ).r;\n}\nfloat SMAASearchXLeft( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {\nvec2 e = vec2( 0.0, 1.0 );\nfor ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) {\ne = texture2D( edgesTex, texcoord, 0.0 ).rg;\ntexcoord -= vec2( 2.0, 0.0 ) * resolution;\nif ( ! ( texcoord.x > end && e.g > 0.8281 && e.r == 0.0 ) ) break;\n}\ntexcoord.x += 0.25 * resolution.x;\ntexcoord.x += resolution.x;\ntexcoord.x += 2.0 * resolution.x;\ntexcoord.x -= resolution.x * SMAASearchLength(searchTex, e, 0.0, 0.5);\nreturn texcoord.x;\n}\nfloat SMAASearchXRight( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {\nvec2 e = vec2( 0.0, 1.0 );\nfor ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) {\ne = texture2D( edgesTex, texcoord, 0.0 ).rg;\ntexcoord += vec2( 2.0, 0.0 ) * resolution;\nif ( ! ( texcoord.x < end && e.g > 0.8281 && e.r == 0.0 ) ) break;\n}\ntexcoord.x -= 0.25 * resolution.x;\ntexcoord.x -= resolution.x;\ntexcoord.x -= 2.0 * resolution.x;\ntexcoord.x += resolution.x * SMAASearchLength( searchTex, e, 0.5, 0.5 );\nreturn texcoord.x;\n}\nfloat SMAASearchYUp( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {\nvec2 e = vec2( 1.0, 0.0 );\nfor ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) {\ne = texture2D( edgesTex, texcoord, 0.0 ).rg;\ntexcoord += vec2( 0.0, 2.0 ) * resolution;\nif ( ! ( texcoord.y > end && e.r > 0.8281 && e.g == 0.0 ) ) break;\n}\ntexcoord.y -= 0.25 * resolution.y;\ntexcoord.y -= resolution.y;\ntexcoord.y -= 2.0 * resolution.y;\ntexcoord.y += resolution.y * SMAASearchLength( searchTex, e.gr, 0.0, 0.5 );\nreturn texcoord.y;\n}\nfloat SMAASearchYDown( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {\nvec2 e = vec2( 1.0, 0.0 );\nfor ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) {\ne = texture2D( edgesTex, texcoord, 0.0 ).rg;\ntexcoord -= vec2( 0.0, 2.0 ) * resolution;\nif ( ! ( texcoord.y < end && e.r > 0.8281 && e.g == 0.0 ) ) break;\n}\ntexcoord.y += 0.25 * resolution.y;\ntexcoord.y += resolution.y;\ntexcoord.y += 2.0 * resolution.y;\ntexcoord.y -= resolution.y * SMAASearchLength( searchTex, e.gr, 0.5, 0.5 );\nreturn texcoord.y;\n}\nvec2 SMAAArea( sampler2D areaTex, vec2 dist, float e1, float e2, float offset ) {\nvec2 texcoord = float( SMAA_AREATEX_MAX_DISTANCE ) * round( 4.0 * vec2( e1, e2 ) ) + dist;\ntexcoord = SMAA_AREATEX_PIXEL_SIZE * texcoord + ( 0.5 * SMAA_AREATEX_PIXEL_SIZE );\ntexcoord.y += SMAA_AREATEX_SUBTEX_SIZE * offset;\nreturn texture2D( areaTex, texcoord, 0.0 ).rg;\n}\nvec4 SMAABlendingWeightCalculationPS( vec2 texcoord, vec2 pixcoord, vec4 offset[ 3 ], sampler2D edgesTex, sampler2D areaTex, sampler2D searchTex, ivec4 subsampleIndices ) {\nvec4 weights = vec4( 0.0, 0.0, 0.0, 0.0 );\nvec2 e = texture2D( edgesTex, texcoord ).rg;\nif ( e.g > 0.0 ) {\nvec2 d;\nvec2 coords;\ncoords.x = SMAASearchXLeft( edgesTex, searchTex, offset[ 0 ].xy, offset[ 2 ].x );\ncoords.y = offset[ 1 ].y;\nd.x = coords.x;\nfloat e1 = texture2D( edgesTex, coords, 0.0 ).r;\ncoords.x = SMAASearchXRight( edgesTex, searchTex, offset[ 0 ].zw, offset[ 2 ].y );\nd.y = coords.x;\nd = d / resolution.x - pixcoord.x;\nvec2 sqrt_d = sqrt( abs( d ) );\ncoords.y -= 1.0 * resolution.y;\nfloat e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 1, 0 ) ).r;\nweights.rg = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.y ) );\n}\nif ( e.r > 0.0 ) {\nvec2 d;\nvec2 coords;\ncoords.y = SMAASearchYUp( edgesTex, searchTex, offset[ 1 ].xy, offset[ 2 ].z );\ncoords.x = offset[ 0 ].x;\nd.x = coords.y;\nfloat e1 = texture2D( edgesTex, coords, 0.0 ).g;\ncoords.y = SMAASearchYDown( edgesTex, searchTex, offset[ 1 ].zw, offset[ 2 ].w );\nd.y = coords.y;\nd = d / resolution.y - pixcoord.y;\nvec2 sqrt_d = sqrt( abs( d ) );\ncoords.y -= 1.0 * resolution.y;\nfloat e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 0, 1 ) ).g;\nweights.ba = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.x ) );\n}\nreturn weights;\n}\nvoid main() {\ngl_FragColor = SMAABlendingWeightCalculationPS( vUv, vPixcoord, vOffset, tDiffuse, tArea, tSearch, ivec4( 0.0 ) );\n}"
  }, {
      uniforms: {
          tDiffuse: {
              value: null
          },
          tColor: {
              value: null
          },
          resolution: {
              value: new d.Vector2(1 / 1024,1 / 512)
          }
      },
      vertexShader: "uniform vec2 resolution;\nvarying vec2 vUv;\nvarying vec4 vOffset[ 2 ];\nvoid SMAANeighborhoodBlendingVS( vec2 texcoord ) {\nvOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0, 1.0 );\nvOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( 1.0, 0.0, 0.0, -1.0 );\n}\nvoid main() {\nvUv = uv;\nSMAANeighborhoodBlendingVS( vUv );\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
      fragmentShader: "uniform sampler2D tDiffuse;\nuniform sampler2D tColor;\nuniform vec2 resolution;\nvarying vec2 vUv;\nvarying vec4 vOffset[ 2 ];\nvec4 SMAANeighborhoodBlendingPS( vec2 texcoord, vec4 offset[ 2 ], sampler2D colorTex, sampler2D blendTex ) {\nvec4 a;\na.xz = texture2D( blendTex, texcoord ).xz;\na.y = texture2D( blendTex, offset[ 1 ].zw ).g;\na.w = texture2D( blendTex, offset[ 1 ].xy ).a;\nif ( dot(a, vec4( 1.0, 1.0, 1.0, 1.0 )) < 1e-5 ) {\nreturn texture2D( colorTex, texcoord, 0.0 );\n} else {\nvec2 offset;\noffset.x = a.a > a.b ? a.a : -a.b;\noffset.y = a.g > a.r ? -a.g : a.r;\nif ( abs( offset.x ) > abs( offset.y )) {\noffset.y = 0.0;\n} else {\noffset.x = 0.0;\n}\nvec4 C = texture2D( colorTex, texcoord, 0.0 );\ntexcoord += sign( offset ) * resolution;\nvec4 Cop = texture2D( colorTex, texcoord, 0.0 );\nfloat s = abs( offset.x ) > abs( offset.y ) ? abs( offset.x ) : abs( offset.y );\nC.xyz = pow(C.xyz, vec3(2.2));\nCop.xyz = pow(Cop.xyz, vec3(2.2));\nvec4 mixed = mix(C, Cop, s);\nmixed.xyz = pow(mixed.xyz, vec3(1.0 / 2.2));\nreturn mixed;\n}\n}\nvoid main() {\ngl_FragColor = SMAANeighborhoodBlendingPS( vUv, vOffset, tColor, tDiffuse );\n}"
  }],
  a.exports = d.SMAAShader,
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/SSAOShader", ["datav:/npm/three/0.97.0"], function(a, b, c) {
  var d = c("datav:/npm/three/0.97.0");
  return d.SSAOShader = {
      uniforms: {
          tDiffuse: {
              value: null
          },
          tDepth: {
              value: null
          },
          size: {
              value: new d.Vector2(512,512)
          },
          cameraNear: {
              value: 1
          },
          cameraFar: {
              value: 100
          },
          onlyAO: {
              value: 0
          },
          aoClamp: {
              value: 0.5
          },
          lumInfluence: {
              value: 0.5
          }
      },
      vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
      fragmentShader: "uniform float cameraNear;\nuniform float cameraFar;\n#ifdef USE_LOGDEPTHBUF\nuniform float logDepthBufFC;\n#endif\nuniform bool onlyAO;\nuniform vec2 size;\nuniform float aoClamp;\nuniform float lumInfluence;\nuniform sampler2D tDiffuse;\nuniform sampler2D tDepth;\nvarying vec2 vUv;\n#define DL 2.399963229728653\n#define EULER 2.718281828459045\nconst int samples = 8;\nconst float radius = 5.0;\nconst bool useNoise = false;\nconst float noiseAmount = 0.0003;\nconst float diffArea = 0.4;\nconst float gDisplace = 0.4;\n#include <packing>\nvec2 rand( const vec2 coord ) {\nvec2 noise;\nif ( useNoise ) {\nfloat nx = dot ( coord, vec2( 12.9898, 78.233 ) );\nfloat ny = dot ( coord, vec2( 12.9898, 78.233 ) * 2.0 );\nnoise = clamp( fract ( 43758.5453 * sin( vec2( nx, ny ) ) ), 0.0, 1.0 );\n} else {\nfloat ff = fract( 1.0 - coord.s * ( size.x / 2.0 ) );\nfloat gg = fract( coord.t * ( size.y / 2.0 ) );\nnoise = vec2( 0.25, 0.75 ) * vec2( ff ) + vec2( 0.75, 0.25 ) * gg;\n}\nreturn ( noise * 2.0  - 1.0 ) * noiseAmount;\n}\nfloat readDepth( const in vec2 coord ) {\nfloat cameraFarPlusNear = cameraFar + cameraNear;\nfloat cameraFarMinusNear = cameraFar - cameraNear;\nfloat cameraCoef = 2.0 * cameraNear;\n#ifdef USE_LOGDEPTHBUF\nfloat logz = unpackRGBAToDepth( texture2D( tDepth, coord ) );\nfloat w = pow(2.0, (logz / logDepthBufFC)) - 1.0;\nfloat z = (logz / w) + 1.0;\n#else\nfloat z = unpackRGBAToDepth( texture2D( tDepth, coord ) );\n#endif\nreturn cameraCoef / ( cameraFarPlusNear - z * cameraFarMinusNear );\n}\nfloat compareDepths( const in float depth1, const in float depth2, inout int far ) {\nfloat garea = 2.0;\nfloat diff = ( depth1 - depth2 ) * 100.0;\nif ( diff < gDisplace ) {\ngarea = diffArea;\n} else {\nfar = 1;\n}\nfloat dd = diff - gDisplace;\nfloat gauss = pow( EULER, -2.0 * dd * dd / ( garea * garea ) );\nreturn gauss;\n}\nfloat calcAO( float depth, float dw, float dh ) {\nfloat dd = radius - depth * radius;\nvec2 vv = vec2( dw, dh );\nvec2 coord1 = vUv + dd * vv;\nvec2 coord2 = vUv - dd * vv;\nfloat temp1 = 0.0;\nfloat temp2 = 0.0;\nint far = 0;\ntemp1 = compareDepths( depth, readDepth( coord1 ), far );\nif ( far > 0 ) {\ntemp2 = compareDepths( readDepth( coord2 ), depth, far );\ntemp1 += ( 1.0 - temp1 ) * temp2;\n}\nreturn temp1;\n}\nvoid main() {\nvec2 noise = rand( vUv );\nfloat depth = readDepth( vUv );\nfloat tt = clamp( depth, aoClamp, 1.0 );\nfloat w = ( 1.0 / size.x )  / tt + ( noise.x * ( 1.0 - noise.x ) );\nfloat h = ( 1.0 / size.y ) / tt + ( noise.y * ( 1.0 - noise.y ) );\nfloat ao = 0.0;\nfloat dz = 1.0 / float( samples );\nfloat z = 1.0 - dz / 2.0;\nfloat l = 0.0;\nfor ( int i = 0; i <= samples; i ++ ) {\nfloat r = sqrt( 1.0 - z );\nfloat pw = cos( l ) * r;\nfloat ph = sin( l ) * r;\nao += calcAO( depth, pw * w, ph * h );\nz = z - dz;\nl = l + DL;\n}\nao /= float( samples );\nao = 1.0 - ao;\nvec3 color = texture2D( tDiffuse, vUv ).rgb;\nvec3 lumcoeff = vec3( 0.299, 0.587, 0.114 );\nfloat lum = dot( color.rgb, lumcoeff );\nvec3 luminance = vec3( lum );\nvec3 final = vec3( color * mix( vec3( ao ), vec3( 1.0 ), luminance * lumInfluence ) );\nif ( onlyAO ) {\nfinal = vec3( mix( vec3( ao ), vec3( 1.0 ), luminance * lumInfluence ) );\n}\ngl_FragColor = vec4( final, 1.0 );\n}"
  },
  a.exports = d.SSAOShader,
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/FileShader", ["datav:/npm/three/0.97.0"], function(a, b, c) {
  var d = c("datav:/npm/three/0.97.0");
  return d.FilmShader = {
      uniforms: {
          tDiffuse: {
              type: "t",
              value: null
          },
          time: {
              type: "f",
              value: 0
          },
          nIntensity: {
              type: "f",
              value: 0.5
          },
          sIntensity: {
              type: "f",
              value: 0.05
          },
          sCount: {
              type: "f",
              value: 4096
          },
          grayscale: {
              type: "i",
              value: 1
          }
      },
      vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
      fragmentShader: "uniform float time;\nuniform bool grayscale;\nuniform float nIntensity;\nuniform float sIntensity;\nuniform float sCount;\nuniform sampler2D tDiffuse;\nvarying vec2 vUv;\nvoid main() {\nvec4 cTextureScreen = texture2D( tDiffuse, vUv );\nfloat x = vUv.x * vUv.y * time *  1000.0;\nx = mod( x, 13.0 ) * mod( x, 123.0 );\nfloat dx = mod( x, 0.01 );\nvec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );\nvec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );\ncResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;\ncResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );\nif( grayscale ) {\ncResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );\n}\ngl_FragColor =  vec4( cResult, cTextureScreen.a );\n}"
  },
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/OutlinePass", ["datav:/npm/three/0.97.0"], function(a, b, c) {
  var d = c("datav:/npm/three/0.97.0");
  return d.OutlinePass = function(a, b, c, e) {
      this.renderScene = b,
      this.renderCamera = c,
      this.selectedObjects = void 0 === e ? [] : e,
      this.visibleEdgeColor = new d.Color(1,1,1),
      this.hiddenEdgeColor = new d.Color(0.1,0.04,0.02),
      this.edgeGlow = 0,
      this.usePatternTexture = !1,
      this.edgeThickness = 1,
      this.edgeStrength = 3,
      this.downSampleRatio = 2,
      this.pulsePeriod = 0,
      d.Pass.call(this),
      this.resolution = void 0 === a ? new d.Vector2(256,256) : new d.Vector2(a.x,a.y);
      var f = {
          minFilter: d.LinearFilter,
          magFilter: d.LinearFilter,
          format: d.RGBAFormat
      }
        , g = Math.round(this.resolution.x / this.downSampleRatio)
        , h = Math.round(this.resolution.y / this.downSampleRatio);
      this.maskBufferMaterial = new d.MeshBasicMaterial({
          color: 16777215
      }),
      this.maskBufferMaterial.side = d.DoubleSide,
      this.renderTargetMaskBuffer = new d.WebGLRenderTarget(this.resolution.x,this.resolution.y,f),
      this.renderTargetMaskBuffer.texture.name = "OutlinePass.mask",
      this.renderTargetMaskBuffer.texture.generateMipmaps = !1,
      this.depthMaterial = new d.MeshDepthMaterial,
      this.depthMaterial.side = d.DoubleSide,
      this.depthMaterial.depthPacking = d.RGBADepthPacking,
      this.depthMaterial.blending = d.NoBlending,
      this.prepareMaskMaterial = this.getPrepareMaskMaterial(),
      this.prepareMaskMaterial.side = d.DoubleSide,
      this.renderTargetDepthBuffer = new d.WebGLRenderTarget(this.resolution.x,this.resolution.y,f),
      this.renderTargetDepthBuffer.texture.name = "OutlinePass.depth",
      this.renderTargetDepthBuffer.texture.generateMipmaps = !1,
      this.renderTargetMaskDownSampleBuffer = new d.WebGLRenderTarget(g,h,f),
      this.renderTargetMaskDownSampleBuffer.texture.name = "OutlinePass.depthDownSample",
      this.renderTargetMaskDownSampleBuffer.texture.generateMipmaps = !1,
      this.renderTargetBlurBuffer1 = new d.WebGLRenderTarget(g,h,f),
      this.renderTargetBlurBuffer1.texture.name = "OutlinePass.blur1",
      this.renderTargetBlurBuffer1.texture.generateMipmaps = !1,
      this.renderTargetBlurBuffer2 = new d.WebGLRenderTarget(Math.round(g / 2),Math.round(h / 2),f),
      this.renderTargetBlurBuffer2.texture.name = "OutlinePass.blur2",
      this.renderTargetBlurBuffer2.texture.generateMipmaps = !1,
      this.edgeDetectionMaterial = this.getEdgeDetectionMaterial(),
      this.renderTargetEdgeBuffer1 = new d.WebGLRenderTarget(g,h,f),
      this.renderTargetEdgeBuffer1.texture.name = "OutlinePass.edge1",
      this.renderTargetEdgeBuffer1.texture.generateMipmaps = !1,
      this.renderTargetEdgeBuffer2 = new d.WebGLRenderTarget(Math.round(g / 2),Math.round(h / 2),f),
      this.renderTargetEdgeBuffer2.texture.name = "OutlinePass.edge2",
      this.renderTargetEdgeBuffer2.texture.generateMipmaps = !1;
      var i = 4;
      this.separableBlurMaterial1 = this.getSeperableBlurMaterial(4),
      this.separableBlurMaterial1.uniforms.texSize.value = new d.Vector2(g,h),
      this.separableBlurMaterial1.uniforms.kernelRadius.value = 1,
      this.separableBlurMaterial2 = this.getSeperableBlurMaterial(i),
      this.separableBlurMaterial2.uniforms.texSize.value = new d.Vector2(Math.round(g / 2),Math.round(h / 2)),
      this.separableBlurMaterial2.uniforms.kernelRadius.value = i,
      this.overlayMaterial = this.getOverlayMaterial(),
      void 0 === d.CopyShader && console.error("THREE.OutlinePass relies on THREE.CopyShader");
      var j = d.CopyShader;
      this.copyUniforms = d.UniformsUtils.clone(j.uniforms),
      this.copyUniforms.opacity.value = 1,
      this.materialCopy = new d.ShaderMaterial({
          uniforms: this.copyUniforms,
          vertexShader: j.vertexShader,
          fragmentShader: j.fragmentShader,
          blending: d.NoBlending,
          depthTest: !1,
          depthWrite: !1,
          transparent: !0
      }),
      this.enabled = !0,
      this.needsSwap = !1,
      this.oldClearColor = new d.Color,
      this.oldClearAlpha = 1,
      this.camera = new d.OrthographicCamera(-1,1,1,-1,0,1),
      this.scene = new d.Scene,
      this.quad = new d.Mesh(new d.PlaneBufferGeometry(2,2),null),
      this.quad.frustumCulled = !1,
      this.scene.add(this.quad),
      this.tempPulseColor1 = new d.Color,
      this.tempPulseColor2 = new d.Color,
      this.textureMatrix = new d.Matrix4
  }
  ,
  d.OutlinePass.prototype = Object.assign(Object.create(d.Pass.prototype), {
      constructor: d.OutlinePass,
      dispose: function() {
          this.renderTargetMaskBuffer.dispose(),
          this.renderTargetDepthBuffer.dispose(),
          this.renderTargetMaskDownSampleBuffer.dispose(),
          this.renderTargetBlurBuffer1.dispose(),
          this.renderTargetBlurBuffer2.dispose(),
          this.renderTargetEdgeBuffer1.dispose(),
          this.renderTargetEdgeBuffer2.dispose()
      },
      setSize: function(a, b) {
          this.renderTargetMaskBuffer.setSize(a, b);
          var c = Math.round(a / this.downSampleRatio)
            , e = Math.round(b / this.downSampleRatio);
          this.renderTargetMaskDownSampleBuffer.setSize(c, e),
          this.renderTargetBlurBuffer1.setSize(c, e),
          this.renderTargetEdgeBuffer1.setSize(c, e),
          this.separableBlurMaterial1.uniforms.texSize.value = new d.Vector2(c,e),
          c = Math.round(c / 2),
          e = Math.round(e / 2),
          this.renderTargetBlurBuffer2.setSize(c, e),
          this.renderTargetEdgeBuffer2.setSize(c, e),
          this.separableBlurMaterial2.uniforms.texSize.value = new d.Vector2(c,e)
      },
      changeVisibilityOfSelectedObjects: function(a) {
          function b(b) {
              b instanceof d.Mesh && (b.visible = a)
          }
          for (var c, e = 0; e < this.selectedObjects.length; e++)
              c = this.selectedObjects[e],
              c.traverse(b)
      },
      changeVisibilityOfNonSelectedObjects: function(a) {
          function b(a) {
              a instanceof d.Mesh && e.push(a)
          }
          for (var c, e = [], f = 0; f < this.selectedObjects.length; f++)
              c = this.selectedObjects[f],
              c.traverse(b);
          this.renderScene.traverse(function(b) {
              if (b instanceof d.Mesh) {
                  for (var c, f = !1, g = 0; g < e.length; g++)
                      if (c = e[g].id,
                      c === b.id) {
                          f = !0;
                          break
                      }
                  if (!f) {
                      var h = b.visible;
                      (!a || b.bVisible) && (b.visible = a),
                      b.bVisible = h
                  }
              }
          })
      },
      updateTextureMatrix: function() {
          this.textureMatrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1),
          this.textureMatrix.multiply(this.renderCamera.projectionMatrix),
          this.textureMatrix.multiply(this.renderCamera.matrixWorldInverse)
      },
      render: function(a, b, c, e, f) {
          if (0 !== this.selectedObjects.length) {
              this.oldClearColor.copy(a.getClearColor()),
              this.oldClearAlpha = a.getClearAlpha();
              var g = a.autoClear;
              if (a.autoClear = !1,
              f && a.context.disable(a.context.STENCIL_TEST),
              a.setClearColor(16777215, 1),
              this.changeVisibilityOfSelectedObjects(!1),
              this.renderScene.overrideMaterial = this.depthMaterial,
              a.render(this.renderScene, this.renderCamera, this.renderTargetDepthBuffer, !0),
              this.changeVisibilityOfSelectedObjects(!0),
              this.updateTextureMatrix(),
              this.changeVisibilityOfNonSelectedObjects(!1),
              this.renderScene.overrideMaterial = this.prepareMaskMaterial,
              this.prepareMaskMaterial.uniforms.cameraNearFar.value = new d.Vector2(this.renderCamera.near,this.renderCamera.far),
              this.prepareMaskMaterial.uniforms.depthTexture.value = this.renderTargetDepthBuffer.texture,
              this.prepareMaskMaterial.uniforms.textureMatrix.value = this.textureMatrix,
              a.render(this.renderScene, this.renderCamera, this.renderTargetMaskBuffer, !0),
              this.renderScene.overrideMaterial = null,
              this.changeVisibilityOfNonSelectedObjects(!0),
              this.quad.material = this.materialCopy,
              this.copyUniforms.tDiffuse.value = this.renderTargetMaskBuffer.texture,
              a.render(this.scene, this.camera, this.renderTargetMaskDownSampleBuffer, !0),
              this.tempPulseColor1.copy(this.visibleEdgeColor),
              this.tempPulseColor2.copy(this.hiddenEdgeColor),
              0 < this.pulsePeriod) {
                  var h = (1 + 0.25) / 2 + Math.cos(0.01 * performance.now() / this.pulsePeriod) * (1 - 0.25) / 2;
                  this.tempPulseColor1.multiplyScalar(h),
                  this.tempPulseColor2.multiplyScalar(h)
              }
              this.quad.material = this.edgeDetectionMaterial,
              this.edgeDetectionMaterial.uniforms.maskTexture.value = this.renderTargetMaskDownSampleBuffer.texture,
              this.edgeDetectionMaterial.uniforms.texSize.value = new d.Vector2(this.renderTargetMaskDownSampleBuffer.width,this.renderTargetMaskDownSampleBuffer.height),
              this.edgeDetectionMaterial.uniforms.visibleEdgeColor.value = this.tempPulseColor1,
              this.edgeDetectionMaterial.uniforms.hiddenEdgeColor.value = this.tempPulseColor2,
              a.render(this.scene, this.camera, this.renderTargetEdgeBuffer1, !0),
              this.quad.material = this.separableBlurMaterial1,
              this.separableBlurMaterial1.uniforms.colorTexture.value = this.renderTargetEdgeBuffer1.texture,
              this.separableBlurMaterial1.uniforms.direction.value = d.OutlinePass.BlurDirectionX,
              this.separableBlurMaterial1.uniforms.kernelRadius.value = this.edgeThickness,
              a.render(this.scene, this.camera, this.renderTargetBlurBuffer1, !0),
              this.separableBlurMaterial1.uniforms.colorTexture.value = this.renderTargetBlurBuffer1.texture,
              this.separableBlurMaterial1.uniforms.direction.value = d.OutlinePass.BlurDirectionY,
              a.render(this.scene, this.camera, this.renderTargetEdgeBuffer1, !0),
              this.quad.material = this.separableBlurMaterial2,
              this.separableBlurMaterial2.uniforms.colorTexture.value = this.renderTargetEdgeBuffer1.texture,
              this.separableBlurMaterial2.uniforms.direction.value = d.OutlinePass.BlurDirectionX,
              a.render(this.scene, this.camera, this.renderTargetBlurBuffer2, !0),
              this.separableBlurMaterial2.uniforms.colorTexture.value = this.renderTargetBlurBuffer2.texture,
              this.separableBlurMaterial2.uniforms.direction.value = d.OutlinePass.BlurDirectionY,
              a.render(this.scene, this.camera, this.renderTargetEdgeBuffer2, !0),
              this.quad.material = this.overlayMaterial,
              this.overlayMaterial.uniforms.maskTexture.value = this.renderTargetMaskBuffer.texture,
              this.overlayMaterial.uniforms.edgeTexture1.value = this.renderTargetEdgeBuffer1.texture,
              this.overlayMaterial.uniforms.edgeTexture2.value = this.renderTargetEdgeBuffer2.texture,
              this.overlayMaterial.uniforms.patternTexture.value = this.patternTexture,
              this.overlayMaterial.uniforms.edgeStrength.value = this.edgeStrength,
              this.overlayMaterial.uniforms.edgeGlow.value = this.edgeGlow,
              this.overlayMaterial.uniforms.usePatternTexture.value = this.usePatternTexture,
              f && a.context.enable(a.context.STENCIL_TEST),
              a.render(this.scene, this.camera, c, !1),
              a.setClearColor(this.oldClearColor, this.oldClearAlpha),
              a.autoClear = g
          }
      },
      getPrepareMaskMaterial: function() {
          return new d.ShaderMaterial({
              uniforms: {
                  depthTexture: {
                      value: null
                  },
                  cameraNearFar: {
                      value: new d.Vector2(0.5,0.5)
                  },
                  textureMatrix: {
                      value: new d.Matrix4
                  }
              },
              vertexShader: "varying vec2 vUv;\t\t\t\tvarying vec4 projTexCoord;\t\t\t\tvarying vec4 vPosition;\t\t\t\tuniform mat4 textureMatrix;\t\t\t\tvoid main() {\t\t\t\t\tvUv = uv;\t\t\t\t\tvPosition = modelViewMatrix * vec4( position, 1.0 );\t\t\t\t\tvec4 worldPosition = modelMatrix * vec4( position, 1.0 );\t\t\t\t\tprojTexCoord = textureMatrix * worldPosition;\t\t\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t\t\t}",
              fragmentShader: "#include <packing>\t\t\t\tvarying vec2 vUv;\t\t\t\tvarying vec4 vPosition;\t\t\t\tvarying vec4 projTexCoord;\t\t\t\tuniform sampler2D depthTexture;\t\t\t\tuniform vec2 cameraNearFar;\t\t\t\t\t\t\t\tvoid main() {\t\t\t\t\tfloat depth = unpackRGBAToDepth(texture2DProj( depthTexture, projTexCoord ));\t\t\t\t\tfloat viewZ = -perspectiveDepthToViewZ( depth, cameraNearFar.x, cameraNearFar.y );\t\t\t\t\tfloat depthTest = (-vPosition.z > viewZ) ? 1.0 : 0.0;\t\t\t\t\tgl_FragColor = vec4(0.0, depthTest, 1.0, 1.0);\t\t\t\t}"
          })
      },
      getEdgeDetectionMaterial: function() {
          return new d.ShaderMaterial({
              uniforms: {
                  maskTexture: {
                      value: null
                  },
                  texSize: {
                      value: new d.Vector2(0.5,0.5)
                  },
                  visibleEdgeColor: {
                      value: new d.Vector3(1,1,1)
                  },
                  hiddenEdgeColor: {
                      value: new d.Vector3(1,1,1)
                  }
              },
              vertexShader: "varying vec2 vUv;\n\t\t\t\tvoid main() {\n\t\t\t\t\tvUv = uv;\n\t\t\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t\t\t}",
              fragmentShader: "varying vec2 vUv;\t\t\t\tuniform sampler2D maskTexture;\t\t\t\tuniform vec2 texSize;\t\t\t\tuniform vec3 visibleEdgeColor;\t\t\t\tuniform vec3 hiddenEdgeColor;\t\t\t\t\t\t\t\tvoid main() {\n\t\t\t\t\tvec2 invSize = 1.0 / texSize;\t\t\t\t\tvec4 uvOffset = vec4(1.0, 0.0, 0.0, 1.0) * vec4(invSize, invSize);\t\t\t\t\tvec4 c1 = texture2D( maskTexture, vUv + uvOffset.xy);\t\t\t\t\tvec4 c2 = texture2D( maskTexture, vUv - uvOffset.xy);\t\t\t\t\tvec4 c3 = texture2D( maskTexture, vUv + uvOffset.yw);\t\t\t\t\tvec4 c4 = texture2D( maskTexture, vUv - uvOffset.yw);\t\t\t\t\tfloat diff1 = (c1.r - c2.r)*0.5;\t\t\t\t\tfloat diff2 = (c3.r - c4.r)*0.5;\t\t\t\t\tfloat d = length( vec2(diff1, diff2) );\t\t\t\t\tfloat a1 = min(c1.g, c2.g);\t\t\t\t\tfloat a2 = min(c3.g, c4.g);\t\t\t\t\tfloat visibilityFactor = min(a1, a2);\t\t\t\t\tvec3 edgeColor = 1.0 - visibilityFactor > 0.001 ? visibleEdgeColor : hiddenEdgeColor;\t\t\t\t\tgl_FragColor = vec4(edgeColor, 1.0) * vec4(d);\t\t\t\t}"
          })
      },
      getSeperableBlurMaterial: function(a) {
          return new d.ShaderMaterial({
              defines: {
                  MAX_RADIUS: a
              },
              uniforms: {
                  colorTexture: {
                      value: null
                  },
                  texSize: {
                      value: new d.Vector2(0.5,0.5)
                  },
                  direction: {
                      value: new d.Vector2(0.5,0.5)
                  },
                  kernelRadius: {
                      value: 1
                  }
              },
              vertexShader: "varying vec2 vUv;\n\t\t\t\tvoid main() {\n\t\t\t\t\tvUv = uv;\n\t\t\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t\t\t}",
              fragmentShader: "#include <common>\t\t\t\tvarying vec2 vUv;\t\t\t\tuniform sampler2D colorTexture;\t\t\t\tuniform vec2 texSize;\t\t\t\tuniform vec2 direction;\t\t\t\tuniform float kernelRadius;\t\t\t\t\t\t\t\tfloat gaussianPdf(in float x, in float sigma) {\t\t\t\t\treturn 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;\t\t\t\t}\t\t\t\tvoid main() {\t\t\t\t\tvec2 invSize = 1.0 / texSize;\t\t\t\t\tfloat weightSum = gaussianPdf(0.0, kernelRadius);\t\t\t\t\tvec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;\t\t\t\t\tvec2 delta = direction * invSize * kernelRadius/float(MAX_RADIUS);\t\t\t\t\tvec2 uvOffset = delta;\t\t\t\t\tfor( int i = 1; i <= MAX_RADIUS; i ++ ) {\t\t\t\t\t\tfloat w = gaussianPdf(uvOffset.x, kernelRadius);\t\t\t\t\t\tvec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;\t\t\t\t\t\tvec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;\t\t\t\t\t\tdiffuseSum += ((sample1 + sample2) * w);\t\t\t\t\t\tweightSum += (2.0 * w);\t\t\t\t\t\tuvOffset += delta;\t\t\t\t\t}\t\t\t\t\tgl_FragColor = vec4(diffuseSum/weightSum, 1.0);\t\t\t\t}"
          })
      },
      getOverlayMaterial: function() {
          return new d.ShaderMaterial({
              uniforms: {
                  maskTexture: {
                      value: null
                  },
                  edgeTexture1: {
                      value: null
                  },
                  edgeTexture2: {
                      value: null
                  },
                  patternTexture: {
                      value: null
                  },
                  edgeStrength: {
                      value: 1
                  },
                  edgeGlow: {
                      value: 1
                  },
                  usePatternTexture: {
                      value: 0
                  }
              },
              vertexShader: "varying vec2 vUv;\n\t\t\t\tvoid main() {\n\t\t\t\t\tvUv = uv;\n\t\t\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t\t\t}",
              fragmentShader: "varying vec2 vUv;\t\t\t\tuniform sampler2D maskTexture;\t\t\t\tuniform sampler2D edgeTexture1;\t\t\t\tuniform sampler2D edgeTexture2;\t\t\t\tuniform sampler2D patternTexture;\t\t\t\tuniform float edgeStrength;\t\t\t\tuniform float edgeGlow;\t\t\t\tuniform bool usePatternTexture;\t\t\t\t\t\t\t\tvoid main() {\t\t\t\t\tvec4 edgeValue1 = texture2D(edgeTexture1, vUv);\t\t\t\t\tvec4 edgeValue2 = texture2D(edgeTexture2, vUv);\t\t\t\t\tvec4 maskColor = texture2D(maskTexture, vUv);\t\t\t\t\tvec4 patternColor = texture2D(patternTexture, 6.0 * vUv);\t\t\t\t\tfloat visibilityFactor = 1.0 - maskColor.g > 0.0 ? 1.0 : 0.5;\t\t\t\t\tvec4 edgeValue = edgeValue1 + edgeValue2 * edgeGlow;\t\t\t\t\tvec4 finalColor = edgeStrength * maskColor.r * edgeValue;\t\t\t\t\tif(usePatternTexture)\t\t\t\t\t\tfinalColor += + visibilityFactor * (1.0 - maskColor.r) * (1.0 - patternColor.r);\t\t\t\t\tgl_FragColor = finalColor;\t\t\t\t}",
              blending: d.AdditiveBlending,
              depthTest: !1,
              depthWrite: !1,
              transparent: !0
          })
      }
  }),
  d.OutlinePass.BlurDirectionX = new d.Vector2(1,0),
  d.OutlinePass.BlurDirectionY = new d.Vector2(0,1),
  a.exports = d.OutlinePass,
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/RenderPass", ["datav:/npm/three/0.97.0"], function(a, b, c) {
  var d = c("datav:/npm/three/0.97.0");
  return d.RenderPass = function(a, b, c, e, f) {
      d.Pass.call(this),
      this.scene = a,
      this.camera = b,
      this.overrideMaterial = c,
      this.clearColor = e,
      this.clearAlpha = void 0 === f ? 0 : f,
      this.clear = !0,
      this.clearDepth = !1,
      this.needsSwap = !1
  }
  ,
  d.RenderPass.prototype = Object.assign(Object.create(d.Pass.prototype), {
      constructor: d.RenderPass,
      updateClear: function(a, b) {
          this.clearColor = a,
          this.clearAlpha = void 0 === b ? 0 : b
      },
      render: function(a, b, c) {
          var d = a.autoClear;
          a.autoClear = !1,
          this.scene.overrideMaterial = this.overrideMaterial;
          var e, f;
          this.clearColor && (e = a.getClearColor().getHex(),
          f = a.getClearAlpha(),
          a.setClearColor(this.clearColor, this.clearAlpha)),
          this.clearDepth && a.clearDepth(),
          a.render(this.scene, this.camera, this.renderToScreen ? null : c, this.clear),
          this.clearColor && a.setClearColor(e, f),
          this.scene.overrideMaterial = null,
          a.autoClear = d
      }
  }),
  a.exports = d.RenderPass,
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/MaskPass", ["datav:/npm/three/0.97.0"], function(a, b, c) {
  var d = c("datav:/npm/three/0.97.0");
  return d.MaskPass = function(a, b) {
      d.Pass.call(this),
      this.scene = a,
      this.camera = b,
      this.clear = !0,
      this.needsSwap = !1,
      this.inverse = !1
  }
  ,
  d.MaskPass.prototype = Object.assign(Object.create(d.Pass.prototype), {
      constructor: d.MaskPass,
      render: function(a, b, c) {
          var d = a.context
            , e = a.state;
          e.buffers.color.setMask(!1),
          e.buffers.depth.setMask(!1),
          e.buffers.color.setLocked(!0),
          e.buffers.depth.setLocked(!0);
          var f, g;
          this.inverse ? (f = 0,
          g = 1) : (f = 1,
          g = 0),
          e.buffers.stencil.setTest(!0),
          e.buffers.stencil.setOp(d.REPLACE, d.REPLACE, d.REPLACE),
          e.buffers.stencil.setFunc(d.ALWAYS, f, 4294967295),
          e.buffers.stencil.setClear(g),
          a.render(this.scene, this.camera, c, this.clear),
          a.render(this.scene, this.camera, b, this.clear),
          e.buffers.color.setLocked(!1),
          e.buffers.depth.setLocked(!1),
          e.buffers.stencil.setFunc(d.EQUAL, 1, 4294967295),
          e.buffers.stencil.setOp(d.KEEP, d.KEEP, d.KEEP)
      }
  }),
  d.ClearMaskPass = function() {
      d.Pass.call(this),
      this.needsSwap = !1
  }
  ,
  d.ClearMaskPass.prototype = Object.create(d.Pass.prototype),
  Object.assign(d.ClearMaskPass.prototype, {
      render: function(a) {
          a.state.buffers.stencil.setTest(!1)
      }
  }),
  a.exports = d.MaskPass,
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/CopyShader", ["datav:/npm/three/0.97.0"], function(a, b, c) {
  var d = c("datav:/npm/three/0.97.0");
  return d.CopyShader = {
      uniforms: {
          tDiffuse: {
              value: null
          },
          opacity: {
              value: 1
          }
      },
      vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
      fragmentShader: "uniform float opacity;\nuniform sampler2D tDiffuse;\nvarying vec2 vUv;\nvoid main() {\nvec4 texel = texture2D( tDiffuse, vUv );\ngl_FragColor = opacity * texel;\n}"
  },
  a.exports = d.CopyShader,
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/SMAAPass", ["datav:/npm/three/0.97.0"], function(a, b, c) {
  var d = c("datav:/npm/three/0.97.0");
  return c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/SMAAShader.js"),
  d.SMAAPass = function(a, b) {
      d.Pass.call(this),
      this.edgesRT = new d.WebGLRenderTarget(a,b,{
          depthBuffer: !1,
          stencilBuffer: !1,
          generateMipmaps: !1,
          minFilter: d.LinearFilter,
          format: d.RGBFormat
      }),
      this.weightsRT = new d.WebGLRenderTarget(a,b,{
          depthBuffer: !1,
          stencilBuffer: !1,
          generateMipmaps: !1,
          minFilter: d.LinearFilter,
          format: d.RGBAFormat
      });
      var c = new Image;
      c.src = this.getAreaTexture(),
      this.areaTexture = new d.Texture,
      this.areaTexture.image = c,
      this.areaTexture.format = d.RGBFormat,
      this.areaTexture.minFilter = d.LinearFilter,
      this.areaTexture.generateMipmaps = !1,
      this.areaTexture.needsUpdate = !0,
      this.areaTexture.flipY = !1;
      var e = new Image;
      e.src = this.getSearchTexture(),
      this.searchTexture = new d.Texture,
      this.searchTexture.image = e,
      this.searchTexture.magFilter = d.NearestFilter,
      this.searchTexture.minFilter = d.NearestFilter,
      this.searchTexture.generateMipmaps = !1,
      this.searchTexture.needsUpdate = !0,
      this.searchTexture.flipY = !1,
      void 0 === d.SMAAShader && console.error("THREE.SMAAPass relies on THREE.SMAAShader"),
      this.uniformsEdges = d.UniformsUtils.clone(d.SMAAShader[0].uniforms),
      this.uniformsEdges.resolution.value.set(1 / a, 1 / b),
      this.materialEdges = new d.ShaderMaterial({
          defines: d.SMAAShader[0].defines,
          uniforms: this.uniformsEdges,
          vertexShader: d.SMAAShader[0].vertexShader,
          fragmentShader: d.SMAAShader[0].fragmentShader
      }),
      this.uniformsWeights = d.UniformsUtils.clone(d.SMAAShader[1].uniforms),
      this.uniformsWeights.resolution.value.set(1 / a, 1 / b),
      this.uniformsWeights.tDiffuse.value = this.edgesRT.texture,
      this.uniformsWeights.tArea.value = this.areaTexture,
      this.uniformsWeights.tSearch.value = this.searchTexture,
      this.materialWeights = new d.ShaderMaterial({
          defines: d.SMAAShader[1].defines,
          uniforms: this.uniformsWeights,
          vertexShader: d.SMAAShader[1].vertexShader,
          fragmentShader: d.SMAAShader[1].fragmentShader
      }),
      this.uniformsBlend = d.UniformsUtils.clone(d.SMAAShader[2].uniforms),
      this.uniformsBlend.resolution.value.set(1 / a, 1 / b),
      this.uniformsBlend.tDiffuse.value = this.weightsRT.texture,
      this.materialBlend = new d.ShaderMaterial({
          uniforms: this.uniformsBlend,
          vertexShader: d.SMAAShader[2].vertexShader,
          fragmentShader: d.SMAAShader[2].fragmentShader
      }),
      this.needsSwap = !1,
      this.camera = new d.OrthographicCamera(-1,1,1,-1,0,1),
      this.scene = new d.Scene,
      this.quad = new d.Mesh(new d.PlaneBufferGeometry(2,2),null),
      this.quad.frustumCulled = !1,
      this.scene.add(this.quad)
  }
  ,
  d.SMAAPass.prototype = Object.assign(Object.create(d.Pass.prototype), {
      constructor: d.SMAAPass,
      render: function(a, b, c) {
          this.uniformsEdges.tDiffuse.value = c.texture,
          this.quad.material = this.materialEdges,
          a.render(this.scene, this.camera, this.edgesRT, this.clear),
          this.quad.material = this.materialWeights,
          a.render(this.scene, this.camera, this.weightsRT, this.clear),
          this.uniformsBlend.tColor.value = c.texture,
          this.quad.material = this.materialBlend,
          this.renderToScreen ? a.render(this.scene, this.camera) : a.render(this.scene, this.camera, b, this.clear)
      },
      dispose: function() {
          this.scene.remove(this.quad),
          this.scene.remove(this.camera),
          this.quad.dispose && this.quad.dispose(),
          this.camera.dispose && this.camera.dispose(),
          this.edgesRT.dispose && this.edgesRT.dispose(),
          this.weightsRT.dispose && this.weightsRT.dispose(),
          this.areaTexture.dispose && this.areaTexture.dispose(),
          this.searchTexture.dispose && this.searchTexture.dispose(),
          this.materialBlend.dispose && this.materialBlend.dispose(),
          this.quad = null,
          this.scene = null,
          this.camera = null,
          this.edgesRT = null,
          this.weightsRT = null,
          this.areaTexture = null,
          this.searchTexture = null,
          this.materialBlend = null
      },
      setSize: function(a, b) {
          this.edgesRT.setSize(a, b),
          this.weightsRT.setSize(a, b),
          this.materialEdges.uniforms.resolution.value.set(1 / a, 1 / b),
          this.materialWeights.uniforms.resolution.value.set(1 / a, 1 / b),
          this.materialBlend.uniforms.resolution.value.set(1 / a, 1 / b)
      },
      getAreaTexture: function() {
          return "data:image/png;base64,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"
      },
      getSearchTexture: function() {
          return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAhCAAAAABIXyLAAAAAOElEQVRIx2NgGAWjYBSMglEwEICREYRgFBZBqDCSLA2MGPUIVQETE9iNUAqLR5gIeoQKRgwXjwAAGn4AtaFeYLEAAAAASUVORK5CYII="
      }
  }),
  a.exports = d.SMAAPass,
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/LuminosityHighPassShader", ["datav:/npm/three/0.97.0"], function(a, b, c) {
  var d = c("datav:/npm/three/0.97.0");
  return d.LuminosityHighPassShader = {
      shaderID: "luminosityHighPass",
      uniforms: {
          tDiffuse: {
              type: "t",
              value: null
          },
          luminosityThreshold: {
              type: "f",
              value: 1
          },
          smoothWidth: {
              type: "f",
              value: 1
          },
          defaultColor: {
              type: "c",
              value: new d.Color(0)
          },
          defaultOpacity: {
              type: "f",
              value: 0
          }
      },
      vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
      fragmentShader: "uniform sampler2D tDiffuse;\nuniform vec3 defaultColor;\nuniform float defaultOpacity;\nuniform float luminosityThreshold;\nuniform float smoothWidth;\nvarying vec2 vUv;\nvoid main() {\nvec4 texel = texture2D( tDiffuse, vUv );\nvec3 luma = vec3( 0.299, 0.587, 0.114 );\nfloat v = dot( texel.xyz, luma );\nvec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );\nfloat alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );\ngl_FragColor = mix( outputColor, texel, alpha );\n}"
  },
  a.exports = d.LuminosityHighPassShader,
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/UnrealBloomPass", ["datav:/npm/three/0.97.0"], function(a, b, c) {
  var d = c("datav:/npm/three/0.97.0");
  return d.UnrealBloomPass = function(a, b, c, e) {
      d.Pass.call(this),
      this.strength = void 0 === b ? 1 : b,
      this.radius = c,
      this.threshold = e,
      this.resolution = void 0 === a ? new d.Vector2(256,256) : new d.Vector2(a.x,a.y);
      var f = {
          minFilter: d.LinearFilter,
          magFilter: d.LinearFilter,
          format: d.RGBAFormat
      };
      this.renderTargetsHorizontal = [],
      this.renderTargetsVertical = [],
      this.nMips = 5;
      var g = Math.round(this.resolution.x / 2)
        , h = Math.round(this.resolution.y / 2);
      this.renderTargetBright = new d.WebGLRenderTarget(g,h,f),
      this.renderTargetBright.texture.generateMipmaps = !1;
      for (var j, k = 0; k < this.nMips; k++) {
          j = new d.WebGLRenderTarget(g,h,f),
          j.texture.generateMipmaps = !1,
          this.renderTargetsHorizontal.push(j);
          var j = new d.WebGLRenderTarget(g,h,f);
          j.texture.generateMipmaps = !1,
          this.renderTargetsVertical.push(j),
          g = Math.round(g / 2),
          h = Math.round(h / 2)
      }
      void 0 === d.LuminosityHighPassShader && console.error("THREE.UnrealBloomPass relies on THREE.LuminosityHighPassShader");
      var i = d.LuminosityHighPassShader;
      this.highPassUniforms = d.UniformsUtils.clone(i.uniforms),
      this.highPassUniforms.luminosityThreshold.value = e,
      this.highPassUniforms.smoothWidth.value = 0.01,
      this.materialHighPassFilter = new d.ShaderMaterial({
          uniforms: this.highPassUniforms,
          vertexShader: i.vertexShader,
          fragmentShader: i.fragmentShader,
          defines: {}
      }),
      this.separableBlurMaterials = [];
      for (var l = [3, 5, 7, 9, 11], g = Math.round(this.resolution.x / 2), h = Math.round(this.resolution.y / 2), k = 0; k < this.nMips; k++)
          this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[k])),
          this.separableBlurMaterials[k].uniforms.texSize.value = new d.Vector2(g,h),
          g = Math.round(g / 2),
          h = Math.round(h / 2);
      this.compositeMaterial = this.getCompositeMaterial(this.nMips),
      this.compositeMaterial.uniforms.blurTexture1.value = this.renderTargetsVertical[0].texture,
      this.compositeMaterial.uniforms.blurTexture2.value = this.renderTargetsVertical[1].texture,
      this.compositeMaterial.uniforms.blurTexture3.value = this.renderTargetsVertical[2].texture,
      this.compositeMaterial.uniforms.blurTexture4.value = this.renderTargetsVertical[3].texture,
      this.compositeMaterial.uniforms.blurTexture5.value = this.renderTargetsVertical[4].texture,
      this.compositeMaterial.uniforms.bloomStrength.value = b,
      this.compositeMaterial.uniforms.bloomRadius.value = 0.1,
      this.compositeMaterial.needsUpdate = !0;
      this.compositeMaterial.uniforms.bloomFactors.value = [1, 0.8, 0.6, 0.4, 0.2],
      this.bloomTintColors = [new d.Vector3(1,1,1), new d.Vector3(1,1,1), new d.Vector3(1,1,1), new d.Vector3(1,1,1), new d.Vector3(1,1,1)],
      this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors,
      void 0 === d.CopyShader && console.error("THREE.BloomPass relies on THREE.CopyShader");
      var m = d.CopyShader;
      this.copyUniforms = d.UniformsUtils.clone(m.uniforms),
      this.copyUniforms.opacity.value = 1,
      this.materialCopy = new d.ShaderMaterial({
          uniforms: this.copyUniforms,
          vertexShader: m.vertexShader,
          fragmentShader: m.fragmentShader,
          blending: d.AdditiveBlending,
          depthTest: !1,
          depthWrite: !1,
          transparent: !0
      }),
      this.enabled = !0,
      this.needsSwap = !1,
      this.oldClearColor = new d.Color,
      this.oldClearAlpha = 1,
      this.camera = new d.OrthographicCamera(-1,1,1,-1,0,1),
      this.scene = new d.Scene,
      this.quad = new d.Mesh(new d.PlaneBufferGeometry(2,2),null),
      this.quad.frustumCulled = !1,
      this.scene.add(this.quad)
  }
  ,
  d.UnrealBloomPass.prototype = Object.assign(Object.create(d.Pass.prototype), {
      constructor: d.UnrealBloomPass,
      dispose: function() {
          for (var a = 0; a < this.renderTargetsHorizontal.length; a++)
              this.renderTargetsHorizontal[a].dispose();
          for (var a = 0; a < this.renderTargetsVertical.length; a++)
              this.renderTargetsVertical[a].dispose();
          this.renderTargetBright.dispose()
      },
      setSize: function(a, b) {
          var c = Math.round(a / 2)
            , e = Math.round(b / 2);
          this.renderTargetBright.setSize(c, e);
          for (var f = 0; f < this.nMips; f++)
              this.renderTargetsHorizontal[f].setSize(c, e),
              this.renderTargetsVertical[f].setSize(c, e),
              this.separableBlurMaterials[f].uniforms.texSize.value = new d.Vector2(c,e),
              c = Math.round(c / 2),
              e = Math.round(e / 2)
      },
      render: function(a, b, c, e, f) {
          this.oldClearColor.copy(a.getClearColor()),
          this.oldClearAlpha = a.getClearAlpha();
          var g = a.autoClear;
          a.autoClear = !1,
          a.setClearColor(new d.Color(0,0,0), 0),
          f && a.context.disable(a.context.STENCIL_TEST),
          this.highPassUniforms.tDiffuse.value = c.texture,
          this.highPassUniforms.luminosityThreshold.value = this.threshold,
          this.quad.material = this.materialHighPassFilter,
          a.render(this.scene, this.camera, this.renderTargetBright, !0);
          for (var h = this.renderTargetBright, j = 0; j < this.nMips; j++)
              this.quad.material = this.separableBlurMaterials[j],
              this.separableBlurMaterials[j].uniforms.colorTexture.value = h.texture,
              this.separableBlurMaterials[j].uniforms.direction.value = d.UnrealBloomPass.BlurDirectionX,
              a.render(this.scene, this.camera, this.renderTargetsHorizontal[j], !0),
              this.separableBlurMaterials[j].uniforms.colorTexture.value = this.renderTargetsHorizontal[j].texture,
              this.separableBlurMaterials[j].uniforms.direction.value = d.UnrealBloomPass.BlurDirectionY,
              a.render(this.scene, this.camera, this.renderTargetsVertical[j], !0),
              h = this.renderTargetsVertical[j];
          this.quad.material = this.compositeMaterial,
          this.compositeMaterial.uniforms.bloomStrength.value = this.strength,
          this.compositeMaterial.uniforms.bloomRadius.value = this.radius,
          this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors,
          a.render(this.scene, this.camera, this.renderTargetsHorizontal[0], !0),
          this.quad.material = this.materialCopy,
          this.copyUniforms.tDiffuse.value = this.renderTargetsHorizontal[0].texture,
          f && a.context.enable(a.context.STENCIL_TEST),
          a.render(this.scene, this.camera, c, !1),
          a.setClearColor(this.oldClearColor, this.oldClearAlpha),
          a.autoClear = g
      },
      getSeperableBlurMaterial: function(a) {
          return new d.ShaderMaterial({
              defines: {
                  KERNEL_RADIUS: a,
                  SIGMA: a
              },
              uniforms: {
                  colorTexture: {
                      value: null
                  },
                  texSize: {
                      value: new d.Vector2(0.5,0.5)
                  },
                  direction: {
                      value: new d.Vector2(0.5,0.5)
                  }
              },
              vertexShader: "varying vec2 vUv;\n\t\t\t\tvoid main() {\n\t\t\t\t\tvUv = uv;\n\t\t\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t\t\t}",
              fragmentShader: "#include <common>\t\t\t\tvarying vec2 vUv;\n\t\t\t\tuniform sampler2D colorTexture;\n\t\t\t\tuniform vec2 texSize;\t\t\t\tuniform vec2 direction;\t\t\t\t\t\t\t\tfloat gaussianPdf(in float x, in float sigma) {\t\t\t\t\treturn 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;\t\t\t\t}\t\t\t\tvoid main() {\n\t\t\t\t\tvec2 invSize = 1.0 / texSize;\t\t\t\t\tfloat fSigma = float(SIGMA);\t\t\t\t\tfloat weightSum = gaussianPdf(0.0, fSigma);\t\t\t\t\tvec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;\t\t\t\t\tfor( int i = 1; i < KERNEL_RADIUS; i ++ ) {\t\t\t\t\t\tfloat x = float(i);\t\t\t\t\t\tfloat w = gaussianPdf(x, fSigma);\t\t\t\t\t\tvec2 uvOffset = direction * invSize * x;\t\t\t\t\t\tvec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;\t\t\t\t\t\tvec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;\t\t\t\t\t\tdiffuseSum += (sample1 + sample2) * w;\t\t\t\t\t\tweightSum += 2.0 * w;\t\t\t\t\t}\t\t\t\t\tgl_FragColor = vec4(diffuseSum/weightSum, texture2D( colorTexture, vUv).a);\n\t\t\t\t}"
          })
      },
      getCompositeMaterial: function(a) {
          return new d.ShaderMaterial({
              defines: {
                  NUM_MIPS: a
              },
              uniforms: {
                  blurTexture1: {
                      value: null
                  },
                  blurTexture2: {
                      value: null
                  },
                  blurTexture3: {
                      value: null
                  },
                  blurTexture4: {
                      value: null
                  },
                  blurTexture5: {
                      value: null
                  },
                  dirtTexture: {
                      value: null
                  },
                  bloomStrength: {
                      value: 1
                  },
                  bloomFactors: {
                      value: null
                  },
                  bloomTintColors: {
                      value: null
                  },
                  bloomRadius: {
                      value: 0
                  }
              },
              vertexShader: "varying vec2 vUv;\n\t\t\t\tvoid main() {\n\t\t\t\t\tvUv = uv;\n\t\t\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t\t\t}",
              fragmentShader: "varying vec2 vUv;\t\t\t\tuniform sampler2D blurTexture1;\t\t\t\tuniform sampler2D blurTexture2;\t\t\t\tuniform sampler2D blurTexture3;\t\t\t\tuniform sampler2D blurTexture4;\t\t\t\tuniform sampler2D blurTexture5;\t\t\t\tuniform sampler2D dirtTexture;\t\t\t\tuniform float bloomStrength;\t\t\t\tuniform float bloomRadius;\t\t\t\tuniform float bloomFactors[NUM_MIPS];\t\t\t\tuniform vec3 bloomTintColors[NUM_MIPS];\t\t\t\t\t\t\t\tfloat lerpBloomFactor(const in float factor) { \t\t\t\t\tfloat mirrorFactor = 1.2 - factor;\t\t\t\t\treturn mix(factor, mirrorFactor, bloomRadius);\t\t\t\t}\t\t\t\t\t\t\t\tvoid main() {\t\t\t\t\tgl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) + \t\t\t\t\t \t\t\t\t\t\t\t lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) + \t\t\t\t\t\t\t\t\t\t\t\t lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) + \t\t\t\t\t\t\t\t\t\t\t\t lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) + \t\t\t\t\t\t\t\t\t\t\t\t lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );\t\t\t\t}"
          })
      }
  }),
  d.UnrealBloomPass.BlurDirectionX = new d.Vector2(1,0),
  d.UnrealBloomPass.BlurDirectionY = new d.Vector2(0,1),
  a.exports = d.UnrealBloomPass,
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/FXAAShader", ["datav:/npm/three/0.97.0"], function(a, b, c) {
  var d = c("datav:/npm/three/0.97.0");
  return d.FXAAShader = {
      uniforms: {
          tDiffuse: {
              value: null
          },
          resolution: {
              value: new d.Vector2(1 / 1024,1 / 512)
          }
      },
      vertexShader: "void main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
      fragmentShader: "uniform sampler2D tDiffuse;\nuniform vec2 resolution;\n#define FXAA_REDUCE_MIN   (1.0/128.0)\n#define FXAA_REDUCE_MUL   (1.0/8.0)\n#define FXAA_SPAN_MAX     8.0\nvoid main() {\nvec3 rgbNW = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( -1.0, -1.0 ) ) * resolution ).xyz;\nvec3 rgbNE = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( 1.0, -1.0 ) ) * resolution ).xyz;\nvec3 rgbSW = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( -1.0, 1.0 ) ) * resolution ).xyz;\nvec3 rgbSE = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( 1.0, 1.0 ) ) * resolution ).xyz;\nvec4 rgbaM  = texture2D( tDiffuse,  gl_FragCoord.xy  * resolution );\nvec3 rgbM  = rgbaM.xyz;\nvec3 luma = vec3( 0.299, 0.587, 0.114 );\nfloat lumaNW = dot( rgbNW, luma );\nfloat lumaNE = dot( rgbNE, luma );\nfloat lumaSW = dot( rgbSW, luma );\nfloat lumaSE = dot( rgbSE, luma );\nfloat lumaM  = dot( rgbM,  luma );\nfloat lumaMin = min( lumaM, min( min( lumaNW, lumaNE ), min( lumaSW, lumaSE ) ) );\nfloat lumaMax = max( lumaM, max( max( lumaNW, lumaNE) , max( lumaSW, lumaSE ) ) );\nvec2 dir;\ndir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\ndir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\nfloat dirReduce = max( ( lumaNW + lumaNE + lumaSW + lumaSE ) * ( 0.25 * FXAA_REDUCE_MUL ), FXAA_REDUCE_MIN );\nfloat rcpDirMin = 1.0 / ( min( abs( dir.x ), abs( dir.y ) ) + dirReduce );\ndir = min( vec2( FXAA_SPAN_MAX,  FXAA_SPAN_MAX),\nmax( vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\ndir * rcpDirMin)) * resolution;\nvec4 rgbA = (1.0/2.0) * (\ntexture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (1.0/3.0 - 0.5)) +\ntexture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (2.0/3.0 - 0.5)));\nvec4 rgbB = rgbA * (1.0/2.0) + (1.0/4.0) * (\ntexture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (0.0/3.0 - 0.5)) +\ntexture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (3.0/3.0 - 0.5)));\nfloat lumaB = dot(rgbB, vec4(luma, 0.0));\nif ( ( lumaB < lumaMin ) || ( lumaB > lumaMax ) ) {\ngl_FragColor = rgbA;\n} else {\ngl_FragColor = rgbB;\n}\n}"
  },
  a.exports = d.FXAAShader,
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/SSAARenderPass.js", ["datav:/npm/three/0.97.0"], function(a, b, c) {
  var d = c("datav:/npm/three/0.97.0");
  return d.SSAARenderPass = function(a, b, c, e) {
      d.Pass.call(this),
      this.scene = a,
      this.camera = b,
      this.sampleLevel = 4,
      this.unbiased = !0,
      this.clearColor = void 0 === c ? 0 : c,
      this.clearAlpha = void 0 === e ? 0 : e,
      void 0 === d.CopyShader && console.error("THREE.SSAARenderPass relies on THREE.CopyShader");
      var f = d.CopyShader;
      this.copyUniforms = d.UniformsUtils.clone(f.uniforms),
      this.copyMaterial = new d.ShaderMaterial({
          uniforms: this.copyUniforms,
          vertexShader: f.vertexShader,
          fragmentShader: f.fragmentShader,
          premultipliedAlpha: !0,
          transparent: !0,
          blending: d.AdditiveBlending,
          depthTest: !1,
          depthWrite: !1
      }),
      this.camera2 = new d.OrthographicCamera(-1,1,1,-1,0,1),
      this.scene2 = new d.Scene,
      this.quad2 = new d.Mesh(new d.PlaneGeometry(2,2),this.copyMaterial),
      this.quad2.frustumCulled = !1,
      this.scene2.add(this.quad2)
  }
  ,
  d.SSAARenderPass.prototype = Object.assign(Object.create(d.Pass.prototype), {
      constructor: d.SSAARenderPass,
      dispose: function() {
          this.sampleRenderTarget && (this.sampleRenderTarget.dispose(),
          this.sampleRenderTarget = null),
          this.scene2.remove(this.quad2),
          this.scene2.remove(this.camera2),
          this.quad2.dispose && this.quad2.dispose(),
          this.camera2.dispose && this.camera2.dispose(),
          this.copyMaterial.dispose && this.copyMaterial.dispose(),
          this.quad2 = null,
          this.scene2 = null,
          this.camera2 = null
      },
      setSize: function(a, b) {
          this.sampleRenderTarget && this.sampleRenderTarget.setSize(a, b)
      },
      render: function(a, b, c) {
          this.sampleRenderTarget || (this.sampleRenderTarget = new d.WebGLRenderTarget(c.width,c.height,{
              minFilter: d.LinearFilter,
              magFilter: d.LinearFilter,
              format: d.RGBAFormat
          }));
          var e = d.SSAARenderPass.JitterVectors[Math.max(0, Math.min(this.sampleLevel, 5))]
            , f = a.autoClear;
          a.autoClear = !1;
          var g = a.getClearColor().getHex()
            , h = a.getClearAlpha()
            , j = 1 / e.length;
          this.copyUniforms.tDiffuse.value = this.sampleRenderTarget.texture;
          for (var k, l = c.width, m = c.height, n = 0; n < e.length; n++) {
              k = e[n],
              this.camera.setViewOffset && this.camera.setViewOffset(l, m, 0.0625 * k[0], 0.0625 * k[1], l, m);
              var i = j;
              if (this.unbiased) {
                  var o = -0.5 + (n + 0.5) / e.length;
                  i += 1 / 32 * o
              }
              this.copyUniforms.opacity.value = i,
              a.setClearColor(new d.Color(this.clearColor), this.clearAlpha),
              a.render(this.scene, this.camera, this.sampleRenderTarget, !0),
              0 === n && a.setClearColor(0, 0),
              a.render(this.scene2, this.camera2, this.renderToScreen ? null : b, 0 === n)
          }
          this.camera.clearViewOffset && this.camera.clearViewOffset(),
          a.autoClear = f,
          a.setClearColor(g, h)
      }
  }),
  d.SSAARenderPass.JitterVectors = [[[0, 0]], [[4, 4], [-4, -4]], [[-2, -6], [6, -2], [-6, 2], [2, 6]], [[1, -3], [-1, 3], [5, 1], [-3, -5], [-5, 5], [-7, -1], [3, 7], [7, -7]], [[1, 1], [-1, -3], [-3, 2], [4, -1], [-5, -2], [2, 5], [5, 3], [3, -5], [-2, 6], [0, -7], [-4, -6], [-6, 4], [-8, 0], [7, -4], [6, 7], [-7, -8]], [[-4, -7], [-7, -5], [-3, -5], [-5, -4], [-1, -4], [-2, -2], [-6, -1], [-4, 0], [-7, 1], [-1, 2], [-6, 3], [-3, 3], [-7, 6], [-3, 6], [-5, 7], [-1, 7], [5, -7], [1, -6], [6, -5], [4, -4], [2, -3], [7, -2], [1, -1], [4, -1], [2, 1], [6, 2], [0, 4], [4, 4], [2, 5], [7, 5], [5, 6], [3, 7]]],
  a.exports = d.SSAARenderPass,
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/FilmPass", ["datav:/npm/three/0.97.0"], function(a, b, c) {
  var d = c("datav:/npm/three/0.97.0");
  return c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/FileShader"),
  d.FilmPass = function(a, b, c, e) {
      d.Pass.call(this),
      void 0 === d.FilmShader && console.error("THREE.FilmPass relies on THREE.FilmShader");
      var f = d.FilmShader;
      this.uniforms = d.UniformsUtils.clone(f.uniforms),
      this.material = new d.ShaderMaterial({
          uniforms: this.uniforms,
          vertexShader: f.vertexShader,
          fragmentShader: f.fragmentShader
      }),
      void 0 !== e && (this.uniforms.grayscale.value = e),
      void 0 !== a && (this.uniforms.nIntensity.value = a),
      void 0 !== b && (this.uniforms.sIntensity.value = b),
      void 0 !== c && (this.uniforms.sCount.value = c),
      this.camera = new d.OrthographicCamera(-1,1,1,-1,0,1),
      this.scene = new d.Scene,
      this.quad = new d.Mesh(new d.PlaneBufferGeometry(2,2),null),
      this.quad.frustumCulled = !1,
      this.scene.add(this.quad)
  }
  ,
  d.FilmPass.prototype = Object.assign(Object.create(d.Pass.prototype), {
      constructor: d.FilmPass,
      render: function(a, b, c, d) {
          this.uniforms.tDiffuse.value = c.texture,
          this.uniforms.time.value += d,
          this.quad.material = this.material,
          this.renderToScreen ? a.render(this.scene, this.camera) : a.render(this.scene, this.camera, b, this.clear)
      }
  }),
  a.exports = d.FilmPass,
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/TAARenderPass", ["datav:/npm/three/0.97.0"], function(a, b, c) {
  var d = c("datav:/npm/three/0.97.0");
  return c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/SSAARenderPass.js"),
  d.TAARenderPass = function(a, b, c) {
      void 0 === d.SSAARenderPass && console.error("THREE.TAARenderPass relies on THREE.SSAARenderPass"),
      d.SSAARenderPass.call(this, a, b, c),
      this.sampleLevel = 0,
      this.accumulate = !1
  }
  ,
  d.TAARenderPass.JitterVectors = d.SSAARenderPass.JitterVectors,
  d.TAARenderPass.prototype = Object.assign(Object.create(d.SSAARenderPass.prototype), {
      constructor: d.TAARenderPass,
      render: function(a, b, c, e) {
          if (!this.accumulate)
              return d.SSAARenderPass.prototype.render.call(this, a, b, c, e),
              void (this.accumulateIndex = -1);
          var f = d.TAARenderPass.JitterVectors[5];
          this.sampleRenderTarget || (this.sampleRenderTarget = new d.WebGLRenderTarget(c.width,c.height,this.params)),
          this.holdRenderTarget || (this.holdRenderTarget = new d.WebGLRenderTarget(c.width,c.height,this.params)),
          this.accumulate && -1 === this.accumulateIndex && (d.SSAARenderPass.prototype.render.call(this, a, this.holdRenderTarget, c, e),
          this.accumulateIndex = 0);
          var g = a.autoClear;
          a.autoClear = !1;
          var h = 1 / f.length;
          if (0 <= this.accumulateIndex && this.accumulateIndex < f.length) {
              this.copyUniforms.opacity.value = h,
              this.copyUniforms.tDiffuse.value = b.texture;
              for (var k = Math.pow(2, this.sampleLevel), l = 0; l < k; l++) {
                  var i = this.accumulateIndex
                    , j = f[i];
                  if (this.camera.setViewOffset && this.camera.setViewOffset(c.width, c.height, 0.0625 * j[0], 0.0625 * j[1], c.width, c.height),
                  a.render(this.scene, this.camera, b, !0),
                  a.render(this.scene2, this.camera2, this.sampleRenderTarget, 0 === this.accumulateIndex),
                  this.accumulateIndex++,
                  this.accumulateIndex >= f.length)
                      break
              }
              this.camera.clearViewOffset && this.camera.clearViewOffset()
          }
          var m = this.accumulateIndex * h;
          0 < m && (this.copyUniforms.opacity.value = 1,
          this.copyUniforms.tDiffuse.value = this.sampleRenderTarget.texture,
          a.render(this.scene2, this.camera2, b, !0)),
          1 > m && (this.copyUniforms.opacity.value = 1 - m,
          this.copyUniforms.tDiffuse.value = this.holdRenderTarget.texture,
          a.render(this.scene2, this.camera2, b, 0 === m)),
          a.autoClear = g
      },
      dispose: function() {
          this.sampleLevel = 0,
          this.accumulate = !1,
          d.SSAARenderPass.prototype.dispose.call(this)
      }
  }),
  a.exports = d.TAARenderPass,
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/utils/projection.js", [], function(a) {
  var b = 3.141592653589793;
  return a.exports = {
      ll2sphere: function(a, b) {
          var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 200
            , d = (90 - b) * (Math.PI / 180)
            , e = (0 <= a ? a : 360 + a) * (Math.PI / 180)
            , f = c * Math.sin(d) * Math.sin(e)
            , g = c * Math.cos(d)
            , h = c * Math.sin(d) * Math.cos(e);
          return {
              x: f,
              y: g,
              z: h
          }
      },
      ll2plane: function(a, b) {
          var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 200
            , d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : 2;
          return {
              x: a * d,
              y: b * d,
              z: c
          }
      },
      sphere2ll: function(a, b, c) {
          var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : 200
            , e = Math.acos(b / d)
            , f = 90 - 180 * e / Math.PI;
          if (0 === Math.sin(e))
              return {
                  lat: 90,
                  lng: 0
              };
          var g = Math.atan2(a, c)
            , h = 180 * g / Math.PI
            , i = 180 < h ? h - 360 : h;
          return {
              lat: f,
              lng: i
          }
      },
      plane2ll: function(a, b, c) {
          var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : 2;
          return {
              lat: b / d,
              lng: a / d,
              z: c
          }
      }
  },
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/ShaderPass", ["datav:/npm/three/0.97.0"], function(a, b, c) {
  var d = c("datav:/npm/three/0.97.0");
  return d.ShaderPass = function(a, b) {
      d.Pass.call(this),
      this.textureID = void 0 === b ? "tDiffuse" : b,
      a instanceof d.ShaderMaterial ? (this.uniforms = a.uniforms,
      this.material = a) : a && (this.uniforms = d.UniformsUtils.clone(a.uniforms),
      this.material = new d.ShaderMaterial({
          defines: a.defines || {},
          uniforms: this.uniforms,
          vertexShader: a.vertexShader,
          fragmentShader: a.fragmentShader
      })),
      this.camera = new d.OrthographicCamera(-1,1,1,-1,0,1),
      this.scene = new d.Scene,
      this.quad = new d.Mesh(new d.PlaneBufferGeometry(2,2),null),
      this.quad.frustumCulled = !1,
      this.scene.add(this.quad)
  }
  ,
  d.ShaderPass.prototype = Object.assign(Object.create(d.Pass.prototype), {
      constructor: d.ShaderPass,
      render: function(a, b, c) {
          this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = c.texture),
          this.quad.material = this.material,
          this.renderToScreen ? a.render(this.scene, this.camera) : a.render(this.scene, this.camera, b, this.clear)
      },
      dispose: function() {
          this.scene.remove(this.quad),
          this.scene.remove(this.camera),
          this.quad.dispose && this.quad.dispose(),
          this.camera.dispose && this.camera.dispose(),
          this.material.dispose && this.material.dispose(),
          this.quad = null,
          this.scene = null,
          this.camera = null,
          this.material = null
      }
  }),
  a.exports = d.ShaderPass,
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/utils/common.js", [], function(a) {
  return a.exports = {
      easyDiff: function(c, a) {
          return c === a
      },
      easyObjDiff: function(a, b) {
          return Object.keys(b).every(function(c) {
              return a.hasOwnProperty(c) && a[c] === b[c]
          })
      },
      deepClone: function(a) {
          return JSON.parse(JSON.stringify(a))
      },
      isValuable: function(a) {
          return null !== a && void 0 !== a
      }
  },
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/EffectComposer", ["datav:/npm/three/0.97.0"], function(a, b, c) {
  var d = c("datav:/npm/three/0.97.0");
  return d.EffectComposer = function(a, b) {
      if (!a)
          return console.error("THREE.EffectComposer relies on THREE.WebGLRenderer");
      if (this.renderer = a,
      void 0 === b) {
          var c = {
              minFilter: d.LinearFilter,
              magFilter: d.LinearFilter,
              format: d.RGBAFormat,
              stencilBuffer: !1
          }
            , e = a.getSize();
          b = new d.WebGLRenderTarget(e.width,e.height,c)
      }
      this.renderTarget1 = b,
      this.renderTarget2 = b.clone(),
      this.writeBuffer = this.renderTarget1,
      this.readBuffer = this.renderTarget2,
      this.passes = {},
      void 0 === d.CopyShader && console.error("THREE.EffectComposer relies on THREE.CopyShader"),
      this.copyPass = new d.ShaderPass(d.CopyShader)
  }
  ,
  Object.assign(d.EffectComposer.prototype, {
      swapBuffers: function() {
          var a = this.readBuffer;
          this.readBuffer = this.writeBuffer,
          this.writeBuffer = a
      },
      addPass: function(a, b) {
          if (!this.passes[a]) {
              this.passes[a] = b;
              var c = this.renderer.getSize();
              b.setSize(c.width, c.height)
          }
      },
      render: function(a) {
          var b = !1;
          for (var c in this.passes) {
              var e = this.passes[c];
              if (!1 !== e.enabled) {
                  if (e.render(this.renderer, this.writeBuffer, this.readBuffer, a, b),
                  e.needsSwap) {
                      if (b) {
                          var f = this.renderer.context;
                          f.stencilFunc(f.NOTEQUAL, 1, 4294967295),
                          this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, a),
                          f.stencilFunc(f.EQUAL, 1, 4294967295)
                      }
                      this.swapBuffers()
                  }
                  void 0 !== d.MaskPass && (e instanceof d.MaskPass ? b = !0 : e instanceof d.ClearMaskPass && (b = !1))
              }
          }
      },
      reset: function(a) {
          if (void 0 === a) {
              var b = this.renderer.getSize();
              a = this.renderTarget1.clone(),
              a.setSize(b.width, b.height)
          }
          this.renderTarget1.dispose(),
          this.renderTarget2.dispose(),
          this.renderTarget1 = a,
          this.renderTarget2 = a.clone(),
          this.writeBuffer = this.renderTarget1,
          this.readBuffer = this.renderTarget2
      },
      setSize: function(a, b) {
          for (var c in this.renderTarget1.setSize(a, b),
          this.renderTarget2.setSize(a, b),
          this.passes) {
              var d = this.passes[c];
              d.setSize(a, b)
          }
      },
      remove: function(a) {
          if (this.passes[a]) {
              var b = this.passes[a];
              delete this.passes[a],
              b.dispose && b.dispose()
          }
      },
      getPass: function(a) {
          if (this.passes)
              return this.passes[a]
      },
      dispose: function() {
          for (var a in this.writeBuffer && this.writeBuffer.dispose && this.writeBuffer.dispose(),
          this.readBuffer && this.readBuffer.dispose && this.readBuffer.dispose(),
          this.writeBuffer = null,
          this.readBuffer = null,
          this.passes) {
              var b = this.passes[a];
              b.dispose && b.dispose()
          }
          this.passes = {}
      }
  }),
  d.Pass = function() {
      this.enabled = !0,
      this.needsSwap = !0,
      this.clear = !1,
      this.renderToScreen = !1
  }
  ,
  Object.assign(d.Pass.prototype, {
      setSize: function() {},
      render: function() {
          console.error("THREE.Pass: .render() must be implemented in derived pass.")
      },
      dispose: function() {}
  }),
  a.exports = d.EffectComposer,
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/utils", ["datav:/npm/tween.js/16.6.0", "datav:/npm/chroma-js/1.3.4", "datav:/npm/safely-merge/1.0.1"], function(a, b, c) {
  var d = c("datav:/npm/tween.js/16.6.0")
    , e = c("datav:/npm/chroma-js/1.3.4")
    , f = c("datav:/com/@double11-2017/map3d-earth/0.1.14/utils/common.js")
    , g = c("datav:/com/@double11-2017/map3d-earth/0.1.14/utils/projection.js")
    , h = c("datav:/npm/safely-merge/1.0.1");
  return a.exports = Object.assign({
      TWEEN: d,
      Chroma: e,
      mergeOptions: h
  }, g, f),
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/composer", ["datav:/npm/three/0.97.0", "datav:/npm/eventemitter3/2.0.3", "datav:/npm/safely-merge/1.0.1"], function(a, b, c) {
  function d(a, b) {
      if (!(a instanceof b))
          throw new TypeError("Cannot call a class as a function")
  }
  function e(a, b) {
      if (!a)
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return b && ("object" === typeof b || "function" === typeof b) ? b : a
  }
  function f(a, b) {
      if ("function" !== typeof b && null !== b)
          throw new TypeError("Super expression must either be null or a function, not " + typeof b);
      a.prototype = Object.create(b && b.prototype, {
          constructor: {
              value: a,
              enumerable: !1,
              writable: !0,
              configurable: !0
          }
      }),
      b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b)
  }
  var g = function() {
      function a(a, b) {
          for (var c, d = 0; d < b.length; d++)
              c = b[d],
              c.enumerable = c.enumerable || !1,
              c.configurable = !0,
              "value"in c && (c.writable = !0),
              Object.defineProperty(a, c.key, c)
      }
      return function(b, c, d) {
          return c && a(b.prototype, c),
          d && a(b, d),
          b
      }
  }()
    , h = c("datav:/npm/three/0.97.0")
    , i = c("datav:/npm/eventemitter3/2.0.3")
    , j = c("datav:/npm/safely-merge/1.0.1")
    , k = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/EffectComposer")
    , l = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/RenderPass")
    , m = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/CopyShader")
    , n = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/ShaderPass")
    , o = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/LuminosityHighPassShader")
    , p = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/UnrealBloomPass")
    , q = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/SMAAPass")
    , r = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/TAARenderPass")
    , s = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/FXAAShader")
    , t = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/MaskPass")
    , u = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/FilmPass")
    , v = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/OutlinePass")
    , w = c("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/SSAOShader")
    , x = {
      bloomThreshold: 0.8,
      bloomStrength: 1.8,
      bloomRadius: 0.3,
      antiAliasType: "NONE"
  }
    , y = function(a) {
      function b(a, c, f, g, h) {
          var i;
          d(this, b);
          var k = e(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this));
          return f && g && a && c ? (k.options = j(x, h || {}),
          k.scene = a,
          k.camera = c,
          k.renderer = f,
          k.container = g,
          k.init(),
          k) : (i = console.log("init composer failed"),
          e(k, i))
      }
      return f(b, a),
      g(b, [{
          key: "init",
          value: function() {
              var a = this.options
                , b = this.offsetWidth = this.container.offsetWidth
                , c = this.offsetHeight = this.container.offsetHeight
                , d = this.renderer.getClearColor()
                , e = this.renderer.getClearAlpha()
                , f = this.renderScene = new l(this.scene,this.camera,null,d,e);
              f.enabled = !1;
              var g = a.bloomRadius
                , i = a.bloomStrength
                , j = a.bloomThreshold
                , o = new h.Vector2(b,c)
                , q = this.bloomPass = new p(o,i,g,j)
                , r = new n(m);
              r.renderToScreen = !0;
              var s = this.composer = new k(this.renderer);
              s.setSize(b, c),
              s.addPass("renderScene", f),
              s.addPass("bloomPass", q),
              s.addPass("copyShader", r),
              this.addAntiAliasPass(),
              this.addSpecialEffectPass()
          }
      }, {
          key: "addAntiAliasPass",
          value: function() {
              var a = this.options.antiAliasType;
              switch (this.removeAntiAliasPass(),
              a) {
              case "SMAA":
                  {
                      var b = new q(this.offsetWidth,this.offsetHeight);
                      b.renderToScreen = !0,
                      this.composer.addPass("smaaRenderPass", b)
                  }
                  break;
              case "TAA":
                  {
                      var c = this.renderer.getClearColor().getHex()
                        , d = this.renderer.getClearAlpha()
                        , e = new r(this.scene,this.camera);
                      e.unbiased = !1,
                      e.sampleLevel = 4,
                      e.accumulate = !0,
                      e.accumulateIndex = -1,
                      e.renderToScreen = !1,
                      this.composer.addPass("taaRenderPass", e),
                      this.switchRenderScene(!1)
                  }
                  break;
              case "FXAA":
                  {
                      var f = new n(s)
                        , g = new h.Vector2(1 / this.offsetWidth,1 / this.offsetHeight);
                      f.uniforms.resolution.value = g,
                      this.composer.addPass("fxaaRenderPass", f)
                  }
                  break;
              default:
              }
          }
      }, {
          key: "addSpecialEffectPass",
          value: function() {}
      }, {
          key: "removeAntiAliasPass",
          value: function() {
              this.composer.remove("smaaRenderPass"),
              this.composer.remove("taaRenderPass"),
              this.composer.remove("fxaaRenderPass"),
              this.switchRenderScene(!0)
          }
      }, {
          key: "switchRenderScene",
          value: function(a) {
              this.renderScene && (this.renderScene.enabled = a)
          }
      }, {
          key: "renderToScreen",
          value: function(a) {
              a.renderToScreen = !0
          }
      }, {
          key: "removeFromScreen",
          value: function(a) {
              a.renderToScreen = !1
          }
      }, {
          key: "render",
          value: function() {
              this.composer && this.composer.render()
          }
      }, {
          key: "updateOptions",
          value: function(a) {
              this.options = j(this.options, a || {}),
              this.bloomPass && (this.bloomPass.radius = this.options.bloomRadius,
              this.bloomPass.strength = this.options.bloomStrength,
              this.bloomPass.threshold = this.options.bloomThreshold),
              this.addAntiAliasPass(),
              this.addSpecialEffectPass(),
              this.updateRenderPassClear()
          }
      }, {
          key: "updateRenderPassClear",
          value: function() {
              this.renderScene && this.renderScene.updateClear(this.options.clearColor, this.options.clearAlpha)
          }
      }, {
          key: "remove",
          value: function() {
              this.composer.dispose(),
              this.composer = null
          }
      }]),
      b
  }(i);
  return a.exports = y,
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/map", ["datav:/npm/three/0.97.0", "datav:/npm/eventemitter3/2.0.3", "datav:/npm/three-orbit-controls/82.1.0"], function(a, b, c) {
  function d(a, b) {
      if (!(a instanceof b))
          throw new TypeError("Cannot call a class as a function")
  }
  function e(a, b) {
      if (!a)
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return b && ("object" === typeof b || "function" === typeof b) ? b : a
  }
  function f(a, b) {
      if ("function" !== typeof b && null !== b)
          throw new TypeError("Super expression must either be null or a function, not " + typeof b);
      a.prototype = Object.create(b && b.prototype, {
          constructor: {
              value: a,
              enumerable: !1,
              writable: !0,
              configurable: !0
          }
      }),
      b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b)
  }
  var g = function() {
      function a(a, b) {
          for (var c, d = 0; d < b.length; d++)
              c = b[d],
              c.enumerable = c.enumerable || !1,
              c.configurable = !0,
              "value"in c && (c.writable = !0),
              Object.defineProperty(a, c.key, c)
      }
      return function(b, c, d) {
          return c && a(b.prototype, c),
          d && a(b, d),
          b
      }
  }()
    , h = c("datav:/npm/three/0.97.0")
    , i = c("datav:/com/@double11-2017/map3d-earth/0.1.14/utils")
    , j = c("datav:/npm/eventemitter3/2.0.3")
    , k = c("datav:/com/@double11-2017/map3d-earth/0.1.14/composer")
    , l = c("datav:/npm/three-orbit-controls/82.1.0")(h)
    , m = 4096
    , n = function(a) {
      return null === a || void 0 === a
  }
    , o = function(a) {
      function b(a, c) {
          d(this, b);
          var f = e(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this));
          return f.THREE = h,
          f.Utils = i,
          f.container = "string" === typeof a ? document.querySelector(a) : a,
          f.options = Object.assign({
              autoRotateSpeed: 1,
              projType: 0,
              isInteractive: !0,
              background: {
                  clearColor: "#102B42"
              },
              cameraPos: {
                  fov: 60,
                  lat: 30,
                  lng: 115,
                  distance: 400
              },
              renderMode: "normalMode",
              advancedModeOptions: {
                  antiAliasType: "NONE",
                  bloomThreshold: 0.7,
                  bloomRadius: 0.1,
                  bloomStrength: 0.8
              }
          }, c),
          f.container.style.pointerEvents = f.options.isInteractive ? "auto" : "none",
          f.composer = null,
          f.Projection = null,
          f.unProjection = null,
          f.projType = 0,
          f.init(),
          f.loop(),
          f
      }
      return f(b, a),
      g(b, [{
          key: "init",
          value: function() {
              var a = this.options
                , b = this.container
                , c = b.clientWidth
                , d = b.clientHeight
                , e = this.scene = new h.Scene
                , f = this.renderer = new h.WebGLRenderer({
                  canvas: document.createElementNS("http://www.w3.org/1999/xhtml", "canvas"),
                  alpha: !0,
                  antialias: !0,
                  preserveDrawingBuffer: !0
              });
              f.shadowMap.type = h.PCFSoftShadowMap,
              f.setSize(c, d),
              f.toneMapping = h.ReinhardToneMapping,
              f.toneMappingExposure = Math.pow(1.05, 4),
              f.gammaInput = !0,
              f.gammaOutput = !0,
              b.appendChild(f.domElement);
              var g = this.camera = new h.PerspectiveCamera(a.cameraPos.fov,c / d,0.1,1e8)
                , i = this.orbitControls = new l(g,b);
              i.maxDistance = 1e4,
              i.enableKeys = !1,
              this.setRotateSpeed(),
              this.updateProjection(),
              this.setComposer(),
              this.setCameraPos(),
              this.setClearColor(),
              this.setInteractive(),
              this.scaleX = 1,
              this.scaleY = 1,
              window.share.event && window.share.event.on("ratio-change", this.ratioChange.bind(this))
          }
      }, {
          key: "ratioChange",
          value: function(a) {
              this.scaleX = a.ratioX,
              this.scaleY = a.ratioY,
              this.resize(this.container.clientWidth, this.container.clientHeight)
          }
      }, {
          key: "getComposerOpts",
          value: function() {
              var a = this.options.advancedModeOptions;
              return {
                  bloomRadius: a.bloomRadius,
                  bloomStrength: a.bloomStrength,
                  antiAliasType: a.antiAliasType,
                  bloomThreshold: a.bloomThreshold,
                  clearColor: this.renderer.getClearColor(),
                  clearAlpha: this.renderer.getClearAlpha()
              }
          }
      }, {
          key: "setComposer",
          value: function() {
              var a = this.options;
              if ("advancedMode" === a.renderMode) {
                  this.composer && this.composer.remove();
                  var b = this.getComposerOpts();
                  this.composer = new k(this.scene,this.camera,this.renderer,this.container,b)
              }
          }
      }, {
          key: "ll2sphere",
          value: function(a, b) {
              var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 200
                , d = (90 - b) * (Math.PI / 180)
                , e = (a + 180) * (Math.PI / 180)
                , f = -(c * Math.sin(d) * Math.cos(e))
                , g = c * Math.sin(d) * Math.sin(e)
                , h = c * Math.cos(d);
              return {
                  x: f,
                  y: h,
                  z: g
              }
          }
      }, {
          key: "updateProjection",
          value: function() {
              var a = this.options.projType;
              0 === a ? (this.Projection = i.ll2sphere,
              this.unProjection = i.sphere2ll,
              this.projType = 0) : 1 === a ? (this.Projection = i.ll2plane,
              this.unProjection = i.plane2ll,
              this.projType = 1) : void 0
          }
      }, {
          key: "emitProjTrans",
          value: function() {
              var a = this
                , b = this.options
                , c = b.isProjTrans
                , d = b.projType
                , e = b.transDuration;
              0 === d ? this.setCameraPos() : 1 === d && this.setCameraLookAtOrigin(),
              c && (0 === e ? this.emit("projChanged", {
                  projType: d,
                  index: 1
              }) : this.createEaseFunc(0, 1, e, function(b) {
                  a.emit("projChanged", {
                      projType: d,
                      index: b
                  })
              }))
          }
      }, {
          key: "createEaseFunc",
          value: function(a, b, c, d) {
              new i.TWEEN.Tween({
                  value: a
              }).to({
                  value: b
              }, 1e3 * c).delay(0).onStart(function() {}).easing(i.TWEEN.Easing.Linear.None).onStart(function() {
                  d && d(0)
              }).onUpdate(function() {
                  d && d(this.value)
              }).onComplete(function() {
                  d && d(1),
                  i.TWEEN.remove()
              }).start()
          }
      }, {
          key: "resize",
          value: function(a, b) {
              this.renderer.setSize(a, b),
              (a > m || b > m) && (a > b ? (b = b / a * m,
              a = m) : (a = a / b * m,
              b = m)),
              this.renderer.setSize(a, b, !1),
              this.camera.aspect = a / b,
              this.camera.updateProjectionMatrix()
          }
      }, {
          key: "updateOptions",
          value: function(a) {
              var b = i.deepClone(this.options);
              this.options = i.mergeOptions(this.options, a || {}),
              i.easyDiff(b.projType, a.projType) || (this.updateProjection(),
              this.emitProjTrans()),
              i.easyDiff(b.isInteractive, a.isInteractive) || this.setInteractive(),
              i.easyObjDiff(b.background, a.background) || this.setClearColor(),
              i.easyObjDiff(b.cameraPos, a.cameraPos) || this.setCameraPos(),
              i.easyDiff(b.autoRotateSpeed, a.autoRotateSpeed) || this.setRotateSpeed(),
              i.easyDiff(b.renderMode, a.renderMode) && i.easyObjDiff(b.advancedModeOptions, a.advancedModeOptions) || this.updateComposer()
          }
      }, {
          key: "updateComposer",
          value: function() {
              var a = this.options.renderMode;
              if ("normalMode" === a)
                  this.composer && (this.composer.remove(),
                  this.composer = null);
              else if ("advancedMode" === a) {
                  this.composer || this.setComposer();
                  var b = this.getComposerOpts();
                  this.composer.updateOptions(b)
              }
          }
      }, {
          key: "setInteractive",
          value: function() {
              this.container.style.pointerEvents = this.options.isInteractive ? "auto" : "none"
          }
      }, {
          key: "setClearColor",
          value: function() {
              var a = this.options.background.clearColor
                , b = i.Chroma(a).rgba()
                , c = void 0 === b[3] ? 1 : b[3];
              this.renderer.setClearColor(new h.Color(a), c)
          }
      }, {
          key: "setRotateSpeed",
          value: function() {
              var a = this.options.autoRotateSpeed;
              this.orbitControls.autoRotate = !0,
              this.orbitControls.autoRotateSpeed = a
          }
      }, {
          key: "getContainerCoord",
          value: function(a, b) {
              if (!(n(b) || n(a))) {
                  var c = this.Projection(a, b)
                    , d = new h.Vector3(c.x,c.y,c.z)
                    , e = d.project(this.camera)
                    , f = this.renderer.getSize();
                  return [(e.x + 1) / 2 * f.width, -(e.y - 1) / 2 * f.height]
              }
          }
      }, {
          key: "setCameraPos",
          value: function() {
              var a = this.options.cameraPos
                , b = this.Projection(a.lng, a.lat)
                , c = new h.Vector3(b.x,b.y,b.z)
                , d = c.distanceTo(new h.Vector3(0,0,0))
                , e = c.clone().multiplyScalar(a.distance / d);
              this.orbitControls.object.fov = a.fov,
              this.orbitControls.object.position.set(e.x, e.y, e.z),
              this.orbitControls.target.set(0, 0, 0),
              this.orbitControls.object.updateProjectionMatrix()
          }
      }, {
          key: "setCameraLookAtOrigin",
          value: function() {
              var a = this.options.cameraPos
                , b = a.distance
                , c = a.fov
                , d = this.Projection(0, 0)
                , e = new h.Vector3(d.x,d.y,d.z)
                , f = e.distanceTo(new h.Vector3(0,0,0))
                , g = e.clone().multiplyScalar(b / f);
              this.orbitControls.object.fov = c,
              this.orbitControls.object.position.set(g.x, g.y, g.z),
              this.orbitControls.target.set(0, 0, 0),
              this.orbitControls.object.updateProjectionMatrix()
          }
      }, {
          key: "render",
          value: function() {
              var a = this.options.renderMode;
              "normalMode" === a ? this.renderer.render(this.scene, this.camera) : "advancedMode" === a && this.composer && this.composer.render()
          }
      }, {
          key: "loop",
          value: function() {
              this.orbitControls.update(),
              this.render(),
              this.emit("animationFrame"),
              i.TWEEN && i.TWEEN.update(),
              window.requestAnimationFrame(this.loop.bind(this))
          }
      }]),
      b
  }(j);
  return a.exports = o,
  a.exports
});
;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14", ["datav:/npm/eventemitter3/2.0.3", "datav:/npm/safely-merge/1.0.1"], function(a, b, c) {
  function d(a, b) {
      if (!(a instanceof b))
          throw new TypeError("Cannot call a class as a function")
  }
  function e(a, b) {
      if (!a)
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return b && ("object" === typeof b || "function" === typeof b) ? b : a
  }
  function f(a, b) {
      if ("function" !== typeof b && null !== b)
          throw new TypeError("Super expression must either be null or a function, not " + typeof b);
      a.prototype = Object.create(b && b.prototype, {
          constructor: {
              value: a,
              enumerable: !1,
              writable: !0,
              configurable: !0
          }
      }),
      b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b)
  }
  var g = function() {
      function a(a, b) {
          for (var c, d = 0; d < b.length; d++)
              c = b[d],
              c.enumerable = c.enumerable || !1,
              c.configurable = !0,
              "value"in c && (c.writable = !0),
              Object.defineProperty(a, c.key, c)
      }
      return function(b, c, d) {
          return c && a(b.prototype, c),
          d && a(b, d),
          b
      }
  }()
    , h = c("datav:/com/@double11-2017/map3d-earth/0.1.14/map")
    , i = c("datav:/npm/eventemitter3/2.0.3")
    , j = c("datav:/npm/safely-merge/1.0.1")
    , k = {
      autoRotateSpeed: 1,
      isInteractive: !0,
      background: {
          clearColor: "#102B42",
          clearAlpha: 0.9
      },
      cameraPos: {
          fov: 60,
          lat: 30,
          lng: 115,
          distance: 400
      },
      renderMode: "normalMode",
      advancedModeOptions: {
          antiAliasType: "NONE",
          bloomThreshold: 0.7,
          bloomRadius: 0.1,
          bloomStrength: 0.8
      }
  }
    , l = function(a) {
      function b(a, c) {
          d(this, b);
          var f = e(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this));
          return f.container = a,
          f.apis = c.apis,
          f.options = j(k, c),
          f.init(),
          f.subcoms = {},
          f
      }
      return f(b, a),
      g(b, [{
          key: "init",
          value: function() {
              this.options;
              this.threeMap = new h(this.container,this.options)
          }
      }, {
          key: "get",
          value: function(a) {
              return this.subcoms[a]
          }
      }, {
          key: "add",
          value: function(a, b) {
              return a ? void (a.addTo && a.addTo(this.threeMap),
              this.subcoms[b] = a) : console.log("layer \u6CA1\u6709\u5B9A\u4E49")
          }
      }, {
          key: "remove",
          value: function(a, b) {
              a.remove && a.remove(),
              delete this.subcoms[b]
          }
      }, {
          key: "resize",
          value: function(a, b) {
              this.threeMap.resize(a, b)
          }
      }, {
          key: "updateOptions",
          value: function(a) {
              a && (this.options = j(this.options, a)),
              this.threeMap.updateOptions(this.options)
          }
      }]),
      b
  }(i);
  return a.exports = l,
  a.exports
});
