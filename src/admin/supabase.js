import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "eterna-admin-auth",
  },
});

// Content tables managed by the admin. Each stores {id, data, published, sort_order}.
export const CONTENT_TABLES = [
  { table: "brands", label: "Markat", idField: "id" },
  { table: "categories", label: "Kategoritë", idField: "id" },
  { table: "rooms", label: "Dhomat", idField: "id" },
  { table: "products", label: "Produktet", idField: "id" },
  { table: "designers", label: "Projektuesit", idField: "id" },
  { table: "articles", label: "Journal", idField: "id" },
];
