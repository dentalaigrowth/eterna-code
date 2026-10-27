/* Product field configuration for the generic edit form.
   Loads brand/designer/category/room options from the database so
   selects are always current. Builds the field list from the product
   data shape that window.ETERNA.products uses. */

import { supabase } from "./supabase.js";
import {
  biText,
  textInput,
  selectField,
  multiSelect,
  toggle,
  galleryEditor,
} from "./fields.js";

export const productsConfig = {
  table: "products",
  label: "Produktet",
  fields: [
    { key: "name", label: "Emri", required: true },
    { key: "year", label: "Viti" },
    { key: "brand", label: "Marka", required: true },
    { key: "designer", label: "Projektuesi" },
    { key: "cat", label: "Kategoria" },
    { key: "rooms", label: "Dhomat" },
    { key: "story", label: "Story" },
    { key: "materials", label: "Materialet" },
    { key: "dims", label: "Përmasat" },
    { key: "featured", label: "Featured" },
    { key: "isNew", label: "New" },
    { key: "imgs", label: "Imazhet" },
    { key: "video", label: "Video" },
  ],
};

export async function loadProductOptions() {
  const [brands, designers, cats, rooms] = await Promise.all([
    supabase.from("brands").select("id, data").order("sort_order"),
    supabase.from("designers").select("id, data").order("sort_order"),
    supabase.from("categories").select("id, data").order("sort_order"),
    supabase.from("rooms").select("id, data").order("sort_order"),
  ]);

  const brandOpts = (brands.data || []).map((r) => ({
    value: r.id,
    label: r.data.name || r.id,
  }));
  const designerOpts = (designers.data || []).map((r) => ({
    value: r.id,
    label: r.data.name || r.id,
  }));
  const catOpts = (cats.data || []).map((r) => ({
    value: r.id,
    label: r.data.en || r.id,
  }));
  const roomOpts = (rooms.data || []).map((r) => ({
    value: r.id,
    label: r.data.en || r.id,
  }));

  return { brandOpts, designerOpts, catOpts, roomOpts };
}

export function buildProductFields(data, opts) {
  const d = data || {};
  const f = [];

  f.push(biText("Emri", d.name, { key: "name", required: true }));

  f.push(
    textInput("Viti", d.year, { type: "number", key: "year" })
  );

  f.push(
    selectField("Marka", d.brand, opts.brandOpts, {
      key: "brand",
      required: true,
      allowEmpty: true,
      emptyLabel: "— zgjidh —",
    })
  );

  f.push(
    selectField("Projektuesi", d.designer, opts.designerOpts, {
      key: "designer",
      allowEmpty: true,
      emptyLabel: "— zgjidh —",
    })
  );

  f.push(
    selectField("Kategoria", d.cat, opts.catOpts, {
      key: "cat",
      allowEmpty: true,
      emptyLabel: "— zgjidh —",
    })
  );

  f.push(
    multiSelect("Dhomat", d.rooms, opts.roomOpts, { key: "rooms" })
  );

  f.push(
    biText("Story", d.story, { key: "story", long: true, rows: 5 })
  );

  f.push(
    biText("Materialet", d.materials, { key: "materials", long: true, rows: 3 })
  );

  f.push(
    biText("Përmasat / Detajet", d.dims, { key: "dims", long: false })
  );

  f.push(toggle("Featured", d.featured, { key: "featured" }));
  f.push(toggle("New", d.isNew, { key: "isNew" }));

  f.push(galleryEditor("Imazhet", d.imgs, { key: "imgs" }));

  f.push(textInput("Video URL", d.video, { key: "video", placeholder: "video-id ose URL" }));

  return f;
}
