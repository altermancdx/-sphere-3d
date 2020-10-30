const Cube = require('SphereMap/Cube')(module, module.exports, require);

Cube("datav:/com/@double11-2017/map3d-earth/0.1.14/libs/effectLib/EffectComposer", ["datav:/npm/three/0.97.0"], function(a, b, c) {
  var d = c("three");
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
