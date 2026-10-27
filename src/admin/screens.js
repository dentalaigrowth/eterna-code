/* Generic reusable list + edit screens for the ETERNA admin.
   List: search + pagination, toggle publish, compact actions.
   Form: sticky top bar, language switch, two-column card layout,
   toast notifications, unsaved-changes guard. */

import { supabase } from "./supabase.js";
import {
  biText,
  textInput,
  selectField,
  multiSelect,
  toggle,
  galleryEditor,
  collectFields,
  optimizeUrl,
  fieldCard,
  langSwitch,
  getLang,
  onLangChange,
  slugify,
} from "./fields.js";
import { generateUniqueSlug } from "./entity-configs.js";
import { PAGE_CONFIGS, PAGE_LIST } from "./page-configs.js";

const PER_PAGE = 15;

/* ---------- Page list + editor ---------- */

export async function renderPageList(main) {
  main.innerHTML = "";
  main.appendChild(h("h1", "Faqet"));
  main.appendChild(p("lead", "Redakto tekstet dhe imazhet e çdo faqeje."));
  const grid = el("div", "cards");
  for (const pg of PAGE_LIST) {
    const card = el("div", "card");
    card.style.cursor = "pointer";
    const l = el("span", "l");
    l.textContent = "Faqe";
    card.appendChild(l);
    const n = el("span", "n");
    n.textContent = pg.label;
    n.style.fontSize = "1.2rem";
    card.appendChild(n);
    card.addEventListener("click", () => { location.hash = "pages/" + pg.id; });
    grid.appendChild(card);
  }
  main.appendChild(grid);
}

export async function renderPageEditor(main, pageId) {
  const cfg = PAGE_CONFIGS[pageId];
  if (!cfg) { main.innerHTML = ""; main.appendChild(p("empty", "Faqja nuk u gjet.")); return; }

  const { data } = await supabase.from("site_content").select("key, value").eq("key", pageId).maybeSingle();
  const existing = (data && data.value) || {};

  main.innerHTML = "";

  // sticky top bar
  const topBar = el("div", "form-topbar");
  const left = el("div", "topbar-l");
  const back = el("a", "btn sm line");
  back.href = "#pages";
  back.textContent = "← Faqet";
  left.appendChild(back);
  const titleSpan = el("span", "topbar-title");
  titleSpan.textContent = cfg.label;
  left.appendChild(titleSpan);
  topBar.appendChild(left);
  const topActions = el("div", "topbar-r");
  const cancelBtn = el("button", "btn sm line");
  cancelBtn.type = "button";
  cancelBtn.textContent = "Anulo";
  const saveBtn = el("button", "btn sm");
  saveBtn.textContent = "Ruaj";
  topActions.appendChild(cancelBtn);
  topActions.appendChild(saveBtn);
  topBar.appendChild(topActions);
  main.appendChild(topBar);

  // toast
  const toast = el("div", "toast");
  toast.textContent = "Ndryshimet u ruajtën";
  toast.style.display = "none";
  main.appendChild(toast);

  // language switch
  main.appendChild(langSwitch());

  const layout = el("div", "form-layout");
  const colMain = el("div", "form-col-main");
  const colSide = el("div", "form-col-side");
  layout.appendChild(colMain);
  layout.appendChild(colSide);
  main.appendChild(layout);

  // build section cards
  for (let i = 0; i < cfg.sections.length; i++) {
    const sec = cfg.sections[i];
    const fields = sec.fields(existing);
    const card = fieldCard(sec.heading, ...fields);
    if (i % 2 === 0) colMain.appendChild(card);
    else colSide.appendChild(card);
  }

  // featured products on home
  if (cfg.extraFields) {
    const products = await loadProductsFromDB();
    for (const f of cfg.extraFields(existing, products)) {
      const card = fieldCard("Featured products", f);
      colMain.appendChild(card);
    }
  }

  let dirty = false;
  layout.addEventListener("input", () => { dirty = true; });
  cancelBtn.addEventListener("click", () => {
    if (dirty && !confirm("Ka ndryshime të paruajtura. Të anulohen?")) return;
    location.hash = "pages";
  });

  saveBtn.addEventListener("click", async () => {
    saveBtn.disabled = true;
    saveBtn.textContent = "Po ruan…";
    try {
      const collected = collectFields(layout);
      const merged = { ...existing, ...collected };
      const { error } = await supabase.from("site_content").upsert({ key: pageId, value: merged }, { onConflict: "key" });
      if (error) throw error;
      dirty = false;
      toast.style.display = "";
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
        toast.style.display = "none";
        location.hash = "pages";
      }, 1000);
    } catch (e) {
      alert("Gabim: " + e.message);
      saveBtn.disabled = false;
      saveBtn.textContent = "Ruaj";
    }
  });
}

