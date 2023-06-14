"use strict";

import "../sass/widgets/brandboost.sass";

export default {
  init(widgets, params) {
    console.log("BRAND BOOST", widgets, params);

    this.brandBoosWidget = widgets.find((widget) => widget.type === "bboost");
    this.publisherArticle = document.querySelector(".publisher--article");

    this.expand();
    this.brandBoosWidget.loadIframe();
    this.brandBoosWidget.iframe.contentWindow.postMessage({
      sender: "brand-booster-head",
      pageHeight: 16000,
    });
  },

  expand() {
    this.publisherArticle.classList.add("is--expand");
  },
  collapse() {
    this.publisherArticle.classList.remove("is--expand");
  },
};

/*

function _toConsumableArray(e) {
  return (
    _arrayWithoutHoles(e) ||
    _iterableToArray(e) ||
    _unsupportedIterableToArray(e) ||
    _nonIterableSpread()
  );
}
function _nonIterableSpread() {
  throw new TypeError(
    "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}
function _iterableToArray(e) {
  if (
    ("undefined" != typeof Symbol && null != e[Symbol.iterator]) ||
    null != e["@@iterator"]
  )
    return Array.from(e);
}
function _arrayWithoutHoles(e) {
  if (Array.isArray(e)) return _arrayLikeToArray(e);
}
function _slicedToArray(e, t) {
  return (
    _arrayWithHoles(e) ||
    _iterableToArrayLimit(e, t) ||
    _unsupportedIterableToArray(e, t) ||
    _nonIterableRest()
  );
}
function _nonIterableRest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}
function _unsupportedIterableToArray(e, t) {
  var n;
  if (e)
    return "string" == typeof e
      ? _arrayLikeToArray(e, t)
      : "Map" ===
          (n =
            "Object" === (n = Object.prototype.toString.call(e).slice(8, -1)) &&
            e.constructor
              ? e.constructor.name
              : n) || "Set" === n
      ? Array.from(e)
      : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
      ? _arrayLikeToArray(e, t)
      : void 0;
}
function _arrayLikeToArray(e, t) {
  (null == t || t > e.length) && (t = e.length);
  for (var n = 0, a = new Array(t); n < t; n++) a[n] = e[n];
  return a;
}
function _iterableToArrayLimit(e, t) {
  var n =
    null == e
      ? null
      : ("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
  if (null != n) {
    var a,
      o,
      r = [],
      i = !0,
      d = !1;
    try {
      for (
        n = n.call(e);
        !(i = (a = n.next()).done) && (r.push(a.value), !t || r.length !== t);
        i = !0
      );
    } catch (e) {
      (d = !0), (o = e);
    } finally {
      try {
        i || null == n.return || n.return();
      } finally {
        if (d) throw o;
      }
    }
    return r;
  }
}
function _arrayWithHoles(e) {
  if (Array.isArray(e)) return e;
}
function ownKeys(t, e) {
  var n,
    a = Object.keys(t);
  return (
    Object.getOwnPropertySymbols &&
      ((n = Object.getOwnPropertySymbols(t)),
      e &&
        (n = n.filter(function (e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable;
        })),
      a.push.apply(a, n)),
    a
  );
}
function _objectSpread(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = null != arguments[e] ? arguments[e] : {};
    e % 2
      ? ownKeys(Object(n), !0).forEach(function (e) {
          _defineProperty(t, e, n[e]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
      : ownKeys(Object(n)).forEach(function (e) {
          Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e));
        });
  }
  return t;
}
function _defineProperty(e, t, n) {
  return (
    t in e
      ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = n),
    e
  );
}
var BrandBooster = (function (c, l) {
  function o(e, t, n) {
    s &&
      (O(s[0], "animation", "".concat(t, "s ").concat(e)),
      s[1] &&
        !n.includes("fade") &&
        O(
          s[1],
          "animation",
          "".concat(t, "s ").concat(e.replace("down", "up"))
        ));
  }
  function M(e) {
    var e = e[0].isIntersecting,
      t = h.headIframe || b("#".concat(f.iframeName)),
      n = h.headSlim || b("#".concat(f.iframeName, "-slim"));
    P(t.contentWindow, {
      sender: f.headName,
      visible: e,
    }),
      null != n &&
        n.contentWindow &&
        P(n.contentWindow, {
          sender: f.headName,
          visible: e,
        });
  }
  function W() {
    Z(),
      ee(),
      d < 300 ? te() : v || j(),
      I || ((x || A) && Q(), (k || f.fadeOutOnScroll) && E()),
      (e = !1);
  }
  function R() {
    L();
    var e = (a = _slicedToArray(
        k ? ["1", "visible", "0s", "none"] : ["0", "hidden", "0.2s", "block"],
        4
      ))[0],
      t = a[1],
      n = a[2],
      a = a[3];
    O(h.headSlim, "opacity", e),
      O(h.headSlim, "visibility", t),
      O(h.headSlim, "-webkit-transition-delay", n),
      O(h.headSlim, "transition-delay", n),
      O(h.splitter, "display", a),
      E();
  }

  /*
  var s,
    a,
    r,
    p,
    H,
    z,
    m,
    u,
    e,
    U,
    t,
    n,
    f = _objectSpread(
      _objectSpread({}, BrandBoosterLoader.options),
      {},
      {
        backgroundName: "brand-booster-background",
        headName: "brand-booster-head",
        iframeName: "brand-booster-iframe",
        logStyle:
          "background: darkred; color: #fff; padding: 2px 5px 2px; border-radius: 2px; margin-top: -1px",
        splitterName: "brand-booster-splitter",
        styleName: "brand-booster-style",
        trackingPixelName: "brand-booster-trackingpixel",
      }
    ),
    h = {},
    i = [],
    g = {},
    b = function (e) {
      return l.querySelector(e);
    },
    y = function (e) {
      return l.querySelectorAll(e);
    },
    v = !1,
    k = !1,
    F = [],
    w = 0,
    D = 1,
    x = !1,
    d = l.documentElement.scrollTop || l.body.scrollTop,
    S = c.innerHeight,
    B = (function () {
      var e = l.location.search.match(/overlap=([0-9.]+)/);
      if (e) return e[1];
    })(),
    Y = BrandBoosterLoader.domain,
    q =
      /ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba/i,
    X =
      ((U = [
        f.videoTrackingId0,
        f.videoTrackingId25,
        f.videoTrackingId50,
        f.videoTrackingId75,
        f.videoTrackingId100,
      ].join("##")),
      (t = _slicedToArray(
        [f.targetUrlA, f.targetUrlB].map(function (e) {
          e = ~e.indexOf("http") ? e : "https://".concat(e);
          return encodeURIComponent(f.clickMacro + e);
        }),
        2
      )),
      (n = t[0]),
      (t = t[1]),
      "#".concat(n, "##").concat(t, "##").concat(U)),
    N = b("[id^=teaserheld-header]") || b("body > a:first-of-type"),
    _ = N ? 60 : 0,
    I = "Sitebranding" === f.layoutType,
    A = c.teaserheldNonSticky || b("#teaserheld-header-non-sticky"),
    T =
      (N &&
        ((n = function (e) {
          e.stopPropagation(),
            (_ = 0),
            I || O(h.headInner, "height", "calc(100% - ".concat(p, "px)")),
            O(h.headInner, "top", "".concat(p, "px")),
            L(),
            ne(),
            T("teaserheld closed");
        }),
        (t = (function () {
          switch (Y) {
            case "desired":
            case "familie":
              return b(".teaserheld-header-wrapper span");
            case "spieletipps":
              return b("body > a:first-of-type + span");
            default:
              return b("#teaserheld-header + span");
          }
        })()) &&
          (t.addEventListener("click", n, {
            once: !0,
          }),
          N.addEventListener("click", n, {
            once: !0,
          }))),
      function (e) {
        f.devMode ? console.log("%cBrand Booster", f.logStyle, e) : i.push(e);
      }),
    K = function (e) {
      var t = e.name,
        n = e.duration,
        e = e.times,
        a = void 0 === e ? 1 : e,
        e = ""
          .concat(t, " for ")
          .concat(n, "s")
          .concat(1 < a ? " ".concat(a, " times") : "");
      if ("reset" !== t) {
        if (v || k || !s)
          return void T(
            "not applying effect: ".concat(e, " (effects disabled)")
          );
        T("applying effect: ".concat(e));
      }
      switch (t) {
        case "reset":
          o("none", 0, t);
          break;
        case "fade-in":
          o("fade-in forwards", n, t);
          break;
        case "fade-out":
          o("fade-out forwards", n, t);
          break;
        case "float":
          o("ease-in-out float-down ".concat(a), n, t);
          break;
        case "punch":
          o("punch", n, t);
          break;
        case "shake":
          o("shake", n, t);
      }
    },
    V = function () {
      return Date.now() || new Date().getTime();
    },
    J = function () {
      (u = {
        time: V(),
      }),
        c.localStorage.setItem(f.campaignName, JSON.stringify(u));
    },
    $ = function (e) {
      var t;
      e.data.sender &&
        ~e.data.sender.indexOf("brand-booster") &&
        (t = e.data.command) &&
        ("applyEffect" === t ? K(e.data.detail) : BrandBooster[t]());
    },
    P = function (e, t) {
      try {
        e.postMessage(t, "*");
      } catch (e) {
        T(e);
      }
    },
    C = function (e) {
      e && e.parentNode && e.parentNode.removeChild(e);
    },
    O = function (e, t, n) {
      e &&
        (e instanceof Element
          ? e.style.setProperty(t, n)
          : ((e = "\n"
              .concat(e, " { ")
              .concat(t, ": ")
              .concat(n, " !important }")),
            ((h.style || b("#brand-booster-style")).innerHTML += e)));
    },
    L = function () {
      var e;
      !k && "Brand Booster" === f.layoutType
        ? ((e = B || 12),
          (e = Math.round(((S - p - _) * e) / 100 + p + _)),
          O(h.head, "margin-top", "0"),
          O(h.head, "height", "calc(100vh - ".concat(e, "px)")))
        : (O(h.head, "margin-top", "0"),
          O(h.head, "padding-top", "0"),
          O(h.head, "height", "".concat(f.distanceTop, "px")));
    },
    G = function (e) {
      new IntersectionObserver(M).observe(e);
    },
    Q = function () {
      var e = Math.min(d, (x ? w || p : 0) + (A ? _ : 0)),
        t = "calc(100vh - ".concat(p + _ - e, "px)"),
        e = "translateY(-".concat(e, "px)");
      O(h.headInner, "height", t),
        O(h.headInner, "transform", e),
        O(h.headSlim, "transform", e);
    },
    E = function () {
      var e, t, n;
      k || r + a < d
        ? ((t = 0),
          h.splitter &&
            ((n = d + h.splitter.getBoundingClientRect().top),
            (t =
              d < (e = n + z - _ - (x ? w : p))
                ? (d - (n - S - a)) / a
                : 1 - (d - e) / a)))
        : (t = 1 - (d - r) / a),
        (t = (function (e) {
          var t =
            1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0;
          return (
            Math.round(
              10000 *
                Math.max(
                  Math.min(
                    e,
                    2 < arguments.length && void 0 !== arguments[2]
                      ? arguments[2]
                      : 1
                  ),
                  t
                )
            ) / 10000
          );
        })(t, 0.0001)) !== D &&
          ((D = t),
          O(h.headInner, "opacity", t),
          f.backgroundClickable ||
            O(h.headInner, "visibility", 0.0001 === t ? "hidden" : "visible"),
          (n = h.headIframe || b("#".concat(f.iframeName))),
          P(n.contentWindow, {
            sender: f.headName,
            volume: t,
          }),
          T("opacity/volume: ".concat(t)));
    },
    Z = function () {
      d = l.documentElement.scrollTop || l.body.scrollTop;
    },
    ee = function () {
      var e = h.headIframe || b("#".concat(f.iframeName)),
        t =
          (null == (t = h.headSlim) ? void 0 : t.querySelector("iframe")) ||
          b("#".concat(f.iframeName, "-slim iframe"));
      P(e.contentWindow, {
        sender: f.headName,
        scrollTop: d,
      }),
        null != t &&
          t.contentWindow &&
          P(t.contentWindow, {
            sender: f.headName,
            scrollTop: d,
          });
    },
    j = function () {
      K({
        name: "reset",
      }),
        (v = !0);
    },
    te = function () {
      v = !1;
    },
    ne = function () {
      e || ((e = !0), requestAnimationFrame(W));
    },
    ae = function () {
      !(function () {
        if ((S = c.innerHeight) !== H)
          return (
            (H = S),
            (a = Math.round(S / 2.8)),
            (r = Math.round(S / 2.8)),
            (z = h.splitter ? h.splitter.getBoundingClientRect().height : 0),
            !0
          );
      })() || (L(), (k || f.fadeOutOnScroll) && E());
    },
    oe = function (e) {
      e.target === h.background &&
        (e.stopPropagation(), c.open(f.clickMacro + f.targetUrlA));
    },
    re = function (e) {
      return ""
        .concat(e.id ? "#".concat(e.id.trim()) : "")
        .concat(
          e.className ? ".".concat(e.className.trim().replace(/ /g, ".")) : ""
        );
    },
    ie = function e(t) {
      F.push(t.key),
        F.slice(-10).join("").match(q) &&
          (l.removeEventListener("keyup", e),
          ((t = l.createElement("script")).id = "smb-asteroids"),
          (t.src = "//media.gamona.de/sandbox/bookmarklets/asteroids.min.js"),
          l.body.appendChild(t),
          T("konami code accepted. space ship ready!"));
    },
    de = function () {
      (e = !0),
        C(h.splitter),
        C(BrandBoosterLoader.wrapper),
        (c.bb = void 0),
        (c.BrandBooster = void 0),
        (c.BrandBoosterLoader = void 0),
        T("unloaded");
    };
  return {
    clear: function () {
      var e =
        !(0 < arguments.length && void 0 !== arguments[0]) || arguments[0];
      c.localStorage.removeItem(f.campaignName), e && l.location.reload();
    },
    collapse: function () {
      var e = !f.showSlimVersion;
      if ((j(), e)) {
        (e = h.head.getBoundingClientRect().height),
          (e = (x ? w || p : 0) + (A ? _ : 0) + e - 25);
        c.scrollTo(0, e);
      } else {
        if (k) return;
        (k = !0), R();
      }
      T("collapsed");
    },
    debug: function () {
      if (!f.devMode) {
        f.devMode = !0;
        for (var e = 0; e < i.length; e++) T(i[e]);
      }
    },
    expand: function () {
      k && ((k = !1), R(), T("expanded"));
    },
    init: function () {
      if (!c.bb)
        if (BrandBoosterLoader.wrapper) {
          (h.style = l.createElement("style")),
            (h.style.id = f.styleName),
            (h.style.innerHTML =
              "\n      .alice-root-content {\n        position: static !important;\n      }\n\n      @keyframes size-up { 0% { height: 0 } }\n\n      @keyframes fade-in { 0% { opacity: 0 } }\n\n      @keyframes fade-out { 100% { opacity: 0 } }\n\n      @keyframes punch {\n        0% { transform: scale(1) }\n        10% { transform: scale(1.2) }\n        100% { transform: scale(1) }\n      }\n\n      @keyframes float-down {\n        50% { transform: translateY(20px) }\n      }\n\n      @keyframes float-up {\n        50% { transform: translateY(-20px) }\n      }\n\n      @keyframes shake {\n        10%, 90% { transform: translateX(-1px) }\n        20%, 80% { transform: translateX(2px) }\n        30%, 50%, 70% { transform: translateX(-4px) }\n        40%, 60% { transform: translateX(4px) }\n      }\n    "),
            BrandBoosterLoader.wrapper.appendChild(h.style),
            (g.desired = function () {
              (p = _toConsumableArray(y("header nav")).reduce(function (e, t) {
                return e + t.getBoundingClientRect().height;
              }, 0)),
                (x = !0),
                (m =
                  b(".footer-container") ||
                  b("footer") ||
                  b(".alice-root-footer")),
                O("footer", "margin-bottom", "-26px"),
                O("footer", "position", "relative"),
                O("header", "position", "relative"),
                O("header", "z-index", "1"),
                O(".alice-root-content", "margin", "0 auto"),
                O(".alice-root-footer", "position", "relative"),
                O(".container-wrapper-footer", "background", "#fff"),
                O(".ebl-ad-superbanner1", "margin-top", "0"),
                O(".sad_banner", "display", "none"),
                O(".sad_layer", "display", "none"),
                O(".sad_out-of-page", "position", "relative"),
                O(".sad_sky", "display", "none"),
                O(".sub-main-menu-lvl-2", "background", "#fff"),
                O(".sub-main-menu-lvl-2", "position", "absolute"),
                O(".sub-main-menu-lvl-2", "width", "100%"),
                ~c.smbContext.page.view.search(/home-page/i)
                  ? (f.background = "#fff")
                  : ~c.smbContext.page.channel.search(/forum\//i) &&
                    O(".row.panel-cell-style", "background", "#fff"),
                !b(".homepage-full-width") &&
                  O(".alice-root-content", "width", "1000px");
            }),
            (g.familie = function () {
              (p = _toConsumableArray(y("header nav")).reduce(function (e, t) {
                return e + t.getBoundingClientRect().height;
              }, 0)),
                (x = !0),
                (m = b("footer.footer") || b(".alice-root-footer")),
                O(".adslot-wrapper--superbanner", "display", "none"),
                O(".alice-root-content", "margin", "0 auto"),
                O(".alice-root-footer", "position", "relative"),
                O(".alice-root-header", "z-index", "1"),
                O(
                  ".configured-articles-fluid .configured-articles-inner",
                  "width",
                  "1000px"
                ),
                O(".sad_banner", "display", "none"),
                O(".sad_sky", "display", "none"),
                !b(".homepage-full-width") &&
                  O(".alice-root-content", "width", "1000px");
            }),
            (g.giga = function () {
              (p = _toConsumableArray(y("header nav")).reduce(function (e, t) {
                return e + t.getBoundingClientRect().height;
              }, 0)),
                (s = [b(".alice-root-content"), b(".alice-navbar")]),
                (x = !0),
                (m = b(".main-footer") || b(".alice-root-footer")),
                O(s[0], "transform-origin", "top"),
                O(".alice-root-content", "margin", "0 auto"),
                O(".alice-root-content", "width", "1000px"),
                O(".alice-root-outer-ads", "display", "none"),
                O(".alice-root-footer", "position", "relative"),
                O(".main-container", "position", "relative"),
                O(".main-container", "z-index", "1"),
                O(".main-footer", "margin", "0 auto -44px"),
                O(".main-footer", "position", "relative"),
                O(".main-footer", "width", "1000px"),
                O(".main-footer", "z-index", "1"),
                O(".u-shape", "display", "none");
            }),
            (g.kino = function () {
              (p = _toConsumableArray(y("header nav")).reduce(function (e, t) {
                return e + t.getBoundingClientRect().height;
              }, 0)),
                (x = !0),
                (m =
                  b(".alice-root-footer") ||
                  b(".main-footer") ||
                  b("#page-footer")),
                O("#hockeystick", "left", "50%"),
                O("#hockeystick", "pointer-events", "none"),
                O("#hockeystick", "position", "absolute"),
                O("#hockeystick", "visibility", "hidden"),
                O("#hockeystick", "width", "0"),
                O("#hockeystick", "height", "0"),
                O("#page-footer", "margin", "0 auto -32px"),
                O("#page-footer", "width", "1000px"),
                O("#performance", "position", "relative"),
                O(".alice-root-content", "margin", "0 auto"),
                O(".alice-root-content", "width", "1000px"),
                O(".alice-root-footer", "position", "relative"),
                O(".breadcrumb", "position", "relative"),
                O(".content-wrapper", "width", "auto"),
                O(".movie-header.without-media", "padding-top", "18px"),
                O(".navbar-sub", "z-index", "1"),
                O(".listing-header", "position", "relative"),
                O(".listing-header", "z-index", "1"),
                O(".main-body-header", "margin-top", "0"),
                O(".performance-pub", "display", "none"),
                ~c.smbContext.page.view.search(/^startseite/i)
                  ? (O("#performance", "display", "none"),
                    O(".startpage-content", "margin-bottom", "0"))
                  : ~c.smbContext.page.view.search(/Produkdetailseite/i) &&
                    O(".main-container", "padding-top", "0");
            }),
            (g.spielaffe = function () {
              (p = b("#head_container").getBoundingClientRect().height),
                (x = !0),
                (m = b("#footer_container") || b(".alice-root-footer")),
                O("#advertising_billboard", "display", "none"),
                O("#performance", "display", "none"),
                O(".footerinfo", "margin-top", "0");
            }),
            (g.spieletipps = function () {
              var e;
              (p =
                (b(".alice-navbar") || b(".navbar")).getBoundingClientRect()
                  .height +
                ((null == (e = b(".alice-sub-navbar"))
                  ? void 0
                  : e.getBoundingClientRect().height) || 0)),
                (x = !!b(".alice-navbar")),
                (m = b(".stiFooter") || b(".alice-root-footer")),
                O("body", "padding-top", "".concat(p, "px")),
                O("#leaderboard", "display", "none"),
                O("#stiAdWrapper", "margin", "0 auto"),
                O("#stiAdWrapper", "width", "1000px"),
                O("#teaserheld-header-non-sticky", "top", "0"),
                O(".alice-root-content", "margin", "0 auto"),
                O(".alice-root-content", "width", "1000px"),
                O(".alice-root-footer", "position", "relative"),
                O(".hockeystick", "display", "none"),
                O(".stiFooter", "position", "relative"),
                O(".stiFooter", "z-index", "1"),
                O(".stiLeaderBoard", "display", "none"),
                A && O("body > a:first-of-type", "top", "auto"),
                !A &&
                  0 < _ &&
                  O("#".concat(f.headName), "margin-top", "".concat(_, "px"));
            }),
            (g["t-online"] = function () {
              (p = 182),
                (w = 110),
                (x = !0),
                (m = b('[data-testid="PageFooter"]')),
                (s = [
                  b('[data-testid="PageMain"]'),
                  b('[data-testid="PageHeader"]'),
                ]),
                document.documentElement.classList.add("sdi-center-body"),
                O('[data-testid="PageFooter"]', "position", "relative"),
                O('[data-testid="PageFooter"]', "background", "#fff"),
                O('[data-testid="PageMain"]', "padding-top", "0"),
                O('[data-testid="PageMain"] article', "position", "relative"),
                O('[data-testid="Stages.Container"]', "position", "relative"),
                O(
                  '.frm-brd ~ [class^="style_main_"] [class^="style_content_"]',
                  "margin-left",
                  "auto"
                ),
                O(
                  '.frm-brd ~ [class^="style_main_"] [class^="style_content_"]',
                  "position",
                  "relative"
                ),
                O(
                  '[data-testid="Breadcrumb.FullPageWidthWrapper"]',
                  "position",
                  "relative"
                ),
                O(
                  '[data-testid="Breadcrumb.FullPageWidthWrapper"]',
                  "z-index",
                  "1"
                ),
                O(
                  b('[data-testid="PageHeader.StickyBar"] + div + div'),
                  "z-index",
                  "1"
                ),
                O(
                  b('[data-testid="PageHeader.StickyBar"] + div + div'),
                  "margin",
                  "0 auto -1px"
                ),
                O(
                  b('[data-testid="PageHeader.StickyBar"] + div + div'),
                  "padding",
                  "0 24px"
                );
              var e = b('[data-commercial-format="banner"]'),
                t =
                  (null != e &&
                    null != (t = e.parentNode) &&
                    t.parentNode &&
                    O(e.parentNode.parentNode, "display", "none"),
                  window.location.pathname.includes("/finanzen/boerse/")),
                e = window.location.pathname.includes("/sport/live-ticker/"),
                n = b('[data-testid="Breadcrumb.FullPageWidthWrapper"]');
              n && ((n = n.getBoundingClientRect().height), (p += n), (w += n)),
                (B = B || (f.campaignName.includes("disney") ? 12 : 30)),
                t &&
                  ((p = 217),
                  (w = 145),
                  O("footer.super", "position", "relative"),
                  O("#banner.billboardFinance", "display", "none"),
                  O(".frm-brd", "position", "relative"),
                  O(".frm-brd", "z-index", "1"),
                  O(".frm-content-wrapper", "margin-top", "0")),
                e &&
                  ((p = 217),
                  (w = 145),
                  O("main", "position", "relative"),
                  O("main", "width", "1000px"),
                  O("main", "padding-top", "0"),
                  O("main", "margin", "0 auto"));
            }),
            (g.watson = function () {
              (p = b(".desktopnavi").getBoundingClientRect().height - _),
                (m = b("footer")),
                O("#".concat(f.headName), "margin-top", "".concat(p, "px")),
                O("#dfp_ad_quer_wp0", "display", "none"),
                O(".commercial.seiten_ad", "display", "none"),
                O(".lower", "padding-right", "0"),
                O(".upper", "padding-right", "0"),
                O(".wrapper", "padding", "1px 0 0");
            }),
            g[Y](),
            !(e = c.localStorage.getItem(f.campaignName)) ||
            ((u = JSON.parse(e)),
            (e = V() - u.time),
            1000 * (f.sessionDuration || 30) * 60 < e)
              ? J()
              : (j(), f.showSlimVersion && f.iframeUrlSlim && (k = !0)),
            f.trackingPixelUrl &&
              ((h.trackingPixel = l.createElement("img")),
              (h.trackingPixel.id = f.trackingPixelName),
              (h.trackingPixel.src = f.trackingPixelUrl),
              O(h.trackingPixel, "display", "none"),
              BrandBoosterLoader.wrapper.appendChild(h.trackingPixel)),
            (h.background = l.createElement("div")),
            (h.background.id = f.backgroundName),
            BrandBoosterLoader.wrapper.appendChild(h.background),
            O(h.background, "position", "fixed"),
            O(h.background, "top", "0"),
            O(h.background, "left", "0"),
            O(h.background, "width", "100%"),
            O(h.background, "height", "100%"),
            O(h.background, "background", f.background),
            f.backgroundClickable && O(h.background, "cursor", "pointer"),
            (h.head = l.createElement("div")),
            (h.head.id = f.headName),
            (h.head.innerHTML = '\n      <div id="'
              .concat(f.headName, '-inner">\n        <iframe\n          id="')
              .concat(f.iframeName, '"\n          src="')
              .concat(
                f.iframeUrl + X,
                '"\n          frameborder="0"\n          scrolling="0"\n          width="100%"\n          height="100%"\n        ></iframe>\n      </div>'
              )),
            f.iframeUrlSlim &&
              f.showSlimVersion &&
              "Brand Booster" === f.layoutType &&
              (h.head.innerHTML += '\n        <div id="'
                .concat(
                  f.headName,
                  '-slim">\n          <iframe\n            id="'
                )
                .concat(f.iframeName, '-slim"\n            src="')
                .concat(
                  f.iframeUrlSlim + X,
                  '"\n            frameborder="0"\n            scrolling="0"\n            width="100%"\n            height="100%"\n          ></iframe>\n        </div>'
                )),
            BrandBoosterLoader.wrapper.appendChild(h.head),
            (h.headInner = b("#".concat(f.headName, "-inner"))),
            (h.headSlim = b("#".concat(f.headName, "-slim"))),
            (h.headSlimIframe = b("#".concat(f.headName, "-slim iframe"))),
            (h.headIframe = b("#".concat(f.iframeName))),
            h.headIframe &&
              (h.headIframe.onload = function () {
                P(h.headIframe.contentWindow, {
                  sender: f.headName,
                  pageHeight: document.body.offsetHeight,
                });
              }),
            h.headSlimIframe &&
              (h.headSlimIframe.onload = function () {
                P(h.headSlimIframe.contentWindow, {
                  sender: f.headName,
                  pageHeight: document.body.offsetHeight,
                });
              });
          var e = !k && "Brand Booster" === f.layoutType,
            t =
              (O(h.headInner, "position", I ? "absolute" : "fixed"),
              I ? "1200px" : "calc(100% - ".concat(p + _, "px)")),
            n = "opacity 0.5s, visibility 0.5s",
            a = (o = _slicedToArray(
              k ? ["1", "visible"] : ["0", "hidden"],
              2
            ))[0],
            o = o[1],
            r =
              (O("html", "scroll-behavior", "smooth"),
              O(h.head, "width", "100%"),
              O(h.head, "transition", "height 0.5s 0.1s"),
              O(h.head, "-webkit-transition", "height 0.5s 0.1s"),
              O(h.headInner, "top", "".concat(p + _, "px")),
              O(h.headInner, "left", "0"),
              O(h.headInner, "width", "100%"),
              O(h.headInner, "height", t),
              O(h.headInner, "transition", n),
              O(h.headInner, "-webkit-transition", n),
              h.headSlim &&
                (O(h.headSlim, "opacity", a),
                O(h.headSlim, "visibility", o),
                O(h.headSlim, "position", "fixed"),
                O(h.headSlim, "width", "100%"),
                O(
                  h.headSlim,
                  "height",
                  "calc(100vh + ".concat(f.distanceTop - p - _, "px)")
                ),
                O(h.headSlim, "background", f.background),
                O(h.headSlim, "transition", n),
                O(h.headSlim, "-webkit-transition", n)),
              e && O(h.head, "animation", "size-up 1s 1s backwards"),
              !(function () {
                if (!m) return T("splitter location not found");
                if (f.showSplitter && "Brand Booster" === f.layoutType && !k) {
                  if (l.body.getBoundingClientRect().height < 4 * S)
                    return T("page too short for splitter");
                  (h.splitter = l.createElement("div")),
                    (h.splitter.id = f.splitterName),
                    m.parentNode.insertBefore(h.splitter, m);
                  var e = (x ? 0 : p + w) + (A ? 0 : _);
                  O(h.splitter, "width", "100%"),
                    O(h.splitter, "height", "calc(92vh - ".concat(e, "px)")),
                    G(h.splitter);
                }
              })(),
              h.head &&
                (l.addEventListener("keyup", ie),
                c.addEventListener("message", $),
                c.addEventListener("resize", ae, {
                  capture: !1,
                }),
                l.addEventListener("scroll", ne, {
                  capture: !1,
                }),
                f.backgroundClickable &&
                  h.background.addEventListener("click", oe)),
              ae(),
              ne(),
              [
                ".ebl-ad-skyscraper-right",
                ".stiSkyscraperRgt",
                "#div-gpt-ad-sky",
                "#hockeystick-right",
                "#hockeystick-tile-2",
                '[data-commercial-format="sky"]',
              ]);
          O("".concat(r.join(",\n")), "display", "none");
          for (var i = 0; i < r.length; i++) {
            var d = b(r[i]);
            if (d) {
              for (; d.firstChild; ) C(d.firstChild);
              T("removed content of ".concat(r[i]));
            }
          }
          T("initialization successful"),
            T("campaign    : ".concat(f.campaignName)),
            T("layout      : ".concat(f.layoutType)),
            T("background  : ".concat(f.background)),
            T("effects     : ".concat(v ? "NO" : "YES")),
            T(
              "head        : ".concat(
                re(BrandBoosterLoader.wrapper.nextElementSibling)
              )
            ),
            T("splitter    : ".concat(h.splitter && m ? re(m) : "NO")),
            T("slim        : ".concat(h.headSlim ? "YES" : "NO")),
            T(
              "teaserheld  : ".concat(
                N
                  ? ""
                      .concat("YES", " (")
                      .concat(A ? "non-sticky" : "sticky", ")")
                  : "NO"
              )
            ),
            top.document.dispatchEvent(
              new Event("brand-booster:render-finished")
            ),
            (c.bb = BrandBooster);
        } else T("initialization failed"), de();
    },
    options: f,
    unload: de,
  };
})(window, document);


//BrandBooster.init();
*/
