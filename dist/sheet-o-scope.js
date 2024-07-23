var F = Object.defineProperty;
var M = (s) => {
  throw TypeError(s);
};
var _ = (s, t, e) => t in s ? F(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var d = (s, t, e) => _(s, typeof t != "symbol" ? t + "" : t, e), E = (s, t, e) => t.has(s) || M("Cannot " + e);
var g = (s, t, e) => (E(s, t, "read from private field"), e ? e.call(s) : t.get(s)), u = (s, t, e) => t.has(s) ? M("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(s) : t.set(s, e), S = (s, t, e, n) => (E(s, t, "write to private field"), n ? n.call(s, e) : t.set(s, e), e), i = (s, t, e) => (E(s, t, "access private method"), e);
var m = /* @__PURE__ */ ((s) => (s.Main = "main", s.PopUp = "popUp", s))(m || {}), h = /* @__PURE__ */ ((s) => (s.Actor = "actor", s.Item = "item", s.Journal = "journal", s))(h || {});
function K(s) {
  return new URL(s).searchParams.get("sheetView") ? m.PopUp : m.Main;
}
function Q(s) {
  const e = new URL(s).searchParams;
  if (e.get("sheetView")) {
    const n = e.get("id"), o = e.get("type");
    if (n && o && // apparently the best way to check an enum has a value
    Object.values(h).includes(o))
      return { id: n, type: o };
  }
  return null;
}
function A() {
  return game;
}
function R(s, t) {
  var n, o, r, l, k, C;
  const e = A();
  if (t === h.Actor)
    return (o = (n = e.actors) == null ? void 0 : n.get(s)) == null ? void 0 : o.sheet;
  if (t === h.Item)
    return (l = (r = e.items) == null ? void 0 : r.get(s)) == null ? void 0 : l.sheet;
  if (t === h.Journal)
    return (C = (k = e.journal) == null ? void 0 : k.get(s)) == null ? void 0 : C.sheet;
}
var U = /* @__PURE__ */ ((s) => (s.Reattach = "reattach", s))(U || {}), p, f, J, L;
class I extends EventTarget {
  constructor(e = null) {
    super();
    u(this, f);
    u(this, p);
    S(this, p, e), window.addEventListener("message", i(this, f, J).bind(this));
  }
  send(e, n) {
    const o = {
      sender: "sheet-o-scope",
      action: e,
      data: n
    };
    g(this, p) && g(this, p).postMessage(o);
  }
}
p = new WeakMap(), f = new WeakSet(), J = function(e) {
  if (i(this, f, L).call(this, e)) {
    const n = new MessageEvent("message", { data: e.data });
    this.dispatchEvent(n);
  }
}, L = function(e) {
  const n = e.data;
  return e.origin === window.location.origin && n.sender === "sheet-o-scope";
};
class X {
  constructor() {
    d(this, "label", "SHEET-O-SCOPE.detach");
    d(this, "class", "sheet-detach");
    d(this, "icon", "fa-solid fa-arrow-right-from-bracket");
    d(this, "onclick", null);
  }
}
var w, a, z, O, v, T, j;
class Y extends EventTarget {
  constructor() {
    super();
    u(this, a);
    u(this, w);
    S(this, w, new I()), Hooks.once("ready", i(this, a, z).bind(this));
  }
}
w = new WeakMap(), a = new WeakSet(), z = function() {
  var n, o, r;
  const e = A();
  if (!((n = e.modules.get("lib-wrapper")) != null && n.active) && ((o = e.user) != null && o.isGM)) {
    (r = ui.notifications) == null || r.error(
      'Module sheet-o-scope requires the "libWrapper" module. Please install and activate it.'
    );
    return;
  }
  Hooks.on(
    "getActorSheetHeaderButtons",
    i(this, a, v).bind(this, h.Actor)
  ), Hooks.on(
    "getItemSheetHeaderButtons",
    i(this, a, v).bind(this, h.Item)
  ), Hooks.on(
    "getJournalSheetHeaderButtons",
    i(this, a, v).bind(this, h.Journal)
  ), g(this, w).addEventListener(
    "message",
    i(this, a, O).bind(this)
  );
}, O = function(e) {
  const n = e.data;
  n.action === U.Reattach && i(this, a, j).call(this, n.data);
}, v = function(e, n, o) {
  const r = new X();
  r.onclick = () => {
    i(this, a, T).call(this, e, n);
  }, o.unshift(r);
}, T = function(e, n) {
  const { width: o, height: r } = n.options, l = n.document.id;
  n.close(), window.open(
    `/game?sheetView=1&id=${l}&type=${e}`,
    "_blank",
    `popup=true,width=${o},height=${r}`
  );
}, j = function(e) {
  const { id: n, type: o } = e, r = R(n, o);
  r && r.render(!0);
};
class Z {
  constructor() {
    d(this, "label", "SHEET-O-SCOPE.reattach");
    d(this, "class", "sheet-reattach");
    d(this, "icon", "fa-solid fa-arrow-right-to-bracket");
    d(this, "onclick", null);
  }
}
var H, N;
class ee {
  constructor() {
    u(this, H);
  }
  run() {
    const t = i(this, H, N);
    libWrapper.register(
      "sheet-o-scope",
      "Notifications.prototype.notify",
      function(e, ...n) {
        return t(n) ? -1 : e(...n);
      }
    );
  }
}
H = new WeakSet(), N = function(t) {
  const [e, n] = t;
  return !!(n === "info" && e.includes("not displayed because the game Canvas is disabled") || n === "error" && e.includes(
    "Foundry Virtual Tabletop requires a minimum screen resolution"
  ));
};
var y, V;
class te {
  constructor() {
    u(this, y);
  }
  run() {
    const t = i(this, y, V);
    libWrapper.register(
      "sheet-o-scope",
      "Application.prototype.render",
      function(e, ...n) {
        return t(this) ? this : e(...n);
      }
    );
  }
}
y = new WeakSet(), V = function(t) {
  return !![
    "navigation",
    "sidebar",
    "players",
    "hotbar",
    "pause",
    "controls"
  ].includes(t.options.id);
};
class se {
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
  ee,
  te,
  se
];
var b, c, $, q, D, B, x;
class oe {
  constructor(t) {
    u(this, c);
    u(this, b);
    var e;
    S(this, b, new I(window.opener)), Hooks.once("init", i(this, c, $).bind(this)), Hooks.once("ready", i(this, c, q).bind(this, t)), Hooks.on(
      "getActorSheetHeaderButtons",
      i(this, c, B).bind(this, h.Actor)
    ), Hooks.on(
      "getItemSheetHeaderButtons",
      i(this, c, B).bind(this, h.Item)
    ), Hooks.on(
      "getJournalSheetHeaderButtons",
      i(this, c, B).bind(this, h.Journal)
    ), (e = document.querySelector("body")) == null || e.classList.add("sheet-o-scope-popup");
  }
}
b = new WeakMap(), c = new WeakSet(), $ = function() {
  ne.forEach((t) => {
    new t().run();
  });
}, q = function(t) {
  const { id: e, type: n } = t, o = R(e, n);
  o && o.render(!0, {
    minimizable: !1,
    resizable: !1
  }), window.addEventListener("resize", i(this, c, D).bind(this, o));
}, D = function(t) {
  t && t.setPosition({
    width: window.innerWidth,
    height: window.innerHeight
  });
}, B = function(t, e, n) {
  const o = e.document.id;
  if (!o)
    return;
  const r = n.find((k) => k.class === "close");
  r && (r.onclick = () => {
    window.close();
  });
  const l = new Z();
  l.onclick = () => {
    i(this, c, x).call(this, t, o);
  }, n.unshift(l);
}, x = function(t, e) {
  g(this, b).send(U.Reattach, { id: e, type: t }), window.close();
};
const G = window.location.toString(), P = K(G), W = Q(G);
P === m.Main ? new Y() : P === m.PopUp && W && new oe(W);