async function loadProductsFromDB() {
  const { data } = await supabase.from("products").select("id, data").order("sort_order");
  return (data || []).map((r) => ({ id: r.id, name: (r.data && r.data.name) || r.id }));
}

/* ---------- Generic list ---------- */

export async function renderGenericList(main, config) {
  const table = config.table;
  main.innerHTML = "";
  main.appendChild(h("h1", config.label));

  const { data, error } = await supabase
    .from(table)
    .select("id, data, published, sort_order")
    .order("sort_order");
  if (error) {
    const err = el("p", "err");
    err.textContent = "Gabim: " + (error.message || "nuk mund të ngarkohen të dhënat.");
    main.appendChild(err);
    return;
  }
  const rows = data || [];

  function rowName(r) {
    const d = r.data || {};
    if (config.extractName) return config.extractName(d);
    return extractName({ ...d, id: r.id });
  }

  if (!rows.length) {
    main.appendChild(
      p("empty", "Nuk ka rreshta. Kliko \"+ Shto të re\" ose importo të dhënat nga Dashboard.")
    );
    const toolbar = el("div", "toolbar");
    const addBtn = el("button", "btn");
    addBtn.textContent = "+ Shto të re";
    addBtn.addEventListener("click", () => {
      location.hash = table + "/new";
    });
    toolbar.appendChild(addBtn);
    main.appendChild(toolbar);
    return;
  }

  let searchTerm = "";
  let page = 0;

  const toolbar = el("div", "toolbar");
  const search = el("input", "search");
  search.type = "text";
  search.placeholder = "Kërko…";
  toolbar.appendChild(search);
  const addBtn = el("button", "btn");
  addBtn.textContent = "+ Shto të re";
  addBtn.addEventListener("click", () => {
    location.hash = table + "/new";
  });
  toolbar.appendChild(addBtn);
  main.appendChild(toolbar);

  const tableWrap = el("div", "table-wrap");
  main.appendChild(tableWrap);

  const pager = el("div", "pager");
  main.appendChild(pager);

  function filtered() {
    if (!searchTerm) return rows;
    const q = searchTerm.toLowerCase();
    return rows.filter((r) => {
      const name = config.extractName ? config.extractName(r.data || {}) : extractName({ ...(r.data || {}), id: r.id });
      return (
        (r.id || "").toLowerCase().indexOf(q) > -1 ||
        name.toLowerCase().indexOf(q) > -1
      );
    });
  }

  function renderTable() {
    const list = filtered();
    const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    if (page >= totalPages) page = totalPages - 1;
    const slice = list.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

    tableWrap.innerHTML = "";
    if (!slice.length) {
      tableWrap.appendChild(p("empty", "Nuk ka rreshta që përputhen."));
    } else {
      const t = el("table", "tbl");
      t.innerHTML =
        '<thead><tr><th>Emri</th><th>Publikuar</th><th>Renditja</th><th></th></tr></thead><tbody></tbody>';
      const body = t.querySelector("tbody");
      for (const row of slice) {
        body.appendChild(buildRow(row, config));
      }
      tableWrap.appendChild(t);
    }

    pager.innerHTML = "";
    if (totalPages > 1) {
      const prev = el("button", "btn line pg");
      prev.type = "button";
      prev.textContent = "←";
      prev.disabled = page === 0;
      prev.addEventListener("click", () => { page--; renderTable(); });
      const info = el("span", "pg-info");
      info.textContent = `${page + 1} / ${totalPages}`;
      const next = el("button", "btn line pg");
      next.type = "button";
      next.textContent = "→";
      next.disabled = page >= totalPages - 1;
      next.addEventListener("click", () => { page++; renderTable(); });
      pager.appendChild(prev);
      pager.appendChild(info);
      pager.appendChild(next);
    }
  }

  search.addEventListener("input", () => {
    searchTerm = search.value.trim();
    page = 0;
    renderTable();
  });

  renderTable();
}

