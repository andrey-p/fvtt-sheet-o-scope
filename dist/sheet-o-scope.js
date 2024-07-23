var _ = Object.defineProperty;
var M = (t) => {
  throw TypeError(t);
};
var K = (t, s, e) => s in t ? _(t, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[s] = e;
var u = (t, s, e) => K(t, typeof s != "symbol" ? s + "" : s, e), C = (t, s, e) => s.has(t) || M("Cannot " + e);
var g = (t, s, e) => (C(t, s, "read from private field"), e ? e.call(t) : s.get(t)), d = (t, s, e) => s.has(t) ? M("Cannot add the same private member more than once") : s instanceof WeakSet ? s.add(t) : s.set(t, e), S = (t, s, e, n) => (C(t, s, "write to private field"), n ? n.call(t, e) : s.set(t, e), e), i = (t, s, e) => (C(t, s, "access private method"), e);
var w = /* @__PURE__ */ ((t) => (t.Main = "main", t.PopUp = "popUp", t))(w || {}), h = /* @__PURE__ */ ((t) => (t.Actor = "actor", t.Item = "item", t.Journal = "journal", t))(h || {});
function Q(t) {
  return new URL(t).searchParams.get("sheetView") ? w.PopUp : w.Main;
}
function X(t) {
  const e = new URL(t).searchParams;
  if (e.get("sheetView")) {
    const n = e.get("id"), o = e.get("type");
    if (n && o && // apparently the best way to check an enum has a value
    Object.values(h).includes(o))
      return { id: n, type: o };
  }
  return null;
}
function $(t) {
  console.log(`sheet-o-scope | ${t}`);
}
function Y(t) {
  console.warn(`sheet-o-scope | ${t}`);
}
function A() {
  return game;
}
function I(t, s) {
  var n, o, r, l, k, U;
  const e = A();
  if (s === h.Actor)
    return (o = (n = e.actors) == null ? void 0 : n.get(t)) == null ? void 0 : o.sheet;
  if (s === h.Item)
    return (l = (r = e.items) == null ? void 0 : r.get(t)) == null ? void 0 : l.sheet;
  if (s === h.Journal)
    return (U = (k = e.journal) == null ? void 0 : k.get(t)) == null ? void 0 : U.sheet;
}
var E = /* @__PURE__ */ ((t) => (t.Reattach = "reattach", t))(E || {}), p, f, O, J;
class R extends EventTarget {
  constructor(e = null) {
    super();
    d(this, f);
    d(this, p);
    S(this, p, e), window.addEventListener("message", i(this, f, O).bind(this));
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
p = new WeakMap(), f = new WeakSet(), O = function(e) {
  if (i(this, f, J).call(this, e)) {
    const n = new MessageEvent("message", { data: e.data });
    this.dispatchEvent(n);
  }
}, J = function(e) {
  const n = e.data;
  return e.origin === window.location.origin && n.sender === "sheet-o-scope";
};
class Z {
  constructor() {
    u(this, "label", "SHEET-O-SCOPE.detach");
    u(this, "class", "sheet-detach");
    u(this, "icon", "fa-solid fa-arrow-right-from-bracket");
    u(this, "onclick", null);
  }
}
var m, a, L, z, v, D, N;
class ee extends EventTarget {
  constructor() {
    super();
    d(this, a);
    d(this, m);
    S(this, m, new R()), Hooks.once("ready", i(this, a, L).bind(this));
  }
}
m = new WeakMap(), a = new WeakSet(), L = function() {
  var n, o, r;
  const e = A();
  if (!((n = e.modules.get("lib-wrapper")) != null && n.active) && ((o = e.user) != null && o.isGM)) {
    (r = ui.notifications) == null || r.error(
      'Module sheet-o-scope requires the "libWrapper" module. Please install and activate it.'
    );
    return;
  }
  $("Setting up changes to main window"), Hooks.on(
    "getActorSheetHeaderButtons",
    i(this, a, v).bind(this, h.Actor)
  ), Hooks.on(
    "getItemSheetHeaderButtons",
    i(this, a, v).bind(this, h.Item)
  ), Hooks.on(
    "getJournalSheetHeaderButtons",
    i(this, a, v).bind(this, h.Journal)
  ), g(this, m).addEventListener(
    "message",
    i(this, a, z).bind(this)
  );
}, z = function(e) {
  const n = e.data;
  n.action === E.Reattach && i(this, a, N).call(this, n.data);
}, v = function(e, n, o) {
  const r = new Z();
  r.onclick = () => {
    i(this, a, D).call(this, e, n);
  }, o.unshift(r);
}, D = function(e, n) {
  const { width: o, height: r } = n.options, l = n.document.id;
  n.close(), window.open(
    `/game?sheetView=1&id=${l}&type=${e}`,
    "_blank",
    `popup=true,width=${o},height=${r}`
  );
}, N = function(e) {
  const { id: n, type: o } = e, r = I(n, o);
  r && r.render(!0);
};
class te {
  constructor() {
    u(this, "label", "SHEET-O-SCOPE.reattach");
    u(this, "class", "sheet-reattach");
    u(this, "icon", "fa-solid fa-arrow-right-to-bracket");
    u(this, "onclick", null);
  }
}
var H, T;
class se {
  constructor() {
    d(this, H);
  }
  run() {
    const s = i(this, H, T);
    libWrapper.register(
      "sheet-o-scope",
      "Notifications.prototype.notify",
      function(e, ...n) {
        return s(n) ? -1 : e(...n);
      }
    );
  }
}
H = new WeakSet(), T = function(s) {
  const [e, n] = s;
  return !!(n === "info" && e.includes("not displayed because the game Canvas is disabled") || n === "error" && e.includes(
    "Foundry Virtual Tabletop requires a minimum screen resolution"
  ));
};
var y, j;
class ne {
  constructor() {
    d(this, y);
  }
  run() {
    const s = i(this, y, j);
    libWrapper.register(
      "sheet-o-scope",
      "Application.prototype.render",
      function(e, ...n) {
        return s(this) ? this : e(...n);
      }
    );
  }
}
y = new WeakSet(), j = function(s) {
  return !![
    "navigation",
    "sidebar",
    "players",
    "hotbar",
    "pause",
    "controls"
  ].includes(s.options.id);
};
class oe {
  run() {
    libWrapper.register(
      "sheet-o-scope",
      "ClientSettings.prototype.get",
      function(s, ...e) {
        return e.join(".") === "core.noCanvas" ? !0 : s(...e);
      }
    );
  }
}
const ie = [
  se,
  ne,
  oe
];
var b, c, V, q, G, B, x;
class re {
  constructor(s) {
    d(this, c);
    d(this, b);
    var e;
    S(this, b, new R(window.opener)), Hooks.once("init", i(this, c, V).bind(this)), Hooks.once("ready", i(this, c, q).bind(this, s)), Hooks.on(
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
b = new WeakMap(), c = new WeakSet(), V = function() {
  ie.forEach((s) => {
    new s().run();
  });
}, q = function(s) {
  const { id: e, type: n } = s, o = I(e, n);
  o ? ($(`Opening sheet for ${n} with ID: ${e}`), o.render(!0, {
    minimizable: !1,
    resizable: !1
  })) : Y(`Couldn't find sheet for ${n} with ID: ${e}`), window.addEventListener("resize", i(this, c, G).bind(this, o));
}, G = function(s) {
  s && s.setPosition({
    width: window.innerWidth,
    height: window.innerHeight
  });
}, B = function(s, e, n) {
  const o = e.document.id;
  if (!o)
    return;
  const r = n.find((k) => k.class === "close");
  r && (r.onclick = () => {
    window.close();
  });
  const l = new te();
  l.onclick = () => {
    i(this, c, x).call(this, s, o);
  }, n.unshift(l);
}, x = function(s, e) {
  g(this, b).send(E.Reattach, { id: e, type: s }), window.close();
};
const F = window.location.toString(), P = Q(F), W = X(F);
P === w.Main ? new ee() : P === w.PopUp && W && new re(W);
CONFIG.debug.hooks = !0;
