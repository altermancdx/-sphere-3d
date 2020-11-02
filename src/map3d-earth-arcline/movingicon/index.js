const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/map3d-earth-arcline/0.0.11/movingicon",["datav:/npm/eventemitter3/2.0.3"],function(a,b,c){let d=null,e=null;const f=require("eventemitter3");return a.exports=class extends f{constructor(a){super(),this.options=Object.assign({height:10,size:15,speed:0.01,maxOpacity:1,mapUrl:"https://img.alicdn.com/tfs/TB14LWbkER1BeNjy0FmXXb0wVXa-20-10.png"},a||{}),this.movingIconSet=[],this.movingFlag=0}addTo(a){return a?void(d=a.THREE,e=a.Utils,this.map=a,this.scene=a.scene,this.init()):console.log("MovingIcon layer needs map layer")}animation(){this.data&&this.material&&(this.material.uniforms.u_position.value=this.data.getPoint(this.movingFlag),this.movingFlag+=this.options.speed,this.movingFlag=1<this.movingFlag?0:this.movingFlag)}setData(a,b){if(a){this.data=null,this._data=null,this._data=a,0===b?this.data=a.sphere:1===b&&(this.data=a.plane);let c=this.setDirection();this.material&&(this.material.uniforms.u_direction.value=c),this.movingicon&&!this.movingicon.visible&&this.show()}}setDataType(a){this._data&&(0===a?this.data=this._data.sphere:1===a&&(this.data=this._data.plane))}setDirection(){let a=this.data.getPoint(0),b=this.data.getPoint(1);return 0<(a.x1-b.x2)*(a.y1-b.y2)?1:-1}init(){this.material=this.initMaterial(),this.geometry=this.initGeometry(),this.movingicon=new d.Points(this.geometry,this.material),this.scene.add(this.movingicon),this.hide()}show(){this.movingicon&&(this.movingicon.visible=!0)}hide(){this.movingicon&&(this.movingicon.visible=!1)}initMaterial(){const a=this.options;let b={u_size:{value:a.size},u_height:{value:a.height},u_maxOpacity:{value:a.maxOpacity},u_animFlag:{value:a.speed},u_length:{value:a.length},u_texture:{value:this.getTextureMap()},u_position:{value:new d.Vector3},u_direction:{value:1}};return this.material=new d.ShaderMaterial({uniforms:b,vertexShader:`
      uniform float u_size;
      uniform float u_height;
      uniform vec3 u_position;
      
      void main() {
        gl_PointSize = u_size;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(u_position, 1.);
      }
      `,fragmentShader:`
      uniform float u_maxOpacity;
      uniform float u_direction;
      uniform sampler2D u_texture;

      void main() {
        vec2 pos;
        if(u_direction == -1.) {
          pos = vec2(gl_PointCoord.x, 1. - gl_PointCoord.y);
        } else {
          pos = 1. - gl_PointCoord.xy;
        }
        gl_FragColor = texture2D(u_texture, pos) * u_maxOpacity;
      }
      `,blending:d.NormalBlending,depthTest:!0,depthWrite:!1,transparent:!0}),this.material.needsUpdate=!0,this.material.extensions.derivatives=!0,this.material}getTextureMap(){return new d.TextureLoader().setCrossOrigin("anonymous").load(this.options.mapUrl)}initGeometry(){return this.geometry=new d.BufferGeometry,this.geometry.addAttribute("position",new d.BufferAttribute(new Float32Array(3),3)),this.geometry.computeBoundingBox(),this.geometry.computeBoundingSphere(),this.geometry.computeVertexNormals(),this.geometry}updateMaterial(){let a=this.options;this.material.uniforms.u_height.value=a.height,this.material.uniforms.u_animFlag.value=a.speed,this.material.uniforms.u_size.value=a.size,this.material.uniforms.u_maxOpacity.value=a.maxOpacity,this.material.needsUpdate=!0}updateOptions(a){let b=a.mapUrl;this.options=e.mergeOptions(this.options,a||{}),this.updateMaterial(),b!==a.mapUrl&&(this.material.uniforms.u_texture.value=this.getTextureMap())}remove(){this.scene.remove(this.movingicon),this.movingicon&&this.movingicon.dispose&&this.movingicon.dispose(),this.material&&this.material.dispose&&this.material.dispose(),this.geometry&&this.geometry.dispose&&this.geometry.dispose(),this.movingicon=null,this.material=null,this.geometry=null,this.data=null,this._data=null}},a.exports});;
