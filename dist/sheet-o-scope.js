var G = Object.defineProperty;
var A = (s) => {
  throw TypeError(s);
};
var X = (s, e, t) => e in s ? G(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var l = (s, e, t) => X(s, typeof e != "symbol" ? e + "" : e, t), E = (s, e, t) => e.has(s) || A("Cannot " + t);
var g = (s, e, t) => (E(s, e, "read from private field"), t ? t.call(s) : e.get(s)), d = (s, e, t) => e.has(s) ? A("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(s) : e.set(s, t), H = (s, e, t, o) => (E(s, e, "write to private field"), o ? o.call(s, t) : e.set(s, t), t), r = (s, e, t) => (E(s, e, "access private method"), t);
var w = /* @__PURE__ */ ((s) => (s.Main = "main", s.PopUp = "popUp", s))(w || {});
function Y(s) {
  return new URL(s).searchParams.get("sheetView") ? w.PopUp : w.Main;
}
var u = /* @__PURE__ */ ((s) => (s.Actor = "actor", s.Item = "item", s.Journal = "journal", s))(u || {});
function p() {
  return game;
}
function O(s, e) {
  var o, n, i, h, S, I;
  const t = p();
  if (e === u.Actor)
    return (n = (o = t.actors) == null ? void 0 : o.get(s)) == null ? void 0 : n.sheet;
  if (e === u.Item)
    return (h = (i = t.items) == null ? void 0 : i.get(s)) == null ? void 0 : h.sheet;
  if (e === u.Journal)
    return (I = (S = t.journal) == null ? void 0 : S.get(s)) == null ? void 0 : I.sheet;
}
function W(s) {
  var o;
  const t = (o = p().users) == null ? void 0 : o.current;
  return t ? t.getFlag("sheet-o-scope", s) : null;
}
function J(s, e) {
  var n;
  const o = (n = p().users) == null ? void 0 : n.current;
  o && o.setFlag("sheet-o-scope", s, e);
}
const K = 5 * 60 * 1e3;
function Q() {
  const s = W("popUps");
  if (!s)
    return null;
  `${s.map((t) => t.id)}`;
  let e = null;
  for (; !e && s.length; )
    e = s.shift(), e && e.created && e.created < Date.now() - K && (e = null);
  return J("popUps", s), e || null;
}
function Z(s) {
  let e = W("popUps");
  s.created = Date.now(), e ? e.push(s) : e = [s], `${e.map((t) => t.id)}`, J("popUps", e);
}
var M = /* @__PURE__ */ ((s) => (s.Reattach = "reattach", s))(M || {}), m, C, z;
class T extends EventTarget {
  constructor() {
    super();
    d(this, m);
    const t = p();
    if (!t.socket || !t.userId)
      throw new Error(
        "can't initialise websocket module before game is initialised"
      );
    t.socket.on("module.sheet-o-scope", r(this, m, C).bind(this));
  }
  send(t, o) {
    var h;
    const n = p(), i = {
      sender: n.userId,
      action: t,
      data: o
    };
    (h = n.socket) == null || h.emit("module.sheet-o-scope", i);
  }
}
m = new WeakSet(), C = function(t) {
  r(this, m, z).call(this, t) && this.dispatchEvent(new MessageEvent("message", { data: t }));
}, z = function(t) {
  const o = p();
  return t.sender === o.userId;
};
class ee {
  constructor() {
    l(this, "label", "SHEET-O-SCOPE.detach");
    l(this, "class", "sheet-detach");
    l(this, "icon", "fa-solid fa-arrow-right-from-bracket");
    l(this, "onclick", null);
  }
}
var b, c, D, F, U, L, N;
class te extends EventTarget {
  constructor() {
    super();
    d(this, c);
    d(this, b);
    Hooks.once("ready", r(this, c, D).bind(this));
  }
}
b = new WeakMap(), c = new WeakSet(), D = function() {
  var o, n, i;
  const t = p();
  if (!((o = t.modules.get("lib-wrapper")) != null && o.active) && ((n = t.user) != null && n.isGM)) {
    (i = ui.notifications) == null || i.error(
      'Module sheet-o-scope requires the "libWrapper" module. Please install and activate it.'
    );
    return;
  }
  Hooks.on(
    "getActorSheetHeaderButtons",
    r(this, c, U).bind(this, u.Actor)
  ), Hooks.on(
    "getItemSheetHeaderButtons",
    r(this, c, U).bind(this, u.Item)
  ), Hooks.on(
    "getJournalSheetHeaderButtons",
    r(this, c, U).bind(this, u.Journal)
  ), H(this, b, new T()), g(this, b).addEventListener(
    "message",
    r(this, c, F).bind(this)
  );
}, F = function(t) {
  const o = t.data;
  o.action === M.Reattach && r(this, c, N).call(this, o.data);
}, U = function(t, o, n) {
  const i = new ee();
  i.onclick = () => {
    r(this, c, L).call(this, t, o);
  }, n.unshift(i);
}, L = function(t, o) {
  const { width: n, height: i } = o.options, h = o.document.id;
  h && (Z({ id: h, type: t }), o.close(), window.open(
    "/game?sheetView=1",
    `sheet-o-scope-popup-${h}`,
    `popup=true,width=${n},height=${i}`
  ));
}, N = function(t) {
  const { id: o, type: n } = t, i = O(o, n);
  i && i.render(!0);
};
class se {
  constructor() {
    l(this, "label", "SHEET-O-SCOPE.reattach");
    l(this, "class", "sheet-reattach");
    l(this, "icon", "fa-solid fa-arrow-right-to-bracket");
    l(this, "onclick", null);
  }
}
var y, $;
class oe {
  constructor() {
    d(this, y);
  }
  run() {
    const e = r(this, y, $);
    libWrapper.register(
      "sheet-o-scope",
      "Notifications.prototype.notify",
      function(t, ...o) {
        return e(o) ? -1 : t(...o);
      }
    );
  }
}
y = new WeakSet(), $ = function(e) {
  const [t, o] = e;
  return !!(o === "info" && t.includes("not displayed because the game Canvas is disabled") || o === "error" && t.includes(
    "Foundry Virtual Tabletop requires a minimum screen resolution"
  ));
};
var P, _;
class ne {
  constructor() {
    d(this, P);
  }
  run() {
    const e = r(this, P, _);
    libWrapper.register(
      "sheet-o-scope",
      "Application.prototype.render",
      function(t, ...o) {
        return e(this) ? this : t(...o);
      }
    );
  }
}
P = new WeakSet(), _ = function(e) {
  return !![
    "navigation",
    "sidebar",
    "players",
    "hotbar",
    "pause",
    "controls"
  ].includes(e.options.id);
};
class ie {
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
const re = [
  oe,
  ne,
  ie
];
var k, f, a, j, q, x, v, B, V;
class ae {
  constructor() {
    d(this, a);
    d(this, k);
    d(this, f);
    var e;
    H(this, f, !!window.opener && window.name.includes("sheet-o-scope")), Hooks.once("init", r(this, a, j).bind(this)), Hooks.once("ready", r(this, a, q).bind(this)), Hooks.on(
      "getActorSheetHeaderButtons",
      r(this, a, v).bind(this, u.Actor)
    ), Hooks.on(
      "getItemSheetHeaderButtons",
      r(this, a, v).bind(this, u.Item)
    ), Hooks.on(
      "getJournalSheetHeaderButtons",
      r(this, a, v).bind(this, u.Journal)
    ), Hooks.on("renderActorSheet", r(this, a, B).bind(this)), Hooks.on("renderItemSheet", r(this, a, B).bind(this)), Hooks.on("renderJournalSheet", r(this, a, B).bind(this)), (e = document.querySelector("body")) == null || e.classList.add("sheet-o-scope-popup");
  }
}
k = new WeakMap(), f = new WeakMap(), a = new WeakSet(), j = function() {
  H(this, k, new T()), re.forEach((e) => {
    new e().run();
  });
}, q = function() {
  const e = Q();
  if (!e)
    return;
  const { id: t, type: o } = e, n = O(t, o);
  if (n) {
    const i = {};
    g(this, f) && (i.resizable = !1, window.addEventListener(
      "resize",
      r(this, a, x).bind(this, n)
    )), i.minimizable = !1, n.render(!0, i);
  }
}, x = function(e) {
  e && e.setPosition({
    width: window.innerWidth,
    height: window.innerHeight
  });
}, v = function(e, t, o) {
  const n = t.document.id;
  if (!n)
    return;
  const i = o.find((S) => S.class === "close");
  i && (i.onclick = () => {
    window.close();
  });
  const h = new se();
  h.onclick = () => {
    r(this, a, V).call(this, e, n);
  }, o.unshift(h);
}, B = function(e, t) {
  g(this, f) && t[0].classList.add("popup-sheet");
}, V = function(e, t) {
  var o;
  (o = g(this, k)) == null || o.send(M.Reattach, { id: t, type: e }), window.close();
};
const ce = window.location.toString(), R = Y(ce);
R === w.Main ? new te() : R === w.PopUp && new ae();
