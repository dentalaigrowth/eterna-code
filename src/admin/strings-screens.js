/* "Tekstet e faqes": searchable list and per-key editor for the ui_strings table.
   A row stores only overrides that differ from the built-in text. */

import { supabase } from "./supabase.js";
import { el, fieldCard, autoGrow } from "./fields.js";
import { DEFAULT_STRINGS, DEFAULT_STRINGS_SPECIAL } from "./strings.js";

const PER_PAGE = 25;
const ALL_GROUPS = "Të gjitha";
const GROUP_RULES = [
  ["Butona", /^(book|explore|discover|readMore|readStory|viewAll|viewAllB|show|seePiece|whatsapp|askWA|sendWA|copy|clear|close|back|prev|next|zoom|view|visit|formSend|reqDetails|seeShowroom)$/],
  ["Formularë", /^(form|f[A-Z]|sent|done|copied|copyFail|reply)/],
  ["Footer", /^(foot|rights|follow|instagram|phoneL|byAppt)/],
  ["Menu", /^(home|collection|collOf|brands?|designers|journal|showroom|contact|about|trade|philosophy|menu)$/],
  ["Faqe", /^(ph|hero|stmt|egg|locus|dH$|dP$|dIntro|jH$|jP$|coll|bookH|showH|showP|visitH|visitP|tradeH|tradeP|contactH|contactP|writeH|applyH|about[A-Z]|byRoom|icons|iconsH|ourBrands|notFound|piecesBy)/],
];
const GROUPS = [ALL_GROUPS, ...GROUP_RULES.map(([name]) => name), "Të tjera"];

function groupOf(key) {
  const rule = GROUP_RULES.find(([, re]) => re.test(key));
  return rule ? rule[0] : "Të tjera";
}

function defaultFor(lang, key) {
  if (key === "waProduct") return DEFAULT_STRINGS_SPECIAL[`waProduct_${lang}`] || "";
  const v = DEFAULT_STRINGS[lang][key];
  return typeof v === "string" ? v : "";
}

function overrideFrom(text, def) {
  const t = (text || "").trim();
  return t && t !== def ? t : null;
}

function buildRow(key, value) {
  const raw = value && typeof value === "object" ? value : {};
  const def = { en: defaultFor("en", key), sq: defaultFor("sq", key) };
  const usable = (t) => (key === "waProduct" && !t.includes("{p}") ? "" : t);
  const ov = {
    en: overrideFrom(typeof raw.en === "string" ? usable(raw.en) : "", def.en),
    sq: overrideFrom(typeof raw.sq === "string" ? usable(raw.sq) : "", def.sq),
  };
  return {
    key,
    def,
    ov,
    cur: { en: ov.en ?? def.en, sq: ov.sq ?? def.sq },
    changed: ov.en !== null || ov.sq !== null,
  };
}

async function loadRows() {
  const { data, error } = await supabase.from("ui_strings").select("key, value");
  if (error) throw error;
  const saved = new Map((data || []).map((r) => [r.key, r.value]));
  const keys = new Set([...Object.keys(DEFAULT_STRINGS.en), ...saved.keys()]);
  const rows = [];
  for (const key of keys) {
    const v = saved.get(key);
    const isText =
      typeof DEFAULT_STRINGS.en[key] === "string" ||
      (v && (typeof v.en === "string" || typeof v.sq === "string"));
    if (isText) rows.push(buildRow(key, v));
  }
  return rows.sort((a, b) => a.key.localeCompare(b.key));
}

function textRow(r) {
  const tr = el("tr");

  const enCell = el("td");
  const enText = el("span", "str-text");
  enText.textContent = r.cur.en;
  enText.title = r.cur.en;
  const caption = el("span", "str-key");
  caption.textContent = r.key;
  enCell.append(enText, caption);

  const sqCell = el("td");
  const sqText = el("span", "str-text");
  sqText.textContent = r.cur.sq;
  sqText.title = r.cur.sq;
  sqCell.appendChild(sqText);

  const actCell = el("td");
  const acts = el("div", "row-acts");
  if (r.changed) {
    const badge = el("span", "badge changed");
    badge.textContent = "Ndryshuar";
    acts.appendChild(badge);
  }
  const edit = el("a", "btn sm line");
  edit.href = "#strings/" + encodeURIComponent(r.key);
  edit.textContent = "Edito";
  acts.appendChild(edit);
  actCell.appendChild(acts);

  tr.append(enCell, sqCell, actCell);
  return tr;
}

