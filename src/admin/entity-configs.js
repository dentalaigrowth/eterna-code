/* Entity field configurations for categories, brands, and rooms.
   Each config reuses the generic list + form from screens.js and
   reads/writes the SAME data shape that window.ETERNA uses. */

import { supabase } from "./supabase.js";
import { biText, textInput, selectField, imageInput, toggle, paragraphList, worksEditor, slugify } from "./fields.js";

/* ---------- Categories ---------- */
/* Data shape in window.ETERNA.cats: { en: "Chairs", sq: "Karrige" } */

export const categoriesConfig = {
  table: "categories",
  label: "Kategoritë",
  thumbnailField: null,
  autoSlug: true,
  fields: [
    { key: "name", label: "Emri", required: true },
  ],
  buildFields(data) {
    const d = data || {};
    return [biText("Emri", d, { key: "name", required: true })];
  },
  collectData(collected) {
    return { en: collected.name.en, sq: collected.name.sq };
  },
  extractName(data) {
    if (!data) return "—";
    if (data.en) return data.en;
    if (data.name && data.name.en) return data.name.en;
    return "—";
  },
  async canDelete(id) {
    const { count, error } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("cat", id);
    if (error) return { ok: false, msg: "Gabim: " + error.message };
    if (count > 0) return { ok: false, msg: `Nuk mund të fshihet: ${count} produktesh e përdorin këtë kategori.` };
    return { ok: true };
  },
};

/* ---------- Brands ---------- */
/* Data shape in window.ETERNA.brands: { name, origin: {en,sq}, hero, video, intro: {en,sq} } */

export const brandsConfig = {
  table: "brands",
  label: "Markat",
  thumbnailField: "hero",
  autoSlug: true,
  fields: [
    { key: "name", label: "Emri", required: true },
    { key: "origin", label: "Origjina", required: true },
    { key: "hero", label: "Imazhi i kopertinës" },
    { key: "video", label: "Video" },
    { key: "intro", label: "Përshkrimi", required: true },
  ],
  buildFields(data) {
    const d = data || {};
    return [
      biText("Emri", d.name, { key: "name", required: true }),
      biText("Origjina", d.origin, { key: "origin", required: true }),
      imageInput("Imazhi i kopertinës (hero)", d.hero, { key: "hero" }),
      textInput("Video", d.video, { key: "video", placeholder: "video-id ose URL" }),
      biText("Përshkrimi", d.intro, { key: "intro", required: true, long: true, rows: 4 }),
    ];
  },
  collectData(collected) {
    return {
      name: typeof collected.name === "string" ? collected.name : (collected.name.en || ""),
      origin: collected.origin,
      hero: collected.hero,
      video: collected.video,
      intro: collected.intro,
    };
  },
  extractName(data) {
    if (!data) return "—";
    if (typeof data.name === "string") return data.name;
    if (data.name && data.name.en) return data.name.en;
    return "—";
  },
  async canDelete(id) {
    const { count, error } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("brand", id);
    if (error) return { ok: false, msg: "Gabim: " + error.message };
    if (count > 0) return { ok: false, msg: `Nuk mund të fshihet: ${count} produktesh e përdorin këtë markë.` };
    return { ok: true };
  },
};

/* ---------- Rooms ---------- */
/* Data shape in window.ETERNA.rooms: { en: "Living", sq: "Ndenja" } */

export const roomsConfig = {
  table: "rooms",
  label: "Dhomat",
  thumbnailField: null,
  autoSlug: true,
  fields: [
    { key: "name", label: "Emri", required: true },
  ],
  buildFields(data) {
    const d = data || {};
    return [biText("Emri", d, { key: "name", required: true })];
  },
  collectData(collected) {
    return { en: collected.name.en, sq: collected.name.sq };
  },
  extractName(data) {
    if (!data) return "—";
    if (data.en) return data.en;
    if (data.name && data.name.en) return data.name.en;
    return "—";
  },
  async canDelete(id) {
    const { data: products, error } = await supabase
      .from("products")
      .select("id, data")
      .eq("published", true);
    if (error) return { ok: false, msg: "Gabim: " + error.message };
    const count = (products || []).filter((p) => {
      const rooms = (p.data && p.data.rooms) || [];
      return rooms.indexOf(id) > -1;
    }).length;
    if (count > 0) return { ok: false, msg: `Nuk mund të fshihet: ${count} produktesh e përdorin këtë dhomë.` };
    return { ok: true };
  },
};

/* ---------- Designers ---------- */
/* Data shape: { name, life: "1902–1971", country: {en,sq}, img, portrait,
   bio: {en,sq}, story: {en:[...],sq:[...]}, works: [[title,year,producer,productId],...] } */

