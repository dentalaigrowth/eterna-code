import "./admin.css";
import { supabase, CONTENT_TABLES } from "./supabase.js";
import { ADMIN_EMAIL_DOMAIN } from "./config.js";
import { runImport } from "./import.js";
import { renderGenericList, renderGenericForm } from "./screens.js";
import { productsConfig, loadProductOptions, buildProductFields } from "./product-config.js";

const root = document.getElementById("admin");
let session = null;

async function bootstrap() {
  const { data } = await supabase.auth.getSession();
  session = data.session;
  supabase.auth.onAuthStateChange((_event, s) => {
    session = s;
    render();
  });
  render();
}

function render() {
  if (session) renderApp();
  else renderLogin();
}

function renderLogin() {
  root.innerHTML = "";
  const w = el("div", "login-wrap");
  const form = el("form", "login");
  form.innerHTML =
    '<div class="brand">ETERNA</div>' +
    '<h1>Panou i administrimit</h1>' +
    '<div class="fld"><label for="u">Përdoruesi</label><input id="u" name="username" autocomplete="username" required></div>' +
    '<div class="fld"><label for="p">Fjalëkalimi</label><input id="p" name="password" type="password" autocomplete="current-password" required></div>' +
    '<p class="err" id="err"></p>' +
    '<button class="btn" type="submit" id="submit">Hyr</button>';
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = form.querySelector("#err");
    const btn = form.querySelector("#submit");
    const username = form.querySelector("#u").value.trim();
    const password = form.querySelector("#p").value;
    if (!username || !password) {
      err.textContent = "Plotëso përdoruesin dhe fjalëkalimin.";
      return;
    }
    btn.disabled = true;
    err.textContent = "";
    const email =
      username.indexOf("@") > -1 ? username : username + "@" + ADMIN_EMAIL_DOMAIN;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      err.textContent = "Username ose fjalëkalimi i gabuar";
      btn.disabled = false;
    }
  });
  w.appendChild(form);
  root.appendChild(w);
}

const NAV = [
  { id: "dashboard", label: "Dashboard" },
  { id: "products", label: "Produktet" },
  { id: "categories", label: "Kategoritë" },
  { id: "brands", label: "Markat" },
  { id: "rooms", label: "Dhomat" },
  { id: "designers", label: "Projektuesit" },
  { id: "articles", label: "Journal" },
  { id: "pages", label: "Faqet" },
  { id: "strings", label: "Tekstet e faqes" },
  { id: "settings", label: "Cilësimet" },
];

let view = parseHash();
window.addEventListener("hashchange", () => {
  view = parseHash();
  if (session) {
    const main = document.getElementById("main");
    if (main) renderSection(main);
    syncSidebar();
  }
});

function parseHash() {
  const h = (location.hash || "").replace(/^#/, "");
  const parts = h.split("/");
  return { section: parts[0] || "dashboard", arg: parts[1] || "" };
}

function renderApp() {
  root.innerHTML = "";
  const shell = el("div", "shell");
  shell.appendChild(sidebar());
  const main = el("div", "main");
  main.id = "main";
  shell.appendChild(main);
  root.appendChild(shell);
  renderSection(main);
}

function sidebar() {
  const side = el("aside", "side");
  const brand = el("div", "brand");
  brand.textContent = "ETERNA";
  side.appendChild(brand);
  for (const item of NAV) {
    const a = el("a");
    a.href = "#" + item.id;
    a.textContent = item.label;
    a.dataset.nav = item.id;
    if (view.section === item.id) a.classList.add("on");
    side.appendChild(a);
  }
  const spacer = el("div", "spacer");
  side.appendChild(spacer);
  const logout = el("a", "logout");
  logout.textContent = "Dilni";
  logout.href = "#";
  logout.addEventListener("click", async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
  });
  side.appendChild(logout);
  return side;
}

function syncSidebar() {
  document.querySelectorAll(".side a[data-nav]").forEach((a) => {
    a.classList.toggle("on", a.dataset.nav === view.section);
  });
}

async function renderSection(main) {
  main.innerHTML = '<p class="lead">Po ngarkohet…</p>';
  try {
    switch (view.section) {
      case "dashboard":
        return await renderDashboard(main);
      case "products":
        return view.arg
          ? await renderProductForm(main)
          : await renderGenericList(main, productsConfig);
      case "categories":
      case "brands":
      case "rooms":
      case "designers":
      case "articles":
        return await renderList(main, view.section);
      case "pages":
        return await renderPages(main);
      case "strings":
        return await renderStrings(main);
      case "settings":
        return renderSettings(main);
      default:
        return await renderDashboard(main);
    }
  } catch (e) {
    main.innerHTML = '<p class="err">Gabim: ' + esc(e.message) + "</p>";
  }
}

