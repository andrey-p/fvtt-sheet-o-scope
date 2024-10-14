var fe = Object.defineProperty;
var j = (i) => {
  throw TypeError(i);
};
var pe = (i, t, e) => t in i ? fe(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var S = (i, t, e) => pe(i, typeof t != "symbol" ? t + "" : t, e), N = (i, t, e) => t.has(i) || j("Cannot " + e);
var h = (i, t, e) => (N(i, t, "read from private field"), e ? e.call(i) : t.get(i)), u = (i, t, e) => t.has(i) ? j("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(i) : t.set(i, e), c = (i, t, e, s) => (N(i, t, "write to private field"), s ? s.call(i, e) : t.set(i, e), e), o = (i, t, e) => (N(i, t, "access private method"), e);
var $ = /* @__PURE__ */ ((i) => (i.Main = "main", i.Secondary = "secondary", i))($ || {});
function me(i) {
  return new URL(i).searchParams.get("sheetView") ? $.Secondary : $.Main;
}
var y = /* @__PURE__ */ ((i) => (i.Actor = "actor", i.Item = "item", i.Journal = "journal", i))(y || {});
function z() {
  return game;
}
function Y(i, t) {
  var s, r, a, d, l, k;
  const e = z();
  if (t === y.Actor)
    return (r = (s = e.actors) == null ? void 0 : s.get(i)) == null ? void 0 : r.sheet;
  if (t === y.Item)
    return (d = (a = e.items) == null ? void 0 : a.get(i)) == null ? void 0 : d.sheet;
  if (t === y.Journal)
    return (k = (l = e.journal) == null ? void 0 : l.get(i)) == null ? void 0 : k.sheet;
}
async function X(i) {
  var s;
  const e = (s = z().users) == null ? void 0 : s.current;
  if (e) {
    const r = await e.getFlag("sheet-o-scope", i);
    try {
      return JSON.parse(r);
    } catch {
    }
  }
  return null;
}
async function K(i, t) {
  var r;
  const s = (r = z().users) == null ? void 0 : r.current;
  s && await s.setFlag("sheet-o-scope", i, JSON.stringify(t));
}
function G(i) {
  return z().i18n.localize(i);
}
const ye = 5 * 60 * 1e3;
async function Se() {
  const i = await X("openableSheets") || [], t = [];
  let e;
  for (; i.length; )
    e = i.shift(), e && e.created && e.created > Date.now() - ye && t.push(e);
  return await K("openableSheets", i), t;
}
async function be(i) {
  let t = await X("openableSheets");
  i.created = Date.now(), t ? t.push(i) : t = [i], await K("openableSheets", t);
}
var p = /* @__PURE__ */ ((i) => (i.Reattach = "reattach", i.Refresh = "refresh", i.Ping = "ping", i.PingBack = "pingBack", i.Log = "log", i))(p || {}), w = /* @__PURE__ */ ((i) => (i.Log = "log", i.Warn = "warn", i.Error = "error", i))(w || {}), B, P, I, Z, ee;
class Q extends EventTarget {
  constructor() {
    super();
    u(this, I);
    u(this, B);
    u(this, P);
    const e = z();
    if (!e.socket || !e.userId)
      throw new Error(
        "can't initialise websocket module before game is initialised"
      );
    c(this, B, e.socket), c(this, P, e.userId), h(this, B).on("module.sheet-o-scope", o(this, I, Z).bind(this));
  }
  send(e, s) {
    const r = {
      sender: h(this, P),
      action: e,
      data: s
    };
    h(this, B).emit("module.sheet-o-scope", r);
  }
}
B = new WeakMap(), P = new WeakMap(), I = new WeakSet(), Z = function(e) {
  o(this, I, ee).call(this, e) && this.dispatchEvent(new MessageEvent("message", { data: e }));
}, ee = function(e) {
  return e.sender === h(this, P);
};
class ke {
  constructor() {
    S(this, "label", "SHEET-O-SCOPE.detach");
    S(this, "class", "sheet-detach");
    S(this, "icon", "fa-solid fa-arrow-right-from-bracket");
    S(this, "onclick", null);
  }
}
var H, v, g, te, ie, D, se, ne, oe;
class He extends EventTarget {
  constructor() {
    super();
    u(this, g);
    u(this, H);
    u(this, v);
    c(this, v, !1), Hooks.once("ready", o(this, g, te).bind(this));
  }
}
H = new WeakMap(), v = new WeakMap(), g = new WeakSet(), te = function() {
  var s, r, a;
  const e = z();
  if (!((s = e.modules.get("lib-wrapper")) != null && s.active) && ((r = e.user) != null && r.isGM)) {
    (a = ui.notifications) == null || a.error(G("SHEET-O-SCOPE.noLibWrapperWarning"));
    return;
  }
  w.Log, Hooks.on(
    "getActorSheetHeaderButtons",
    o(this, g, D).bind(this, y.Actor)
  ), Hooks.on(
    "getItemSheetHeaderButtons",
    o(this, g, D).bind(this, y.Item)
  ), Hooks.on(
    "getJournalSheetHeaderButtons",
    o(this, g, D).bind(this, y.Journal)
  ), c(this, H, new Q()), h(this, H).addEventListener(
    "message",
    o(this, g, ie).bind(this)
  );
}, ie = function(e) {
  const s = e.data;
  if (s.action === p.Reattach)
    o(this, g, ne).call(this, s.data);
  else if (s.action === p.PingBack)
    c(this, v, !1);
  else if (s.action === p.Log) {
    const r = s.data;
    r.type, `${r.message}`;
  }
}, D = function(e, s, r) {
  const a = new ke();
  a.onclick = () => {
    o(this, g, se).call(this, e, s);
  }, r.unshift(a);
}, se = async function(e, s) {
  var k, T;
  const { width: r, height: a } = s.options, d = s.document.id;
  if (!d)
    return;
  await be({ id: d, type: e }), s.close(), await o(this, g, oe).call(this) ? (k = h(this, H)) == null || k.send(p.Refresh) : h(this, v) ? (T = ui.notifications) == null || T.error(G("SHEET-O-SCOPE.loadingDetachWarning")) : (c(this, v, !0), window.open(
    "/game?sheetView=1",
    `sheet-o-scope-secondary-${d}`,
    `popup=true,width=${r},height=${a}`
  ));
}, ne = function(e) {
  const { id: s, type: r } = e, a = Y(s, r);
  a && a.render(!0);
}, oe = async function() {
  const e = h(this, H);
  if (!e)
    throw new Error("Can't ping if socket handler isn't initialized!");
  const s = new Promise((r) => {
    let a;
    const d = (l) => {
      l.data.action === p.PingBack && (e.removeEventListener("message", d), clearTimeout(a), r(!0));
    };
    a = setTimeout(() => {
      e.removeEventListener("message", d), r(!1);
    }, 1e3), e.addEventListener("message", d);
  });
  return e.send(p.Ping), s;
};
const V = 700;
var E, M, O;
class ve {
  constructor(t, e) {
    u(this, E);
    u(this, M);
    u(this, O);
    c(this, E, t), c(this, M, e), c(this, O, !1);
  }
  resizeViewport(t) {
    c(this, E, t), c(this, O, !0);
  }
  getLayout(t) {
    const e = h(this, E).height;
    let s = 0;
    const r = [];
    t.forEach((d) => {
      const l = d.options.width || V;
      r.push({
        x: s,
        y: 0,
        width: l,
        height: e
      }), s += l;
    });
    let a;
    return h(this, O) ? a = h(this, E).width : (a = Math.min(s, h(this, M)), a === 0 && (a = V)), {
      viewport: {
        width: a,
        height: e
      },
      sheets: r
    };
  }
}
E = new WeakMap(), M = new WeakMap(), O = new WeakMap();
class Ee {
  constructor() {
    S(this, "label", "SHEET-O-SCOPE.reattach");
    S(this, "class", "sheet-reattach");
    S(this, "icon", "fa-solid fa-arrow-right-to-bracket");
    S(this, "onclick", null);
  }
}
var A, re;
class We {
  constructor() {
    u(this, A);
  }
  run() {
    const t = o(this, A, re);
    libWrapper.register(
      "sheet-o-scope",
      "Notifications.prototype.notify",
      function(e, ...s) {
        return t(s) ? -1 : e(...s);
      }
    );
  }
}
A = new WeakSet(), re = function(t) {
  const [e, s] = t;
  return !!(s === "info" && e.includes("not displayed because the game Canvas is disabled") || s === "error" && e.includes(
    "Foundry Virtual Tabletop requires a minimum screen resolution"
  ));
};
var J, ae;
class Le {
  constructor() {
    u(this, J);
  }
  run() {
    const t = o(this, J, ae);
    libWrapper.register(
      "sheet-o-scope",
      "Application.prototype.render",
      function(e, ...s) {
        return t(this) ? this : e(...s);
      }
    );
  }
}
J = new WeakSet(), ae = function(t) {
  return !![
    "navigation",
    "sidebar",
    "players",
    "hotbar",
    "pause",
    "controls"
  ].includes(t.options.id);
};
class Be {
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
const Pe = [
  We,
  Le,
  Be
];
var b, W, R, L, m, n, he, ce, de, F, C, le, ue, U, x, ge, _, f, we;
class Oe {
  constructor() {
    u(this, n);
    u(this, b);
    u(this, W);
    u(this, R);
    u(this, L);
    u(this, m);
    var e;
    c(this, m, []), c(this, R, !!window.opener && window.name.includes("sheet-o-scope")), c(this, W, new ve(
      { width: window.innerWidth, height: window.innerHeight },
      window.screen.availWidth
    )), c(this, L, !1), Hooks.once("init", o(this, n, he).bind(this)), Hooks.once("ready", o(this, n, ce).bind(this)), Hooks.on(
      "getActorSheetHeaderButtons",
      o(this, n, U).bind(this, y.Actor)
    ), Hooks.on(
      "getItemSheetHeaderButtons",
      o(this, n, U).bind(this, y.Item)
    ), Hooks.on(
      "getJournalSheetHeaderButtons",
      o(this, n, U).bind(this, y.Journal)
    ), Hooks.on("renderActorSheet", o(this, n, x).bind(this)), Hooks.on("renderItemSheet", o(this, n, x).bind(this)), Hooks.on("renderJournalSheet", o(this, n, x).bind(this)), (e = document.querySelector("body")) == null || e.classList.add("sheet-o-scope-secondary");
    const t = foundry.utils.throttle(o(this, n, ue), 1e3).bind(this);
    window.addEventListener("resize", t);
  }
}
b = new WeakMap(), W = new WeakMap(), R = new WeakMap(), L = new WeakMap(), m = new WeakMap(), n = new WeakSet(), he = function() {
  Pe.forEach((t) => {
    new t().run();
  });
}, ce = async function() {
  c(this, b, new Q()), h(this, b).addEventListener(
    "message",
    o(this, n, we).bind(this)
  ), h(this, b).send(p.PingBack), o(this, n, F).call(this);
}, de = function(t) {
  if (window.innerWidth === t.width && window.innerHeight === t.height)
    return;
  o(this, n, f).call(this, w.Log, "resizing secondary window");
  const e = t.width + window.outerWidth - window.innerWidth, s = t.height + window.outerHeight - window.innerHeight;
  window.resizeTo(e, s);
}, F = async function() {
  const t = await Se();
  o(this, n, f).call(this, w.Log, `opening sheets after refresh: ${t.map((s) => s.id).join(", ")}`);
  const e = t.map((s) => o(this, n, le).call(this, s));
  await Promise.all(e), o(this, n, C).call(this);
}, C = async function() {
  const t = h(this, W).getLayout(h(this, m));
  o(this, n, f).call(this, w.Log, "starting relayout..."), o(this, n, f).call(this, w.Log, `secondary window dimensions: ${t.viewport.width}x${t.viewport.height}`), o(this, n, f).call(this, w.Log, `number of sheets: ${t.sheets.length}`), c(this, L, !0), o(this, n, de).call(this, t.viewport);
  const e = h(this, m).map((s, r) => {
    const { x: a, y: d, width: l, height: k } = t.sheets[r];
    try {
      return s.setPosition({
        left: a,
        top: d,
        width: l,
        height: k
      });
    } catch (T) {
      o(this, n, f).call(this, w.Warn, `Couldn't reposition sheet ${s.id}: ${T.message}`);
    }
    return Promise.resolve();
  });
  await Promise.all(e), c(this, L, !1);
}, le = async function(t) {
  if (!t)
    return;
  const { id: e, type: s } = t, r = Y(e, s);
  if (r) {
    const a = {};
    h(this, m).push(r);
    const l = h(this, W).getLayout(h(this, m)).sheets.pop();
    l && (a.left = l.x, a.right = l.y, a.width = l.width, a.height = l.height), h(this, R) && (a.resizable = !1), a.minimizable = !1, o(this, n, f).call(this, w.Log, `Opening sheet for ${s} with ID: ${e}`), await r.render(!0, a);
  } else
    o(this, n, f).call(this, w.Warn, `Couldn't find sheet for ${s} with ID: ${e}`);
}, ue = function() {
  h(this, L) || (h(this, W).resizeViewport({
    width: window.innerWidth,
    height: window.innerHeight
  }), o(this, n, f).call(this, w.Log, "secondary window manually resized - it will no longer be automatically resized by this module"), o(this, n, C).call(this));
}, // tweak the buttons that appear at the top of each sheet in the secondary screen
U = function(t, e, s) {
  const r = e.document.id;
  if (!r)
    return;
  const a = s.find((l) => l.class === "close");
  a && (a.onclick = () => {
    o(this, n, _).call(this, e.id);
  });
  const d = new Ee();
  d.onclick = () => {
    o(this, n, ge).call(this, t, r, e.id);
  }, s.unshift(d);
}, // tweak the sheet itself
x = function(t, e) {
  h(this, R) && e[0].classList.add("secondary-window-sheet");
}, ge = function(t, e, s) {
  var r;
  o(this, n, f).call(this, w.Log, `reattaching sheet with id: ${s}`), (r = h(this, b)) == null || r.send(p.Reattach, { id: e, type: t }), o(this, n, _).call(this, s);
}, _ = function(t) {
  o(this, n, f).call(this, w.Log, `closing sheet with id: ${t}`);
  const e = h(this, m).findIndex((r) => r.id === t);
  if (e === -1) {
    o(this, n, f).call(this, w.Warn, `couldn't find sheet with id: ${t}`);
    return;
  }
  h(this, m).splice(e, 1)[0].close(), h(this, m).length ? o(this, n, C).call(this) : window.close();
}, // send any logs to the main window
f = function(t, e) {
  var s;
  (s = h(this, b)) == null || s.send(p.Log, { type: t, message: e });
}, we = function(t) {
  var s;
  const e = t.data;
  e.action === p.Ping ? (s = h(this, b)) == null || s.send(p.PingBack) : e.action === p.Refresh && o(this, n, F).call(this);
};
const Re = window.location.toString(), q = me(Re);
q === $.Main ? new He() : q === $.Secondary && new Oe();
