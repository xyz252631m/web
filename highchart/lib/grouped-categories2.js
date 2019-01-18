(function() {
    var t;
    !function(e) {
        "object" == typeof t && t.exports ? t.exports = e : e(Highcharts)
    }(function(t) {
        "use strict";
        function e(t) {
            return JSON.parse(JSON.stringify(t))
        }
        function n(t, n) {
            return this.userOptions = e(t),
                this.name = t.name || t,
                this.parent = n,
                this
        }
        function i(t) {
            for (var e = t.length, n = 0; e--; )
                n += t[e];
            return n
        }
        function r(t, e, i) {
            for (t.unshift(new n(e,i)); i; )
                i.leaves = i.leaves ? i.leaves + 1 : 1,
                    i = i.parent
        }
        function a(t, e, n, i, o) {
            var s, l = t.length;
            for (o = o || 0,
                     n.depth = n.depth ? n.depth : 0; l--; )
                s = t[l],
                    s.categories ? (i && (s.parent = i),
                        a(s.categories, e, n, s, o + 1)) : r(e, s, i);
            n.depth = u(n.depth, o)
        }
        function o(t, e, n) {
            e[0] === e[2] && (e[0] = e[2] = h(e[0]) - n % 2 / 2),
            e[1] === e[3] && (e[1] = e[3] = h(e[1]) + n % 2 / 2),
                t.push("M", e[0], e[1], "L", e[2], e[3])
        }
        function s(t, e) {
            return t.getPosition(t.axis.horiz, e, t.axis.tickmarkOffset)
        }
        function l(t, e, n) {
            for (var i, r = t.length; r--; )
                i = t[r][e],
                i && l(i, e, n),
                    n(t[r])
        }
        var h = Math.round
            , c = Math.min
            , u = Math.max
            , d = t.merge
            , f = t.pick
            , p = t.each
            , g = window.HighchartsAdapter && window.HighchartsAdapter.inArray || t.inArray
            , m = t.Axis.prototype
            , v = t.Tick.prototype
            , y = m.init
            , x = m.render
            , b = m.setCategories
            , M = v.getLabelSize
            , w = v.addLabel
            , k = v.destroy
            , S = v.render;
        n.prototype.toString = function() {
            for (var t = [], e = this; e; )
                t.push(e.name),
                    e = e.parent;
            return t.join(", ")
        }
            ,
            m.init = function(t, e) {
                y.call(this, t, e),
                "object" == typeof e && e.categories && this.setupGroups(e)
            }
            ,
            m.setupGroups = function(t) {
                var n, i = [], r = {};
                n = e(t.categories),
                    a(n, i, r),
                    this.categoriesTree = n,
                    this.categories = i,
                    this.isGrouped = 0 !== r.depth,
                    this.labelsDepth = r.depth,
                    this.labelsSizes = [],
                    this.labelsGridPath = [],
                    this.tickLength = t.tickLength || this.tickLength || null,
                    this.tickWidth = f(t.tickWidth, this.isXAxis ? 1 : 0),
                    this.directionFactor = [-1, 1, 1, -1][this.side],
                    this.options.lineWidth = f(t.lineWidth, 1)
            }
            ,
            m.render = function() {
                if (this.isGrouped && (this.labelsGridPath = []),
                void 0 === this.originalTickLength && (this.originalTickLength = this.options.tickLength),
                    this.options.tickLength = this.isGrouped ? .001 : this.originalTickLength,
                    x.call(this),
                    !this.isGrouped)
                    return this.labelsGrid && this.labelsGrid.attr({
                        visibility: "hidden"
                    }),
                        !1;
                var t = this
                    , e = t.options
                    , n = t.top
                    , i = t.left
                    , r = i + t.width
                    , a = n + t.height
                    , o = t.hasVisibleSeries || t.hasData
                    , s = t.labelsDepth
                    , h = t.labelsGrid
                    , c = t.horiz
                    , u = t.labelsGridPath
                    , d = (e.drawHorizontalBorders,
                    t.opposite,
                    t.tickWidth);
                return t.userTickLength && (s -= 1),
                h && h.parentGroup && h.parentGroup.added || (h = t.labelsGrid = t.chart.renderer.path().attr({
                    strokeWidth: d,
                    "stroke-width": d,
                    stroke: e.tickColor
                }).add(t.axisGroup)),
                    h.attr({
                        d: u,
                        visibility: o ? "visible" : "hidden"
                    }),
                    t.labelGroup.attr({
                        visibility: o ? "visible" : "hidden"
                    }),
                    l(t.categoriesTree, "categories", function(e) {
                        var n = e.tick;
                        return !!n && (n.startAt + n.leaves - 1 < t.min || n.startAt > t.max ? (n.label.hide(),
                            n.destroyed = 0) : n.label.attr({
                            visibility: o ? "visible" : "hidden"
                        }),
                            !0)
                    }),
                    !0
            }
            ,
            m.setCategories = function(t, e) {
                this.categories && this.cleanGroups(),
                    this.setupGroups({
                        categories: t
                    }),
                    this.categories = this.userOptions.categories = t,
                    b.call(this, this.categories, e)
            }
            ,
            m.cleanGroups = function() {
                var t, e = this.ticks;
                for (t in e)
                    e[t].parent && delete e[t].parent;
                l(this.categoriesTree, "categories", function(t) {
                    var e = t.tick;
                    return !!e && (e.label.destroy(),
                        p(e, function(t, n) {
                            delete e[n]
                        }),
                        delete t.tick,
                        !0)
                }),
                    this.labelsGrid = null
            }
            ,
            m.groupSize = function(t, e) {
                var n = this.labelsSizes
                    , r = this.directionFactor
                    , a = !!this.options.labels.groupedOptions && this.options.labels.groupedOptions[t - 1]
                    , o = 0;
                return a && (o = r === -1 ? a.x ? a.x : 0 : a.y ? a.y : 0),
                void 0 !== e && (n[t] = u(n[t] || 0, e + 10 + Math.abs(o))),
                    t === !0 ? i(n) * r : n[t] ? n[t] * r : 0
            }
            ,
            v.addLabel = function() {
                var t;
                return w.call(this),
                !(!this.axis.categories || !(t = this.axis.categories[this.pos])) && (this.label && this.label.attr("text", this.axis.labelFormatter.call({
                    axis: this.axis,
                    chart: this.axis.chart,
                    isFirst: this.isFirst,
                    isLast: this.isLast,
                    value: t.name
                })),
                this.axis.isGrouped && this.axis.options.labels.enabled && this.addGroupedLabels(t),
                    !0)
            }
            ,
            v.addGroupedLabels = function(t) {
                for (var e, n = this, i = this.axis, r = i.chart, a = i.options.labels, o = a.useHTML, s = a.style, l = a.groupedOptions, h = {
                    align: "center",
                    rotation: 0,
                    x: 0,
                    y: i.horiz ? 20 : 1
                }, c = i.horiz ? "height" : "width", u = 0; n; ) {
                    if (u > 0 && !t.tick) {
                        this.value = t.name;
                        var f = a.formatter ? a.formatter.call(this, t) : t.name
                            , p = l && l[u - 1]
                            , g = p ? d(h, l[u - 1]) : h
                            , m = p && l[u - 1].style ? d(s, l[u - 1].style) : s;
                        delete g.style,
                            e = r.renderer.text(f, 0, 0, o).attr(g).css(m).add(i.labelGroup),
                            n.startAt = this.pos,
                            n.childCount = t.categories.length,
                            n.leaves = t.leaves,
                            n.visible = this.childCount,
                            n.label = e,
                            n.labelOffsets = {
                                x: g.x,
                                y: g.y
                            },
                            t.tick = n
                    }
                    i.groupSize(u, n.label.getBBox()[c]),
                        t = t.parent,
                        n = t ? n.parent = t.tick || {} : null,
                        u++
                }
            }
            ,
            v.render = function(t, e, n) {
                S.call(this, t, e, n);
                var i = this.axis.categories[this.pos];
                if (this.axis.isGrouped && i && !(this.pos > this.axis.max)) {
                    var r, a, l, h, d, f = this, p = f, m = f.axis, v = f.pos, y = f.isFirst, x = m.max, b = m.min, M = m.horiz, w = m.labelsGridPath, k = m.groupSize(0), A = m.tickWidth,
                        C = s(f, v), T = M ? C.y : C.x, L = m.chart.renderer.fontMetrics(m.options.labels.style.fontSize).b, P = 1, _ = M && C.x === m.pos + m.len || !M && C.y === m.pos ? -1 : 0;
                    for (k = T + k; p.parent; ) {
                        p = p.parent;
                        var E = function(t) {
                            var e = 0;
                            return y ? (e = g(t.name, t.parent.categories),
                                e = e < 0 ? 0 : e) : e
                        }(i)
                            , N = p.labelOffsets.x
                            , z = p.labelOffsets.y;
                        a = s(f, u(p.startAt - 1, b - 1)),
                            l = s(f, c(p.startAt + p.leaves - 1 - E, x)),
                            d = p.label.getBBox(!0),
                            r = m.groupSize(P),
                            _ = M && l.x === m.pos + m.len || !M && l.y === m.pos ? -1 : 0,
                            h = M ? {
                                x: (a.x + l.x) / 2 + N,
                                y: k + r / 2 + L - d.height / 2 - 4 + z / 2
                            } : {
                                x: k + r / 2 + N,
                                y: (a.y + l.y - d.height) / 2 + L + z
                            },
                        isNaN(h.x) || isNaN(h.y) || (p.label.attr(h),
                        w && v === p.startAt && p.startAt + p.childCount !== m.categories.length && (M ? o(w, [l.x - _, T, l.x - _, k + r], A) : o(w, [T, l.y + _, k + r, l.y + _], A))),
                            k += r,
                            P++
                    }
                }
            }
            ,
            v.destroy = function() {
                for (var t = this.parent; t; )
                    t.destroyed = t.destroyed ? t.destroyed + 1 : 1,
                        t = t.parent;
                k.call(this)
            }
            ,
            v.getLabelSize = function() {
                if (this.axis.isGrouped === !0) {
                    var t = M.call(this) + 10;
                    return this.axis.labelsSizes[0] < t && (this.axis.labelsSizes[0] = t),
                        i(this.axis.labelsSizes)
                }
                return M.call(this)
            }
    })
})()