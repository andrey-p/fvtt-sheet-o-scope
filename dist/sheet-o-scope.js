var G = Object.defineProperty;
var U = (s) => {
  throw TypeError(s);
};
var X = (s, e, t) => e in s ? G(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var l = (s, e, t) => X(s, typeof e != "symbol" ? e + "" : e, t), M = (s, e, t) => e.has(s) || U("Cannot " + t);
var g = (s, e, t) => (M(s, e, "read from private field"), t ? t.call(s) : e.get(s)), u = (s, e, t) => e.has(s) ? U("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(s) : e.set(s, t), H = (s, e, t, n) => (M(s, e, "write to private field"), n ? n.call(s, t) : e.set(s, t), t), r = (s, e, t) => (M(s, e, "access private method"), t);
var w = /* @__PURE__ */ ((s) => (s.Main = "main", s.Secondary = "secondary", s))(w || {});
function Y(s) {
  return new URL(s).searchParams.get("sheetView") ? w.Secondary : w.Main;
}
var d = /* @__PURE__ */ ((s) => (s.Actor = "actor", s.Item = "item", s.Journal = "journal", s))(d || {});
function f() {
  return game;
}
function W(s, e) {
  var n, o, i, h, k, R;
  const t = f();
  if (e === d.Actor)
    return (o = (n = t.actors) == null ? void 0 : n.get(s)) == null ? void 0 : o.sheet;
  if (e === d.Item)
    return (h = (i = t.items) == null ? void 0 : i.get(s)) == null ? void 0 : h.sheet;
  if (e === d.Journal)
    return (R = (k = t.journal) == null ? void 0 : k.get(s)) == null ? void 0 : R.sheet;
}
function J(s) {
  var n;
  const t = (n = f().users) == null ? void 0 : n.current;
  return t ? t.getFlag("sheet-o-scope", s) : null;
}
function O(s, e) {
  var o;
  const n = (o = f().users) == null ? void 0 : o.current;
  n && n.setFlag("sheet-o-scope", s, e);
}
const K = 5 * 60 * 1e3;
function Q() {
  const s = J("openableSheets");
  if (!s)
    return null;
  `${s.map((t) => t.id)}`;
  let e = null;
  for (; !e && s.length; )
    e = s.shift(), e && e.created && e.created < Date.now() - K && (e = null);
  return O("openableSheets", s), e || null;
}
function Z(s) {
  let e = J("openableSheets");
  s.created = Date.now(), e ? e.push(s) : e = [s], `${e.map((t) => t.id)}`, O("openableSheets", e);
}
var A = /* @__PURE__ */ ((s) => (s.Reattach = "reattach", s))(A || {}), m, C, z;
class P extends EventTarget {
  constructor() {
    super();
    u(this, m);
    const t = f();
    if (!t.socket || !t.userId)
      throw new Error(
        "can't initialise websocket module before game is initialised"
      );
    t.socket.on("module.sheet-o-scope", r(this, m, C).bind(this));
  }
  send(t, n) {
    var h;
    const o = f(), i = {
      sender: o.userId,
      action: t,
      data: n
    };
    (h = o.socket) == null || h.emit("module.sheet-o-scope", i);
  }
}
m = new WeakSet(), C = function(t) {
  r(this, m, z).call(this, t) && this.dispatchEvent(new MessageEvent("message", { data: t }));
}, z = function(t) {
  const n = f();
  return t.sender === n.userId;
};
class ee {
  constructor() {
    l(this, "label", "SHEET-O-SCOPE.detach");
    l(this, "class", "sheet-detach");
    l(this, "icon", "fa-solid fa-arrow-right-from-bracket");
    l(this, "onclick", null);
  }
}
var b, c, D, F, y, L, N;
class te extends EventTarget {
  constructor() {
    super();
    u(this, c);
    u(this, b);
    Hooks.once("ready", r(this, c, D).bind(this));
  }
}
b = new WeakMap(), c = new WeakSet(), D = function() {
  var n, o, i;
  const t = f();
  if (!((n = t.modules.get("lib-wrapper")) != null && n.active) && ((o = t.user) != null && o.isGM)) {
    (i = ui.notifications) == null || i.error(
      'Module sheet-o-scope requires the "libWrapper" module. Please install and activate it.'
    );
    return;
  }
  Hooks.on(
    "getActorSheetHeaderButtons",
    r(this, c, y).bind(this, d.Actor)
  ), Hooks.on(
    "getItemSheetHeaderButtons",
    r(this, c, y).bind(this, d.Item)
  ), Hooks.on(
    "getJournalSheetHeaderButtons",
    r(this, c, y).bind(this, d.Journal)
  ), H(this, b, new P()), g(this, b).addEventListener(
    "message",
    r(this, c, F).bind(this)
  );
}, F = function(t) {
  const n = t.data;
  n.action === A.Reattach && r(this, c, N).call(this, n.data);
}, y = function(t, n, o) {
  const i = new ee();
  i.onclick = () => {
    r(this, c, L).call(this, t, n);
  }, o.unshift(i);
}, L = function(t, n) {
  const { width: o, height: i } = n.options, h = n.document.id;
  h && (Z({ id: h, type: t }), n.close(), window.open(
    "/game?sheetView=1",
    `sheet-o-scope-secondary-${h}`,
    `popup=true,width=${o},height=${i}`
  ));
}, N = function(t) {
  const { id: n, type: o } = t, i = W(n, o);
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
var E, $;
class ne {
  constructor() {
    u(this, E);
  }
  run() {
    const e = r(this, E, $);
    libWrapper.register(
      "sheet-o-scope",
      "Notifications.prototype.notify",
      function(t, ...n) {
        return e(n) ? -1 : t(...n);
      }
    );
  }
}
E = new WeakSet(), $ = function(e) {
  const [t, n] = e;
  return !!(n === "info" && t.includes("not displayed because the game Canvas is disabled") || n === "error" && t.includes(
    "Foundry Virtual Tabletop requires a minimum screen resolution"
  ));
};
var I, _;
class oe {
  constructor() {
    u(this, I);
  }
  run() {
    const e = r(this, I, _);
    libWrapper.register(
      "sheet-o-scope",
      "Application.prototype.render",
      function(t, ...n) {
        return e(this) ? this : t(...n);
      }
    );
  }
}
I = new WeakSet(), _ = function(e) {
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
  ne,
  oe,
  ie
];
var S, p, a, j, q, x, v, B, V;
class ae {
  constructor() {
    u(this, a);
    u(this, S);
    u(this, p);
    var e;
    H(this, p, !!window.opener && window.name.includes("sheet-o-scope")), Hooks.once("init", r(this, a, j).bind(this)), Hooks.once("ready", r(this, a, q).bind(this)), Hooks.on(
      "getActorSheetHeaderButtons",
      r(this, a, v).bind(this, d.Actor)
    ), Hooks.on(
      "getItemSheetHeaderButtons",
      r(this, a, v).bind(this, d.Item)
    ), Hooks.on(
      "getJournalSheetHeaderButtons",
      r(this, a, v).bind(this, d.Journal)
    ), Hooks.on("renderActorSheet", r(this, a, B).bind(this)), Hooks.on("renderItemSheet", r(this, a, B).bind(this)), Hooks.on("renderJournalSheet", r(this, a, B).bind(this)), (e = document.querySelector("body")) == null || e.classList.add("sheet-o-scope-secondary");
  }
}
S = new WeakMap(), p = new WeakMap(), a = new WeakSet(), j = function() {
  H(this, S, new P()), re.forEach((e) => {
    new e().run();
  });
}, q = function() {
  const e = Q();
  if (!e)
    return;
  const { id: t, type: n } = e, o = W(t, n);
  if (o) {
    const i = {};
    g(this, p) && (i.resizable = !1, window.addEventListener(
      "resize",
      r(this, a, x).bind(this, o)
    )), i.minimizable = !1, o.render(!0, i);
  }
}, x = function(e) {
  e && e.setPosition({
    width: window.innerWidth,
    height: window.innerHeight
  });
}, v = function(e, t, n) {
  const o = t.document.id;
  if (!o)
    return;
  const i = n.find((k) => k.class === "close");
  i && (i.onclick = () => {
    window.close();
  });
  const h = new se();
  h.onclick = () => {
    r(this, a, V).call(this, e, o);
  }, n.unshift(h);
}, B = function(e, t) {
  g(this, p) && t[0].classList.add("secondary-window-sheet");
}, V = function(e, t) {
  var n;
  (n = g(this, S)) == null || n.send(A.Reattach, { id: t, type: e }), window.close();
};
const ce = window.location.toString(), T = Y(ce);
T === w.Main ? new te() : T === w.Secondary && new ae();
