const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/map3d-earth-arcline/0.0.11",["datav:/npm/eventemitter3/2.0.3","datav:/npm/safely-merge/1.0.1"],function(a,b,c){let d=null,e=null;const f=require("eventemitter3"),g=require("@/map3d-earth-arcline/movingicon"),h=require("@/map3d-earth-arcline/tube-buffer"),i=require("safely-merge"),j=require("@/map3d-earth-arcline/path-generator");return a.exports=class extends f{constructor(a,b){super(),this.options=i({visible:!0,flyingline:{height:6,tubularSegments:64,radius:0.1,radiusSegments:3,color:"#E7EE98",speed:5e-3,lineArc:1,ptPerTube:2,opacity:1,curveType:"bezierCurve",defaulColor:"#E7EE98"},marker:{height:10,size:15,speed:1,mapUrl:"https://img.alicdn.com/tfs/TB14LWbkER1BeNjy0FmXXb0wVXa-20-10.png"}},b),this.paths=[],this.flyingTubeCollectioin=[]}addTo(a){return a?void(d=a.THREE,e=a.Utils,this.map=a,this.scene=a.scene,this.initEvent(),this.initMovingIcon()):console.log("flyingline layer needs map layer")}initMovingIcon(){this.movingIcon=new g(this.options.marker),this.movingIcon.addTo(this.map)}initEvent(){this.map.on("animationFrame",this.animation.bind(this)),this.map.on("projChanged",this.updatePostions.bind(this))}initColorSeries(){this.colorSeries={};let a=this.options.flyingline.flyinglineTypeSeries;a.forEach((a)=>{let b=a.flyinglineType;this.colorSeries[b]||(this.colorSeries[b]=a.flyinglineColor)})}setData(a){this.cleanComByEmptyArray(),a&&Array.isArray(a)&&(this._data=a,this.render())}cleanComByEmptyArray(a){a&&Array.isArray(a)&&!a.length&&(this._data=null,this.hide())}render(){this.clean(),this.initColorSeries();let a=this._data,b=this.paths,c=this.options.flyingline,f=this.flyingTubeCollectioin,d=new j(c,e);d.setData(a);let g=d.getData(),i=Math.floor(g.length*Math.random());0===this.map.projType?this.movingIcon.setData(g[i].path,0):1===this.map.projType&&this.movingIcon.setData(g[i].path,1);for(let a=0;a<g.length;a++){let b=g[a],d=b.type,e=new h({speed:c.speed,opacity:c.opacity,color:this.getColor(d),dashRatio:c.dashRatio,dashSliceCount:c.dashSliceCount});e.__type=d,e.setData(b.geometry),e.addTo(this.map),f.push(e)}this.checkVisible()}getColor(a){let b,c=this.options.flyingline;return b=this.colorSeries[a]?this.colorSeries[a]:c.defaulColor,b}animation(){if(this.options.visible){let a=this.flyingTubeCollectioin;if(a.length)for(let b,c=0;c<a.length;c++)b=a[c],b.animation();this.movingIcon.animation()}}updatePostions(a){const{projType:b,index:c}=a;if(this.options.visible){let a=this.flyingTubeCollectioin;if(a.length)for(let d,e=0;e<a.length;e++)d=a[e],d.transform(b,c);0===c&&this.movingIcon.setDataType(b)}}updateOptions(a){let b=this.options.flyingline.radius,c=this.options.flyingline.height,d=this.options.flyingline.lineArc,e=JSON.parse(JSON.stringify(this.options));this.options=i(this.options,a||{}),this.initColorSeries(),(c!==this.options.flyingline.height||b!==this.options.flyingline.radius||d!==this.options.flyingline.lineArc)&&this.render(),this.updateTubesOptions(),this.checkVisible(),this.movingIcon.updateOptions(this.options.marker)}updateTubesOptions(){let a=this.options.flyingline,b=this.flyingTubeCollectioin;if(b.length)for(let c,d=0;d<b.length;d++)c=b[d],c.updateOptions({color:this.getColor(c.__type),speed:a.speed,opacity:a.opacity,dashRatio:a.dashRatio,dashSliceCount:a.dashSliceCount})}checkVisible(){let a=this.options;a.visible?this.show():this.hide()}show(){this.options.visible=!0;let a=this.flyingTubeCollectioin;if(a.length)for(let b,c=0;c<a.length;c++)b=a[c],b.show();this.movingIcon&&this.movingIcon.show()}hide(){this.options.visible=!1;let a=this.flyingTubeCollectioin;if(a.length)for(let b,c=0;c<a.length;c++)b=a[c],b.hide();this.movingIcon&&this.movingIcon.hide()}remove(){this.map.off("animationFrame",this.animation),this.map.off("projChanged",this.updatePostions);let a=this.flyingTubeCollectioin;if(a.length)for(let b,c=0;c<a.length;c++)b=a[c],b.remove();this.paths=[],this.flyingTubeCollectioin=[],this.movingIcon&&this.movingIcon.remove()}clean(){let a=this.flyingTubeCollectioin;if(a.length)for(let b,c=0;c<a.length;c++)b=a[c],b.remove();this.paths=[],this.flyingTubeCollectioin=[],this.movingIcon&&this.movingIcon.hide()}},a.exports});