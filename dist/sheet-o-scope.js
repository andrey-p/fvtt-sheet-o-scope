var be = Object.defineProperty;
var X = (i) => {
  throw TypeError(i);
};
var He = (i, e, t) => e in i ? be(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var E = (i, e, t) => He(i, typeof e != "symbol" ? e + "" : e, t), G = (i, e, t) => e.has(i) || X("Cannot " + t);
var a = (i, e, t) => (G(i, e, "read from private field"), t ? t.call(i) : e.get(i)), d = (i, e, t) => e.has(i) ? X("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(i) : e.set(i, t), l = (i, e, t, s) => (G(i, e, "write to private field"), s ? s.call(i, t) : e.set(i, t), t), n = (i, e, t) => (G(i, e, "access private method"), t);
var I = /* @__PURE__ */ ((i) => (i.Main = "main", i.Secondary = "secondary", i))(I || {});
function ve(i) {
  return new URL(i).searchParams.get("sheetView") ? I.Secondary : I.Main;
}
var S = /* @__PURE__ */ ((i) => (i.Actor = "actor", i.Item = "item", i.Journal = "journal", i))(S || {});
function H() {
  return game;
}
function Z(i, e) {
  var s, r, h, g, c, y;
  const t = H();
  if (e === S.Actor)
    return (r = (s = t.actors) == null ? void 0 : s.get(i)) == null ? void 0 : r.sheet;
  if (e === S.Item)
    return (g = (h = t.items) == null ? void 0 : h.get(i)) == null ? void 0 : g.sheet;
  if (e === S.Journal)
    return (y = (c = t.journal) == null ? void 0 : c.get(i)) == null ? void 0 : y.sheet;
}
async function ee(i) {
  var s;
  const t = (s = H().users) == null ? void 0 : s.current;
  if (t) {
    const r = await t.getFlag("sheet-o-scope", i);
    try {
      return JSON.parse(r);
    } catch {
    }
  }
  return null;
}
async function te(i, e) {
  var r;
  const s = (r = H().users) == null ? void 0 : r.current;
  s && await s.setFlag("sheet-o-scope", i, JSON.stringify(e));
}
function $(i) {
  const e = H();
  if (!e || !e.i18n || !e.i18n.localize)
    throw new Error("this helper can only be used after Foundry's initialized");
  return e.i18n.localize(i);
}
const Oe = 5 * 60 * 1e3;
async function Pe() {
  const i = await ee("openableSheets") || [], e = [];
  let t;
  for (; i.length; )
    t = i.shift(), t && t.created && t.created > Date.now() - Oe && e.push(t);
  return await te("openableSheets", i), e;
}
async function Me(i) {
  let e = await ee("openableSheets");
  i.created = Date.now(), e ? e.push(i) : e = [i], await te("openableSheets", e);
}
var m = /* @__PURE__ */ ((i) => (i.Reattach = "reattach", i.Refresh = "refresh", i.Ping = "ping", i.PingBack = "pingBack", i.Log = "log", i))(m || {}), w = /* @__PURE__ */ ((i) => (i.Log = "log", i.Warn = "warn", i.Error = "error", i))(w || {}), F = /* @__PURE__ */ ((i) => (i.Sticky = "sticky", i.Normal = "normal", i))(F || {}), L = /* @__PURE__ */ ((i) => (i.Controlled = "controlled", i.Uncontrolled = "uncontrolled", i))(L || {}), B, C, z, se, ne;
class ie extends EventTarget {
  constructor() {
    super();
    d(this, z);
    d(this, B);
    d(this, C);
    const t = H();
    if (!t.socket || !t.userId)
      throw new Error(
        "can't initialise websocket module before game is initialised"
      );
    l(this, B, t.socket), l(this, C, t.userId), a(this, B).on("module.sheet-o-scope", n(this, z, se).bind(this));
  }
  send(t, s) {
    const r = {
      sender: a(this, C),
      action: t,
      data: s
    };
    a(this, B).emit("module.sheet-o-scope", r);
  }
}
B = new WeakMap(), C = new WeakMap(), z = new WeakSet(), se = function(t) {
  n(this, z, ne).call(this, t) && this.dispatchEvent(new MessageEvent("message", { data: t }));
}, ne = function(t) {
  return t.sender === a(this, C);
};
class We {
  constructor() {
    E(this, "label", "SHEET-O-SCOPE.detach");
    E(this, "class", "sheet-detach");
    E(this, "icon", "fa-solid fa-arrow-right-from-bracket");
    E(this, "onclick", null);
  }
}
const Le = {
  namespace: "sheet-o-scope",
  key: "controlledMode",
  name: "SHEET-O-SCOPE.controlledMode",
  hint: "SHEET-O-SCOPE.controlledModeDescription",
  scope: "client",
  config: !0,
  type: String,
  choices: {
    [L.Controlled]: "SHEET-O-SCOPE.controlledModeControlled",
    [L.Uncontrolled]: "SHEET-O-SCOPE.controlledModeUncontrolled"
  },
  default: "controlled"
}, Be = {
  namespace: "sheet-o-scope",
  key: "stickyMode",
  name: "SHEET-O-SCOPE.stickyMode",
  hint: "SHEET-O-SCOPE.stickyModeDescription",
  scope: "client",
  config: !0,
  type: String,
  choices: {
    [F.Normal]: "SHEET-O-SCOPE.stickyModeNormal",
    [F.Sticky]: "SHEET-O-SCOPE.stickyModeSticky"
  },
  default: "normal"
};
var U, V;
class oe {
  constructor() {
    d(this, U);
  }
  async registerSettings() {
    await n(this, U, V).call(this, Le), await n(this, U, V).call(this, Be);
  }
  get(e) {
    return H().settings.get("sheet-o-scope", e);
  }
}
U = new WeakSet(), V = async function(e) {
  const t = H();
  if (e.name && (e.name = $(e.name)), e.hint && (e.hint = $(e.hint)), e.choices)
    for (const s in e.choices)
      e.choices[s] = $(e.choices[s]);
  await t.settings.register("sheet-o-scope", e.key, e);
};
var v, O, T, u, re, ae, N, he, ce, de;
class Ce {
  constructor() {
    d(this, u);
    d(this, v);
    d(this, O);
    d(this, T);
    l(this, O, !1), Hooks.once("ready", n(this, u, re).bind(this)), l(this, T, new oe());
  }
}
v = new WeakMap(), O = new WeakMap(), T = new WeakMap(), u = new WeakSet(), re = async function() {
  var t, s, r;
  const e = H();
  if (!((t = e.modules.get("lib-wrapper")) != null && t.active) && ((s = e.user) != null && s.isGM)) {
    (r = ui.notifications) == null || r.error($("SHEET-O-SCOPE.noLibWrapperWarning"));
    return;
  }
  w.Log, Hooks.on(
    "getActorSheetHeaderButtons",
    n(this, u, N).bind(this, S.Actor)
  ), Hooks.on(
    "getItemSheetHeaderButtons",
    n(this, u, N).bind(this, S.Item)
  ), Hooks.on(
    "getJournalSheetHeaderButtons",
    n(this, u, N).bind(this, S.Journal)
  ), l(this, v, new ie()), a(this, v).addEventListener(
    "message",
    n(this, u, ae).bind(this)
  ), await a(this, T).registerSettings();
}, ae = function(e) {
  const t = e.data;
  if (t.action === m.Reattach)
    n(this, u, ce).call(this, t.data);
  else if (t.action === m.PingBack)
    l(this, O, !1);
  else if (t.action === m.Log) {
    const s = t.data;
    s.type, `${s.message}`;
  }
}, N = function(e, t, s) {
  const r = new We();
  r.onclick = () => {
    n(this, u, he).call(this, e, t);
  }, s.unshift(r);
}, he = async function(e, t) {
  var h, g;
  const s = t.document.id;
  if (!s)
    return;
  if (await Me({ id: s, type: e }), t.close(), await n(this, u, de).call(this))
    (h = a(this, v)) == null || h.send(m.Refresh);
  else if (a(this, O))
    (g = ui.notifications) == null || g.error($("SHEET-O-SCOPE.loadingDetachWarning"));
  else {
    l(this, O, !0);
    let { width: c, height: y } = t.options;
    c || (c = 600), (typeof y == "string" || !y) && (y = 700), a(this, T).get("controlledMode") === L.Uncontrolled && (c += 100, y += 100), window.open(
      "/game?sheetView=1",
      `sheet-o-scope-secondary-${s}`,
      `popup=true,width=${c},height=${y}`
    );
  }
}, ce = function(e) {
  const { id: t, type: s } = e, r = Z(t, s);
  r && r.render(!0);
}, de = async function() {
  const e = a(this, v);
  if (!e)
    throw new Error("Can't ping if socket handler isn't initialized!");
  const t = new Promise((s) => {
    let r;
    const h = (g) => {
      g.data.action === m.PingBack && (e.removeEventListener("message", h), clearTimeout(r), s(!0));
    };
    r = setTimeout(() => {
      e.removeEventListener("message", h), s(!1);
    }, 1e3), e.addEventListener("message", h);
  });
  return e.send(m.Ping), t;
};
const K = 700;
var P, D, R;
class Te {
  constructor(e, t) {
    d(this, P);
    d(this, D);
    d(this, R);
    l(this, P, e), l(this, D, t), l(this, R, !1);
  }
  resizeViewport(e) {
    l(this, P, e), l(this, R, !0);
  }
  getLayout(e) {
    const t = a(this, P).height;
    let s = 0;
    const r = [];
    e.forEach((g) => {
      const c = g.options.width || K;
      r.push({
        x: s,
        y: 0,
        width: c,
        height: t
      }), s += c;
    });
    let h;
    return a(this, R) ? h = a(this, P).width : (h = Math.min(s, a(this, D)), h === 0 && (h = K)), {
      viewport: {
        width: h,
        height: t
      },
      sheets: r
    };
  }
}
P = new WeakMap(), D = new WeakMap(), R = new WeakMap();
class Re {
  constructor() {
    E(this, "label", "SHEET-O-SCOPE.reattach");
    E(this, "class", "sheet-reattach");
    E(this, "icon", "fa-solid fa-arrow-right-to-bracket");
    E(this, "onclick", null);
  }
}
var _, le;
class ze {
  constructor() {
    d(this, _);
  }
  run() {
    const e = n(this, _, le);
    libWrapper.register(
      "sheet-o-scope",
      "Notifications.prototype.notify",
      function(t, ...s) {
        return e(s) ? -1 : t(...s);
      }
    );
  }
}
_ = new WeakSet(), le = function(e) {
  const [t, s] = e;
  return !!(s === "info" && t.includes("not displayed because the game Canvas is disabled") || s === "error" && t.includes(
    "Foundry Virtual Tabletop requires a minimum screen resolution"
  ));
};
var j, ue;
class $e {
  constructor() {
    d(this, j);
  }
  run() {
    const e = n(this, j, ue);
    libWrapper.register(
      "sheet-o-scope",
      "Application.prototype.render",
      function(t, ...s) {
        return e(this) ? this : t(...s);
      }
    );
  }
}
j = new WeakSet(), ue = function(e) {
  return !![
    "navigation",
    "sidebar",
    "players",
    "hotbar",
    "pause",
    "controls"
  ].includes(e.options.id);
};
class Ie {
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
const Ue = [
  ze,
  $e,
  Ie
];
var k, M, b, W, p, o, ge, we, fe, q, A, me, pe, J, x, ye, Y, f, Se;
class De {
  constructor() {
    d(this, o);
    d(this, k);
    d(this, M);
    d(this, b);
    d(this, W);
    d(this, p);
    var t;
    l(this, p, []), l(this, b, new oe()), l(this, M, new Te(
      { width: window.innerWidth, height: window.innerHeight },
      window.screen.availWidth
    )), l(this, W, !1), Hooks.once("init", n(this, o, ge).bind(this)), Hooks.once("ready", n(this, o, we).bind(this)), Hooks.on(
      "getActorSheetHeaderButtons",
      n(this, o, J).bind(this, S.Actor)
    ), Hooks.on(
      "getItemSheetHeaderButtons",
      n(this, o, J).bind(this, S.Item)
    ), Hooks.on(
      "getJournalSheetHeaderButtons",
      n(this, o, J).bind(this, S.Journal)
    ), Hooks.on("renderActorSheet", n(this, o, x).bind(this)), Hooks.on("renderItemSheet", n(this, o, x).bind(this)), Hooks.on("renderJournalSheet", n(this, o, x).bind(this)), (t = document.querySelector("body")) == null || t.classList.add("sheet-o-scope-secondary");
    const e = foundry.utils.throttle(n(this, o, pe), 1e3).bind(this);
    window.addEventListener("resize", e);
  }
}
k = new WeakMap(), M = new WeakMap(), b = new WeakMap(), W = new WeakMap(), p = new WeakMap(), o = new WeakSet(), ge = async function() {
  Ue.forEach((e) => {
    new e().run();
  }), await a(this, b).registerSettings();
}, we = async function() {
  l(this, k, new ie()), a(this, k).addEventListener(
    "message",
    n(this, o, Se).bind(this)
  ), a(this, k).send(m.PingBack), n(this, o, q).call(this);
}, fe = function(e) {
  if (window.innerWidth === e.width && window.innerHeight === e.height)
    return;
  n(this, o, f).call(this, w.Log, "resizing secondary window");
  const t = e.width + window.outerWidth - window.innerWidth, s = e.height + window.outerHeight - window.innerHeight;
  window.resizeTo(t, s);
}, q = async function() {
  const e = await Pe();
  n(this, o, f).call(this, w.Log, `opening sheets after refresh: ${e.map((s) => s.id).join(", ")}`);
  const t = e.map((s) => n(this, o, me).call(this, s));
  await Promise.all(t), n(this, o, A).call(this);
}, A = async function() {
  if (a(this, b).get("controlledMode") === L.Uncontrolled)
    return;
  const t = a(this, M).getLayout(a(this, p));
  n(this, o, f).call(this, w.Log, "starting relayout..."), n(this, o, f).call(this, w.Log, `secondary window dimensions: ${t.viewport.width}x${t.viewport.height}`), n(this, o, f).call(this, w.Log, `number of sheets: ${t.sheets.length}`), l(this, W, !0), n(this, o, fe).call(this, t.viewport);
  const s = a(this, p).map((r, h) => {
    const { x: g, y: c, width: y, height: Ee } = t.sheets[h];
    try {
      return r.setPosition({
        left: g,
        top: c,
        width: y,
        height: Ee
      });
    } catch (ke) {
      n(this, o, f).call(this, w.Warn, `Couldn't reposition sheet ${r.id}: ${ke.message}`);
    }
    return Promise.resolve();
  });
  await Promise.all(s), l(this, W, !1);
}, me = async function(e) {
  if (!e)
    return;
  const { id: t, type: s } = e, r = Z(t, s);
  if (r) {
    const h = {};
    a(this, p).push(r);
    const c = a(this, M).getLayout(a(this, p)).sheets.pop();
    c && (h.left = c.x, h.right = c.y, h.width = c.width, h.height = c.height), a(this, b).get("controlledMode") === L.Controlled && (h.resizable = !1), h.minimizable = !1, n(this, o, f).call(this, w.Log, `Opening sheet for ${s} with ID: ${t}`), await r.render(!0, h);
  } else
    n(this, o, f).call(this, w.Warn, `Couldn't find sheet for ${s} with ID: ${t}`);
}, pe = function() {
  a(this, W) || (a(this, M).resizeViewport({
    width: window.innerWidth,
    height: window.innerHeight
  }), n(this, o, f).call(this, w.Log, "secondary window manually resized - it will no longer be automatically resized by this module"), n(this, o, A).call(this));
}, // tweak the buttons that appear at the top of each sheet in the secondary screen
J = function(e, t, s) {
  const r = t.document.id;
  if (!r)
    return;
  const h = s.find((c) => c.class === "close");
  h && (h.onclick = () => {
    n(this, o, Y).call(this, t.id);
  });
  const g = new Re();
  g.onclick = () => {
    n(this, o, ye).call(this, e, r, t.id);
  }, s.unshift(g);
}, // tweak the sheet itself
x = function(e, t) {
  a(this, b).get("controlledMode") === L.Controlled && t[0].classList.add("controlled-sheet");
}, ye = function(e, t, s) {
  var r;
  n(this, o, f).call(this, w.Log, `reattaching sheet with id: ${s}`), (r = a(this, k)) == null || r.send(m.Reattach, { id: t, type: e }), n(this, o, Y).call(this, s);
}, Y = function(e) {
  n(this, o, f).call(this, w.Log, `closing sheet with id: ${e}`);
  const t = a(this, p).findIndex((h) => h.id === e);
  if (t === -1) {
    n(this, o, f).call(this, w.Warn, `couldn't find sheet with id: ${e}`);
    return;
  }
  a(this, p).splice(t, 1)[0].close();
  const r = a(this, b).get("stickyMode");
  !a(this, p).length && r === F.Normal ? window.close() : n(this, o, A).call(this);
}, // send any logs to the main window
f = function(e, t) {
  var s;
  (s = a(this, k)) == null || s.send(m.Log, { type: e, message: t });
}, Se = function(e) {
  var s;
  const t = e.data;
  t.action === m.Ping ? (s = a(this, k)) == null || s.send(m.PingBack) : t.action === m.Refresh && n(this, o, q).call(this);
};
const Ne = window.location.toString(), Q = ve(Ne);
Q === I.Main ? new Ce() : Q === I.Secondary && new De();
