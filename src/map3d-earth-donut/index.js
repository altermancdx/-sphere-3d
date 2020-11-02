const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/map3d-earth-donut/0.0.6", ["datav:/npm/eventemitter3/3.1.0", "datav:/npm/safely-merge/1.0.1"], function (a, b, c) {
  function d(a, b) {
    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
  }

  function e(a, b) {
    if (!a) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return b && ("object" === typeof b || "function" === typeof b) ? b : a
  }

  function f(a, b) {
    if ("function" !== typeof b && null !== b) throw new TypeError("Super expression must either be null or a function, not " + typeof b);
    a.prototype = Object.create(b && b.prototype, {
      constructor: {
        value: a,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), b && (Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b)
  }
  var g = function () {
      function a(a, b) {
        for (var c, d = 0; d < b.length; d++) c = b[d], c.enumerable = c.enumerable || !1, c.configurable = !0, "value" in c && (c.writable = !0), Object.defineProperty(a, c.key, c)
      }
      return function (b, c, d) {
        return c && a(b.prototype, c), d && a(b, d), b
      }
    }(),
    h = require("eventemitter3"),
    i = require("safely-merge"),
    j = require("@/map3d-earth-donut/layer.js");
  return a.exports = function (a) {
    function b(a, c) {
      d(this, b);
      var f = e(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this));
      return f.container = a, f.config = c, f.apis = c.apis, f.layerOnClick = f.layerOnClick.bind(f), f
    }
    return f(b, a), g(b, [{
      key: "init",
      value: function () {
        var a = this.getOptions(),
          b = j(this.map),
          c = this.layer = new b(a);
        c.addTo(this.map), c.on("click", this.layerOnClick)
      }
    }, {
      key: "getOptions",
      value: function () {
        return this.config
      }
    }, {
      key: "addTo",
      value: function (a) {
        return a ? void(this.map = a, this.init()) : console.log("scatter layer needs map layer")
      }
    }, {
      key: "layerOnClick",
      value: function (a) {
        this.emit("donut-on-click", a)
      }
    }, {
      key: "render",
      value: function (a) {
        this.layer && this.layer.setData(a)
      }
    }, {
      key: "updateOptions",
      value: function (a) {
        this.config = i(this.config, a), a = this.getOptions(), this.layer && this.layer.updateOptions(a)
      }
    }, {
      key: "show",
      value: function () {
        this.layer && this.layer.show()
      }
    }, {
      key: "hide",
      value: function () {
        this.layer && this.layer.hide()
      }
    }, {
      key: "remove",
      value: function () {
        this.layer && this.layer.off("click", this.layerOnClick), this.layer && this.layer.remove()
      }
    }]), b
  }(h), a.exports
});
