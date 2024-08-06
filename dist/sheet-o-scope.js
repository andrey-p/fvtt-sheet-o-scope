var K = Object.defineProperty;
var A = (s) => {
  throw TypeError(s);
};
var Q = (s, t, e) => t in s ? K(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var l = (s, t, e) => Q(s, typeof t != "symbol" ? t + "" : t, e), U = (s, t, e) => t.has(s) || A("Cannot " + e);
var p = (s, t, e) => (U(s, t, "read from private field"), e ? e.call(s) : t.get(s)), u = (s, t, e) => t.has(s) ? A("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(s) : t.set(s, e), w = (s, t, e, o) => (U(s, t, "write to private field"), o ? o.call(s, e) : t.set(s, e), e), n = (s, t, e) => (U(s, t, "access private method"), e);
var b = /* @__PURE__ */ ((s) => (s.Main = "main", s.PopUp = "popUp", s))(b || {}), h = /* @__PURE__ */ ((s) => (s.Actor = "actor", s.Item = "item", s.Journal = "journal", s))(h || {});
function X(s) {
  return new URL(s).searchParams.get("sheetView") ? b.PopUp : b.Main;
}
function Y(s) {
  const e = new URL(s).searchParams;
  if (e.get("sheetView")) {
    const o = e.get("id"), i = e.get("type");
    if (o && i && // apparently the best way to check an enum has a value
    Object.values(h).includes(i))
      return { id: o, type: i };
  }
  return null;
}
function I() {
  return game;
}
function J(s, t) {
  var o, i, r, d, M, P;
  const e = I();
  if (t === h.Actor)
    return (i = (o = e.actors) == null ? void 0 : o.get(s)) == null ? void 0 : i.sheet;
  if (t === h.Item)
    return (d = (r = e.items) == null ? void 0 : r.get(s)) == null ? void 0 : d.sheet;
  if (t === h.Journal)
    return (P = (M = e.journal) == null ? void 0 : M.get(s)) == null ? void 0 : P.sheet;
}
var C = /* @__PURE__ */ ((s) => (s.Reattach = "reattach", s))(C || {}), g, m, z, O;
class L extends EventTarget {
  constructor(e = null) {
    super();
    u(this, m);
    u(this, g);
    w(this, g, e), window.addEventListener("message", n(this, m, z).bind(this));
  }
  send(e, o) {
    const i = {
      sender: "sheet-o-scope",
      action: e,
      data: o
    };
    p(this, g) && p(this, g).postMessage(i);
  }
}
g = new WeakMap(), m = new WeakSet(), z = function(e) {
  if (n(this, m, O).call(this, e)) {
    const o = new MessageEvent("message", { data: e.data });
    this.dispatchEvent(o);
  }
}, O = function(e) {
  const o = e.data;
  return e.origin === window.location.origin && o.sender === "sheet-o-scope";
};
class Z {
  constructor() {
    l(this, "label", "SHEET-O-SCOPE.detach");
    l(this, "class", "sheet-detach");
    l(this, "icon", "fa-solid fa-arrow-right-from-bracket");
    l(this, "onclick", null);
  }
}
var S, c, T, $, H, j, N;
class ee extends EventTarget {
  constructor() {
    super();
    u(this, c);
    u(this, S);
    w(this, S, new L()), Hooks.once("ready", n(this, c, T).bind(this));
  }
}
S = new WeakMap(), c = new WeakSet(), T = function() {
  var o, i, r;
  const e = I();
  if (!((o = e.modules.get("lib-wrapper")) != null && o.active) && ((i = e.user) != null && i.isGM)) {
    (r = ui.notifications) == null || r.error(
      'Module sheet-o-scope requires the "libWrapper" module. Please install and activate it.'
    );
    return;
  }
  Hooks.on(
    "getActorSheetHeaderButtons",
    n(this, c, H).bind(this, h.Actor)
  ), Hooks.on(
    "getItemSheetHeaderButtons",
    n(this, c, H).bind(this, h.Item)
  ), Hooks.on(
    "getJournalSheetHeaderButtons",
    n(this, c, H).bind(this, h.Journal)
  ), p(this, S).addEventListener(
    "message",
    n(this, c, $).bind(this)
  );
}, $ = function(e) {
  const o = e.data;
  o.action === C.Reattach && n(this, c, N).call(this, o.data);
}, H = function(e, o, i) {
  const r = new Z();
  r.onclick = () => {
    n(this, c, j).call(this, e, o);
  }, i.unshift(r);
}, j = function(e, o) {
  const { width: i, height: r } = o.options, d = o.document.id;
  o.close(), window.open(
    `/game?sheetView=1&id=${d}&type=${e}`,
    `sheet-o-scope-popup-${d}`,
    `popup=true,width=${i},height=${r}`
  );
}, N = function(e) {
  const { id: o, type: i } = e, r = J(o, i);
  r && r.render(!0);
};
class te {
  constructor() {
    l(this, "label", "SHEET-O-SCOPE.reattach");
    l(this, "class", "sheet-reattach");
    l(this, "icon", "fa-solid fa-arrow-right-to-bracket");
    l(this, "onclick", null);
  }
}
var y, V;
class se {
  constructor() {
    u(this, y);
  }
  run() {
    const t = n(this, y, V);
    libWrapper.register(
      "sheet-o-scope",
      "Notifications.prototype.notify",
      function(e, ...o) {
        return t(o) ? -1 : e(...o);
      }
    );
  }
}
y = new WeakSet(), V = function(t) {
  const [e, o] = t;
  return !!(o === "info" && e.includes("not displayed because the game Canvas is disabled") || o === "error" && e.includes(
    "Foundry Virtual Tabletop requires a minimum screen resolution"
  ));
};
var E, q;
class oe {
  constructor() {
    u(this, E);
  }
  run() {
    const t = n(this, E, q);
    libWrapper.register(
      "sheet-o-scope",
      "Application.prototype.render",
      function(e, ...o) {
        return t(this) ? this : e(...o);
      }
    );
  }
}
E = new WeakSet(), q = function(t) {
  return !![
    "navigation",
    "sidebar",
    "players",
    "hotbar",
    "pause",
    "controls"
  ].includes(t.options.id);
};
class ie {
  run() {
    libWrapper.register(
      "sheet-o-scope",
      "ClientSettings.prototype.get",
      function(t, ...e) {
        return e.join(".") === "core.noCanvas" ? !0 : t(...e);
      }
    );
  }
}
const ne = [
  se,
  oe,
  ie
];
var k, f, a, D, x, G, v, B, F;
class re {
  constructor(t) {
    u(this, a);
    u(this, k);
    u(this, f);
    var e;
    w(this, f, !!window.opener && window.name.includes("sheet-o-scope")), w(this, k, new L(window.opener)), Hooks.once("init", n(this, a, D).bind(this)), Hooks.once("ready", n(this, a, x).bind(this, t)), Hooks.on(
      "getActorSheetHeaderButtons",
      n(this, a, v).bind(this, h.Actor)
    ), Hooks.on(
      "getItemSheetHeaderButtons",
      n(this, a, v).bind(this, h.Item)
    ), Hooks.on(
      "getJournalSheetHeaderButtons",
      n(this, a, v).bind(this, h.Journal)
    ), Hooks.on("renderActorSheet", n(this, a, B).bind(this)), Hooks.on("renderItemSheet", n(this, a, B).bind(this)), Hooks.on("renderJournalSheet", n(this, a, B).bind(this)), (e = document.querySelector("body")) == null || e.classList.add("sheet-o-scope-popup");
  }
}
k = new WeakMap(), f = new WeakMap(), a = new WeakSet(), D = function() {
  ne.forEach((t) => {
    new t().run();
  });
}, x = function(t) {
  const { id: e, type: o } = t, i = J(e, o);
  if (i) {
    const r = {};
    p(this, f) && (r.resizable = !1, window.addEventListener(
      "resize",
      n(this, a, G).bind(this, i)
    )), r.minimizable = !1, i.render(!0, r);
  }
}, G = function(t) {
  t && t.setPosition({
    width: window.innerWidth,
    height: window.innerHeight
  });
}, v = function(t, e, o) {
  const i = e.document.id;
  if (!i)
    return;
  const r = o.find((d) => d.class === "close");
  if (r && (r.onclick = () => {
    window.close();
  }), p(this, f)) {
    const d = new te();
    d.onclick = () => {
      n(this, a, F).call(this, t, i);
    }, o.unshift(d);
  }
}, B = function(t, e) {
  p(this, f) && e[0].classList.add("popup-sheet");
}, F = function(t, e) {
  p(this, k).send(C.Reattach, { id: e, type: t }), window.close();
};
const _ = window.location.toString(), W = X(_), R = Y(_);
W === b.Main ? new ee() : W === b.PopUp && R && new re(R);