async function renderDashboard(main) {
  main.innerHTML = "";
  main.appendChild(h("h1", "Dashboard"));
  main.appendChild(p("lead", "Përmbledhje e të dhënave në databazë."));

  const tables = [
    ...CONTENT_TABLES,
    { table: "ui_strings", label: "Tekstet" },
    { table: "site_content", label: "Faqet" },
  ];
  const counts = await Promise.all(
    tables.map(async (t) => {
      const { count, error } = await supabase
        .from(t.table)
        .select("*", { count: "exact", head: true });
      return { label: t.label, n: error ? "—" : count };
    })
  );

  const cards = el("div", "cards");
  for (const c of counts) {
    const card = el("div", "card");
    card.innerHTML =
      '<span class="n">' + c.n + '</span><span class="l">' + esc(c.label) + "</span>";
    cards.appendChild(card);
  }
  main.appendChild(cards);

  const box = el("div", "import-box");
  box.innerHTML =
    "<h3>Importo të dhënat aktuale</h3>" +
    "<p>Kopjonë të gjitha të dhënat statike (data.js, data-designers.js dhe tekstet) në databazë. Mund ta xhirosh më shumë se një herë — përditëson rreshtat ekzistues.</p>" +
    '<button class="btn" id="import-btn">Importo të dhënat aktuale</button>' +
    '<p class="res" id="import-res"></p>';
  main.appendChild(box);

  box.querySelector("#import-btn").addEventListener("click", async () => {
    const btn = box.querySelector("#import-btn");
    const res = box.querySelector("#import-res");
    btn.disabled = true;
    btn.textContent = "Po importon…";
    res.textContent = "";
    res.style.color = "";
    try {
      const out = await runImport();
      const lines = [];
      for (const k in out) lines.push(k + ": " + out[k]);
      res.textContent = "U importua me sukses.\n" + lines.join("\n");
      res.style.color = "var(--ok)";
    } catch (e) {
      res.textContent = "Gabim: " + e.message;
      res.style.color = "var(--danger)";
    } finally {
      btn.disabled = false;
      btn.textContent = "Importo të dhënat aktuale";
    }
  });
}

async function renderList(main, table) {
  const meta = CONTENT_TABLES.find((t) => t.table === table);
  main.innerHTML = "";
  main.appendChild(h("h1", meta.label));
  main.appendChild(p("lead", "Të dhënat ruhen si JSON të plotë në kolonën data."));

  if (view.arg) return await renderEditor(main, table);

  const toolbar = el("div", "toolbar");
  const addBtn = el("button", "btn line");
  addBtn.textContent = "+ Shto të re";
  addBtn.addEventListener("click", () => {
    location.hash = table + "/new";
  });
  toolbar.appendChild(addBtn);
  main.appendChild(toolbar);

  const { data, error } = await supabase
    .from(table)
    .select("id, data, published, sort_order, updated_at")
    .order("sort_order");
  if (error) throw error;
  if (!data || !data.length) {
    main.appendChild(
      p(
        "empty",
        'Nuk ka rreshta. Përdor butonin "Importo të dhënat aktuale" në Dashboard.'
      )
    );
    return;
  }

  const t = el("table", "tbl");
  t.innerHTML =
    "<thead><tr><th>ID</th><th>Emri</th><th>Publikuar</th><th>Renditja</th><th>Përditësuar</th><th></th></tr></thead><tbody></tbody>";
  const body = t.querySelector("tbody");
  for (const row of data) {
    const tr = el("tr");
    const name = extractName(row.data);
    tr.innerHTML =
      '<td class="muted">' +
      esc(row.id) +
      "</td>" +
      "<td>" +
      esc(name) +
      "</td>" +
      "<td>" +
      (row.published
        ? '<span class="badge on">Po</span>'
        : '<span class="badge off">Jo</span>') +
      "</td>" +
      '<td class="muted">' +
      (row.sort_order ?? 0) +
      "</td>" +
      '<td class="muted">' +
      (row.updated_at ? new Date(row.updated_at).toLocaleString("sq") : "—") +
      "</td>" +
      '<td><a href="#' +
      table +
      "/" +
      encodeURIComponent(row.id) +
      '">Redakto</a></td>';
    body.appendChild(tr);
  }
  main.appendChild(t);
}

