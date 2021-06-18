"use strict";
function _typeof(e) {
  return (_typeof =
    "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
      ? function (e) {
          return typeof e;
        }
      : function (e) {
          return e &&
            "function" == typeof Symbol &&
            e.constructor === Symbol &&
            e !== Symbol.prototype
            ? "symbol"
            : typeof e;
        })(e);
}
function _classCallCheck(e, n) {
  if (!(e instanceof n))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, n) {
  for (var t = 0; t < n.length; t++) {
    var r = n[t];
    (r.enumerable = r.enumerable || !1),
      (r.configurable = !0),
      "value" in r && (r.writable = !0),
      Object.defineProperty(e, r.key, r);
  }
}
function _createClass(e, n, t) {
  return (
    n && _defineProperties(e.prototype, n), t && _defineProperties(e, t), e
  );
}
var LocalConnection = (function () {
  function t(e) {
    _classCallCheck(this, t);
    var n = this;
    ((window.LC = n).key = e.key),
      (n.name = e.name),
      (n.frames = e.frames),
      (n.timeout = Number.parseInt(e.timeout, 10) || 0),
      (n.onConnect = e.onConnect || function () {}),
      (n.onTimeout = e.onTimeout || function () {}),
      (n._timestamp = 0),
      (n.connected = !1),
      (n.CustomError = function (e) {
        (this.name =
          "LocalConnectionCusomError. https://github.com/softberry/Local-Connection"),
          (this.message = e);
      }),
      n.missingOptions(e) ||
        ((n._timestamp = 0 === n.timeout ? 0 : Date.now() + 1e3 * n.timeout),
        window.addEventListener
          ? window.addEventListener("load", function () {
              n.ready = !0;
            })
          : window.attachEvent("onload", function () {
              n.ready = !0;
            }),
        (n.ready = "complete" === window.document.readyState),
        n.reconnect());
  }
  return (
    _createClass(t, [
      {
        key: "missingOptions",
        value: function (e) {
          var n = this;
          try {
            if ("object" !== _typeof(e))
              throw new n.CustomError(
                "LocalConnection required options key,name,frames must be defined!"
              );
            if (!e.key)
              throw new n.CustomError("key (UniqueKey) must be defined ");
            if (!e.name)
              throw new n.CustomError(
                "name is not defined. Each document needs a name as string (a-z,A-Z,0-9)"
              );
            if (!e.frames)
              throw new n.CustomError(
                "frames are not defined. Give other document names in array"
              );
            if (
              ("string" == typeof e.frames && (e.frames = e.frames.split(",")),
              !Array.isArray(e.frames) || 0 === e.frames.length)
            )
              throw new n.CustomError(
                "frame names should be comma separated string or an Array of stings."
              );
          } catch (e) {
            return !0;
          }
          return !1;
        },
      },
      {
        key: "reconnect",
        value: function () {
          var e = this;
          if (0 < e.timeout && Date.now() > e._timestamp) return e.onTimeout();
          if (window.parent === window) return e.onTimeout();
          for (var n = 0, n = 0; n < e.frames.length; n++)
            e[e.frames[n]] = e[e.frames[n]] || e.getFrameByName(e.frames[n]);
          (e.connected = e.isConnected()),
            e.connected
              ? e.onConnect()
              : window.setTimeout(function () {
                  e.reconnect();
                }, 1e3);
        },
      },
      {
        key: "isConnected",
        value: function () {
          for (var e = !0, n = this, t = 0; t < n.frames.length; t++)
            null === n[n.frames[t]] && (e = !1);
          return e;
        },
      },
      {
        key: "getFrameByName",
        value: function (e) {
          var i = this;
          if (e === i.name) return window;
          var n = window;
          for (; n !== n.parent; ) n = n.parent;
          for (var t = 0; t < n.frames.length; ) {
            var r = n.frames[t];
            if ((t++, 0 < r.frames.length && !i[e])) {
              var o = (function e(n, t) {
                for (var r = 0; r < n.length; ) {
                  var o = n.frames[r];
                  if ((r++, 0 < o.frames.length && !i[t])) {
                    var a = e(o, t);
                    if (null !== a) return a;
                  }
                  if (null !== (o = i.checkFrame(o, t))) return o;
                }
                return null;
              })(r, e);
              if (null !== o) return o;
            }
            var a = null;
            try {
              a = void 0 === r.LC ? null : i.checkFrame(r, e);
            } catch (e) {}
            if (null !== a) return a;
          }
          return null;
        },
      },
      {
        key: "checkFrame",
        value: function (e, n) {
          try {
            if (e.LC.key === this.key && e.LC.name === n && e.LC.ready)
              return this.pair(window), e;
          } catch (e) {
            return null;
          }
          return null;
        },
      },
      {
        key: "pair",
        value: function (e) {
          var n = this;
          e.LC.key === n.key && (n[e.LC.name] = e),
            n.connected ||
              (n.isConnected() && ((n.connected = !0), n.onConnect()));
        },
      },
    ]),
    t
  );
})();

export default LocalConnection;
