/* Page editor configurations for site_content.
   Each page defines its editable texts (bilingual EN/SQ) and images.
   Stored in site_content as { key: { ...fields } }. The public site
   reads overrides from window.ETERNA_CONTENT and falls back to defaults. */

import {
  biText,
  imageInput,
  fieldCard,
} from "./fields.js";

/* Featured products multi-select on the homepage.
   Stored as an ordered array of product IDs in site_content. */
function featuredProductsField(selected, products) {
  const wrap = document.createElement("div");
  wrap.className = "fld";
  wrap.dataset.field = "featuredIds";
  const lab = document.createElement("label");
  lab.textContent = "Produktet e zgjedhura";
  wrap.appendChild(lab);

  const picked = (selected || []).slice();
  const all = products.map((p) => ({ value: p.id, label: p.name }));

  const pickedWrap = document.createElement("div");
  pickedWrap.className = "featured-picked";
  const availableWrap = document.createElement("div");
  availableWrap.className = "featured-available";

  function renderPicked() {
    pickedWrap.innerHTML = "";
    const hint = document.createElement("div");
    hint.className = "featured-hint";
    hint.textContent = picked.length ? "Zgjedhur (renditja sipas)" : "Asnjë pjesë e zgjedhur";
    pickedWrap.appendChild(hint);
    picked.forEach((id, i) => {
      const row = document.createElement("div");
      row.className = "featured-row";
      const nm = document.createElement("span");
      nm.className = "featured-name";
      nm.textContent = all.find((p) => p.value === id)?.label || id;
      row.appendChild(nm);
      const up = document.createElement("button");
      up.type = "button";
      up.className = "btn sm line";
      up.textContent = "↑";
      up.disabled = i === 0;
      up.addEventListener("click", () => {
        [picked[i], picked[i - 1]] = [picked[i - 1], picked[i]];
        renderPicked();
      });
      const dn = document.createElement("button");
      dn.type = "button";
      dn.className = "btn sm line";
      dn.textContent = "↓";
      dn.disabled = i === picked.length - 1;
      dn.addEventListener("click", () => {
        [picked[i], picked[i + 1]] = [picked[i + 1], picked[i]];
        renderPicked();
      });
      const rm = document.createElement("button");
      rm.type = "button";
      rm.className = "btn sm danger-line";
      rm.textContent = "✕";
      rm.addEventListener("click", () => {
        picked.splice(i, 1);
        renderPicked();
      });
      row.appendChild(up);
      row.appendChild(dn);
      row.appendChild(rm);
      pickedWrap.appendChild(row);
    });
  }

  function renderAvailable() {
    availableWrap.innerHTML = "";
    const hint = document.createElement("div");
    hint.className = "featured-hint";
    hint.textContent = "Shto pjesë";
    availableWrap.appendChild(hint);
    const sel = document.createElement("select");
    sel.className = "featured-add-sel";
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "— zgjidh —";
    sel.appendChild(blank);
    for (const p of all) {
      if (picked.indexOf(p.value) > -1) continue;
      const opt = document.createElement("option");
      opt.value = p.value;
      opt.textContent = p.label;
      sel.appendChild(opt);
    }
    sel.addEventListener("change", () => {
      if (sel.value) {
        picked.push(sel.value);
        renderPicked();
        renderAvailable();
      }
    });
    availableWrap.appendChild(sel);
  }

  renderPicked();
  renderAvailable();
  wrap.appendChild(pickedWrap);
  wrap.appendChild(availableWrap);
  wrap._collect = () => picked;
  return wrap;
}

/* ---------- Page definitions ---------- */