function extractName(data) {
  if (!data) return "—";
  if (typeof data.name === "string") return data.name;
  if (data.name && typeof data.name === "object")
    return data.name.en || data.name.sq || "—";
  if (data.title && typeof data.title === "object")
    return data.title.en || data.title.sq || "—";
  if (data.intro && typeof data.intro === "object")
    return (data.intro.en || data.intro.sq || "").slice(0, 40);
  if (data.bio && typeof data.bio === "object")
    return (data.bio.en || "").slice(0, 40);
  return "—";
}

async function renderEditor(main, table) {
  const id = decodeURIComponent(view.arg);
  const isNew = id === "new";
  let row = null;
  if (!isNew) {
    const { data, error } = await supabase
      .from(table)
      .select("id, data, published, sort_order")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    row = data;
    if (!row) {
      main.innerHTML = "";
      main.appendChild(p("empty", "Rreshti nuk u gjet."));
      const back = el("a", "back");
      back.href = "#" + table;
      back.textContent = "← Kthehu";
      main.appendChild(back);
      return;
    }
  }

  main.innerHTML = "";
  const back = el("a", "back");
  back.href = "#" + table;
  back.textContent = "← Kthehu te lista";
  main.appendChild(back);
  main.appendChild(h("h1", isNew ? "Shto të re" : "Redakto"));

  const editor = el("div", "editor");
  const meta = el("div", "meta");
  meta.innerHTML =
    '<div class="fld"><label>ID</label><input id="e-id" value="' +
    esc(isNew ? "" : id) +
    '" ' +
    (isNew ? "" : "readonly") +
    "></div>" +
    '<div class="fld"><label>Publikuar</label><select id="e-pub"><option value="true">Po</option><option value="false">Jo</option></select></div>' +
    '<div class="fld"><label>Renditja</label><input id="e-order" type="number" value="' +
    (row ? row.sort_order ?? 0 : 0) +
    '"></div>';
  editor.appendChild(meta);

  const jsonCol = el("div", "json");
  jsonCol.innerHTML =
    '<label style="font-size:.72rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)">Data (JSON)</label>' +
    '<textarea id="e-data" spellcheck="false">' +
    esc(JSON.stringify(row ? row.data : {}, null, 2)) +
    "</textarea>";
  editor.appendChild(jsonCol);

  const actions = el("div", "row-actions");
  const save = el("button", "btn");
  save.textContent = "Ruaj";
  const del = el("button", "btn line");
  del.textContent = "Fshi";
  actions.appendChild(save);
  if (!isNew) actions.appendChild(del);
  editor.appendChild(actions);
  main.appendChild(editor);

  if (row) meta.querySelector("#e-pub").value = String(row.published);

  save.addEventListener("click", async () => {
    save.disabled = true;
    save.textContent = "Po ruan…";
    try {
      const newId = meta.querySelector("#e-id").value.trim();
      const pubVal = meta.querySelector("#e-pub").value === "true";
      const order = parseInt(meta.querySelector("#e-order").value, 10) || 0;
      const dataObj = JSON.parse(jsonCol.querySelector("#e-data").value);
      if (!newId) throw new Error("ID nuk mund të jetë bosh.");
      const payload = {
        id: newId,
        data: dataObj,
        published: pubVal,
        sort_order: order,
      };
      const { error } = await supabase
        .from(table)
        .upsert(payload, { onConflict: "id" });
      if (error) throw error;
      location.hash = table;
    } catch (e) {
      alert("Gabim: " + e.message);
    } finally {
      save.disabled = false;
      save.textContent = "Ruaj";
    }
  });

  del.addEventListener("click", async () => {
    if (!confirm("Të fshihet ky rresht?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      alert("Gabim: " + error.message);
      return;
    }
    location.hash = table;
  });
}

async function renderPages(main) {
  main.innerHTML = "";
  main.appendChild(h("h1", "Faqet"));
  main.appendChild(p("lead", "Tekste faqesh të ruajtura si JSON në site_content."));

  if (view.arg)
    return await renderKeyValueEditor(main, "site_content", "key", "value");

  const toolbar = el("div", "toolbar");
  const addBtn = el("button", "btn line");
  addBtn.textContent = "+ Shto çelës";
  addBtn.addEventListener("click", () => {
    location.hash = "pages/new";
  });
  toolbar.appendChild(addBtn);
  main.appendChild(toolbar);

  const { data, error } = await supabase
    .from("site_content")
    .select("key, value, updated_at")
    .order("key");
  if (error) throw error;
  if (!data || !data.length) {
    main.appendChild(p("empty", "Nuk ka përmbajtje faqesh."));
    return;
  }
  const t = el("table", "tbl");
  t.innerHTML =
    "<thead><tr><th>Çelësi</th><th>Përditësuar</th><th></th></tr></thead><tbody></tbody>";
  const body = t.querySelector("tbody");
  for (const row of data) {
    const tr = el("tr");
    tr.innerHTML =
      "<td>" +
      esc(row.key) +
      "</td>" +
      '<td class="muted">' +
      (row.updated_at ? new Date(row.updated_at).toLocaleString("sq") : "—") +
      "</td>" +
      '<td><a href="#pages/' +
      encodeURIComponent(row.key) +
      '">Redakto</a></td>';
    body.appendChild(tr);
  }
  main.appendChild(t);
}

async function renderStrings(main) {
  main.innerHTML = "";
  main.appendChild(h("h1", "Tekstet e faqes"));
  main.appendChild(p("lead", "Tekstet e ndërfaqes (T object) — {en, sq} për çdo çelës."));

  if (view.arg) return await renderStringEditor(main);

  const { data, error } = await supabase
    .from("ui_strings")
    .select("key, value, updated_at")
    .order("key");
  if (error) throw error;
  if (!data || !data.length) {
    main.appendChild(
      p(
        "empty",
        'Nuk ka tekste. Përdor butonin "Importo të dhënat aktuale" në Dashboard.'
      )
    );
    return;
  }
  const t = el("table", "tbl");
  t.innerHTML =
    "<thead><tr><th>Çelësi</th><th>EN</th><th>SQ</th><th></th></tr></thead><tbody></tbody>";
  const body = t.querySelector("tbody");
  for (const row of data) {
    const tr = el("tr");
    const en =
      row.value && row.value.en ? String(row.value.en).slice(0, 40) : "—";
    const sq =
      row.value && row.value.sq ? String(row.value.sq).slice(0, 40) : "—";
    tr.innerHTML =
      "<td>" +
      esc(row.key) +
      "</td>" +
      '<td class="muted">' +
      esc(en) +
      "</td>" +
      '<td class="muted">' +
      esc(sq) +
      "</td>" +
      '<td><a href="#strings/' +
      encodeURIComponent(row.key) +
      '">Redakto</a></td>';
    body.appendChild(tr);
  }
  main.appendChild(t);
}

async function renderStringEditor(main) {
  const key = decodeURIComponent(view.arg);
  const isNew = key === "new";
  let row = null;
  if (!isNew) {
    const { data, error } = await supabase
      .from("ui_strings")
      .select("key, value")
      .eq("key", key)
      .maybeSingle();
    if (error) throw error;
    row = data;
  }

  main.innerHTML = "";
  const back = el("a", "back");
  back.href = "#strings";
  back.textContent = "← Kthehu";
  main.appendChild(back);
  main.appendChild(h("h1", isNew ? "Shto tekst" : "Redakto tekst"));

  const editor = el("div", "editor");
  const meta = el("div", "meta");
  meta.innerHTML =
    '<div class="fld"><label>Çelësi</label><input id="s-key" value="' +
    esc(isNew ? "" : key) +
    '" ' +
    (isNew ? "" : "readonly") +
    "></div>";
  editor.appendChild(meta);

  const jsonCol = el("div", "json");
  const val = row && row.value ? row.value : { en: "", sq: "" };
  jsonCol.innerHTML =
    '<label style="font-size:.72rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)">Vlera ({en, sq})</label>' +
    '<textarea id="s-value" spellcheck="false">' +
    esc(JSON.stringify(val, null, 2)) +
    "</textarea>";
  editor.appendChild(jsonCol);

  const actions = el("div", "row-actions");
  const save = el("button", "btn");
  save.textContent = "Ruaj";
  const del = el("button", "btn line");
  del.textContent = "Fshi";
  actions.appendChild(save);
  if (!isNew) actions.appendChild(del);
  editor.appendChild(actions);
  main.appendChild(editor);

  save.addEventListener("click", async () => {
    save.disabled = true;
    save.textContent = "Po ruan…";
    try {
      const newKey = meta.querySelector("#s-key").value.trim();
      const valueObj = JSON.parse(jsonCol.querySelector("#s-value").value);
      if (!newKey) throw new Error("Çelësi nuk mund të jetë bosh.");
      const { error } = await supabase
        .from("ui_strings")
        .upsert({ key: newKey, value: valueObj }, { onConflict: "key" });
      if (error) throw error;
      location.hash = "strings";
    } catch (e) {
      alert("Gabim: " + e.message);
    } finally {
      save.disabled = false;
      save.textContent = "Ruaj";
    }
  });

  del.addEventListener("click", async () => {
    if (!confirm("Të fshihet ky tekst?")) return;
    const { error } = await supabase.from("ui_strings").delete().eq("key", key);
    if (error) {
      alert("Gabim: " + error.message);
      return;
    }
    location.hash = "strings";
  });
}

async function renderKeyValueEditor(main, table, keyCol, valCol) {
  const key = decodeURIComponent(view.arg);
  const isNew = key === "new";
  let row = null;
  if (!isNew) {
    const { data, error } = await supabase
      .from(table)
      .select(keyCol + ", " + valCol)
      .eq(keyCol, key)
      .maybeSingle();
    if (error) throw error;
    row = data;
  }
  const backTarget = table === "site_content" ? "pages" : "strings";
  main.innerHTML = "";
  const back = el("a", "back");
  back.href = "#" + backTarget;
  back.textContent = "← Kthehu";
  main.appendChild(back);
  main.appendChild(h("h1", isNew ? "Shto" : "Redakto"));

  const editor = el("div", "editor");
  const meta = el("div", "meta");
  meta.innerHTML =
    '<div class="fld"><label>Çelësi</label><input id="k-key" value="' +
    esc(isNew ? "" : key) +
    '" ' +
    (isNew ? "" : "readonly") +
    "></div>";
  editor.appendChild(meta);
  const jsonCol = el("div", "json");
  jsonCol.innerHTML =
    '<label style="font-size:.72rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)">Vlera (JSON)</label>' +
    '<textarea id="k-value" spellcheck="false">' +
    esc(JSON.stringify(row ? row[valCol] : {}, null, 2)) +
    "</textarea>";
  editor.appendChild(jsonCol);
  const actions = el("div", "row-actions");
  const save = el("button", "btn");
  save.textContent = "Ruaj";
  actions.appendChild(save);
  if (!isNew) {
    const del = el("button", "btn line");
    del.textContent = "Fshi";
    del.addEventListener("click", async () => {
      if (!confirm("Të fshihet?")) return;
      const { error } = await supabase.from(table).delete().eq(keyCol, key);
      if (error) {
        alert("Gabim: " + error.message);
        return;
      }
      location.hash = backTarget;
    });
    actions.appendChild(del);
  }
  editor.appendChild(actions);
  main.appendChild(editor);

  save.addEventListener("click", async () => {
    save.disabled = true;
    save.textContent = "Po ruan…";
    try {
      const newKey = meta.querySelector("#k-key").value.trim();
      const valueObj = JSON.parse(jsonCol.querySelector("#k-value").value);
      if (!newKey) throw new Error("Çelësi nuk mund të jetë bosh.");
      const payload = {};
      payload[keyCol] = newKey;
      payload[valCol] = valueObj;
      const { error } = await supabase
        .from(table)
        .upsert(payload, { onConflict: keyCol });
      if (error) throw error;
      location.hash = backTarget;
    } catch (e) {
      alert("Gabim: " + e.message);
    } finally {
      save.disabled = false;
      save.textContent = "Ruaj";
    }
  });
}

function renderSettings(main) {
  main.innerHTML = "";
  main.appendChild(h("h1", "Cilësimet"));
  const wrap = el("div", "settings");
  const box = el("div", "box");
  box.innerHTML =
    "<h3>Domeni i emailit të adminit</h3>" +
    "<p>Përdoruesi që shkruan në formularin e hyrjes kthehet në <code>&lt;username&gt;@" +
    esc(ADMIN_EMAIL_DOMAIN) +
    "</code>. Krijo këtë përdorues në Supabase Auth.</p>" +
    "<p>Për të ndryshuar domenin, ndrysho <code>ADMIN_EMAIL_DOMAIN</code> në <code>src/admin/config.js</code>.</p>";
  wrap.appendChild(box);
  main.appendChild(wrap);
}

function el(tag, cls) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}
function h(tag, text) {
  const e = el(tag);
  e.textContent = text;
  return e;
}
function p(cls, text) {
  const e = el("p", cls);
  e.textContent = text;
  return e;
}
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );
}

async function renderProductForm(main) {
  const opts = await loadProductOptions();
  const config = {
    ...productsConfig,
    arg: view.arg,
    buildFields: (data) => buildProductFields(data, opts),
  };
  await renderGenericForm(main, config);
}

bootstrap();