function buildRow(row, config) {
  const table = config.table;
  const dataWithId = { ...(row.data || {}), id: row.id };
  const name = config.extractName ? config.extractName(row.data || {}) : extractName(dataWithId);
  const tr = el("tr");

  // name + thumbnail
  const nameTd = el("td", "td-name");
  const thumbKey = config.thumbnailField;
  const mainImg = thumbKey ? (row.data && row.data[thumbKey]) || "" : (row.data && row.data.imgs && row.data.imgs[0]) || "";
  if (mainImg) {
    const thumb = el("div", "row-thumb");
    const img = el("img");
    img.alt = "";
    img.loading = "lazy";
    img.src = optimizeUrl(mainImg);
    img.addEventListener("error", () => { thumb.style.display = "none"; });
    thumb.appendChild(img);
    nameTd.appendChild(thumb);
  }
  const nameSpan = el("span", "row-name");
  nameSpan.textContent = name;
  nameTd.appendChild(nameSpan);
  tr.appendChild(nameTd);

  // published toggle switch
  const pubTd = el("td");
  const sw = el("label", "switch sm");
  const cb = el("input");
  cb.type = "checkbox";
  cb.checked = !!row.published;
  const track = el("span", "sw-track");
  const knob = el("span", "sw-knob");
  track.appendChild(knob);
  sw.appendChild(cb);
  sw.appendChild(track);
  sw.title = "Ndrysho publikim";
  cb.addEventListener("change", async () => {
    const { error } = await supabase
      .from(table)
      .update({ published: cb.checked })
      .eq("id", row.id);
    if (error) {
      cb.checked = !cb.checked;
      alert("Gabim: " + error.message);
    }
    row.published = cb.checked;
  });
  pubTd.appendChild(sw);
  tr.appendChild(pubTd);

  // sort_order
  const orderTd = el("td");
  const orderInp = el("input", "order-inp");
  orderInp.type = "number";
  orderInp.value = row.sort_order ?? 0;
  orderInp.addEventListener("change", async () => {
    const val = parseInt(orderInp.value, 10) || 0;
    const { error } = await supabase
      .from(table)
      .update({ sort_order: val })
      .eq("id", row.id);
    if (error) alert("Gabim: " + error.message);
    row.sort_order = val;
  });
  orderTd.appendChild(orderInp);
  tr.appendChild(orderTd);

  // actions
  const actTd = el("td", "row-acts");
  const edit = el("a", "btn sm line");
  edit.href = "#" + table + "/" + encodeURIComponent(row.id);
  edit.textContent = "Redakto";
  actTd.appendChild(edit);

  const dup = el("button", "btn sm line");
  dup.type = "button";
  dup.textContent = "Dubliko";
  dup.addEventListener("click", async () => {
    let newId = row.id + "-copy";
    try { newId = await generateUniqueSlug(table, row.id + "-copy"); } catch (e) { /* keep fallback */ }
    const { error } = await supabase.from(table).upsert({
      id: newId,
      data: { ...row.data, id: newId },
      published: false,
      sort_order: row.sort_order + 1,
    }, { onConflict: "id" });
    if (error) { alert("Gabim: " + error.message); return; }
    location.hash = table + "/" + encodeURIComponent(newId);
  });
  actTd.appendChild(dup);

  const del = el("button", "btn sm danger-line");
  del.type = "button";
  del.textContent = "Fshi";
  del.addEventListener("click", async () => {
    if (config.canDelete) {
      const check = await config.canDelete(row.id);
      if (!check.ok) { alert(check.msg); return; }
    }
    if (!confirm("Je i sigurt?")) return;
    const { error } = await supabase.from(table).delete().eq("id", row.id);
    if (error) { alert("Gabim: " + error.message); return; }
    tr.remove();
  });
  actTd.appendChild(del);
  tr.appendChild(actTd);

  return tr;
}

/* ---------- Generic edit form ---------- */

