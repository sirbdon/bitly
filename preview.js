;
(function() {
    var e = function() {
        function t(e) {
            return Object.prototype.toString.call(e).slice(8, -1).toLowerCase()
        }

        function i(e, t) {
            for (var i = []; t > 0; i[--t] = e);
            return i.join("")
        }
        var r = function() {
            return r.cache.hasOwnProperty(arguments[0]) || (r.cache[arguments[0]] = r.parse(arguments[0])), r.format.call(null, r.cache[arguments[0]], arguments)
        };
        return r.format = function(r, n) {
            var s, o, l, a, h, u, c, p = 1,
                d = r.length,
                f = "",
                m = [];
            for (o = 0; d > o; o++)
                if (f = t(r[o]), "string" === f) m.push(r[o]);
                else if ("array" === f) {
                if (a = r[o], a[2])
                    for (s = n[p], l = 0; a[2].length > l; l++) {
                        if (!s.hasOwnProperty(a[2][l])) throw e('[sprintf] property "%s" does not exist', a[2][l]);
                        s = s[a[2][l]]
                    } else s = a[1] ? n[a[1]] : n[p++];
                if (/[^s]/.test(a[8]) && "number" != t(s)) throw e("[sprintf] expecting number but found %s", t(s));
                switch (a[8]) {
                    case "b":
                        s = s.toString(2);
                        break;
                    case "c":
                        s = String.fromCharCode(s);
                        break;
                    case "d":
                        s = parseInt(s, 10);
                        break;
                    case "e":
                        s = a[7] ? s.toExponential(a[7]) : s.toExponential();
                        break;
                    case "f":
                        s = a[7] ? parseFloat(s).toFixed(a[7]) : parseFloat(s);
                        break;
                    case "o":
                        s = s.toString(8);
                        break;
                    case "s":
                        s = (s += "") && a[7] ? s.substring(0, a[7]) : s;
                        break;
                    case "u":
                        s = Math.abs(s);
                        break;
                    case "x":
                        s = s.toString(16);
                        break;
                    case "X":
                        s = s.toString(16).toUpperCase()
                }
                s = /[def]/.test(a[8]) && a[3] && s >= 0 ? "+" + s : s, u = a[4] ? "0" == a[4] ? "0" : a[4].charAt(1) : " ", c = a[6] - (s + "").length, h = a[6] ? i(u, c) : "", m.push(a[5] ? s + h : h + s)
            }
            return m.join("")
        }, r.cache = {}, r.parse = function(e) {
            for (var t = e, i = [], r = [], n = 0; t;) {
                if (null !== (i = /^[^\x25]+/.exec(t))) r.push(i[0]);
                else if (null !== (i = /^\x25{2}/.exec(t))) r.push("%");
                else {
                    if (null === (i = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(t))) throw "[sprintf] huh?";
                    if (i[2]) {
                        n |= 1;
                        var s = [],
                            o = i[2],
                            l = [];
                        if (null === (l = /^([a-z_][a-z_\d]*)/i.exec(o))) throw "[sprintf] huh?";
                        for (s.push(l[1]);
                            "" !== (o = o.substring(l[0].length));)
                            if (null !== (l = /^\.([a-z_][a-z_\d]*)/i.exec(o))) s.push(l[1]);
                            else {
                                if (null === (l = /^\[(\d+)\]/.exec(o))) throw "[sprintf] huh?";
                                s.push(l[1])
                            }
                        i[2] = s
                    } else n |= 2;
                    if (3 === n) throw "[sprintf] mixing positional and named placeholders is not (yet) supported";
                    r.push(i)
                }
                t = t.substring(i[0].length)
            }
            return r
        }, r
    }();
    (function(e) {
        var t = ["original_url", "url", "type", "provider_url", "provider_display", "provider_name", "favicon_url", "title", "description", "thumbnail_url", "author_name", "author_url", "media_type", "media_html", "media_width", "media_height"];
        e.fn.addInputs = function(i, r) {
            return e(this).each(function() {
                r = e.isArray(r) ? r : t;
                var n = e(this);
                e.each(r, function(t, r) {
                    var s = "";
                    if (0 === r.indexOf("media")) {
                        var o = r.split("_")[1];
                        i.media.hasOwnProperty(o) && (s = i.media[o])
                    } else i.hasOwnProperty(r) && (s = i[r]);
                    var l = e('<input type="hidden"/>').attr({
                        name: r,
                        value: escape(s)
                    });
                    n.append(l)
                })
            })
        }
    })(jQuery, window, document),
    function(e) {
        var t = function(e, t) {
            this.init(e, t)
        };
        t.prototype = {
            init: function(t, i) {
                this.$elem = e(t), this.options = e.extend({}, {
                    preview: null,
                    onchange: e.noop
                }, i), this.$elem.find(".controls .left").on("click", e.proxy(this.left, this)), this.$elem.find(".controls .right").on("click", e.proxy(this.right, this)), this.$elem.find(".controls .nothumb").on("click", e.proxy(function(e) {
                    e.preventDefault(), this.$elem.hide()
                }, this)), this.$elem.on("right", e.proxy(this.right, this)), this.$elem.on("left", e.proxy(this.left, this)), this.$elem.on("hide", e.proxy(this.hide, this)), this.$elem.on("show", e.proxy(this.show, this)), this.$elem.one("mouseenter", function() {
                    e(this).on("mouseenter mouseleave", function() {
                        e(this).find(".controls").toggle()
                    })
                }), this.$elem.data("length", this.$elem.find(".images li").length), this.$elem.data("current", 1)
            },
            left: function(e) {
                e.preventDefault(), this.scroll(-1)
            },
            right: function(e) {
                e.preventDefault(), this.scroll(1)
            },
            update: function(e) {
                void 0 === e && (e = null), this.options.onchange.call(e, e)
            },
            scroll: function(e) {
                var t = this.$elem.find(".images"),
                    i = parseInt(t.find("li").css("width"), 10),
                    r = parseInt(t.css("left"), 10),
                    n = t.find("img").length * i;
                if (0 > e) {
                    if (r = parseInt(r, 10) + i, r > 0) return !1
                } else if (r = parseInt(r, 10) - i, -n >= r) return !1;
                var s = this.$elem.data("current");
                this.$elem.data("current", s + e);
                var o = t.find("img").eq(r / -i).get(0);
                this.update(o), t.css("left", r + "px")
            },
            hide: function() {
                this.$elem.hide(), this.update(null)
            },
            show: function() {
                this.$elem.show();
                var e = this.$elem.data("current"),
                    t = this.$elem.find(".images img").eq(e - 1).get(0);
                this.update(t)
            }
        }, e.fn.thumb = function(i) {
            return e(this).each(function() {
                e(this).data("thumb", new t(this, i))
            })
        }
    }(jQuery),
    function(t) {
        var i = function() {};
        i.prototype = {
            protocolExp: /^http(s?):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i,
            urlExp: /[\-\w]+(\.[a-z]{2,})+(\S+)?(\/|\/[\w#!:.?+=&%@!\-\/])?/gi,
            secure: "https:" === window.location.protocol ? !0 : !1,
            url: function(e) {
                if (e = t.trim(e), "" === e) return null;
                var i = e.match(this.protocolExp),
                    r = i ? i[0] : null;
                return null === r && (i = e.match(this.urlExp), r = i ? "http://" + i[0] : null), r = t.trim(r), "" === r ? null : r
            },
            none: function(e) {
                return null === e || void 0 === e
            },
            image: function(e, i) {
                return this.none(e) ? e : this.secure ? "https://i.embed.ly/1/display?" + t.param({
                    key: i.key,
                    url: e
                }) : e
            }
        };
        var r = new i,
            n = function(i, n) {
                var s = t(this),
                    o = t.extend(!0, {}, i);
                o.title = o.title ? o.title : o.url;
                var l = o.favicon_url ? '<img class="favicon" src="%(favicon_url)s">' : "";
                o.favicon_url = r.image(o.favicon_url, n);
                var a = t.map(o.images, function(t) {
                    return t.src = r.image(t.url, n), e('<li><img src="%(src)s" data-url="%(url)s"/></li>', t)
                }).join("");
                "" !== a && (a = ['<div class="thumb">', '<div class="controls">', '<a class="left" href="#">&#9664;</a>', '<a class="right" href="#">&#9654;</a>', '<a class="nothumb" href="#">&#10005;</a>', "</div>", '<div class="items">', '<ul class="images">', a, "</ul>", "</div>", "</div>"].join(""));
                var h = ['<div class="attributes">', '<a class="title" href="#" contenteditable=true>%(title)s</a>', '<p><a class="description" href="#" contenteditable=true>%(description)s</a></p>', '<span class="meta">', l, '<a class="provider" href="%(provider_url)s">%(provider_display)s</a>', "</span>", "</div>", '<div class="action"><a href="#" class="close">&#10005;</a></div>'].join(""),
                    u = ['<div class="selector">', a, e(h, o), "</div>"].join(""),
                    c = s.closest(n.container).find(n.wrapper).eq(0);
                return 0 === c.length && (c = t(n.wrapper).eq(0)), 1 !== c.length ? !1 : (c.html(t(u)), c.find(".thumb").thumb({
                    onchange: function(e) {
                        var i = null;
                        r.none(e) || (i = t(e).attr("data-url")), s.data("preview").thumbnail_url = i
                    }
                }), c.find(".title").on("blur", function(e) {
                    s.data("preview").title = t(e.target).text()
                }), c.find(".description").on("blur", function(e) {
                    s.data("preview").description = t(e.target).text()
                }), c.find(".action .close").bind("click", t.proxy(function() {
                    s.trigger("close"), c.find(".selector").remove()
                }, this)), c.find(".selector").bind("mouseenter mouseleave", function() {
                    t(this).find(".action").toggle()
                }), s.on("close", function() {
                    c.find(".selector").remove()
                }), void 0)
            },
            s = {
                debug: !1,
                bind: !0,
                error: null,
                success: null,
                render: n,
                wrapper: ".selector-wrapper",
                container: "form",
                field: null,
                query: {
                    wmode: "opaque",
                    words: 30,
                    maxwidth: 560
                }
            },
            o = function(e, t) {
                this.init(e, t)
            };
        o.prototype = {
            $form: null,
            data: {},
            init: function(e, i) {
                this.elem = e, this.$elem = t(e), this.url = null;
                var r = this.$elem.parents("form").eq(0);
                1 === r.length && (this.$form = r), this.options = t.extend({}, s, i), this.options.bind === !0 && (this.$elem.on("keyup", t.proxy(this.keyUp, this)), this.$elem.on("paste", t.proxy(this.paste, this)), this.$elem.on("blur", t.proxy(this.paste, this))), this.$elem.data("preview", {}), this.$elem.on("close", t.proxy(this.clear, this)), this.$elem.on("clear", t.proxy(this.clear, this)), this.$elem.on("preview", t.proxy(this.fetch, this)), this.$elem.on("update", t.proxy(function(e, t, i) {
                    this.$elem.data("preview")[t] = i
                }, this))
            },
            log: function() {
                this.options.debug && window.console && window.console.log(Array.prototype.slice.call(arguments))
            },
            update: function(e, t) {
                var i = this.$elem.data("preview");
                i[e] = t
            },
            clear: function() {
                this.$elem.data("preview", {})
            },
            keyUp: function(e) {
                if (32 !== e.which && 13 !== e.which && 8 !== e.which) return null;
                var t = r.url(this.$elem.val());
                return this.log("onKeyUp url:" + t), null === t ? (this.$elem.trigger("close"), null) : (this.fetch(t), void 0)
            },
            paste: function() {
                setTimeout(t.proxy(function() {
                    this.fetch()
                }, this), 200)
            },
            fetch: function(e) {
                return "string" !== t.type(e) && (e = r.url(this.$elem.val())), this.log(e), null === e || this.url === e ? !1 : (this.$elem.trigger("close"), this.url = e, this.$elem.trigger("loading"), t.embedly.extract(e, {
                    key: this.options.key,
                    query: this.options.query
                }).progress(t.proxy(this._callback, this)), void 0)
            },
            error: function(e) {
                null !== this.options.error && t.proxy(this.options.error, this.elem)(e)
            },
            _callback: function(e) {
                return this.log(e), this.$elem.trigger("loaded"), e.hasOwnProperty("type") ? "error" === e.type ? (this.log("URL (" + e.url + ") returned an error: " + e.error_message), this.error(e), !1) : e.safe ? e.type in {
                    html: "",
                    image: ""
                } ? (e.images.length > 0 && (e.thumbnail_url = e.images[0].url), this.$elem.data("preview", e), t.proxy(this.options.render, this.elem)(e, this.options), null !== this.options.success && t.proxy(this.options.success, this.elem)(e), this.log("done", e), void 0) : (this.log("URL (" + e.url + ") returned a type (" + e.type + ") not handled"), this.error(e), !1) : (this.log("URL (" + e.url + ") was deemed unsafe: " + e.safe_message), this.error(e), !1) : (this.log("Embedly returned an invalid response"), this.error(e), !1)
            }
        }, t.fn.preview = function(e) {
            return t(this).each(function() {
                new o(this, e)
            })
        }
    }(jQuery, window, document)
})(jQuery, window, document);