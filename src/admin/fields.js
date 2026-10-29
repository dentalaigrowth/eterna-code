/* Reusable form-field builders for the ETERNA admin. Each returns a DOM
   element with a _collect() method that yields the field's value. */

export function el(tag, cls) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}

/* ---------- Global language state ---------- */
let currentLang = "en";
const langListeners = [];

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang;
  for (const fn of langListeners) fn(lang);
}

export function onLangChange(fn) {
  langListeners.push(fn);
  fn(currentLang);
}

/* ---------- Bilingual text ---------- */
/* Normalizes the stored value into {en, sq}. If a plain string is stored,
   it is shown in both EN and SQ so existing data is never lost. */

function normalizeBi(value) {
  if (value && typeof value === "object") return { en: value.en || "", sq: value.sq || "" };
  if (typeof value === "string" && value) return { en: value, sq: value };
  return { en: "", sq: "" };
}

export function biText(label, value, opts = {}) {
  const v = normalizeBi(value);
  const wrap = el("div", "bi-field");
  wrap.dataset.field = opts.key || "";
  wrap.dataset.bi = "1";

  const lab = el("label", "fld-lab");
  lab.textContent = label;
  if (opts.required) lab.dataset.required = "1";
  wrap.appendChild(lab);

  if (opts.hint) {
    const hint = el("p", "fld-hint");
    hint.textContent = opts.hint;
    wrap.appendChild(hint);
  }

  const enInput = opts.long ? textarea(v.en, opts) : input(v.en, opts);
  const sqInput = opts.long ? textarea(v.sq, opts) : input(v.sq, opts);

  enInput.classList.add("bi-en");
  sqInput.classList.add("bi-sq");

  const panes = el("div", "bi-panes");
  const enPane = el("div", "bi-pane bi-en-pane");
  const sqPane = el("div", "bi-pane bi-sq-pane");
  sqPane.style.display = "none";
  enPane.appendChild(enInput);
  sqPane.appendChild(sqInput);
  panes.appendChild(enPane);
  panes.appendChild(sqPane);
  wrap.appendChild(panes);

  onLangChange((lang) => {
    enPane.style.display = lang === "en" ? "" : "none";
    sqPane.style.display = lang === "sq" ? "" : "none";
  });

  wrap._collect = () => ({ en: enInput.value, sq: sqInput.value });
  wrap._checkRequired = () => !v.en && !enInput.value && !sqInput.value;
  return wrap;
}

function input(val, opts) {
  const i = el("input");
  i.type = opts.type || "text";
  i.value = val;
  if (opts.placeholder) i.placeholder = opts.placeholder;
  if (opts.required) i.required = true;
  return i;
}

function textarea(val, opts) {
  const t = el("textarea");
  t.value = val;
  t.rows = opts.rows || 4;
  t.style.minHeight = "120px";
  if (opts.placeholder) t.placeholder = opts.placeholder;
  if (opts.required) t.required = true;
  autoGrow(t);
  t.addEventListener("input", () => autoGrow(t));
  return t;
}

export function autoGrow(t) {
  t.style.height = "auto";
  t.style.height = Math.max(120, t.scrollHeight) + "px";
}

/* ---------- Plain text input ---------- */

export function textInput(label, val, opts = {}) {
  const wrap = el("div", "fld");
  wrap.dataset.field = opts.key || "";
  const lab = el("label");
  lab.textContent = label;
  wrap.appendChild(lab);
  const i = el("input");
  i.type = opts.type || "text";
  i.value = val == null ? "" : val;
  if (opts.placeholder) i.placeholder = opts.placeholder;
  if (opts.required) i.required = true;
  if (opts.readOnly) i.readOnly = true;
  wrap.appendChild(i);
  wrap._collect = () => i.value;
  wrap._input = () => i;
  return wrap;
}

/* ---------- Select ---------- */

export function selectField(label, val, options, opts = {}) {
  const wrap = el("div", "fld");
  wrap.dataset.field = opts.key || "";
  const lab = el("label");
  lab.textContent = label;
  wrap.appendChild(lab);
  const s = el("select");
  if (opts.allowEmpty) {
    const blank = el("option");
    blank.value = "";
    blank.textContent = opts.emptyLabel || "—";
    s.appendChild(blank);
  }
  for (const o of options) {
    const opt = el("option");
    opt.value = o.value;
    opt.textContent = o.label;
    if (o.value === val) opt.selected = true;
    s.appendChild(opt);
  }
  wrap.appendChild(s);
  wrap._collect = () => s.value;
  wrap._input = () => s;
  return wrap;
}

