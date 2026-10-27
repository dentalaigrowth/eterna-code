/* Reusable form-field builders for the ETERNA admin. Each returns a DOM
   element with a _collect() method that yields the field's value. */

function el(tag, cls) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );
}

/* ---------- Bilingual text (EN / SQ tabs) ---------- */

export function biText(label, value, opts = {}) {
  const v = value && typeof value === "object" ? value : { en: "", sq: "" };
  const wrap = el("div", "bi-field");
  wrap.dataset.field = opts.key || "";
  const lab = el("label", "fld-lab");
  lab.textContent = label;
  wrap.appendChild(lab);

  const tabs = el("div", "bi-tabs");
  const enBtn = el("button", "bi-tab on");
  enBtn.type = "button";
  enBtn.textContent = "EN";
  const sqBtn = el("button", "bi-tab");
  sqBtn.type = "button";
  sqBtn.textContent = "SQ";
  tabs.appendChild(enBtn);
  tabs.appendChild(sqBtn);

  const panes = el("div", "bi-panes");
  const enPane = el("div", "bi-pane");
  const sqPane = el("div", "bi-pane");
  sqPane.style.display = "none";

  const enInput = opts.long
    ? textarea(v.en || "", opts)
    : input(v.en || "", opts);
  const sqInput = opts.long
    ? textarea(v.sq || "", opts)
    : input(v.sq || "", opts);
  enPane.appendChild(enInput);
  sqPane.appendChild(sqInput);
  panes.appendChild(enPane);
  panes.appendChild(sqPane);

  enBtn.addEventListener("click", () => {
    enBtn.classList.add("on");
    sqBtn.classList.remove("on");
    enPane.style.display = "";
    sqPane.style.display = "none";
  });
  sqBtn.addEventListener("click", () => {
    sqBtn.classList.add("on");
    enBtn.classList.remove("on");
    sqPane.style.display = "";
    enPane.style.display = "none";
  });

  wrap.appendChild(tabs);
  wrap.appendChild(panes);
  wrap._collect = () => ({ en: enInput.value, sq: sqInput.value });
  wrap._input = () => enInput;
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
  if (opts.placeholder) t.placeholder = opts.placeholder;
  if (opts.required) t.required = true;
  return t;
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
  return wrap;
}

/* ---------- Multi-select (checkboxes) ---------- */

export function multiSelect(label, selected, options, opts = {}) {
  const wrap = el("div", "fld");
  wrap.dataset.field = opts.key || "";
  const lab = el("label");
  lab.textContent = label;
  wrap.appendChild(lab);
  const grid = el("div", "multi");
  const sel = new Set(selected || []);
  for (const o of options) {
    const id = "ms-" + Math.random().toString(36).slice(2, 9);
    const cb = el("input");
    cb.type = "checkbox";
    cb.id = id;
    cb.value = o.value;
    if (sel.has(o.value)) cb.checked = true;
    const lbl = el("label", "multi-item");
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

/* ---------- Checkbox ---------- */

export function checkbox(label, checked, opts = {}) {
  const wrap = el("div", "fld");
  wrap.dataset.field = opts.key || "";
  const lbl = el("label", "check-lbl");
  const cb = el("input");
  cb.type = "checkbox";
  cb.checked = !!checked;
  const span = el("span");
  span.textContent = label;
  lbl.appendChild(cb);
  lbl.appendChild(span);
  wrap.appendChild(lbl);
  wrap._collect = () => (cb.checked ? 1 : 0);
  return wrap;
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
    items.forEach((url, i) => {
      const row = el("div", "gal-row");

      const moveBtns = el("div", "gal-move");
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
      moveBtns.appendChild(upBtn);
      moveBtns.appendChild(dnBtn);

      const thumb = el("div", "gal-thumb");
      const img = el("img");
      img.src = optimizeUrl(url);
      thumb.appendChild(img);

      const inp = el("input");
      inp.type = "text";
      inp.value = url;
      inp.placeholder = "https://res.cloudinary.com/...";
      inp.addEventListener("input", () => {
        items[i] = inp.value;
        img.src = optimizeUrl(inp.value);
      });

      const mainWrap = el("label", "gal-main");
      mainWrap.title = "Imazhi kryesor";
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
      mainWrap.appendChild(document.createTextNode("Kryesor"));

      const delBtn = el("button", "gal-btn gal-del");
      delBtn.type = "button";
      delBtn.textContent = "✕";
      delBtn.addEventListener("click", () => {
        items.splice(i, 1);
        render();
      });

      row.appendChild(moveBtns);
      row.appendChild(thumb);
      row.appendChild(inp);
      row.appendChild(mainWrap);
      row.appendChild(delBtn);
      list.appendChild(row);
    });
  }
  render();

  const addBtn = el("button", "btn line gal-add");
  addBtn.type = "button";
  addBtn.textContent = "+ Shto imazh";
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
    // Relative path — resolve through Cloudinary media bases by extension
    var IMG_EXT = /\.(webp|jpg|jpeg|png|svg)(\?.*)?$/i;
    var VID_EXT = /\.(mp4|webm|mov)(\?.*)?$/i;
    var IMG_BASE = "https://res.cloudinary.com/l5tyqnmr/image/upload/";
    var VIDEO_BASE = "https://res.cloudinary.com/l5tyqnmr/video/upload/";
    if (IMG_EXT.test(url)) return IMG_BASE + url.replace(/^(img\/|video\/)/, "");
    if (VID_EXT.test(url)) return VIDEO_BASE + url.replace(/^(img\/|video\/)/, "");
    return url;
  }
  if (url.indexOf("res.cloudinary.com") > -1 && url.indexOf("/upload/") > -1) {
    return url.replace("/upload/", "/upload/f_auto,q_auto,w_120/");
  }
  return url;
}

/* ---------- Collect all fields from a container ---------- */

export function collectFields(container) {
  const out = {};
  container.querySelectorAll("[data-field]").forEach((f) => {
    if (f._collect) out[f.dataset.field] = f._collect();
  });
  return out;
}