export async function renderStringList(main) {
  const rows = await loadRows();
  main.innerHTML = "";
  const title = el("h1");
  title.textContent = "Tekstet e faqes";
  const lead = el("p", "lead");
  lead.textContent = "Ndrysho tekstet që shfaqen në faqe. Lëre bosh për të përdorur tekstin fillestar.";
  main.append(title, lead);

  const toolbar = el("div", "toolbar");
  const search = el("input", "search");
  search.type = "text";
  search.placeholder = "Kërko sipas çelësit ose tekstit…";
  const group = el("select", "search");
  group.style.maxWidth = "200px";
  for (const name of GROUPS) {
    const opt = el("option");
    opt.value = name;
    opt.textContent = name;
    group.appendChild(opt);
  }
  toolbar.append(search, group);

  const table = el("table", "tbl str-table");
  table.innerHTML =
    '<thead><tr><th style="width:46%">Teksti EN</th><th style="width:36%">Teksti SQ</th><th style="width:18%"></th></tr></thead>';
  const body = el("tbody");
  table.appendChild(body);
  const pager = el("div", "pager");
  main.append(toolbar, table, pager);

  let page = 0;
  function visibleRows() {
    const q = search.value.trim().toLowerCase();
    const g = group.value;
    return rows.filter(
      (r) =>
        (g === ALL_GROUPS || groupOf(r.key) === g) &&
        (!q ||
          r.key.toLowerCase().includes(q) ||
          r.cur.en.toLowerCase().includes(q) ||
          r.cur.sq.toLowerCase().includes(q))
    );
  }

  function draw() {
    const list = visibleRows();
    const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    if (page >= totalPages) page = totalPages - 1;
    body.innerHTML = "";
    const slice = list.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
    if (!slice.length) {
      const tr = el("tr");
      const td = el("td", "empty");
      td.colSpan = 3;
      td.textContent = "Asnjë tekst nuk përputhet.";
      tr.appendChild(td);
      body.appendChild(tr);
    }
    for (const r of slice) body.appendChild(textRow(r));

    pager.innerHTML = "";
    if (totalPages > 1) {
      const prev = el("button", "btn sm line pg");
      prev.type = "button";
      prev.textContent = "←";
      prev.disabled = page === 0;
      prev.addEventListener("click", () => { page--; draw(); });
      const info = el("span", "pg-info");
      info.textContent = `${page + 1} / ${totalPages}`;
      const next = el("button", "btn sm line pg");
      next.type = "button";
      next.textContent = "→";
      next.disabled = page >= totalPages - 1;
      next.addEventListener("click", () => { page++; draw(); });
      pager.append(prev, info, next);
    }
  }

  search.addEventListener("input", () => { page = 0; draw(); });
  group.addEventListener("change", () => { page = 0; draw(); });
  draw();
}

function langField(label, value, def, hasOverride) {
  const wrap = el("div", "fld");
  const lab = el("label", "fld-lab");
  lab.textContent = label;
  const ta = el("textarea");
  ta.value = value;
  ta.rows = 2;
  ta.addEventListener("input", () => autoGrow(ta));
  autoGrow(ta);
  const note = el("p", "str-def");
  note.textContent = "Default: " + def;
  const reset = el("button", "btn sm line");
  reset.type = "button";
  reset.textContent = "Rikthe default";
  reset.disabled = !hasOverride;
  const foot = el("div", "str-foot");
  foot.append(note, reset);
  wrap.append(lab, ta, foot);
  wrap.textarea = ta;
  wrap.reset = reset;
  return wrap;
}

