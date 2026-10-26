/* One-time import: upserts the static window.ETERNA data and the T strings
   into the Supabase tables. Safe to run multiple times (upsert by id).
   Reads window.ETERNA from the classic scripts loaded by admin.html. */
import { supabase } from "./supabase.js";
import { DEFAULT_STRINGS } from "./strings.js";

export async function runImport() {
  const D = window.ETERNA;
  if (!D) throw new Error("window.ETERNA nuk u gjet. Sigurohu që data.js është i ngarkuar.");
  const out = {};

  await upsertMap("brands", D.brands);
  out.brands = count(D.brands);
  await upsertMap("categories", D.cats);
  out.categories = count(D.cats);
  await upsertMap("rooms", D.rooms);
  out.rooms = count(D.rooms);
  await upsertArray("products", D.products);
  out.products = D.products.length;
  await upsertMap("designers", D.designers);
  out.designers = count(D.designers);
  await upsertArray("articles", D.journal);
  out.articles = D.journal.length;

  // ui_strings: one row per key with {en, sq}
  let strCount = 0;
  const enKeys = Object.keys(DEFAULT_STRINGS.en);
  for (const key of enKeys) {
    const row = {
      key,
      value: { en: DEFAULT_STRINGS.en[key], sq: DEFAULT_STRINGS.sq[key] },
    };
    const { error } = await supabase
      .from("ui_strings")
      .upsert(row, { onConflict: "key" });
    if (error) throw new Error("ui_strings: " + error.message);
    strCount++;
  }
  out.ui_strings = strCount;

  return out;
}

function count(obj) {
  return Object.keys(obj).length;
}

async function upsertMap(table, map) {
  const rows = [];
  let order = 0;
  for (const id in map) {
    rows.push({ id, data: map[id], published: true, sort_order: order++ });
  }
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw new Error(table + ": " + error.message);
}

async function upsertArray(table, arr) {
  const rows = arr.map(function (item, i) {
    return { id: item.id, data: item, published: true, sort_order: i };
  });
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw new Error(table + ": " + error.message);
}