/* ---------- Multi-select (styled checkbox chips) ---------- */

export function multiSelect(label, selected, options, opts = {}) {
  const wrap = el("div", "fld");
  wrap.dataset.field = opts.key || "";
  const lab = el("label");
  lab.textContent = label;
  wrap.appendChild(lab);
  const grid = el("div", "chips");
  const sel = new Set(selected || []);
  for (const o of options) {
    const id = "ms-" + Math.random().toString(36).slice(2, 9);
    const cb = el("input");
    cb.type = "checkbox";
    cb.id = id;
    cb.value = o.value;
    if (sel.has(o.value)) cb.checked = true;
    const lbl = el("label", "chip");
    lbl.htmlFor = id;
    const span = el("span");
    span.textContent = o.label;
    lbl.appendChild(cb);
    lbl.appendChild(span);
    grid.appendChild(lbl);
  }
  wrap.appendChild(grid);
  wrap._collect = () => {
    const out = [];
    grid.querySelectorAll("input:checked").forEach((cb) => out.push(cb.value));
    return out;
  };
  return wrap;
}

/* ---------- Toggle switch ---------- */

export function toggle(label, checked, opts = {}) {
  const wrap = el("div", "fld toggle-fld");
  wrap.dataset.field = opts.key || "";
  const sw = el("label", "switch");
  const cb = el("input");
  cb.type = "checkbox";
  cb.checked = !!checked;
  const track = el("span", "sw-track");
  const knob = el("span", "sw-knob");
  track.appendChild(knob);
  const span = el("span", "sw-label");
  span.textContent = label;
  sw.appendChild(cb);
  sw.appendChild(track);
  sw.appendChild(span);
  wrap.appendChild(sw);
  wrap._collect = () => (cb.checked ? 1 : 0);
  return wrap;
}

/* Checkbox kept for backward compat — delegates to toggle */
export function checkbox(label, checked, opts = {}) {
  return toggle(label, checked, opts);
}

/* ---------- Gallery editor ---------- */

export function galleryEditor(label, imgs, opts = {}) {
  const wrap = el("div", "fld gallery");
  wrap.dataset.field = opts.key || "";
  const lab = el("label");
  lab.textContent = label;
  wrap.appendChild(lab);

  const list = el("div", "gal-list");
  const items = (imgs || []).slice();

  function render() {
    list.innerHTML = "";
    const visibleItems = items.length ? items : [""];
    visibleItems.forEach((url, i) => {
      const row = el("div", "gal-row");

      const thumb = el("div", "gal-thumb");
      const img = el("img");
      img.alt = "";
      img.loading = "lazy";
      img.src = optimizeUrl(url);
      img.addEventListener("error", () => { img.style.display = "none"; });
      img.addEventListener("load", () => { if (img.naturalWidth === 0) img.style.display = "none"; });
      thumb.appendChild(img);

      const inp = el("input");
      inp.type = "text";
      inp.value = url;
      inp.placeholder = "Ngjit linkun e fotos ose key";
      inp.addEventListener("input", () => {
        items[i] = inp.value;
        img.style.display = "";
        img.src = optimizeUrl(inp.value);
      });

      const mainWrap = el("label", "gal-main");
      mainWrap.title = "Kryesore";
      const radio = el("input");
      radio.type = "radio";
      radio.name = "gal-main-" + (opts.key || "g");
      radio.checked = i === 0;
      radio.addEventListener("change", () => {
        if (radio.checked && i > 0) {
          const [m] = items.splice(i, 1);
          items.unshift(m);
          render();
        }
      });
      mainWrap.appendChild(radio);

      const upBtn = el("button", "gal-btn");
      upBtn.type = "button";
      upBtn.textContent = "↑";
      upBtn.disabled = i === 0;
      upBtn.addEventListener("click", () => {
        if (i > 0) {
          [items[i], items[i - 1]] = [items[i - 1], items[i]];
          render();
        }
      });

      const dnBtn = el("button", "gal-btn");
      dnBtn.type = "button";
      dnBtn.textContent = "↓";
      dnBtn.disabled = i === items.length - 1;
      dnBtn.addEventListener("click", () => {
        if (i < items.length - 1) {
          [items[i], items[i + 1]] = [items[i + 1], items[i]];
          render();
        }
      });

      const delBtn = el("button", "gal-btn gal-del");
      delBtn.type = "button";
      delBtn.textContent = "×";
      delBtn.addEventListener("click", () => {
        items.splice(i, 1);
        render();
      });

      row.appendChild(thumb);
      row.appendChild(inp);
      row.appendChild(mainWrap);
      row.appendChild(upBtn);
      row.appendChild(dnBtn);
      row.appendChild(delBtn);
      list.appendChild(row);
    });
  }
  render();

  const addBtn = el("button", "btn line gal-add");
  addBtn.type = "button";
  addBtn.textContent = "+ Shto foto";
  addBtn.addEventListener("click", () => {
    items.push("");
    render();
    const last = list.querySelector(".gal-row:last-child input[type=text]");
    if (last) last.focus();
  });

  wrap.appendChild(list);
  wrap.appendChild(addBtn);
  wrap._collect = () => items.filter((s) => s && s.trim());
  return wrap;
}

