const Cube = require('@/Cube')(module, module.exports, require);

Cube("datav:/com/map3d-earth-ambientlighter/0.0.9", ["datav:/npm/eventemitter3/2.0.3"], function (a, b, c) {
  let d = null,
    e = null;
  const f = require("eventemitter3");
  return a.exports = class extends f {
    constructor(a, b) {
      super(), this.options = Object.assign({
        intensity: 0.8,
        color: 16777215,
        visible: !0
      }, b || {})
    }
    addTo(a) {
      return a ? void(d = a.THREE, e = a.Utils, this.map = a, this.scene = a.scene, this.init()) : console.log("Ambient Lighter layer needs map layer")
    }
    init() {
      let a = this.options,
        b = new d.Color(e.Chroma(a.color).hex()),
        c = this.light = new d.AmbientLight(b, a.intensity);
      this.scene.add(c), this.checkVisible()
    }
    updateLight() {
      let a = this.options,
        b = new d.Color(e.Chroma(a.color).hex());
      this.light.intensity = a.intensity, this.light.color.setRGB(b.r, b.g, b.b)
    }
    checkVisible() {
      let a = this.options;
      a.visible ? this.show() : this.hide()
    }
    updateOptions(a) {
      this.options = e.mergeOptions(this.options, a || {}), this.updateLight(), this.checkVisible()
    }
    show() {
      this.options.visible = !0, this.light && (this.light.visible = !0)
    }
    hide() {
      this.options.visible = !1, this.light && (this.light.visible = !1)
    }
    remove() {
      this.scene.remove(this.light), this.light && this.light.shadow && this.light.shadow.map && this.light.shadow.map.dispose && this.light.shadow.map.dispose(), this.light = null
    }
  }, a.exports
});
