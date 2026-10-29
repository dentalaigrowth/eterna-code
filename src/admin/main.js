import "./admin.css";
import { supabase } from "./supabase.js";
import { ADMIN_EMAIL_DOMAIN } from "./config.js";
import { runImport } from "./import.js";
import { renderGenericList, renderGenericForm, renderPageList, renderPageEditor } from "./screens.js";
import { renderCustomPageForm, countPages } from "./custom-pages.js";
import { renderStringList, renderStringForm } from "./strings-screens.js";
import { renderSettingsForm } from "./settings-screen.js";
import { productsConfig, loadProductOptions, buildProductFields } from "./product-config.js";
import { categoriesConfig, brandsConfig, roomsConfig, designersConfig } from "./entity-configs.js";
import { journalConfig } from "./journal-config.js";

const ENTITY_CONFIGS = { categories: categoriesConfig, brands: brandsConfig, rooms: roomsConfig, designers: designersConfig, articles: journalConfig };

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
      case "rooms": {
        const cfg = ENTITY_CONFIGS[view.section];
        return view.arg
          ? await renderGenericForm(main, { ...cfg, arg: view.arg })
          : await renderGenericList(main, cfg);
      }
      case "pages": {
        const arg = decodeURIComponent(view.arg);
        if (!arg) return await renderPageList(main);
        if (arg === "new" || arg.startsWith("custom:")) return await renderCustomPageForm(main, arg);
        return await renderPageEditor(main, arg);
      }
      case "designers":
      case "articles": {
        const cfg = ENTITY_CONFIGS[view.section];
        return view.arg
          ? await renderGenericForm(main, { ...cfg, arg: view.arg })
          : await renderGenericList(main, cfg);
      }
      case "strings":
        return view.arg
          ? await renderStringForm(main, decodeURIComponent(view.arg))
          : await renderStringList(main);
      case "settings":
        return await renderSettingsForm(main);
      default:
        return await renderDashboard(main);
    }
  } catch (e) {
    main.innerHTML = '<p class="err">Gabim: ' + esc(e.message) + "</p>";
  }
}

const ADMIN_SHOW_IMPORT = false;

const DASHBOARD_SECTIONS = [
  { section: "products", label: "Produktet" },
  { section: "brands", label: "Markat" },
  { section: "categories", label: "Kategoritë" },
  { section: "rooms", label: "Dhomat" },
  { section: "designers", label: "Projektuesit" },
  { section: "articles", label: "Journal" },
  { section: "strings", label: "Tekstet" },
  { section: "pages", label: "Faqet" },
];

async function renderDashboard(main) {
  main.innerHTML = "";
  main.appendChild(h("h1", "Dashboard"));
  main.appendChild(p("lead", "Përmbledhje e të dhënave në databazë."));

  const counts = await Promise.all(
    DASHBOARD_SECTIONS.map(async (s) => {
      if (s.section === "pages") return { section: s.section, label: s.label, n: await countPages() };
      const table = s.section === "strings" ? "ui_strings" : s.section;
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });
      return { section: s.section, label: s.label, n: error ? "—" : count };
    })
  );

  const cards = el("div", "cards");
  for (const c of counts) {
    const card = el("a", "card");
    card.href = "#" + c.section;
    card.style.cursor = "pointer";
    card.innerHTML =
      '<span class="n">' + c.n + '</span><span class="l">' + esc(c.label) + "</span>";
    cards.appendChild(card);
  }
  main.appendChild(cards);

  const actions = el("div", "toolbar");
  const addProduct = el("button", "btn");
  addProduct.type = "button";
  addProduct.textContent = "+ Shto produkt";
  addProduct.addEventListener("click", () => { location.hash = "products/new"; });
  actions.appendChild(addProduct);

  const viewSite = el("a", "btn line");
  viewSite.href = "/";
  viewSite.target = "_blank";
  viewSite.rel = "noopener";
  viewSite.textContent = "Shiko faqen";
  actions.appendChild(viewSite);

  const logoutBtn = el("button", "btn line");
  logoutBtn.type = "button";
  logoutBtn.textContent = "Dilni";
  logoutBtn.addEventListener("click", async () => { await supabase.auth.signOut(); });
  actions.appendChild(logoutBtn);
  main.appendChild(actions);

  if (ADMIN_SHOW_IMPORT) {
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