/* ---------- Cloudinary URL optimization (for admin thumbnails) ---------- */

export function optimizeUrl(url) {
  if (!url || typeof url !== "string") return "";
  if (url.indexOf("http") !== 0) {
    var IMG_EXT = /\.(webp|jpg|jpeg|png|svg)(\?.*)?$/i;
    var VID_EXT = /\.(mp4|webm|mov)(\?.*)?$/i;
    var IMG_BASE = "https://res.cloudinary.com/l5tyqnmr/image/upload/";
    var VIDEO_BASE = "https://res.cloudinary.com/l5tyqnmr/video/upload/";
    if (IMG_EXT.test(url)) return IMG_BASE + url.replace(/^(img\/|video\/)/, "");
    if (VID_EXT.test(url)) return VIDEO_BASE + url.replace(/^(img\/|video\/)/, "");
    if (url.indexOf("/") === -1) return IMG_BASE + url;
    return url;
  }
  if (url.indexOf("res.cloudinary.com") > -1 && url.indexOf("/upload/") > -1) {
    return url.replace("/upload/", "/upload/f_auto,q_auto,w_240/");
  }
  return url;
}

/* ---------- Single image input with preview ---------- */

export function imageInput(label, val, opts = {}) {
  const wrap = el("div", "fld portrait-fld");
  wrap.dataset.field = opts.key || "";
  const lab = el("label", "fld-lab");
  lab.textContent = label;
  wrap.appendChild(lab);

  const thumb = el("div", "portrait-thumb");
  const img = el("img");
  img.alt = "";
  img.loading = "lazy";
  const ph = el("div", "portrait-ph");
  ph.textContent = "Pa pamje";
  ph.style.display = "none";
  const side = el("div", "portrait-side");
  const inp = el("input");
  inp.type = "text";
  inp.value = val || "";
  inp.placeholder = "key ose URL";
  function update() {
    const v = inp.value.trim();
    if (v) {
      img.style.display = "";
      ph.style.display = "none";
      img.src = optimizeUrl(v);
    } else {
      img.style.display = "none";
      ph.style.display = "flex";
    }
  }
  img.addEventListener("error", () => { img.style.display = "none"; ph.style.display = "flex"; });
  inp.addEventListener("input", update);
  thumb.appendChild(img);
  thumb.appendChild(ph);
  side.appendChild(inp);
  wrap.appendChild(thumb);
  wrap.appendChild(side);
  update();
  wrap._collect = () => inp.value;
  return wrap;
}

/* ---------- Repeatable paragraph list (bilingual) ---------- */
/* For designer story: array of paragraphs per language. */

