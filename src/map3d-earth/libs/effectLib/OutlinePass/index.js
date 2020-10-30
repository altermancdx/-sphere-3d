const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/OutlinePass",["datav:/npm/three/0.97.0"],function(a,b,c){var d=require("three");return d.OutlinePass=function(a,b,c,e){this.renderScene=b,this.renderCamera=c,this.selectedObjects=void 0===e?[]:e,this.visibleEdgeColor=new d.Color(1,1,1),this.hiddenEdgeColor=new d.Color(0.1,0.04,0.02),this.edgeGlow=0,this.usePatternTexture=!1,this.edgeThickness=1,this.edgeStrength=3,this.downSampleRatio=2,this.pulsePeriod=0,d.Pass.call(this),this.resolution=void 0===a?new d.Vector2(256,256):new d.Vector2(a.x,a.y);var f={minFilter:d.LinearFilter,magFilter:d.LinearFilter,format:d.RGBAFormat},g=Math.round(this.resolution.x/this.downSampleRatio),h=Math.round(this.resolution.y/this.downSampleRatio);this.maskBufferMaterial=new d.MeshBasicMaterial({color:16777215}),this.maskBufferMaterial.side=d.DoubleSide,this.renderTargetMaskBuffer=new d.WebGLRenderTarget(this.resolution.x,this.resolution.y,f),this.renderTargetMaskBuffer.texture.name="OutlinePass.mask",this.renderTargetMaskBuffer.texture.generateMipmaps=!1,this.depthMaterial=new d.MeshDepthMaterial,this.depthMaterial.side=d.DoubleSide,this.depthMaterial.depthPacking=d.RGBADepthPacking,this.depthMaterial.blending=d.NoBlending,this.prepareMaskMaterial=this.getPrepareMaskMaterial(),this.prepareMaskMaterial.side=d.DoubleSide,this.renderTargetDepthBuffer=new d.WebGLRenderTarget(this.resolution.x,this.resolution.y,f),this.renderTargetDepthBuffer.texture.name="OutlinePass.depth",this.renderTargetDepthBuffer.texture.generateMipmaps=!1,this.renderTargetMaskDownSampleBuffer=new d.WebGLRenderTarget(g,h,f),this.renderTargetMaskDownSampleBuffer.texture.name="OutlinePass.depthDownSample",this.renderTargetMaskDownSampleBuffer.texture.generateMipmaps=!1,this.renderTargetBlurBuffer1=new d.WebGLRenderTarget(g,h,f),this.renderTargetBlurBuffer1.texture.name="OutlinePass.blur1",this.renderTargetBlurBuffer1.texture.generateMipmaps=!1,this.renderTargetBlurBuffer2=new d.WebGLRenderTarget(Math.round(g/2),Math.round(h/2),f),this.renderTargetBlurBuffer2.texture.name="OutlinePass.blur2",this.renderTargetBlurBuffer2.texture.generateMipmaps=!1,this.edgeDetectionMaterial=this.getEdgeDetectionMaterial(),this.renderTargetEdgeBuffer1=new d.WebGLRenderTarget(g,h,f),this.renderTargetEdgeBuffer1.texture.name="OutlinePass.edge1",this.renderTargetEdgeBuffer1.texture.generateMipmaps=!1,this.renderTargetEdgeBuffer2=new d.WebGLRenderTarget(Math.round(g/2),Math.round(h/2),f),this.renderTargetEdgeBuffer2.texture.name="OutlinePass.edge2",this.renderTargetEdgeBuffer2.texture.generateMipmaps=!1;var i=4;this.separableBlurMaterial1=this.getSeperableBlurMaterial(4),this.separableBlurMaterial1.uniforms.texSize.value=new d.Vector2(g,h),this.separableBlurMaterial1.uniforms.kernelRadius.value=1,this.separableBlurMaterial2=this.getSeperableBlurMaterial(i),this.separableBlurMaterial2.uniforms.texSize.value=new d.Vector2(Math.round(g/2),Math.round(h/2)),this.separableBlurMaterial2.uniforms.kernelRadius.value=i,this.overlayMaterial=this.getOverlayMaterial(),void 0===d.CopyShader&&console.error("THREE.OutlinePass relies on THREE.CopyShader");var j=d.CopyShader;this.copyUniforms=d.UniformsUtils.clone(j.uniforms),this.copyUniforms.opacity.value=1,this.materialCopy=new d.ShaderMaterial({uniforms:this.copyUniforms,vertexShader:j.vertexShader,fragmentShader:j.fragmentShader,blending:d.NoBlending,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this.oldClearColor=new d.Color,this.oldClearAlpha=1,this.camera=new d.OrthographicCamera(-1,1,1,-1,0,1),this.scene=new d.Scene,this.quad=new d.Mesh(new d.PlaneBufferGeometry(2,2),null),this.quad.frustumCulled=!1,this.scene.add(this.quad),this.tempPulseColor1=new d.Color,this.tempPulseColor2=new d.Color,this.textureMatrix=new d.Matrix4},d.OutlinePass.prototype=Object.assign(Object.create(d.Pass.prototype),{constructor:d.OutlinePass,dispose:function(){this.renderTargetMaskBuffer.dispose(),this.renderTargetDepthBuffer.dispose(),this.renderTargetMaskDownSampleBuffer.dispose(),this.renderTargetBlurBuffer1.dispose(),this.renderTargetBlurBuffer2.dispose(),this.renderTargetEdgeBuffer1.dispose(),this.renderTargetEdgeBuffer2.dispose()},setSize:function(a,b){this.renderTargetMaskBuffer.setSize(a,b);var c=Math.round(a/this.downSampleRatio),e=Math.round(b/this.downSampleRatio);this.renderTargetMaskDownSampleBuffer.setSize(c,e),this.renderTargetBlurBuffer1.setSize(c,e),this.renderTargetEdgeBuffer1.setSize(c,e),this.separableBlurMaterial1.uniforms.texSize.value=new d.Vector2(c,e),c=Math.round(c/2),e=Math.round(e/2),this.renderTargetBlurBuffer2.setSize(c,e),this.renderTargetEdgeBuffer2.setSize(c,e),this.separableBlurMaterial2.uniforms.texSize.value=new d.Vector2(c,e)},changeVisibilityOfSelectedObjects:function(a){function b(b){b instanceof d.Mesh&&(b.visible=a)}for(var c,e=0;e<this.selectedObjects.length;e++)c=this.selectedObjects[e],c.traverse(b)},changeVisibilityOfNonSelectedObjects:function(a){function b(a){a instanceof d.Mesh&&e.push(a)}for(var c,e=[],f=0;f<this.selectedObjects.length;f++)c=this.selectedObjects[f],c.traverse(b);this.renderScene.traverse(function(b){if(b instanceof d.Mesh){for(var c,f=!1,g=0;g<e.length;g++)if(c=e[g].id,c===b.id){f=!0;break}if(!f){var h=b.visible;(!a||b.bVisible)&&(b.visible=a),b.bVisible=h}}})},updateTextureMatrix:function(){this.textureMatrix.set(0.5,0,0,0.5,0,0.5,0,0.5,0,0,0.5,0.5,0,0,0,1),this.textureMatrix.multiply(this.renderCamera.projectionMatrix),this.textureMatrix.multiply(this.renderCamera.matrixWorldInverse)},render:function(a,b,c,e,f){if(0!==this.selectedObjects.length){this.oldClearColor.copy(a.getClearColor()),this.oldClearAlpha=a.getClearAlpha();var g=a.autoClear;if(a.autoClear=!1,f&&a.context.disable(a.context.STENCIL_TEST),a.setClearColor(16777215,1),this.changeVisibilityOfSelectedObjects(!1),this.renderScene.overrideMaterial=this.depthMaterial,a.render(this.renderScene,this.renderCamera,this.renderTargetDepthBuffer,!0),this.changeVisibilityOfSelectedObjects(!0),this.updateTextureMatrix(),this.changeVisibilityOfNonSelectedObjects(!1),this.renderScene.overrideMaterial=this.prepareMaskMaterial,this.prepareMaskMaterial.uniforms.cameraNearFar.value=new d.Vector2(this.renderCamera.near,this.renderCamera.far),this.prepareMaskMaterial.uniforms.depthTexture.value=this.renderTargetDepthBuffer.texture,this.prepareMaskMaterial.uniforms.textureMatrix.value=this.textureMatrix,a.render(this.renderScene,this.renderCamera,this.renderTargetMaskBuffer,!0),this.renderScene.overrideMaterial=null,this.changeVisibilityOfNonSelectedObjects(!0),this.quad.material=this.materialCopy,this.copyUniforms.tDiffuse.value=this.renderTargetMaskBuffer.texture,a.render(this.scene,this.camera,this.renderTargetMaskDownSampleBuffer,!0),this.tempPulseColor1.copy(this.visibleEdgeColor),this.tempPulseColor2.copy(this.hiddenEdgeColor),0<this.pulsePeriod){var h=(1+0.25)/2+Math.cos(0.01*performance.now()/this.pulsePeriod)*(1-0.25)/2;this.tempPulseColor1.multiplyScalar(h),this.tempPulseColor2.multiplyScalar(h)}this.quad.material=this.edgeDetectionMaterial,this.edgeDetectionMaterial.uniforms.maskTexture.value=this.renderTargetMaskDownSampleBuffer.texture,this.edgeDetectionMaterial.uniforms.texSize.value=new d.Vector2(this.renderTargetMaskDownSampleBuffer.width,this.renderTargetMaskDownSampleBuffer.height),this.edgeDetectionMaterial.uniforms.visibleEdgeColor.value=this.tempPulseColor1,this.edgeDetectionMaterial.uniforms.hiddenEdgeColor.value=this.tempPulseColor2,a.render(this.scene,this.camera,this.renderTargetEdgeBuffer1,!0),this.quad.material=this.separableBlurMaterial1,this.separableBlurMaterial1.uniforms.colorTexture.value=this.renderTargetEdgeBuffer1.texture,this.separableBlurMaterial1.uniforms.direction.value=d.OutlinePass.BlurDirectionX,this.separableBlurMaterial1.uniforms.kernelRadius.value=this.edgeThickness,a.render(this.scene,this.camera,this.renderTargetBlurBuffer1,!0),this.separableBlurMaterial1.uniforms.colorTexture.value=this.renderTargetBlurBuffer1.texture,this.separableBlurMaterial1.uniforms.direction.value=d.OutlinePass.BlurDirectionY,a.render(this.scene,this.camera,this.renderTargetEdgeBuffer1,!0),this.quad.material=this.separableBlurMaterial2,this.separableBlurMaterial2.uniforms.colorTexture.value=this.renderTargetEdgeBuffer1.texture,this.separableBlurMaterial2.uniforms.direction.value=d.OutlinePass.BlurDirectionX,a.render(this.scene,this.camera,this.renderTargetBlurBuffer2,!0),this.separableBlurMaterial2.uniforms.colorTexture.value=this.renderTargetBlurBuffer2.texture,this.separableBlurMaterial2.uniforms.direction.value=d.OutlinePass.BlurDirectionY,a.render(this.scene,this.camera,this.renderTargetEdgeBuffer2,!0),this.quad.material=this.overlayMaterial,this.overlayMaterial.uniforms.maskTexture.value=this.renderTargetMaskBuffer.texture,this.overlayMaterial.uniforms.edgeTexture1.value=this.renderTargetEdgeBuffer1.texture,this.overlayMaterial.uniforms.edgeTexture2.value=this.renderTargetEdgeBuffer2.texture,this.overlayMaterial.uniforms.patternTexture.value=this.patternTexture,this.overlayMaterial.uniforms.edgeStrength.value=this.edgeStrength,this.overlayMaterial.uniforms.edgeGlow.value=this.edgeGlow,this.overlayMaterial.uniforms.usePatternTexture.value=this.usePatternTexture,f&&a.context.enable(a.context.STENCIL_TEST),a.render(this.scene,this.camera,c,!1),a.setClearColor(this.oldClearColor,this.oldClearAlpha),a.autoClear=g}},getPrepareMaskMaterial:function(){return new d.ShaderMaterial({uniforms:{depthTexture:{value:null},cameraNearFar:{value:new d.Vector2(0.5,0.5)},textureMatrix:{value:new d.Matrix4}},vertexShader:"varying vec2 vUv;\t\t\t\tvarying vec4 projTexCoord;\t\t\t\tvarying vec4 vPosition;\t\t\t\tuniform mat4 textureMatrix;\t\t\t\tvoid main() {\t\t\t\t\tvUv = uv;\t\t\t\t\tvPosition = modelViewMatrix * vec4( position, 1.0 );\t\t\t\t\tvec4 worldPosition = modelMatrix * vec4( position, 1.0 );\t\t\t\t\tprojTexCoord = textureMatrix * worldPosition;\t\t\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t\t\t}",fragmentShader:"#include <packing>\t\t\t\tvarying vec2 vUv;\t\t\t\tvarying vec4 vPosition;\t\t\t\tvarying vec4 projTexCoord;\t\t\t\tuniform sampler2D depthTexture;\t\t\t\tuniform vec2 cameraNearFar;\t\t\t\t\t\t\t\tvoid main() {\t\t\t\t\tfloat depth = unpackRGBAToDepth(texture2DProj( depthTexture, projTexCoord ));\t\t\t\t\tfloat viewZ = -perspectiveDepthToViewZ( depth, cameraNearFar.x, cameraNearFar.y );\t\t\t\t\tfloat depthTest = (-vPosition.z > viewZ) ? 1.0 : 0.0;\t\t\t\t\tgl_FragColor = vec4(0.0, depthTest, 1.0, 1.0);\t\t\t\t}"})},getEdgeDetectionMaterial:function(){return new d.ShaderMaterial({uniforms:{maskTexture:{value:null},texSize:{value:new d.Vector2(0.5,0.5)},visibleEdgeColor:{value:new d.Vector3(1,1,1)},hiddenEdgeColor:{value:new d.Vector3(1,1,1)}},vertexShader:"varying vec2 vUv;\n\t\t\t\tvoid main() {\n\t\t\t\t\tvUv = uv;\n\t\t\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t\t\t}",fragmentShader:"varying vec2 vUv;\t\t\t\tuniform sampler2D maskTexture;\t\t\t\tuniform vec2 texSize;\t\t\t\tuniform vec3 visibleEdgeColor;\t\t\t\tuniform vec3 hiddenEdgeColor;\t\t\t\t\t\t\t\tvoid main() {\n\t\t\t\t\tvec2 invSize = 1.0 / texSize;\t\t\t\t\tvec4 uvOffset = vec4(1.0, 0.0, 0.0, 1.0) * vec4(invSize, invSize);\t\t\t\t\tvec4 c1 = texture2D( maskTexture, vUv + uvOffset.xy);\t\t\t\t\tvec4 c2 = texture2D( maskTexture, vUv - uvOffset.xy);\t\t\t\t\tvec4 c3 = texture2D( maskTexture, vUv + uvOffset.yw);\t\t\t\t\tvec4 c4 = texture2D( maskTexture, vUv - uvOffset.yw);\t\t\t\t\tfloat diff1 = (c1.r - c2.r)*0.5;\t\t\t\t\tfloat diff2 = (c3.r - c4.r)*0.5;\t\t\t\t\tfloat d = length( vec2(diff1, diff2) );\t\t\t\t\tfloat a1 = min(c1.g, c2.g);\t\t\t\t\tfloat a2 = min(c3.g, c4.g);\t\t\t\t\tfloat visibilityFactor = min(a1, a2);\t\t\t\t\tvec3 edgeColor = 1.0 - visibilityFactor > 0.001 ? visibleEdgeColor : hiddenEdgeColor;\t\t\t\t\tgl_FragColor = vec4(edgeColor, 1.0) * vec4(d);\t\t\t\t}"})},getSeperableBlurMaterial:function(a){return new d.ShaderMaterial({defines:{MAX_RADIUS:a},uniforms:{colorTexture:{value:null},texSize:{value:new d.Vector2(0.5,0.5)},direction:{value:new d.Vector2(0.5,0.5)},kernelRadius:{value:1}},vertexShader:"varying vec2 vUv;\n\t\t\t\tvoid main() {\n\t\t\t\t\tvUv = uv;\n\t\t\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t\t\t}",fragmentShader:"#include <common>\t\t\t\tvarying vec2 vUv;\t\t\t\tuniform sampler2D colorTexture;\t\t\t\tuniform vec2 texSize;\t\t\t\tuniform vec2 direction;\t\t\t\tuniform float kernelRadius;\t\t\t\t\t\t\t\tfloat gaussianPdf(in float x, in float sigma) {\t\t\t\t\treturn 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;\t\t\t\t}\t\t\t\tvoid main() {\t\t\t\t\tvec2 invSize = 1.0 / texSize;\t\t\t\t\tfloat weightSum = gaussianPdf(0.0, kernelRadius);\t\t\t\t\tvec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;\t\t\t\t\tvec2 delta = direction * invSize * kernelRadius/float(MAX_RADIUS);\t\t\t\t\tvec2 uvOffset = delta;\t\t\t\t\tfor( int i = 1; i <= MAX_RADIUS; i ++ ) {\t\t\t\t\t\tfloat w = gaussianPdf(uvOffset.x, kernelRadius);\t\t\t\t\t\tvec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;\t\t\t\t\t\tvec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;\t\t\t\t\t\tdiffuseSum += ((sample1 + sample2) * w);\t\t\t\t\t\tweightSum += (2.0 * w);\t\t\t\t\t\tuvOffset += delta;\t\t\t\t\t}\t\t\t\t\tgl_FragColor = vec4(diffuseSum/weightSum, 1.0);\t\t\t\t}"})},getOverlayMaterial:function(){return new d.ShaderMaterial({uniforms:{maskTexture:{value:null},edgeTexture1:{value:null},edgeTexture2:{value:null},patternTexture:{value:null},edgeStrength:{value:1},edgeGlow:{value:1},usePatternTexture:{value:0}},vertexShader:"varying vec2 vUv;\n\t\t\t\tvoid main() {\n\t\t\t\t\tvUv = uv;\n\t\t\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t\t\t}",fragmentShader:"varying vec2 vUv;\t\t\t\tuniform sampler2D maskTexture;\t\t\t\tuniform sampler2D edgeTexture1;\t\t\t\tuniform sampler2D edgeTexture2;\t\t\t\tuniform sampler2D patternTexture;\t\t\t\tuniform float edgeStrength;\t\t\t\tuniform float edgeGlow;\t\t\t\tuniform bool usePatternTexture;\t\t\t\t\t\t\t\tvoid main() {\t\t\t\t\tvec4 edgeValue1 = texture2D(edgeTexture1, vUv);\t\t\t\t\tvec4 edgeValue2 = texture2D(edgeTexture2, vUv);\t\t\t\t\tvec4 maskColor = texture2D(maskTexture, vUv);\t\t\t\t\tvec4 patternColor = texture2D(patternTexture, 6.0 * vUv);\t\t\t\t\tfloat visibilityFactor = 1.0 - maskColor.g > 0.0 ? 1.0 : 0.5;\t\t\t\t\tvec4 edgeValue = edgeValue1 + edgeValue2 * edgeGlow;\t\t\t\t\tvec4 finalColor = edgeStrength * maskColor.r * edgeValue;\t\t\t\t\tif(usePatternTexture)\t\t\t\t\t\tfinalColor += + visibilityFactor * (1.0 - maskColor.r) * (1.0 - patternColor.r);\t\t\t\t\tgl_FragColor = finalColor;\t\t\t\t}",blending:d.AdditiveBlending,depthTest:!1,depthWrite:!1,transparent:!0})}}),d.OutlinePass.BlurDirectionX=new d.Vector2(1,0),d.OutlinePass.BlurDirectionY=new d.Vector2(0,1),a.exports=d.OutlinePass,a.exports});;
