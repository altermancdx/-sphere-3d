const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/TAARenderPass",["datav:/npm/three/0.97.0"],function(a,b,c){var d=require("three");return require("map3d-earth/libs/effectLib/SSAARenderPass.js"),d.TAARenderPass=function(a,b,c){void 0===d.SSAARenderPass&&console.error("THREE.TAARenderPass relies on THREE.SSAARenderPass"),d.SSAARenderPass.call(this,a,b,c),this.sampleLevel=0,this.accumulate=!1},d.TAARenderPass.JitterVectors=d.SSAARenderPass.JitterVectors,d.TAARenderPass.prototype=Object.assign(Object.create(d.SSAARenderPass.prototype),{constructor:d.TAARenderPass,render:function(a,b,c,e){if(!this.accumulate)return d.SSAARenderPass.prototype.render.call(this,a,b,c,e),void(this.accumulateIndex=-1);var f=d.TAARenderPass.JitterVectors[5];this.sampleRenderTarget||(this.sampleRenderTarget=new d.WebGLRenderTarget(c.width,c.height,this.params)),this.holdRenderTarget||(this.holdRenderTarget=new d.WebGLRenderTarget(c.width,c.height,this.params)),this.accumulate&&-1===this.accumulateIndex&&(d.SSAARenderPass.prototype.render.call(this,a,this.holdRenderTarget,c,e),this.accumulateIndex=0);var g=a.autoClear;a.autoClear=!1;var h=1/f.length;if(0<=this.accumulateIndex&&this.accumulateIndex<f.length){this.copyUniforms.opacity.value=h,this.copyUniforms.tDiffuse.value=b.texture;for(var k=Math.pow(2,this.sampleLevel),l=0;l<k;l++){var i=this.accumulateIndex,j=f[i];if(this.camera.setViewOffset&&this.camera.setViewOffset(c.width,c.height,0.0625*j[0],0.0625*j[1],c.width,c.height),a.render(this.scene,this.camera,b,!0),a.render(this.scene2,this.camera2,this.sampleRenderTarget,0===this.accumulateIndex),this.accumulateIndex++,this.accumulateIndex>=f.length)break}this.camera.clearViewOffset&&this.camera.clearViewOffset()}var m=this.accumulateIndex*h;0<m&&(this.copyUniforms.opacity.value=1,this.copyUniforms.tDiffuse.value=this.sampleRenderTarget.texture,a.render(this.scene2,this.camera2,b,!0)),1>m&&(this.copyUniforms.opacity.value=1-m,this.copyUniforms.tDiffuse.value=this.holdRenderTarget.texture,a.render(this.scene2,this.camera2,b,0===m)),a.autoClear=g},dispose:function(){this.sampleLevel=0,this.accumulate=!1,d.SSAARenderPass.prototype.dispose.call(this)}}),a.exports=d.TAARenderPass,a.exports});;