export async function renderGenericForm(main, config) {
  const table = config.table;
  const id = decodeURIComponent(config.arg || "");
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

  const dataObj = row ? row.data : {};
  const titleName = config.extractName ? config.extractName(dataObj) : extractName({ ...dataObj, id });
  const itemTitle = titleName || (isNew ? "Shto të re" : id);
  main.innerHTML = "";

  // sticky top bar
  const topBar = el("div", "form-topbar");
  const left = el("div", "topbar-l");
  const back = el("a", "btn sm line");
  back.href = "#" + table;
  back.textContent = "← Kthehu te lista";
  left.appendChild(back);
  const titleSpan = el("span", "topbar-title");
  titleSpan.textContent = isNew ? "Shto të re" : itemTitle;
  left.appendChild(titleSpan);
  topBar.appendChild(left);
  const topActions = el("div", "topbar-r");
  const cancelBtn = el("button", "btn sm line");
  cancelBtn.type = "button";
  cancelBtn.textContent = "Anulo";
  const saveBtn = el("button", "btn sm");
  saveBtn.textContent = "Ruaj";
  topActions.appendChild(cancelBtn);
  topActions.appendChild(saveBtn);
  topBar.appendChild(topActions);
  main.appendChild(topBar);

  // toast
  const toast = el("div", "toast");
  toast.textContent = "Ndryshimet u ruajtën";
  toast.style.display = "none";
  main.appendChild(toast);

  // language switch
  const lang = langSwitch();
  main.appendChild(lang);

  // two-column layout
  const layout = el("div", "form-layout");
  const colMain = el("div", "form-col-main");
  const colSide = el("div", "form-col-side");
  layout.appendChild(colMain);
  layout.appendChild(colSide);
  main.appendChild(layout);

  // meta fields
  const idField = textInput("ID", isNew ? "" : id, { key: "_id", readOnly: !isNew });
  const pubSel = selectField("Publikuar", row ? String(row.published) : "true",
    [{ value: "true", label: "Po" }, { value: "false", label: "Jo" }],
    { key: "_published" });
  const orderField = textInput("Renditja", row ? row.sort_order ?? 0 : 0,
    { type: "number", key: "_order" });
  const yearField = config.table === "products" ? textInput("Viti", dataObj.year, { type: "number", key: "year" }) : null;

  // build structured fields from config
  const fields = config.buildFields(dataObj);

  // group fields into cards based on config
  // We'll build cards from the product-config's field list
  const cards = buildFormCards(config, fields, { idField, pubSel, orderField, yearField, dataObj });
  for (const card of cards.main) colMain.appendChild(card);
  for (const card of cards.side) colSide.appendChild(card);

  // Auto-generate slug from EN name for new items
  if (isNew && config.autoSlug) {
    const nameField = layout.querySelector('[data-field="name"]');
    if (nameField) {
      const enInput = nameField.querySelector(".bi-en");
      const idInput = idField.querySelector("input");
      if (enInput && idInput) {
        enInput.addEventListener("input", () => {
          idInput.value = slugify(enInput.value);
        });
      }
    }
  }

  // JSON toggle
  const jsonToggle = el("button", "btn line json-toggle");
  jsonToggle.type = "button";
  jsonToggle.textContent = "Shiko JSON";
  const jsonArea = el("textarea", "json-area");
  jsonArea.spellcheck = false;
  jsonArea.value = JSON.stringify(dataObj, null, 2);
  jsonArea.style.display = "none";
  colSide.appendChild(jsonToggle);
  colSide.appendChild(jsonArea);

  let jsonMode = false;
  jsonToggle.addEventListener("click", () => {
    jsonMode = !jsonMode;
    jsonArea.style.display = jsonMode ? "" : "none";
    colMain.style.display = jsonMode ? "none" : "";
    colSide.querySelectorAll(".card-section").forEach((c) => c.style.display = jsonMode ? "none" : "");
    jsonToggle.textContent = jsonMode ? "Fshih JSON" : "Shiko JSON";
    if (jsonMode) {
      const collected = collectFields(layout);
      const merged = { ...dataObj, ...collected };
      jsonArea.value = JSON.stringify(merged, null, 2);
    }
  });

  // unsaved-changes guard
  let dirty = false;
  layout.addEventListener("input", () => { dirty = true; });
  jsonArea.addEventListener("input", () => { dirty = true; });
  cancelBtn.addEventListener("click", () => {
    if (dirty && !confirm("Ka ndryshime të paruajtura. Të anulohen?")) return;
    location.hash = table;
  });
  const beforeUnload = (e) => { if (dirty) e.preventDefault(); };
  window.addEventListener("beforeunload", beforeUnload);

  // validation + save
  saveBtn.addEventListener("click", async () => {
    saveBtn.disabled = true;
    saveBtn.textContent = "Po ruan…";
    try {
      const missing = [];
      for (const f of config.fields) {
        if (!f.required) continue;
        const node = layout.querySelector(`[data-field="${f.key}"]`);
        if (!node) continue;
        const val = node._collect();
        if (!val || (typeof val === "string" && !val.trim()) ||
            (typeof val === "object" && !val.en && !val.sq)) {
          missing.push(f.label);
        }
      }
      if (missing.length) {
        alert("Plotëso fushat e detyrueshme: " + missing.join(", "));
        saveBtn.disabled = false;
        saveBtn.textContent = "Ruaj";
        return;
      }

      const newId = idField.querySelector("input").value.trim();
      if (!newId) throw new Error("ID nuk mund të jetë bosh.");
      const pubVal = pubSel.querySelector("select").value === "true";
      const order = parseInt(orderField.querySelector("input").value, 10) || 0;

      let finalData;
      if (jsonMode) {
        finalData = JSON.parse(jsonArea.value);
      } else {
        const collected = collectFields(layout);
        if (config.collectData) {
          finalData = config.collectData(collected, dataObj);
        } else {
          finalData = { ...dataObj, ...collected };
          finalData.id = newId;
        }
      }

      const payload = { id: newId, data: finalData, published: pubVal, sort_order: order };
      const { error } = await supabase.from(table).upsert(payload, { onConflict: "id" });
      if (error) throw error;

      dirty = false;
      window.removeEventListener("beforeunload", beforeUnload);
      toast.style.display = "";
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
        toast.style.display = "none";
        location.hash = table;
      }, 1000);
    } catch (e) {
      alert("Gabim: " + e.message);
      saveBtn.disabled = false;
      saveBtn.textContent = "Ruaj";
    }
  });
}