export function paragraphList(label, storyVal, opts = {}) {
  const wrap = el("div", "fld para-list");
  wrap.dataset.field = opts.key || "";
  wrap.dataset.bi = "1";
  const lab = el("label", "fld-lab");
  lab.textContent = label;
  if (opts.required) lab.dataset.required = "1";
  wrap.appendChild(lab);

  const norm = normalizeBi(storyVal);
  let enItems = Array.isArray(norm.en) ? norm.en.slice() : (norm.en ? [norm.en] : []);
  let sqItems = Array.isArray(norm.sq) ? norm.sq.slice() : (norm.sq ? [norm.sq] : []);

  const panes = el("div", "bi-panes");
  const enPane = el("div", "bi-pane bi-en-pane");
  const sqPane = el("div", "bi-pane bi-sq-pane");
  sqPane.style.display = "none";
  panes.appendChild(enPane);
  panes.appendChild(sqPane);
  wrap.appendChild(panes);

  function renderPane(pane, items) {
    pane.innerHTML = "";
    items.forEach((text, i) => {
      const row = el("div", "para-row");
      const lbl = el("div", "para-lbl");
      lbl.textContent = "Paragrafi " + (i + 1);
      row.appendChild(lbl);

      const del = el("button", "para-del");
      del.type = "button";
      del.textContent = "×";
      del.addEventListener("click", () => { items.splice(i, 1); renderPane(pane, items); });
      row.appendChild(del);

      const ta = el("textarea");
      ta.value = text;
      ta.rows = 3;
      ta.style.minHeight = "90px";
      ta.addEventListener("input", () => { items[i] = ta.value; autoGrow(ta); });
      autoGrow(ta);
      row.appendChild(ta);

      pane.appendChild(row);
    });
    const add = el("button", "btn line para-add");
    add.type = "button";
    add.textContent = "+ Paragraf";
    add.addEventListener("click", () => { items.push(""); renderPane(pane, items); });
    pane.appendChild(add);
  }

  renderPane(enPane, enItems);
  renderPane(sqPane, sqItems);

  onLangChange((lang) => {
    enPane.style.display = lang === "en" ? "" : "none";
    sqPane.style.display = lang === "sq" ? "" : "none";
  });

  wrap._collect = () => ({ en: enItems, sq: sqItems });
  return wrap;
}

/* ---------- Works editor (repeatable rows) ---------- */
/* Each work in the DB is an array: [title, year, producer, productId].
   Title and producer are plain strings (the public site reads them with
   esc(), not L()). The editor shows a single input per field. */

export function worksEditor(label, works, opts = {}) {
  const wrap = el("div", "fld works-editor");
  wrap.dataset.field = opts.key || "";
  const lab = el("label", "fld-lab");
  lab.textContent = label;
  wrap.appendChild(lab);

  const productOpts = opts.productOpts || [];
  const normTitle = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "").replace(/\s+/g, "").trim();
  const matchByTitle = (title) => {
    if (!title) return "";
    const nt = normTitle(title);
    if (!nt) return "";
    let best = "";
    let bestLen = 0;
    for (const p of productOpts) {
      const np = normTitle(p.label);
      if (!np) continue;
      if (np === nt) return p.value;
      if (np.indexOf(nt) === 0 || nt.indexOf(np) === 0) {
        const len = Math.min(np.length, nt.length);
        if (len > bestLen) { bestLen = len; best = p.value; }
      }
    }
    return best;
  };
  const origWorks = (works || []).slice();
  const items = origWorks.map((w, idx) => {
    if (Array.isArray(w)) {
      const title = typeof w[0] === "string" ? w[0] : (w[0] && w[0].en) || "";
      let product = w[3] || "";
      if (!product && productOpts.length) product = matchByTitle(title);
      return {
        title,
        year: w[1] == null ? "" : String(w[1]),
        producer: typeof w[2] === "string" ? w[2] : (w[2] && w[2].en) || "",
        product,
        _orig: w,
        _idx: idx,
      };
    }
    return { title: "", year: "", producer: "", product: "", _orig: w, _idx: idx };
  });

  const list = el("div", "works-list");

  function sortByYear() {
    items.sort((a, b) => {
      const ay = parseInt(a.year, 10) || 9999;
      const by = parseInt(b.year, 10) || 9999;
      return ay - by;
    });
  }

  function render() {
    sortByYear();
    list.innerHTML = "";

    const head = el("div", "works-head");
    ["Viti", "Titulli", "Produkti", "Prodhuar nga", ""].forEach((h) => {
      const sp = el("span");
      sp.textContent = h;
      head.appendChild(sp);
    });
    list.appendChild(head);

    items.forEach((w, i) => {
      const row = el("div", "work-row");

      const yearInp = el("input");
      yearInp.type = "number";
      yearInp.value = w.year;
      yearInp.placeholder = "Viti";
      yearInp.addEventListener("input", () => { w.year = yearInp.value; });
      yearInp.addEventListener("change", () => render());

      const titleInp = el("input");
      titleInp.type = "text";
      titleInp.value = w.title;
      titleInp.placeholder = "Titulli";
      titleInp.addEventListener("input", () => { w.title = titleInp.value; });

      const prodSel = el("select");
      const blank = el("option");
      blank.value = "";
      blank.textContent = "— pa produkt —";
      prodSel.appendChild(blank);
      for (const p of productOpts) {
        const opt = el("option");
        opt.value = p.value;
        opt.textContent = p.label;
        if (p.value === w.product) opt.selected = true;
      }
      if (w.product && !productOpts.some((p) => p.value === w.product)) {
        const opt = el("option");
        opt.value = w.product;
        opt.textContent = w.product + " (fshirë)";
        opt.selected = true;
        prodSel.insertBefore(opt, blank.nextSibling);
      }
      prodSel.addEventListener("change", () => { w.product = prodSel.value; });

      const prodInp = el("input");
      prodInp.type = "text";
      prodInp.value = w.producer;
      prodInp.placeholder = "Prodhuar nga";
      prodInp.addEventListener("input", () => { w.producer = prodInp.value; });

      const del = el("button", "gal-btn gal-del");
      del.type = "button";
      del.textContent = "×";
      del.addEventListener("click", () => { items.splice(i, 1); render(); });

      row.appendChild(yearInp);
      row.appendChild(titleInp);
      row.appendChild(prodSel);
      row.appendChild(prodInp);
      row.appendChild(del);
      list.appendChild(row);
    });
  }
  render();

  const addBtn = el("button", "btn line works-add");
  addBtn.type = "button";
  addBtn.textContent = "+ Shto vepër";
  addBtn.addEventListener("click", () => {
    items.push({ title: "", year: "", producer: "", product: "" });
    render();
  });
  wrap.appendChild(list);
  wrap.appendChild(addBtn);

  wrap._collect = () => {
    sortByYear();
    return items.map((w) => {
      const orig = w._orig;
      const merged = Array.isArray(orig) ? orig.slice() : ["", null, "", ""];
      merged[0] = w.title || (typeof orig === "string" ? orig : "");
      merged[1] = w.year ? parseInt(w.year, 10) : null;
      merged[2] = w.producer || "";
      const origProduct = Array.isArray(orig) ? orig[3] : "";
      merged[3] = w.product || origProduct || "";
      return merged;
    });
  };
  return wrap;
}

