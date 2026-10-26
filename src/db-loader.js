/* ETERNA db-loader. Fetches all content tables from Supabase, rebuilds
   window.ETERNA in the shape app.js expects, merges ui_strings overrides
   into the T object (exposed as window.ETERNA_T by app.js), and applies
   media rewriting AFTER the merge. Uses stale-while-revalidate:
   1) Synchronously apply cached DB data from localStorage (if any).
   2) app.js renders from the current window.ETERNA (cached or static).
   3) Background fetch updates ETERNA, re-merges, caches, and triggers
      a re-render via a hashchange event.
   If the fetch fails or tables are empty, the static data stays. */
import { supabase } from "./public-supabase.js";

const CACHE_KEY = "eterna-db-cache-v1";
const CONTENT_TABLES = ["brands", "categories", "rooms", "products", "designers", "articles"];

// --- 1. Synchronous: apply cache ---
try {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) applyDbData(JSON.parse(cached));
} catch (e) {
  /* ignore corrupt cache */
}
window.ETERNA_DB_READY = true;

// --- 2. Async: fetch from DB (stale-while-revalidate) ---
if (supabase) {
  fetchAll()
    .then(function (data) {
      if (!data) return;
      applyDbData(data);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch (e) {
        /* ignore quota errors */
      }
      // Trigger app.js re-render
      window.dispatchEvent(new Event("hashchange"));
    })
    .catch(function () {
      /* fetch failed — keep current (static or cached) data */
    });
}

async function fetchAll() {
  const results = {};
  const entries = await Promise.all(
    CONTENT_TABLES.map(async function (t) {
      const { data, error } = await supabase
        .from(t)
        .select("id, data, published, sort_order")
        .eq("published", true)
        .order("sort_order");
      if (error) throw error;
      return [t, data || []];
    })
  );
  for (const [t, rows] of entries) results[t] = rows;

  const { data: uiRows, error: e1 } = await supabase
    .from("ui_strings")
    .select("key, value");
  if (e1) throw e1;
  results.ui_strings = uiRows || [];

  const { data: scRows, error: e2 } = await supabase
    .from("site_content")
    .select("key, value");
  if (e2) throw e2;
  results.site_content = scRows || [];

  return results;
}

function applyDbData(data) {
  if (!data || !window.ETERNA) return;

  const hasContent = CONTENT_TABLES.some(function (t) {
    return data[t] && data[t].length > 0;
  });

  if (hasContent) {
    if (data.brands && data.brands.length) {
      const brands = {};
      data.brands.forEach(function (r) {
        brands[r.id] = r.data;
      });
      window.ETERNA.brands = brands;
    }
    if (data.categories && data.categories.length) {
      const cats = {};
      data.categories.forEach(function (r) {
        cats[r.id] = r.data;
      });
      window.ETERNA.cats = cats;
    }
    if (data.rooms && data.rooms.length) {
      const rooms = {};
      data.rooms.forEach(function (r) {
        rooms[r.id] = r.data;
      });
      window.ETERNA.rooms = rooms;
    }
    if (data.products && data.products.length) {
      window.ETERNA.products = data.products.map(function (r) {
        return r.data;
      });
    }
    if (data.designers && data.designers.length) {
      const designers = {};
      data.designers.forEach(function (r) {
        designers[r.id] = r.data;
      });
      window.ETERNA.designers = designers;
      window.ETERNA.designerOrder = data.designers.map(function (r) {
        return r.id;
      });
    }
    if (data.articles && data.articles.length) {
      window.ETERNA.journal = data.articles.map(function (r) {
        return r.data;
      });
    }
  }

  // Merge ui_strings into T (exposed by app.js as window.ETERNA_T)
  if (data.ui_strings) mergeUiStrings(data.ui_strings);

  // Store site_content for potential use
  if (data.site_content) {
    const sc = {};
    data.site_content.forEach(function (r) {
      sc[r.key] = r.value;
    });
    window.ETERNA_CONTENT = sc;
  }

  // Apply media rewrite AFTER merge so DB-saved image URLs are handled too
  if (window.ETERNA_MEDIA && window.ETERNA_MEDIA.apply) {
    window.ETERNA_MEDIA.apply();
  }
}

function mergeUiStrings(rows) {
  if (!window.ETERNA_T) return;
  for (const row of rows) {
    const key = row.key;
    const val = row.value;
    if (!val || typeof val !== "object") continue;
    if (key === "waProduct") {
      const enTmpl = val.en || "";
      const sqTmpl = val.sq || "";
      window.ETERNA_T.en.waProduct = function (p) {
        return enTmpl.replace("{p}", p);
      };
      window.ETERNA_T.sq.waProduct = function (p) {
        return sqTmpl.replace("{p}", p);
      };
    } else {
      if (val.en !== undefined && val.en !== null)
        window.ETERNA_T.en[key] = val.en;
      if (val.sq !== undefined && val.sq !== null)
        window.ETERNA_T.sq[key] = val.sq;
    }
  }
}
