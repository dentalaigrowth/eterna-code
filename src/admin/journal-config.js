/* Journal (articles) field configuration — uses the same generic
   list + form that entity-configs.js provides for designers etc.
   Data shape (from public app.js):
   { title: {en,sq}, dek: {en,sq}, img, body: {en:[...],sq:[...]},
     date: "2026-10", related: ["egg-chair","swan-chair",...] } */

import { supabase } from "./supabase.js";
import {
  biText,
  textInput,
  imageInput,
  paragraphList,
  slugify,
} from "./fields.js";

function el(tag, cls) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}

/* Searchable multi-select with chips. Returns a DOM element with
   _collect() => array of selected product IDs. */
function searchableMultiSelect(label, selected, options, opts = {}) {
  const wrap = el("div", "fld");
  wrap.dataset.field = opts.key || "";
  const lab = el("label", "fld-lab");
  lab.textContent = label;
  wrap.appendChild(lab);

  const sel = new Set(selected || []);

  const box = el("div", "sms-box");

  // search input
  const search = el("input", "sms-search");
  search.type = "text";
  search.placeholder = "Kërko produkte…";
  box.appendChild(search);

  // results list
  const results = el("div", "sms-results");
  box.appendChild(results);

  // selected chips
  const chipsWrap = el("div", "sms-chips");
  box.appendChild(chipsWrap);

  function renderChips() {
    chipsWrap.innerHTML = "";
    for (const val of sel) {
      const opt = options.find((o) => o.value === val);
      const chip = el("span", "sms-chip");
      chip.textContent = opt ? opt.label : val;
      const rm = el("button", "sms-chip-rm");
      rm.type = "button";
      rm.textContent = "×";
      rm.addEventListener("click", () => {
        sel.delete(val);
        renderChips();
        renderResults();
      });
      chip.appendChild(rm);
      chipsWrap.appendChild(chip);
    }
  }

  function renderResults() {
    results.innerHTML = "";
    const q = search.value.trim().toLowerCase();
    const visible = options.filter((o) => {
      if (sel.has(o.value)) return false;
      if (!q) return true;
      return o.label.toLowerCase().indexOf(q) > -1 || o.value.toLowerCase().indexOf(q) > -1;
    });
    const slice = visible.slice(0, 30);
    for (const o of slice) {
      const row = el("div", "sms-row");
      row.textContent = o.label;
      row.addEventListener("click", () => {
        sel.add(o.value);
        search.value = "";
        renderChips();
        renderResults();
      });
      results.appendChild(row);
    }
    if (visible.length > 30) {
      const more = el("div", "sms-more");
      more.textContent = `+ ${visible.length - 30} të tjera…`;
      results.appendChild(more);
    }
    if (!slice.length && q) {
      const empty = el("div", "sms-empty");
      empty.textContent = "Asnjë produkt.";
      results.appendChild(empty);
    }
  }

  search.addEventListener("input", renderResults);

  renderChips();
  renderResults();

  wrap.appendChild(box);
  wrap._collect = () => Array.from(sel);
  return wrap;
}

async function loadProductsForSelect() {
  const { data } = await supabase
    .from("products")
    .select("id, data")
    .order("sort_order");
  return (data || []).map((r) => ({
    value: r.id,
    label: (r.data && r.data.name) || r.id,
  }));
}

export function buildJournalFields(data, opts) {
  const d = data || {};
  const f = [];

  f.push(biText("Titulli", d.title, { key: "title", required: true }));
  f.push(biText("Përshkrimi i shkurtër", d.dek, { key: "dek", long: true, rows: 2 }));
  f.push(imageInput("Imazhi i kopertinës", d.img, { key: "img" }));
  f.push(textInput("Data", d.date, { key: "date", placeholder: "p.sh. 2026-10" }));
  f.push(paragraphList("Trupi (paragrafë)", d.body, { key: "body" }));
  f.push(
    searchableMultiSelect("Produktet e lidhura", d.related, opts.productOpts || [], {
      key: "related",
    })
  );

  return f;
}

export const journalConfig = {
  table: "articles",
  label: "Journal",
  thumbnailField: "img",
  autoSlug: true,
  fields: [{ key: "title", label: "Titulli", required: true }],
  formSections: [
    { heading: "Artikulli", keys: ["title", "dek", "img", "date"] },
    { heading: "Trupi", keys: ["body"] },
    { heading: "Produktet e lidhura", keys: ["related"] },
  ],
  async buildFields(data) {
    const productOpts = await loadProductsForSelect();
    return buildJournalFields(data, { productOpts });
  },
  collectData(collected, existing) {
    return {
      ...existing,
      title: collected.title,
      dek: collected.dek,
      img: collected.img,
      date: collected.date,
      body: collected.body,
      related: collected.related,
    };
  },
  extractName(data) {
    if (!data) return "—";
    if (data.title && typeof data.title === "object") return data.title.en || data.title.sq || "—";
    if (typeof data.title === "string") return data.title;
    return "—";
  },
};