export async function renderStringForm(main, key) {
  const { data, error } = await supabase
    .from("ui_strings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  const row = buildRow(key, data && data.value);
  main.innerHTML = "";
  if (!data && !row.def.en && !row.def.sq) {
    const back = el("a", "back");
    back.href = "#strings";
    back.textContent = "← Tekstet";
    const msg = el("p", "empty");
    msg.textContent = "Teksti nuk u gjet.";
    main.append(back, msg);
    return;
  }

  let saved = { ...row.ov };
  let initial = { en: row.cur.en, sq: row.cur.sq };
  const isDirty = () => enField.textarea.value !== initial.en || sqField.textarea.value !== initial.sq;

  const topBar = el("div", "form-topbar");
  const left = el("div", "topbar-l");
  const back = el("a", "btn sm line");
  back.href = "#strings";
  back.textContent = "← Tekstet";
  const titleSpan = el("span", "topbar-title");
  titleSpan.textContent = "Edito tekstin";
  left.append(back, titleSpan);
  const topActions = el("div", "topbar-r");
  const cancelBtn = el("button", "btn sm line");
  cancelBtn.type = "button";
  cancelBtn.textContent = "Anulo";
  const saveBtn = el("button", "btn sm");
  saveBtn.type = "button";
  saveBtn.textContent = "Ruaj";
  topActions.append(cancelBtn, saveBtn);
  topBar.append(left, topActions);

  const keyLine = el("p", "str-form-key");
  keyLine.textContent = key;
  const toast = el("div", "toast");
  toast.textContent = "Ndryshimet u ruajtën";
  toast.style.display = "none";

  const enField = langField("Anglisht (EN)", row.cur.en, row.def.en, saved.en !== null);
  const sqField = langField("Shqip (SQ)", row.cur.sq, row.def.sq, saved.sq !== null);
  const layout = el("div", "str-form");
  layout.appendChild(fieldCard("Teksti", enField, sqField));
  main.append(topBar, keyLine, toast, layout);

  const leave = () => {
    if (isDirty() && !confirm("Ka ndryshime të paruajtura. Të anulohen?")) return;
    location.hash = "strings";
  };
  back.addEventListener("click", (e) => { e.preventDefault(); leave(); });
  cancelBtn.addEventListener("click", leave);

  async function persist(next) {
    const value = {};
    if (next.en !== null) value.en = next.en;
    if (next.sq !== null) value.sq = next.sq;
    const { error: saveError } = await supabase
      .from("ui_strings")
      .upsert({ key, value }, { onConflict: "key" });
    if (saveError) throw saveError;
  }

  saveBtn.addEventListener("click", async () => {
    const next = {
      en: overrideFrom(enField.textarea.value, row.def.en),
      sq: overrideFrom(sqField.textarea.value, row.def.sq),
    };
    saveBtn.disabled = true;
    saveBtn.textContent = "Po ruan…";
    try {
      await persist(next);
      saved = next;
      initial = { en: enField.textarea.value, sq: sqField.textarea.value };
      toast.style.display = "";
      toast.classList.add("show");
      setTimeout(() => { location.hash = "strings"; }, 1000);
    } catch (e) {
      alert("Gabim: " + e.message);
      saveBtn.disabled = false;
      saveBtn.textContent = "Ruaj";
    }
  });

  for (const lang of ["en", "sq"]) {
    const field = lang === "en" ? enField : sqField;
    field.reset.addEventListener("click", async () => {
      const next = { ...saved, [lang]: null };
      try {
        await persist(next);
        saved = next;
        field.textarea.value = row.def[lang];
        autoGrow(field.textarea);
        initial[lang] = row.def[lang];
        field.reset.disabled = true;
        toast.textContent = "Teksti u rikthye në default";
        toast.style.display = "";
        toast.classList.add("show");
        setTimeout(() => {
          toast.classList.remove("show");
          toast.style.display = "none";
          toast.textContent = "Ndryshimet u ruajtën";
        }, 1500);
      } catch (e) {
        alert("Gabim: " + e.message);
      }
    });
  }
}