export const PAGE_CONFIGS = {
  home: {
    label: "Home (Kreu)",
    sections: [
      {
        heading: "Hero",
        fields: (d) => [
          biText("Titulli i hero-s", d.heroH, { key: "heroH", required: true }),
          biText("Nëntitulli", d.heroP, { key: "heroP", long: true }),
          biText("Etiketa", d.tag, { key: "tag" }),
          biText("Butoni \"Eksploro\"", d.explore, { key: "explore" }),
          biText("Butoni \"Rezervo\"", d.book, { key: "book" }),
          imageInput("Posteri i hero-s", d.heroPoster, { key: "heroPoster" }),
        ],
      },
      {
        heading: "Blloku i deklaratës",
        fields: (d) => [
          biText("Titulli", d.stmtH, { key: "stmtH" }),
          biText("Teksti", d.stmtP, { key: "stmtP", long: true }),
        ],
      },
      {
        heading: "Shtëpitë",
        fields: (d) => [
          biText("Etiketa", d.ourBrands, { key: "ourBrands" }),
          biText("Butoni \"Zbulo\"", d.discover, { key: "discover" }),
        ],
      },
      {
        heading: "Ikonat / Pjesë për të cilat flitet",
        fields: (d) => [
          biText("Etiketa", d.icons, { key: "icons" }),
          biText("Titulli", d.iconsH, { key: "iconsH" }),
          biText("Shiko të gjitha", d.viewAll, { key: "viewAll" }),
        ],
      },
      {
        heading: "Blloku i historisë Egg",
        fields: (d) => [
          biText("Etiketa", d.eggEy, { key: "eggEy" }),
          biText("Titulli", d.eggH, { key: "eggH" }),
          biText("Teksti", d.eggP, { key: "eggP", long: true }),
          biText("Shiko pjesën", d.seePiece, { key: "seePiece" }),
          biText("Lexo historinë", d.readStory, { key: "readStory" }),
        ],
      },
      {
        heading: "Sipas hapësirës",
        fields: (d) => [
          biText("Etiketa", d.byRoom, { key: "byRoom" }),
          biText("Titulli", d.byRoomH, { key: "byRoomH" }),
        ],
      },
      {
        heading: "Locus / Ribotim arkivor",
        fields: (d) => [
          biText("Etiketa", d.locusEy, { key: "locusEy" }),
          biText("Titulli", d.locusH, { key: "locusH" }),
          biText("Teksti", d.locusP, { key: "locusP", long: true }),
        ],
      },
      {
        heading: "Seksioni i revistës",
        fields: (d) => [
          biText("Titulli", d.jH, { key: "jH" }),
          biText("Të gjitha artikujt", d.allArticles, { key: "allArticles" }),
        ],
      },
      {
        heading: "Vizita / CTA",
        fields: (d) => [
          biText("Titulli", d.visitH, { key: "visitH" }),
          biText("Teksti", d.visitP, { key: "visitP", long: true }),
          biText("Butoni WhatsApp", d.whatsapp, { key: "whatsapp" }),
          biText("Butoni \"Rezervo\"", d.book2, { key: "book2" }),
        ],
      },
      {
        heading: "Fund faqe",
        fields: (d) => [biText("Vizioni", d.footVision, { key: "footVision", long: true })],
      },
    ],
    extraFields: (d, products) => [
      featuredProductsField(d.featuredIds, products),
    ],
  },

  collection: {
    label: "Koleksioni",
    sections: [
      {
        heading: "Faqja e koleksionit",
        fields: (d) => [
          biText("Titulli", d.collH, { key: "collH" }),
          biText("Hyrja", d.collP, { key: "collP", long: true }),
          biText("Etiketa e çmimit", d.priceReq, { key: "priceReq" }),
          biText("Sipas kërkesës", d.onReq, { key: "onReq" }),
        ],
      },
    ],
  },

  brand: {
    label: "Faqet e markave",
    sections: [
      {
        heading: "Hyrjet e faqeve të markave",
        fields: (d) => [
          biText("Rreth markës", d.aboutBrand, { key: "aboutBrand" }),
          biText("Etiketa \"pjesë\"", d.pieces, { key: "pieces" }),
          biText("Pjesë (njëjës)", d.piece, { key: "piece" }),
        ],
      },
    ],
  },

  designers: {
    label: "Faqja e projektuesve",
    sections: [
      {
        heading: "Hyrja e projektuesve",
        fields: (d) => [
          biText("Titulli", d.dH, { key: "dH" }),
          biText("Hyrja", d.dIntro, { key: "dIntro", long: true }),
          biText("Pjesë nga", d.piecesBy, { key: "piecesBy" }),
        ],
      },
    ],
  },

  journal: {
    label: "Faqja e revistës",
    sections: [
      {
        heading: "Hyrja e revistës",
        fields: (d) => [
          biText("Teksti i hyrjes", d.jP, { key: "jP", long: true }),
          biText("Të gjitha artikujt", d.allArticles2, { key: "allArticles2" }),
        ],
      },
    ],
  },

  showroom: {
    label: "Showroom",
    sections: [
      {
        heading: "Faqja e showroom-it",
        fields: (d) => [
          biText("Titulli", d.showH, { key: "showH" }),
          biText("Teksti", d.showP, { key: "showP", long: true }),
          biText("Titulli i rezervimit", d.bookH, { key: "bookH" }),
        ],
      },
      {
        heading: "Lista e vizitës",
        fields: (d) => [
          biText("Mesazh WhatsApp", d.waVisit, { key: "waVisit", long: true }),
        ],
      },
    ],
  },

  trade: {
    label: "Programi profesional",
    sections: [
      {
        heading: "Faqja e programit",
        fields: (d) => [
          biText("Titulli", d.tradeH, { key: "tradeH" }),
          biText("Teksti", d.tradeP, { key: "tradeP", long: true }),
          biText("Titulli i aplikimit", d.applyH, { key: "applyH" }),
        ],
      },
    ],
  },

  about: {
    label: "Filozofia / Rreth nesh",
    sections: [
      {
        heading: "Hero",
        fields: (d) => [
          biText("Titulli", d.phH, { key: "phH" }),
          biText("Hyrja", d.phLead, { key: "phLead", long: true }),
        ],
      },
      {
        heading: "Hapja",
        fields: (d) => [biText("Teksti", d.phOpen, { key: "phOpen", long: true })],
      },
      {
        heading: "Pse e bëjmë këtë",
        fields: (d) => [
          biText("Titulli", d.phWhyH, { key: "phWhyH" }),
          biText("Teksti", d.phWhy, { key: "phWhy", long: true }),
        ],
      },
      {
        heading: "Çfarë do të thonë këto pjesë",
        fields: (d) => [
          biText("Titulli", d.phMeanH, { key: "phMeanH" }),
          biText("Teksti", d.phMean, { key: "phMean", long: true }),
        ],
      },
      {
        heading: "Çfarë mbajmë të shenjtë",
        fields: (d) => [
          biText("Titulli", d.phPillarsH, { key: "phPillarsH" }),
          biText("Citimi", d.phQuote, { key: "phQuote" }),
          biText("Titulli i shenjtë", d.phSacredH, { key: "phSacredH" }),
          biText("Teksti i shenjtë", d.phSacred, { key: "phSacred", long: true }),
        ],
      },
      {
        heading: "Premtim",
        fields: (d) => [
          biText("Titulli", d.phPromiseH, { key: "phPromiseH" }),
          biText("Teksti i firmës", d.phSign, { key: "phSign" }),
        ],
      },
    ],
  },

  contact: {
    label: "Kontakt",
    sections: [
      {
        heading: "Faqja e kontaktit",
        fields: (d) => [
          biText("Titulli", d.contactH, { key: "contactH" }),
          biText("Teksti", d.contactP, { key: "contactP", long: true }),
          biText("Na shkruani", d.writeH, { key: "writeH" }),
        ],
      },
    ],
  },
};

