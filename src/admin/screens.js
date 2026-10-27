/* Generic reusable list + edit screens for the ETERNA admin.
   Both take a "config" object describing the table and its fields.
   The list supports search, pagination (15/page), Published/Draft toggle,
   Edit/Duplicate/Delete, and a numeric Order field.
   The form renders structured fields (bilingual, selects, multi, gallery),
   validates required fields, shows Albanian messages, warns on unsaved
   leave, and keeps a "Shiko JSON" toggle for advanced editing. */

import { supabase } from "./supabase.js";
import {
  biText,
  textInput,
  selectField,
  multiSelect,
  checkbox,
  galleryEditor,
  collectFields,
} from "./fields.js";

const PER_PAGE = 15;

/* ---------- Generic list ---------- */

export async function renderGenericList(main, config) {
  const table = config.table;
  main.innerHTML = "";
  main.appendChild(h("h1", config.label));

  const { data, error } = await supabase
    .from(table)
    .select("id, data, published, sort_order")
    .order("sort_order");
  if (error) {
    const err = el("p", "err");
    err.textContent = "Gabim: " + (error.message || "nuk mund të ngarkohen të dhënat.");
    main.appendChild(err);
    return;
  }
  const rows = data || [];
  if (!rows.length) {
    main.appendChild(
      p("empty", "Nuk ka rreshta. Kliko \"+ Shto të re\" ose importo të dhënat nga Dashboard.")
    );
    const toolbar = el("div", "toolbar");
    const addBtn = el("button", "btn line");
    addBtn.textContent = "+ Shto të re";
    addBtn.addEventListener("click", () => {
      location.hash = table + "/new";
    });
    toolbar.appendChild(addBtn);
    main.appendChild(toolbar);
    return;
  }

  // search + page state
  let searchTerm = "";
  let page = 0;

  const toolbar = el("div", "toolbar");
  const search = el("input", "search");
  search.type = "text";
  search.placeholder = "Kërko…";
  toolbar.appendChild(search);
  const addBtn = el("button", "btn line");
  addBtn.textContent = "+ Shto të re";
  addBtn.addEventListener("click", () => {
    location.hash = table + "/new";
  });
  toolbar.appendChild(addBtn);
  main.appendChild(toolbar);

  const tableWrap = el("div", "table-wrap");
  main.appendChild(tableWrap);

  const pager = el("div", "pager");
  main.appendChild(pager);

  function filtered() {
    if (!searchTerm) return rows;
    const q = searchTerm.toLowerCase();
    return rows.filter((r) => {
      const name = extractName({ ...(r.data || {}), id: r.id });
      return (
        (r.id || "").toLowerCase().indexOf(q) > -1 ||
        name.toLowerCase().indexOf(q) > -1
      );
    });
  }

  function renderTable() {
    const list = filtered();
    const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    if (page >= totalPages) page = totalPages - 1;
    const slice = list.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

    tableWrap.innerHTML = "";
    if (!slice.length) {
      tableWrap.appendChild(
        p("empty", "Nuk ka rreshta. Kliko \"+ Shto të re\" ose importo të dhënat.")
      );
    } else {
      const t = el("table", "tbl");
      t.innerHTML =
        "<thead><tr><th>Emri</th><th>Publikuar</th><th>Renditja</th><th></th></tr></thead><tbody></tbody>";
      const body = t.querySelector("tbody");
      for (const row of slice) {
        body.appendChild(buildRow(row, config));
      }
      tableWrap.appendChild(t);
    }

    // pager
    pager.innerHTML = "";
    if (totalPages > 1) {
      const prev = el("button", "btn line pg");
      prev.type = "button";
      prev.textContent = "←";
      prev.disabled = page === 0;
      prev.addEventListener("click", () => {
        page--;
        renderTable();
      });
      const info = el("span", "pg-info");
      info.textContent = `${page + 1} / ${totalPages}`;
      const next = el("button", "btn line pg");
      next.type = "button";
      next.textContent = "→";
      next.disabled = page >= totalPages - 1;
      next.addEventListener("click", () => {
        page++;
        renderTable();
      });
      pager.appendChild(prev);
      pager.appendChild(info);
      pager.appendChild(next);
    }
  }

  search.addEventListener("input", () => {
    searchTerm = search.value.trim();
    page = 0;
    renderTable();
  });

  renderTable();
}