export async function loadDesignerOptions() {
  const { data } = await supabase
    .from("products")
    .select("id, data")
    .order("sort_order");
  return (data || []).map((r) => ({
    value: r.id,
    label: (r.data && r.data.name) || r.id,
  }));
}

export function buildDesignerFields(data, opts) {
  const d = data || {};
  const f = [];

  // Parse life string "1902–1971" into born/died
  const lifeParts = (d.life || "").split(/[–-]/);
  const born = lifeParts[0] ? lifeParts[0].trim() : "";
  const died = lifeParts[1] ? lifeParts[1].trim() : "";

  f.push(textInput("Emri", d.name, { key: "name", required: true }));
  f.push(textInput("Viti i lindjes", born, { type: "number", key: "_born" }));
  f.push(textInput("Viti i vdekjes (bosh = gjallë)", died, { type: "number", key: "_died" }));
  f.push(biText("Vendi", d.country, { key: "country" }));
  f.push(imageInput("Fotoja (key ose URL)", d.img, { key: "img" }));
  f.push(toggle("Portret (bardh e zi)", d.portrait, { key: "portrait" }));
  f.push(biText("Bio e shkurtër", d.bio, { key: "bio", long: true, rows: 3, hint: "Përdoret si rezervë në faqen e projektuesit vetëm nëse fusha \"Historia\" është bosh." }));
  f.push(paragraphList("Historia (paragrafë)", d.story, { key: "story" }));
  f.push(worksEditor("Veprat", d.works, { key: "works", productOpts: opts.productOpts || [] }));

  return f;
}

export const designersConfig = {
  table: "designers",
  label: "Projektuesit",
  thumbnailField: "img",
  autoSlug: true,
  fields: [
    { key: "name", label: "Emri", required: true },
  ],
  formSections: [
    { heading: "Informacion bazë", keys: ["name", "_born", "_died", "country", "img", "portrait"], side: true },
    { heading: "Bio e shkurtër", keys: ["bio"] },
    { heading: "Historia (paragrafë)", keys: ["story"] },
    { heading: "Veprat", keys: ["works"], fullWidth: true },
  ],
  async buildFields(data) {
    const productOpts = await loadDesignerOptions();
    return buildDesignerFields(data, { productOpts });
  },
  async buildExtra(data, id) {
    if (!id) return null;
    const { data: products } = await supabase
      .from("products")
      .select("id, data")
      .eq("designer", id)
      .order("sort_order");
    if (!products || !products.length) return null;
    const box = document.createElement("div");
    box.className = "related-box";
    const h = document.createElement("div");
    h.className = "card-h";
    h.textContent = "Produkte të lidhura";
    box.appendChild(h);
    const cnt = document.createElement("div");
    cnt.className = "related-count";
    cnt.textContent = products.length + " produkt" + (products.length > 1 ? "e" : "");
    box.appendChild(cnt);
    const list = document.createElement("div");
    list.className = "related-list";
    for (const p of products) {
      const a = document.createElement("a");
      a.href = "#products/" + encodeURIComponent(p.id);
      a.textContent = (p.data && p.data.name) || p.id;
      list.appendChild(a);
    }
    box.appendChild(list);
    return box;
  },
  collectData(collected, existing) {
    const born = collected._born || "";
    const died = collected._died || "";
    const life = born + (died ? "–" + died : "");
    return {
      ...existing,
      name: typeof collected.name === "string" ? collected.name : (collected.name && collected.name.en) || "",
      life,
      country: collected.country,
      img: collected.img,
      portrait: collected.portrait,
      bio: collected.bio,
      story: collected.story,
      works: collected.works,
    };
  },
  extractName(data) {
    if (!data) return "—";
    if (typeof data.name === "string") return data.name;
    if (data.name && data.name.en) return data.name.en;
    return "—";
  },
  async canDelete(id) {
    const { count, error } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("designer", id);
    if (error) return { ok: false, msg: "Gabim: " + error.message };
    if (count > 0) return { ok: false, msg: `Nuk mund të fshihet: ${count} produktesh e përdorin këtë projektues.` };
    return { ok: true };
  },
};

/* ---------- Generate unique slug ---------- */

export async function generateUniqueSlug(table, base) {
  let slug = slugify(base);
  if (!slug) slug = "item";
  let candidate = slug;
  let suffix = 1;
  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select("id")
      .eq("id", candidate)
      .maybeSingle();
    if (error) break;
    if (!data) return candidate;
    suffix++;
    candidate = slug + "-" + String(suffix).padStart(2, "0");
  }
  return candidate;
}
