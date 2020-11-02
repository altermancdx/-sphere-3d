const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/map3d-earth-arcline/0.0.11/tube-buffer",["datav:/npm/eventemitter3/2.0.3"],function(a,b,c){let d=null,e=null;const f=require("eventemitter3");return a.exports=class extends f{constructor(a){super(),this.options=Object.assign({tubularSegments:10,radius:0.1,radiusSegments:3,spacing:20,color:"#E7EE98",speed:5e-3,curveType:"bezierCurve",closed:!1,data:null,dashRatio:4,dashSliceCount:40,opacity:1},a)}addTo(a){return a?void(this.map=a,d=a.THREE,e=a.Utils,this.scene=a.scene,this.init()):console.warn("tube buffer needs map layer")}setData(a){return a?void(this.data=a):console.log("error in tube-buffer: data")}init(){let a=this.options,b=this.data,c=new d.BufferGeometry;c.setIndex(new d.BufferAttribute(b.index,1)),c.addAttribute("sphere_position",new d.BufferAttribute(b.spherePositions,3).setDynamic(!0)),c.addAttribute("plane_position",new d.BufferAttribute(b.planePositions,3).setDynamic(!0)),c.addAttribute("uv",new d.BufferAttribute(b.uv,2)),c.addAttribute("normal",new d.BufferAttribute(b.normal,3)),c.computeBoundingSphere();const f=e.Chroma(a.color).gl(),g={time:{type:"f",value:2},u_time_count:{value:Math.random()},u_ratio:{value:this.options.dashRatio},u_dash_count:{value:this.options.dashSliceCount},u_color:{type:"vec3",value:new d.Vector3(f[0],f[1],f[2])},u_max_opacity:{value:this.options.opacity},u_ease_index:{value:1},u_proj_type:{value:this.map.projType}},h=new d.ShaderMaterial({uniforms:g,vertexShader:`
        varying vec2 vUv;
        attribute vec3 plane_position;
        attribute vec3 sphere_position;

        uniform float u_proj_type;
        uniform float u_ease_index;

        vec3 real_position() {
          if(u_proj_type == 0.){
            return mix(plane_position, sphere_position, u_ease_index);
          } else if(u_proj_type == 1.){
             return mix(sphere_position, plane_position, u_ease_index);
          } else {
            return vec3(0);
          }
          
        }

        void main(){
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4( real_position(), 1.0 );
          gl_Position = projectionMatrix * mvPosition;
        }
      `,fragmentShader:`
        uniform float time;
        varying vec2 vUv;
        uniform vec3 u_color;
        uniform float u_ratio;
        uniform float u_dash_count;
        uniform float u_time_count;
        uniform float u_max_opacity;
        void main( void ) {
          
          float interval;
          float fractor = 0.0;
        
          float half_dash_count = floor(u_dash_count / 2.);
          float half_interval = 1. / half_dash_count;
          float x = mod(vUv.x - u_time_count, half_interval);

          if(u_ratio > 1.) {
            interval = half_interval / (u_ratio + 1.);
          } else {
            interval = half_interval / ((1. / u_ratio) + 1.);
          }

          if((x ) < interval) {
            fractor = 1.;
          } else {
            fractor = .0;
          }

          gl_FragColor = vec4(u_color, fractor * u_max_opacity);
        }
      `,transparent:!0,alphaTest:0.5});let i=this.mesh=new d.Mesh(c,h);i.frustumCulled=!1,i.renderOrder=100+Math.round(3e3*Math.random()),this.scene.add(i),this.checkVisible()}animation(){this.mesh&&this.mesh.material&&(1<this.mesh.material.uniforms.u_time_count.value&&(this.mesh.material.uniforms.u_time_count.value=0),this.mesh.material.uniforms.u_time_count.value+=this.options.speed)}transform(a,b){if(this.mesh&&this.mesh.material){let c=this.mesh.material;c.uniforms.u_ease_index.value=b,c.uniforms.u_proj_type.value=a}}checkVisible(){let a=this.options;a.visible?this.show():this.hide()}update(){const a=e.Chroma(this.options.color).gl();this.mesh.material.uniforms.u_color.value=new d.Vector3(a[0],a[1],a[2]),this.mesh.material.uniforms.u_ratio.value=this.options.dashRatio,this.mesh.material.uniforms.u_max_opacity.value=this.options.opacity,this.mesh.material.uniforms.u_dash_count.value=this.options.dashSliceCount}updateOptions(a){this.options=e.mergeOptions(this.options,a||{}),this.update()}hide(){this.mesh&&(this.mesh.visible=!1)}show(){this.mesh&&(this.mesh.visible=!0)}visify(){this.options.visible=!0,this.show()}remove(){this.scene.remove(this.mesh),this.mesh&&this.mesh.dispose&&this.mesh.dispose(),this.mesh.geometry&&this.mesh.geometry.dispose&&this.mesh.geometry.dispose(),this.mesh.material&&this.mesh.material.dispose&&this.mesh.material.dispose(),this.mesh=null}},a.exports});;