/* ---------- Slugify ---------- */

export function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ---------- Collect all fields from a container ---------- */

export function collectFields(container) {
  const out = {};
  container.querySelectorAll("[data-field]").forEach((f) => {
    if (f._collect) out[f.dataset.field] = f._collect();
  });
  return out;
}

/* ---------- Field card wrapper ---------- */
/* Wraps a set of fields in a white card with an uppercase heading. */

export function fieldCard(heading, ...fields) {
  const card = el("div", "card-section");
  if (heading) {
    const h = el("div", "card-h");
    h.textContent = heading;
    card.appendChild(h);
  }
  const body = el("div", "card-body");
  for (const f of fields) body.appendChild(f);
  card.appendChild(body);
  return card;
}

/* ---------- Language switch ---------- */
/* A single EN | SQ switch placed at the top of the form. Shows a dot
   indicator on a language if any required bi-field is empty for it. */

export function langSwitch() {
  const wrap = el("div", "lang-switch");
  const lab = el("span", "lang-lab");
  lab.textContent = "Gjuha";
  wrap.appendChild(lab);

  function buildBtn(lang) {
    const btn = el("button", "lang-btn");
    btn.type = "button";
    btn.textContent = lang.toUpperCase();
    btn.dataset.lang = lang;
    btn.addEventListener("click", () => setLang(lang));
    onLangChange((l) => {
      btn.classList.toggle("on", l === lang);
    });
    return btn;
  }
  wrap.appendChild(buildBtn("en"));
  wrap.appendChild(buildBtn("sq"));

  // dot indicators for required fields
  const dotEn = el("span", "lang-dot");
  const dotSq = el("span", "lang-dot");
  dotEn.style.display = "none";
  dotSq.style.display = "none";
  wrap.querySelector('[data-lang="en"]').appendChild(dotEn);
  wrap.querySelector('[data-lang="sq"]').appendChild(dotSq);

  function updateDots() {
    const biFields = document.querySelectorAll("[data-field][data-required] + .bi-panes, .bi-field[data-required]");
    // simpler: check all bi-fields whose label has data-required
    let enMissing = false, sqMissing = false;
    document.querySelectorAll(".bi-field").forEach((f) => {
      const lab = f.querySelector(".fld-lab");
      if (!lab || lab.dataset.required !== "1") return;
      const val = f._collect();
      if (!val.en) enMissing = true;
      if (!val.sq) sqMissing = true;
    });
    dotEn.style.display = enMissing ? "" : "none";
    dotSq.style.display = sqMissing ? "" : "none";
  }

  // update dots on input
  document.addEventListener("input", () => setTimeout(updateDots, 0));
  setTimeout(updateDots, 50);
  return wrap;
}
