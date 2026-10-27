/* Entity field configurations for categories, brands, and rooms.
   Each config reuses the generic list + form from screens.js and
   reads/writes the SAME data shape that window.ETERNA uses. */

import { supabase } from "./supabase.js";
import { biText, textInput, selectField, imageInput, slugify } from "./fields.js";

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
