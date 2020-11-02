const Cube = require('@/Cube')(module, module.exports, require);
Cube("datav:/com/map3d-earth-donut/0.0.6/layer.js", ["datav:/npm/eventemitter3/3.1.0", "datav:/npm/safely-merge/1.0.1", "datav:/npm/d3/3.5.12", "datav:/npm/d3-tip/0.9.1"], function (a, b, c) {
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
  var h = function () {
      function a(a, b) {
        var c = [],
          d = !0,
          e = !1,
          f = void 0;
        try {
          for (var g, h = a[Symbol.iterator](); !(d = (g = h.next()).done) && (c.push(g.value), !(b && c.length === b)); d = !0);
        } catch (a) {
          e = !0, f = a
        } finally {
          try {
            !d && h["return"] && h["return"]()
          } finally {
            if (e) throw f
          }
        }
        return c
      }
      return function (b, c) {
        if (Array.isArray(b)) return b;
        if (Symbol.iterator in Object(b)) return a(b, c);
        throw new TypeError("Invalid attempt to destructure non-iterable instance")
      }
    }(),
    g = function () {
      function a(a, b) {
        for (var c, d = 0; d < b.length; d++) c = b[d], c.enumerable = c.enumerable || !1, c.configurable = !0, "value" in c && (c.writable = !0), Object.defineProperty(a, c.key, c)
      }
      return function (b, c, d) {
        return c && a(b.prototype, c), d && a(b, d), b
      }
    }(),
    i = require("eventemitter3"),
    j = require("safely-merge"),
    k = require("d3"),
    l = require("d3-tip").default;

  return require("@/map3d-earth-donut/tipcss"), a.exports = function (a) {
    var b = a.THREE,
      c = a.scene,
      m = a.container,
      n = {
        visible: !0,
        minRadius: 1,
        maxRadius: 10,
        donutSize: 2,
        innerCircleRenderType: "singleColor",
        startInnerCircleColor: "#58F613",
        endInnerCircleColor: "#FF4800",
        innerCircleColor: "rgba(212,20,159,0.8)",
        outerCircleColor: "rgba(212,100,10,0.8)",
        donutSeries: [{
          field: "field1",
          color: "#eee"
        }],
        tip: {
          background: "rgba(0, 0, 0, 0.8)",
          fontSize: 14,
          fontFamily: "Microsoft Yahei",
          fontColor: "#fff"
        }
      };
    return function (c) {
      function i(a) {
        d(this, i);
        var b = e(this, (i.__proto__ || Object.getPrototypeOf(i)).call(this));
        return b.options = j(n, a), b.onRender = b.onRender.bind(b), b.onClick = b.onClick.bind(b), b
      }
      return f(i, c), g(i, [{
        key: "addTo",
        value: function (a) {
          this.map = a, this.init(), a.on("animationFrame", this.onRender)
        }
      }, {
        key: "init",
        value: function () {
          var a = m.clientWidth,
            b = m.clientHeight;
          this.width = a, this.height = b;
          var c = this.svg = k.select(m).append("svg").attr("width", a).attr("height", b).style({
              position: "absolute",
              left: 0,
              top: 0,
              "z-index": 999
            }),
            d = this.options,
            e = d.startInnerCircleColor,
            f = d.endInnerCircleColor,
            g = this.options.tip,
            h = g.background,
            i = g.fontSize,
            j = g.fontFamily,
            n = g.fontColor;
          this.id = "gradient-" + new Date().getTime().toString(36);
          var o = this.svg.append("defs").append("linearGradient").attr("id", this.id);
          o.attr("x1", 0).attr("y1", 0).attr("x2", 1).attr("y2", 1), this.stop1 = o.append("stop").attr("offset", "0%").attr("stop-color", e), this.stop2 = o.append("stop").attr("offset", "100%").attr("stop-color", f), this.tool_tip = l().direction("ne").attr("class", "earth-3d-donut-d3-tip").style("background", h).style("font-size", i + "px").style("font-family", j).style("color", n).html(function (a) {
            return a.tip || "\u7ECF\u5EA6\uFF1A" + a.lng + ",\u7EAC\u5EA6\uFF1A" + a.lat
          }), c.call(this.tool_tip), this.svg.on("click", this.onClick), this.svg.on("touchmove", this.tool_tip.hide)
        }
      }, {
        key: "onClick",
        value: function () {
          var a = k.event.srcElement.__data__;
          this.emit("click", a)
        }
      }, {
        key: "onRender",
        value: function () {
          if (this.svg) {
            var c = m.clientWidth,
              d = m.clientHeight;
            d === this.height && this.width === c || this.svg.attr("width", c).attr("height", d)
          }
          this.nodes && this.nodes.each(function (c) {
            var d = k.select(this),
              e = a.getContainerCoord(c.lng, c.lat),
              f = h(e, 2),
              g = f[0],
              i = f[1],
              j = a.camera.position,
              l = a.Projection(c.lng, c.lat),
              m = l.x,
              n = l.y,
              o = l.z,
              p = new b.Vector3(m, n, o),
              q = j.angleTo(p);
            d.attr("transform", "translate(" + g + ", " + i + ")"), q > Math.PI / 3 ? d.attr("visibility", "hidden") : d.attr("visibility", "visible")
          })
        }
      }, {
        key: "setData",
        value: function (b) {
          this.data = b, this.svg.selectAll("g").remove();
          var c = this.options.tip,
            d = c.background,
            e = c.fontSize,
            f = c.fontFamily,
            g = c.fontColor;
          if (this.tool_tip.style("background", d).style("font-size", e + "px").style("color", g).style("font-family", f), this.nodes = null, !!b.length) {
            this.nodes = this.svg.selectAll("g").data(b).enter().append("g").on("click", this.tool_tip.show).on("mouseover", this.tool_tip.show).on("mouseout", this.tool_tip.hide);
            var i = Math.max.apply(null, b.map(function (a) {
                return a.outer
              })),
              j = this.options,
              l = j.visible,
              m = j.minRadius,
              n = j.maxRadius,
              o = j.donutSize,
              p = j.innerCircleColor,
              q = j.outerCircleColor,
              r = j.donutSeries,
              s = j.innerCircleRenderType,
              t = j.startInnerCircleColor,
              u = j.endInnerCircleColor;
            this.stop1.attr("stop-color", t), this.stop2.attr("stop-color", u);
            var v = this,
              w = k.scale.linear().domain([0, i]).range([m, n]),
              x = function (a) {
                var b = r.filter(function (b) {
                  return b.field == a
                });
                return b.length ? b[0].color : "#f00"
              };
            this.nodes.each(function (b) {
              var c = k.select(this),
                d = Object.keys(b.donut).map(function (a) {
                  return {
                    name: a,
                    value: b.donut[a]
                  }
                }),
                e = w(b.inner),
                f = w(b.outer),
                g = k.svg.arc().innerRadius(f).outerRadius(f + o),
                i = k.layout.pie().sort(null).value(function (a) {
                  return a.value
                }),
                j = i(d),
                l = a.getContainerCoord(+b.lng, +b.lat),
                m = h(l, 2),
                n = m[0],
                r = m[1];
              c.attr("transform", "translate(" + n + ", " + r + ")");
              var t = {
                startAngle: 0,
                endAngle: 2 * Math.PI
              };
              c.append("path").style("fill", q).attr("d", k.svg.arc().innerRadius(e).outerRadius(f)(t)), c.append("g").selectAll("path").data(j).enter().append("path").attr("fill", function (a) {
                return x(a.data.name)
              }).attr("d", g), c.append("circle").attr("r", e).style("fill", "singleColor" === s ? p : "url(#" + v.id + ")")
            })
          }
        }
      }, {
        key: "updateOptions",
        value: function (a) {
          this.options = j(this.options, a), this.data && this.data.length && this.setData(this.data)
        }
      }, {
        key: "show",
        value: function () {
          this.svg && this.svg.style("opacity", 1)
        }
      }, {
        key: "hide",
        value: function () {
          this.svg && this.svg.style("opacity", 0)
        }
      }, {
        key: "remove",
        value: function () {
          this.svg && this.svg.remove && this.svg.remove(), a && a.off("animationFrame", this.onRender), this.svg && this.svg.off && this.svg.off("click", this.onClick), this.svg = null
        }
      }]), i
    }(i)
  }, a.exports
});;
