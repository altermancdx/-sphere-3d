;Cube("datav:/com/@double11-2017/map3d-earth/0.1.14",
  [
    "datav:/npm/eventemitter3/2.0.3",
    "datav:/npm/safely-merge/1.0.1",
  ],
  function(a, b, c) {
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
  }
);