function buildRow(row, config) {
  const table = config.table;
  const name = extractName({ ...(row.data || {}), id: row.id });
  const tr = el("tr");

  // name
  const nameTd = el("td");
  nameTd.textContent = name;
  tr.appendChild(nameTd);

  // published toggle
  const pubTd = el("td");
  const toggle = el("button", "badge " + (row.published ? "on" : "off"));
  toggle.textContent = row.published ? "Po" : "Jo";
  toggle.title = "Ndrysho publikim";
  toggle.addEventListener("click", async () => {
    toggle.disabled = true;
    const { error } = await supabase
      .from(table)
      .update({ published: !row.published })
      .eq("id", row.id);
    if (error) {
      alert("Gabim: " + error.message);
    } else {
      row.published = !row.published;
      toggle.textContent = row.published ? "Po" : "Jo";
      toggle.className = "badge " + (row.published ? "on" : "off");
    }
    toggle.disabled = false;
  });
  pubTd.appendChild(toggle);
  tr.appendChild(pubTd);

  // sort_order
  const orderTd = el("td");
  const orderInp = el("input", "order-inp");
  orderInp.type = "number";
  orderInp.value = row.sort_order ?? 0;
  orderInp.addEventListener("change", async () => {
    const val = parseInt(orderInp.value, 10) || 0;
    const { error } = await supabase
      .from(table)
      .update({ sort_order: val })
      .eq("id", row.id);
    if (error) alert("Gabim: " + error.message);
    row.sort_order = val;
  });
  orderTd.appendChild(orderInp);
  tr.appendChild(orderTd);

  // actions
  const actTd = el("td");
  actTd.className = "row-acts";
  const edit = el("a", "act");
  edit.href = "#" + table + "/" + encodeURIComponent(row.id);
  edit.textContent = "Redakto";
  actTd.appendChild(edit);

  const dup = el("button", "act");
  dup.type = "button";
  dup.textContent = "Duble";
  dup.addEventListener("click", async () => {
    const newId = row.id + "-copy";
    const { error } = await supabase.from(table).upsert({
      id: newId,
      data: { ...row.data, id: newId },
      published: false,
      sort_order: row.sort_order + 1,
    }, { onConflict: "id" });
    if (error) {
      alert("Gabim: " + error.message);
      return;
    }
    location.hash = table + "/" + encodeURIComponent(newId);
  });
  actTd.appendChild(dup);

  const del = el("button", "act act-del");
  del.type = "button";
  del.textContent = "Fshi";
  del.addEventListener("click", async () => {
    if (!confirm("Je i sigurt?")) return;
    const { error } = await supabase.from(table).delete().eq("id", row.id);
    if (error) {
      alert("Gabim: " + error.message);
      return;
    }
    tr.remove();
  });
  actTd.appendChild(del);
  tr.appendChild(actTd);

  return tr;
}

/* ---------- Generic edit form ---------- */

