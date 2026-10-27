/* Page editor configurations for site_content.
   Each page defines its editable texts (bilingual EN/SQ) and images.
   Stored in site_content as { key: { ...fields } }. The public site
   reads overrides from window.ETERNA_CONTENT and falls back to defaults. */

import { supabase } from "./supabase.js";
import {
  biText,
  textInput,
  imageInput,
  selectField,
  fieldCard,
  collectFields,
  slugify,
} from "./fields.js";

/* ---------- Helpers ---------- */

async function loadProducts() {
  const { data } = await supabase
    .from("products")
    .select("id, data")
    .order("sort_order");
  return (data || []).map((r) => ({
    id: r.id,
    name: (r.data && r.data.name) || r.id,
  }));
}

/* Featured products multi-select on the homepage.
   Stored as an ordered array of product IDs in site_content. */
function featuredProductsField(selected, products) {
  const wrap = document.createElement("div");
  wrap.className = "fld";
  wrap.dataset.field = "featuredIds";
  const lab = document.createElement("label");
  lab.textContent = "Pieces people talk about";
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
          biText("Hero title", d.heroH, { key: "heroH", required: true }),
          biText("Hero subtitle", d.heroP, { key: "heroP", long: true }),
          biText("Tag", d.tag, { key: "tag" }),
          textInput("Explore button", d.explore, { key: "explore" }),
          textInput("Book button", d.book, { key: "book" }),
          imageInput("Hero poster", d.heroPoster, { key: "heroPoster" }),
        ],
      },
      {
        heading: "Statement block",
        fields: (d) => [
          biText("Heading", d.stmtH, { key: "stmtH" }),
          biText("Text", d.stmtP, { key: "stmtP", long: true }),
        ],
      },
      {
        heading: "Houses",
        fields: (d) => [
          biText("Label", d.ourBrands, { key: "ourBrands" }),
          biText("Discover button", d.discover, { key: "discover" }),
        ],
      },
      {
        heading: "Icons / Pieces people talk about",
        fields: (d) => [
          biText("Label", d.icons, { key: "icons" }),
          biText("Heading", d.iconsH, { key: "iconsH" }),
          biText("View all", d.viewAll, { key: "viewAll" }),
        ],
      },
      {
        heading: "Egg story block",
        fields: (d) => [
          biText("Eye label", d.eggEy, { key: "eggEy" }),
          biText("Heading", d.eggH, { key: "eggH" }),
          biText("Text", d.eggP, { key: "eggP", long: true }),
          biText("See piece", d.seePiece, { key: "seePiece" }),
          biText("Read story", d.readStory, { key: "readStory" }),
        ],
      },
      {
        heading: "By room",
        fields: (d) => [
          biText("Label", d.byRoom, { key: "byRoom" }),
          biText("Heading", d.byRoomH, { key: "byRoomH" }),
        ],
      },
      {
        heading: "Locus / Archive re-edition",
        fields: (d) => [
          biText("Eye label", d.locusEy, { key: "locusEy" }),
          biText("Heading", d.locusH, { key: "locusH" }),
          biText("Text", d.locusP, { key: "locusP", long: true }),
        ],
      },
      {
        heading: "Journal section",
        fields: (d) => [
          biText("Heading", d.jH, { key: "jH" }),
          biText("All articles", d.allArticles, { key: "allArticles" }),
        ],
      },
      {
        heading: "Visit / CTA",
        fields: (d) => [
          biText("Heading", d.visitH, { key: "visitH" }),
          biText("Text", d.visitP, { key: "visitP", long: true }),
          biText("WhatsApp button", d.whatsapp, { key: "whatsapp" }),
          biText("Book button", d.book, { key: "book2" }),
        ],
      },
      {
        heading: "Footer",
        fields: (d) => [biText("Vision", d.footVision, { key: "footVision", long: true })],
      },
    ],
    extraFields: (d, products) => [
      featuredProductsField(d.featuredIds, products),
    ],
  },

  collection: {
    label: "Collection",
    sections: [
      {
        heading: "Collection page",
        fields: (d) => [
          biText("Heading", d.collH, { key: "collH" }),
          biText("Lead", d.collP, { key: "collP", long: true }),
          biText("Price label", d.priceReq, { key: "priceReq" }),
          biText("On request", d.onReq, { key: "onReq" }),
        ],
      },
    ],
  },

  brand: {
    label: "Brand pages",
    sections: [
      {
        heading: "Brand page intros",
        fields: (d) => [
          biText("About brand", d.aboutBrand, { key: "aboutBrand" }),
          biText("Pieces label", d.pieces, { key: "pieces" }),
          biText("Piece (singular)", d.piece, { key: "piece" }),
        ],
      },
    ],
  },

  designers: {
    label: "Designers page",
    sections: [
      {
        heading: "Designers intro",
        fields: (d) => [
          biText("Heading", d.dH, { key: "dH" }),
          biText("Intro", d.dIntro, { key: "dIntro", long: true }),
          biText("Pieces by", d.piecesBy, { key: "piecesBy" }),
        ],
      },
    ],
  },

  journal: {
    label: "Journal page",
    sections: [
      {
        heading: "Journal intro",
        fields: (d) => [
          biText("Intro text", d.jP, { key: "jP", long: true }),
          biText("All articles", d.allArticles, { key: "allArticles2" }),
        ],
      },
    ],
  },

  showroom: {
    label: "Showroom",
    sections: [
      {
        heading: "Showroom page",
        fields: (d) => [
          biText("Heading", d.showH, { key: "showH" }),
          biText("Text", d.showP, { key: "showP", long: true }),
          biText("Book heading", d.bookH, { key: "bookH" }),
        ],
      },
      {
        heading: "Visit list",
        fields: (d) => [
          biText("WhatsApp message", d.waVisit, { key: "waVisit", long: true }),
        ],
      },
    ],
  },

  trade: {
    label: "Trade program",
    sections: [
      {
        heading: "Trade page",
        fields: (d) => [
          biText("Heading", d.tradeH, { key: "tradeH" }),
          biText("Text", d.tradeP, { key: "tradeP", long: true }),
          biText("Apply heading", d.applyH, { key: "applyH" }),
        ],
      },
    ],
  },

  about: {
    label: "Philosophy / About",
    sections: [
      {
        heading: "Hero",
        fields: (d) => [
          biText("Heading", d.phH, { key: "phH" }),
          biText("Lead", d.phLead, { key: "phLead", long: true }),
        ],
      },
      {
        heading: "Opening",
        fields: (d) => [biText("Text", d.phOpen, { key: "phOpen", long: true })],
      },
      {
        heading: "Why we do this",
        fields: (d) => [
          biText("Heading", d.phWhyH, { key: "phWhyH" }),
          biText("Text", d.phWhy, { key: "phWhy", long: true }),
        ],
      },
      {
        heading: "What these pieces mean",
        fields: (d) => [
          biText("Heading", d.phMeanH, { key: "phMeanH" }),
          biText("Text", d.phMean, { key: "phMean", long: true }),
        ],
      },
      {
        heading: "What we hold sacred",
        fields: (d) => [
          biText("Heading", d.phPillarsH, { key: "phPillarsH" }),
          biText("Quote", d.phQuote, { key: "phQuote" }),
          biText("Sacred heading", d.phSacredH, { key: "phSacredH" }),
          biText("Sacred text", d.phSacred, { key: "phSacred", long: true }),
        ],
      },
      {
        heading: "Promise",
        fields: (d) => [
          biText("Heading", d.phPromiseH, { key: "phPromiseH" }),
          biText("Sign text", d.phSign, { key: "phSign" }),
        ],
      },
    ],
  },

  contact: {
    label: "Contact",
    sections: [
      {
        heading: "Contact page",
        fields: (d) => [
          biText("Heading", d.contactH, { key: "contactH" }),
          biText("Text", d.contactP, { key: "contactP", long: true }),
          biText("Write to us", d.writeH, { key: "writeH" }),
        ],
      },
    ],
  },
};

export const PAGE_LIST = [
  { id: "home", label: "Home" },
  { id: "collection", label: "Collection" },
  { id: "brand", label: "Brand pages" },
  { id: "designers", label: "Designers" },
  { id: "journal", label: "Journal" },
  { id: "showroom", label: "Showroom" },
  { id: "trade", label: "Trade program" },
  { id: "about", label: "Philosophy / About" },
  { id: "contact", label: "Contact" },
];
