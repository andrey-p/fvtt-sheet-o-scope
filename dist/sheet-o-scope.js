var X = Object.defineProperty;
var C = (s) => {
  throw TypeError(s);
};
var Y = (s, e, t) => e in s ? X(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var d = (s, e, t) => Y(s, typeof e != "symbol" ? e + "" : e, t), P = (s, e, t) => e.has(s) || C("Cannot " + t);
var p = (s, e, t) => (P(s, e, "read from private field"), t ? t.call(s) : e.get(s)), u = (s, e, t) => e.has(s) ? C("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(s) : e.set(s, t), w = (s, e, t, o) => (P(s, e, "write to private field"), o ? o.call(s, t) : e.set(s, t), t), i = (s, e, t) => (P(s, e, "access private method"), t);
var b = /* @__PURE__ */ ((s) => (s.Main = "main", s.PopUp = "popUp", s))(b || {});
function K(s) {
  return new URL(s).searchParams.get("sheetView") ? b.PopUp : b.Main;
}
var l = /* @__PURE__ */ ((s) => (s.Actor = "actor", s.Item = "item", s.Journal = "journal", s))(l || {});
function E() {
  return game;
}
function R(s, e) {
  var o, n, r, h, A, W;
  const t = E();
  if (e === l.Actor)
    return (n = (o = t.actors) == null ? void 0 : o.get(s)) == null ? void 0 : n.sheet;
  if (e === l.Item)
    return (h = (r = t.items) == null ? void 0 : r.get(s)) == null ? void 0 : h.sheet;
  if (e === l.Journal)
    return (W = (A = t.journal) == null ? void 0 : A.get(s)) == null ? void 0 : W.sheet;
}
function O(s) {
  var o;
  const t = (o = E().users) == null ? void 0 : o.current;
  return t ? t.getFlag("sheet-o-scope", s) : null;
}
function J(s, e) {
  var n;
  const o = (n = E().users) == null ? void 0 : n.current;
  o && o.setFlag("sheet-o-scope", s, e);
}
const Q = 5 * 60 * 1e3;
function Z() {
  const s = O("popUps");
  if (!s)
    return null;
  `${s.map((t) => t.id)}`;
  let e = null;
  for (; !e && s.length; )
    e = s.shift(), e && e.created && e.created < Date.now() - Q && (e = null);
  return J("popUps", s), e || null;
}
function ee(s) {
  let e = O("popUps");
  s.created = Date.now(), e ? e.push(s) : e = [s], `${e.map((t) => t.id)}`, J("popUps", e);
}
var M = /* @__PURE__ */ ((s) => (s.Reattach = "reattach", s))(M || {}), g, m, L, z;
class T extends EventTarget {
  constructor(t = null) {
    super();
    u(this, m);
    u(this, g);
    w(this, g, t), window.addEventListener("message", i(this, m, L).bind(this));
  }
  send(t, o) {
    const n = {
      sender: "sheet-o-scope",
      action: t,
      data: o
    };
    p(this, g) && p(this, g).postMessage(n);
  }
}
g = new WeakMap(), m = new WeakSet(), L = function(t) {
  if (i(this, m, z).call(this, t)) {
    const o = new MessageEvent("message", { data: t.data });
    this.dispatchEvent(o);
  }
}, z = function(t) {
  const o = t.data;
  return t.origin === window.location.origin && o.sender === "sheet-o-scope";
};
class te {
  constructor() {
    d(this, "label", "SHEET-O-SCOPE.detach");
    d(this, "class", "sheet-detach");
    d(this, "icon", "fa-solid fa-arrow-right-from-bracket");
    d(this, "onclick", null);
  }
}
var S, c, D, F, U, N, $;
class se extends EventTarget {
  constructor() {
    super();
    u(this, c);
    u(this, S);
    w(this, S, new T()), Hooks.once("ready", i(this, c, D).bind(this));
  }
}
S = new WeakMap(), c = new WeakSet(), D = function() {
  var o, n, r;
  const t = E();
  if (!((o = t.modules.get("lib-wrapper")) != null && o.active) && ((n = t.user) != null && n.isGM)) {
    (r = ui.notifications) == null || r.error(
      'Module sheet-o-scope requires the "libWrapper" module. Please install and activate it.'
    );
    return;
  }
  Hooks.on(
    "getActorSheetHeaderButtons",
    i(this, c, U).bind(this, l.Actor)
  ), Hooks.on(
    "getItemSheetHeaderButtons",
    i(this, c, U).bind(this, l.Item)
  ), Hooks.on(
    "getJournalSheetHeaderButtons",
    i(this, c, U).bind(this, l.Journal)
  ), p(this, S).addEventListener(
    "message",
    i(this, c, F).bind(this)
  );
}, F = function(t) {
  const o = t.data;
  o.action === M.Reattach && i(this, c, $).call(this, o.data);
}, U = function(t, o, n) {
  const r = new te();
  r.onclick = () => {
    i(this, c, N).call(this, t, o);
  }, n.unshift(r);
}, N = function(t, o) {
  const { width: n, height: r } = o.options, h = o.document.id;
  h && (ee({ id: h, type: t }), o.close(), window.open(
    "/game?sheetView=1",
    `sheet-o-scope-popup-${h}`,
    `popup=true,width=${n},height=${r}`
  ));
}, $ = function(t) {
  const { id: o, type: n } = t, r = R(o, n);
  r && r.render(!0);
};
class oe {
  constructor() {
    d(this, "label", "SHEET-O-SCOPE.reattach");
    d(this, "class", "sheet-reattach");
    d(this, "icon", "fa-solid fa-arrow-right-to-bracket");
    d(this, "onclick", null);
  }
}
var B, _;
class ne {
  constructor() {
    u(this, B);
  }
  run() {
    const e = i(this, B, _);
    libWrapper.register(
      "sheet-o-scope",
      "Notifications.prototype.notify",
      function(t, ...o) {
        return e(o) ? -1 : t(...o);
      }
    );
  }
}
B = new WeakSet(), _ = function(e) {
  const [t, o] = e;
  return !!(o === "info" && t.includes("not displayed because the game Canvas is disabled") || o === "error" && t.includes(
    "Foundry Virtual Tabletop requires a minimum screen resolution"
  ));
};
var y, j;
class ie {
  constructor() {
    u(this, y);
  }
  run() {
    const e = i(this, y, j);
    libWrapper.register(
      "sheet-o-scope",
      "Application.prototype.render",
      function(t, ...o) {
        return e(this) ? this : t(...o);
      }
    );
  }
}
y = new WeakSet(), j = function(e) {
  return !![
    "navigation",
    "sidebar",
    "players",
    "hotbar",
    "pause",
    "controls"
  ].includes(e.options.id);
};
class re {
  run() {
    libWrapper.register(
      "sheet-o-scope",
      "ClientSettings.prototype.get",
      function(e, ...t) {
        return t.join(".") === "core.noCanvas" ? !0 : e(...t);
      }
    );
  }
}
const ae = [
  ne,
  ie,
  re
];
var k, f, a, q, x, V, H, v, G;
class ce {
  constructor() {
    u(this, a);
    u(this, k);
    u(this, f);
    var e;
    w(this, f, !!window.opener && window.name.includes("sheet-o-scope")), w(this, k, new T(window.opener)), Hooks.once("init", i(this, a, q).bind(this)), Hooks.once("ready", i(this, a, x).bind(this)), Hooks.on(
      "getActorSheetHeaderButtons",
      i(this, a, H).bind(this, l.Actor)
    ), Hooks.on(
      "getItemSheetHeaderButtons",
      i(this, a, H).bind(this, l.Item)
    ), Hooks.on(
      "getJournalSheetHeaderButtons",
      i(this, a, H).bind(this, l.Journal)
    ), Hooks.on("renderActorSheet", i(this, a, v).bind(this)), Hooks.on("renderItemSheet", i(this, a, v).bind(this)), Hooks.on("renderJournalSheet", i(this, a, v).bind(this)), (e = document.querySelector("body")) == null || e.classList.add("sheet-o-scope-popup");
  }
}
k = new WeakMap(), f = new WeakMap(), a = new WeakSet(), q = function() {
  ae.forEach((e) => {
    new e().run();
  });
}, x = function() {
  const e = Z();
  if (!e)
    return;
  const { id: t, type: o } = e, n = R(t, o);
  if (n) {
    const r = {};
    p(this, f) && (r.resizable = !1, window.addEventListener(
      "resize",
      i(this, a, V).bind(this, n)
    )), r.minimizable = !1, n.render(!0, r);
  }
}, V = function(e) {
  e && e.setPosition({
    width: window.innerWidth,
    height: window.innerHeight
  });
}, H = function(e, t, o) {
  const n = t.document.id;
  if (!n)
    return;
  const r = o.find((h) => h.class === "close");
  if (r && (r.onclick = () => {
    window.close();
  }), p(this, f)) {
    const h = new oe();
    h.onclick = () => {
      i(this, a, G).call(this, e, n);
    }, o.unshift(h);
  }
}, v = function(e, t) {
  p(this, f) && t[0].classList.add("popup-sheet");
}, G = function(e, t) {
  p(this, k).send(M.Reattach, { id: t, type: e }), window.close();
};
const he = window.location.toString(), I = K(he);
I === b.Main ? new se() : I === b.PopUp && new ce();