export async function renderGenericForm(main, config) {
  const table = config.table;
  const id = decodeURIComponent(config.arg || "");
  const isNew = id === "new";

  let row = null;
  if (!isNew) {
    const { data, error } = await supabase
      .from(table)
      .select("id, data, published, sort_order")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    row = data;
    if (!row) {
      main.innerHTML = "";
      main.appendChild(p("empty", "Rreshti nuk u gjet."));
      const back = el("a", "back");
      back.href = "#" + table;
      back.textContent = "← Kthehu";
      main.appendChild(back);
      return;
    }
  }

  const dataObj = row ? row.data : {};
  main.innerHTML = "";

  const back = el("a", "back");
  back.href = "#" + table;
  back.textContent = "← Kthehu te lista";
  main.appendChild(back);
  main.appendChild(h("h1", isNew ? "Shto të re" : "Redakto"));

  // meta row: ID, Published, Order
  const meta = el("div", "form-meta");
  const idField = textInput("ID", isNew ? "" : id, { key: "_id" });
  if (!isNew) idField.querySelector("input").readOnly = true;
  meta.appendChild(idField);
  const pubSel = selectField(
    "Publikuar",
    row ? String(row.published) : "true",
    [
      { value: "true", label: "Po" },
      { value: "false", label: "Jo" },
    ],
    { key: "_published" }
  );
  meta.appendChild(pubSel);
  const orderField = textInput("Renditja", row ? row.sort_order ?? 0 : 0, {
    type: "number",
    key: "_order",
  });
  meta.appendChild(orderField);
  main.appendChild(meta);

  // structured form
  const form = el("div", "form-body");
  const fields = config.buildFields(dataObj);
  for (const f of fields) form.appendChild(f);
  main.appendChild(form);

  // JSON toggle
  const jsonToggle = el("button", "btn line json-toggle");
  jsonToggle.type = "button";
  jsonToggle.textContent = "Shiko JSON";
  const jsonArea = el("textarea", "json-area");
  jsonArea.spellcheck = false;
  jsonArea.value = JSON.stringify(dataObj, null, 2);
  jsonArea.style.display = "none";
  main.appendChild(jsonToggle);
  main.appendChild(jsonArea);

  let jsonMode = false;
  jsonToggle.addEventListener("click", () => {
    jsonMode = !jsonMode;
    jsonArea.style.display = jsonMode ? "" : "none";
    form.style.display = jsonMode ? "none" : "";
    jsonToggle.textContent = jsonMode ? "Fshih JSON" : "Shiko JSON";
    if (jsonMode) {
      // sync from form to JSON
      const collected = collectFields(form);
      const merged = { ...dataObj, ...collected };
      jsonArea.value = JSON.stringify(merged, null, 2);
    }
  });

  // actions
  const actions = el("div", "row-actions");
  const saveBtn = el("button", "btn");
  saveBtn.textContent = "Ruaj";
  const cancelBtn = el("button", "btn line");
  cancelBtn.type = "button";
  cancelBtn.textContent = "Anulo";
  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);
  main.appendChild(actions);

  const msg = el("p", "form-msg");
  main.appendChild(msg);

  // unsaved-changes guard
  let dirty = false;
  form.addEventListener("input", () => {
    dirty = true;
  });
  jsonArea.addEventListener("input", () => {
    dirty = true;
  });
  cancelBtn.addEventListener("click", () => {
    if (dirty && !confirm("Ka ndryshime të paruajtura. Të anulohen?")) return;
    location.hash = table;
  });
  const beforeUnload = (e) => {
    if (dirty) e.preventDefault();
  };
  window.addEventListener("beforeunload", beforeUnload);

  // validation + save
  saveBtn.addEventListener("click", async () => {
    saveBtn.disabled = true;
    saveBtn.textContent = "Po ruan…";
    msg.textContent = "";
    msg.className = "form-msg";
    try {
      // required validation
      const missing = [];
      for (const f of config.fields) {
        if (!f.required) continue;
        // find the DOM node by key
        const node = form.querySelector(`[data-field="${f.key}"]`);
        if (!node) continue;
        const val = node._collect();
        if (
          !val ||
          (typeof val === "string" && !val.trim()) ||
          (typeof val === "object" && !val.en && !val.sq)
        ) {
          missing.push(f.label);
        }
      }
      if (missing.length) {
        msg.textContent = "Plotëso fushat e detyrueshme: " + missing.join(", ");
        msg.className = "form-msg err";
        saveBtn.disabled = false;
        saveBtn.textContent = "Ruaj";
        return;
      }

      const newId = idField.querySelector("input").value.trim();
      if (!newId) throw new Error("ID nuk mund të jetë bosh.");
      const pubVal = pubSel.querySelector("select").value === "true";
      const order = parseInt(orderField.querySelector("input").value, 10) || 0;

      let finalData;
      if (jsonMode) {
        finalData = JSON.parse(jsonArea.value);
      } else {
        const collected = collectFields(form);
        finalData = { ...dataObj, ...collected };
        finalData.id = newId;
      }

      const payload = {
        id: newId,
        data: finalData,
        published: pubVal,
        sort_order: order,
      };
      const { error } = await supabase
        .from(table)
        .upsert(payload, { onConflict: "id" });
      if (error) throw error;

      msg.textContent = "U ruajt me sukses.";
      msg.className = "form-msg ok";
      dirty = false;
      window.removeEventListener("beforeunload", beforeUnload);
      setTimeout(() => {
        location.hash = table;
      }, 600);
    } catch (e) {
      msg.textContent = "Gabim: " + e.message;
      msg.className = "form-msg err";
      saveBtn.disabled = false;
      saveBtn.textContent = "Ruaj";
    }
  });
}

/* ---------- Helpers ---------- */

export function extractName(data) {
  if (!data) return "—";
  if (typeof data.name === "string") return data.name;
  if (data.name && typeof data.name === "object")
    return data.name.sq || data.name.en || data.id || "—";
  if (data.id) return data.id;
  if (data.title && typeof data.title === "object")
    return data.title.en || data.title.sq || "—";
  if (data.intro && typeof data.intro === "object")
    return (data.intro.en || data.intro.sq || "").slice(0, 40);
  if (data.bio && typeof data.bio === "object")
    return (data.bio.en || "").slice(0, 40);
  return "—";
}

function el(tag, cls) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}
function h(tag, text) {
  const e = el(tag);
  e.textContent = text;
  return e;
}
function p(cls, text) {
  const e = el("p", cls);
  e.textContent = text;
  return e;
}