export const PAGE_LIST = [
  { id: "home", label: "Home" },
  { id: "collection", label: "Koleksioni" },
  { id: "brand", label: "Faqet e markave" },
  { id: "designers", label: "Projektuesit" },
  { id: "journal", label: "Revista" },
  { id: "showroom", label: "Showroom" },
  { id: "trade", label: "Programi profesional" },
  { id: "about", label: "Filozofia / Rreth nesh" },
  { id: "contact", label: "Kontakt" },
];

/* ---------- Save logic: only store values that differ from defaults ---------- */

/* Deep-equality for {en,sq} objects or plain strings/arrays. */
function valEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a && b && typeof a === "object") {
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    for (const k of ak) {
      if (!valEqual(a[k], b[k])) return false;
    }
    return true;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => v === b[i]);
  }
  return false;
}

/* Build the override object: only keys where the collected value
   differs from the default. Empty/blank bi-text means "use default",
   so it is never stored as an override. */
export function buildOverride(collected, defaults) {
  const out = {};
  for (const key of Object.keys(collected)) {
    const val = collected[key];
    const def = defaults[key];

    // For bi-text fields (objects with en/sq): skip if empty or equals default
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const en = (val.en || "").trim();
      const sq = (val.sq || "").trim();
      if (!en && !sq) continue; // empty = use default
      if (valEqual(val, def)) continue; // unchanged
      out[key] = val;
      continue;
    }

    // For mono-text fields: skip if empty or equals default
    if (typeof val === "string") {
      if (!val.trim()) continue;
      if (val === def) continue;
      out[key] = val;
      continue;
    }

    // For arrays (featuredIds): skip if empty or equals default
    if (Array.isArray(val)) {
      if (!val.length) continue;
      if (valEqual(val, def || [])) continue;
      out[key] = val;
      continue;
    }

    out[key] = val;
  }
  return out;
}

/* Merge defaults with saved overrides to produce the full data object
   that the form fields receive. */
const isBi = (v) => v && typeof v === "object" && !Array.isArray(v) && "en" in v;

export function mergePageData(defaults, overrides) {
  const out = { ...defaults };
  for (const key of Object.keys(overrides)) {
    const o = overrides[key];
    const d = defaults[key];
    out[key] = isBi(o) && isBi(d) ? { en: o.en || d.en, sq: o.sq || d.sq } : o;
  }
  return out;
}