/* Build form cards by grouping config fields into sections. */
function buildFormCards(config, fields, meta) {
  const fieldMap = {};
  for (const f of fields) {
    const key = f.dataset.field;
    if (key) fieldMap[key] = f;
  }

  const main = [];
  const side = [];

  // Base info (side)
  const baseFields = [meta.idField, meta.pubSel, meta.orderField];
  if (meta.yearField) baseFields.push(meta.yearField);
  side.push(fieldCard("Informacion bazë", ...baseFields));

  // For entity configs with collectData (categories, brands, rooms),
  // put all non-meta fields into a single content card.
  if (config.collectData) {
    const contentFields = fields.filter((f) => f.dataset.field && !f.dataset.field.startsWith("_"));
    if (contentFields.length) main.push(fieldCard("Përmbajtja", ...contentFields));
    return { main, side };
  }

  // Product config (field-based grouping)

  // Content (main)
  const contentFields = [];
  if (fieldMap.name) contentFields.push(fieldMap.name);
  if (fieldMap.story) contentFields.push(fieldMap.story);
  if (fieldMap.materials) contentFields.push(fieldMap.materials);
  if (fieldMap.dims) contentFields.push(fieldMap.dims);
  if (contentFields.length) main.push(fieldCard("Përmbajtja", ...contentFields));

  // Classification (side)
  const classFields = [];
  if (fieldMap.brand) classFields.push(fieldMap.brand);
  if (fieldMap.designer) classFields.push(fieldMap.designer);
  if (fieldMap.cat) classFields.push(fieldMap.cat);
  if (classFields.length) side.push(fieldCard("Klasifikimi", ...classFields));

  // Rooms (side)
  if (fieldMap.rooms) side.push(fieldCard("Dhomat", fieldMap.rooms));

  // Display (main)
  const displayFields = [];
  if (fieldMap.featured) displayFields.push(fieldMap.featured);
  if (fieldMap.isNew) displayFields.push(fieldMap.isNew);
  if (displayFields.length) main.push(fieldCard("Shfaqja", ...displayFields));

  // Images (main)
  if (fieldMap.imgs) main.push(fieldCard("Imazhet", fieldMap.imgs));

  // Video (side)
  if (fieldMap.video) side.push(fieldCard("Video", fieldMap.video));

  return { main, side };
}

/* ---------- Helpers ---------- */

export function extractName(data) {
  if (!data) return "—";
  if (typeof data.name === "string") return data.name;
  if (data.name && typeof data.name === "object")
    return data.name.sq || data.name.en || data.id || "—";
  if (data.id) return data.id;
  if (data.title && typeof data.title === "object")
    return data.title.en || data.title.sq || "—";
  if (data.intro && typeof data.intro === "object")
    return (data.intro.en || data.intro.sq || "").slice(0, 40);
  if (data.bio && typeof data.bio === "object")
    return (data.bio.en || "").slice(0, 40);
  return "—";
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
