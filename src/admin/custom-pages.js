/* Custom pages: extra site pages stored as one array in the site_content row "custom_pages". */

import { supabase } from "./supabase.js";
import {
  el,
  biText,
  textInput,
  imageInput,
  paragraphList,
  toggle,
  fieldCard,
  langSwitch,
  collectFields,
  slugify,
} from "./fields.js";
import { PAGE_LIST } from "./page-configs.js";

const KEY = "custom_pages";
const PREFIX = "custom:";
const SYSTEM_IDS = new Set(PAGE_LIST.map((pg) => pg.id));

export async function loadCustomPages() {
  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", KEY)
    .maybeSingle();
  if (error) throw error;
  const value = data && data.value;
  return Array.isArray(value) ? value : [];
}

/* Reads the current list, applies the change, and writes only this row back. */
export async function updateCustomPages(mutate) {
  const current = await loadCustomPages();
  const next = mutate(current.slice());
  const { error } = await supabase
    .from("site_content")
    .upsert({ key: KEY, value: next }, { onConflict: "key" });
  if (error) throw error;
}

export async function countPages() {
  try {
    return PAGE_LIST.length + (await loadCustomPages()).length;
  } catch (e) {
    return "—";
  }
}

function uniqueSlug(base, taken) {
  const root = slugify(base) || "faqe";
  let candidate = root;
  let n = 2;
  while (SYSTEM_IDS.has(candidate) || taken.has(candidate)) {
    candidate = root + "-" + n++;
  }
  return candidate;
}

export function customPageCards(list, onChange) {
  return list
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((page) => {
      const card = el("div", "card");
      const l = el("span", "l");
      l.textContent = "Faqe e personalizuar";
      card.appendChild(l);
      const n = el("span", "n");
      n.textContent = (page.title && (page.title.en || page.title.sq)) || page.slug;
      n.style.fontSize = "1.2rem";
      card.appendChild(n);

      const pub = toggle("Publikuar", page.published, { key: "published" });
      const cb = pub.querySelector("input");
      cb.addEventListener("change", async () => {
        try {
          await updateCustomPages((items) =>
            items.map((it) => (it.slug === page.slug ? { ...it, published: cb.checked } : it))
          );
        } catch (e) {
          cb.checked = !cb.checked;
          alert("Gabim: " + e.message);
        }
      });
      card.appendChild(pub);

      const acts = el("div", "row-acts");
      const edit = el("a");
      edit.href = "#pages/" + encodeURIComponent(PREFIX + page.slug);
      edit.textContent = "Edito";
      const del = el("button", "btn sm danger-line");
      del.type = "button";
      del.textContent = "Fshi";
      del.addEventListener("click", async () => {
        if (!confirm("Je i sigurt?")) return;
        try {
          await updateCustomPages((items) => items.filter((it) => it.slug !== page.slug));
          onChange();
        } catch (e) {
          alert("Gabim: " + e.message);
        }
      });
      acts.append(edit, del);
      card.appendChild(acts);
      return card;
    });
}

export async function renderCustomPageForm(main, arg) {
  const isNew = arg === "new";
  const slug = isNew ? "" : arg.slice(PREFIX.length);
  const list = await loadCustomPages();
  const page = isNew ? null : list.find((it) => it.slug === slug);
  main.innerHTML = "";

  if (!isNew && !page) {
    const back = el("a", "back");
    back.href = "#pages";
    back.textContent = "← Faqet";
    const msg = el("p", "empty");
    msg.textContent = "Faqja nuk u gjet.";
    main.append(back, msg);
    return;
  }

  const d = page || {};
  const footer = d.footer || {};
  const menu = d.menu || {};
  const seo = d.seo || {};

  const titleField = biText("Titulli", d.title || {}, { key: "title", required: true });
  const slugField = textInput("Slug", slug, { key: "slug", readOnly: !isNew });
  const pubField = toggle("Publikuar", d.published, { key: "published" });
  const orderField = textInput("Renditja", d.order ?? 0, { type: "number", key: "order" });
  const heroField = imageInput("Imazhi kryesor", d.heroImg, { key: "heroImg" });
  const introField = biText("Hyrja", d.intro || {}, { key: "intro", long: true });
  const bodyField = paragraphList("Trupi (paragrafë)", d.body || {}, { key: "body" });
  const footerToggle = toggle("Shfaq në footer", footer.show, { key: "showFooter" });
  const footerLabel = biText("Etiketa e linkut në footer", footer.label || {}, { key: "footerLabel" });
  const menuToggle = toggle("Shfaq në menu", menu.show, { key: "showMenu" });
  const menuLabel = biText("Etiketa e linkut në menu", menu.label || {}, { key: "menuLabel" });
  const seoTitleField = biText("Titulli SEO", seo.title || {}, { key: "seoTitle" });
  const seoDescField = biText("Përshkrimi SEO", seo.description || {}, { key: "seoDesc", long: true });

  if (isNew) {
    const enInput = titleField.querySelector(".bi-en");
    const slugInput = slugField.querySelector("input");
    enInput.addEventListener("input", () => {
      slugInput.value = slugify(enInput.value);
    });
  }

  const topBar = el("div", "form-topbar");
  const left = el("div", "topbar-l");
  const back = el("a", "btn sm line");
  back.href = "#pages";
  back.textContent = "← Faqet";
  const titleSpan = el("span", "topbar-title");
  titleSpan.textContent = isNew ? "Faqe e re" : (d.title && (d.title.en || d.title.sq)) || slug;
  left.append(back, titleSpan);
  const topActions = el("div", "topbar-r");
  const cancelBtn = el("button", "btn sm line");
  cancelBtn.type = "button";
  cancelBtn.textContent = "Anulo";
  const saveBtn = el("button", "btn sm");
  saveBtn.textContent = "Ruaj";
  topActions.append(cancelBtn, saveBtn);
  topBar.append(left, topActions);

  const toast = el("div", "toast");
  toast.textContent = "Ndryshimet u ruajtën";
  toast.style.display = "none";

  const layout = el("div", "form-layout");
  const colMain = el("div", "form-col-main");
  const colSide = el("div", "form-col-side");
  layout.append(colMain, colSide);
  colMain.append(
    fieldCard("Përmbajtja", heroField, introField, bodyField),
    fieldCard("SEO", seoTitleField, seoDescField)
  );
  colSide.append(
    fieldCard("Informacion bazë", titleField, slugField, pubField, orderField),
    fieldCard("Shfaqja", footerToggle, footerLabel, menuToggle, menuLabel)
  );
  main.append(topBar, toast, langSwitch(), layout);

  let dirty = false;
  layout.addEventListener("input", () => { dirty = true; });
  cancelBtn.addEventListener("click", () => {
    if (dirty && !confirm("Ka ndryshime të paruara. Të anulohen?")) return;
    location.hash = "pages";
  });

  saveBtn.addEventListener("click", async () => {
    const title = titleField._collect();
    if (!title.en.trim() && !title.sq.trim()) {
      alert("Plotëso fushat e detyrueshme: Titulli");
      return;
    }
    saveBtn.disabled = true;
    saveBtn.textContent = "Po ruan…";
    try {
      const c = collectFields(layout);
      const item = {
        title: c.title,
        published: c.published === 1,
        order: parseInt(c.order, 10) || 0,
        heroImg: c.heroImg.trim(),
        intro: c.intro,
        body: c.body,
        footer: { show: c.showFooter === 1, label: c.footerLabel },
        menu: { show: c.showMenu === 1, label: c.menuLabel },
        seo: { title: c.seoTitle, description: c.seoDesc },
      };
      await updateCustomPages((items) => {
        if (isNew) {
          const newSlug = uniqueSlug(title.en || title.sq, new Set(items.map((it) => it.slug)));
          return [...items, { slug: newSlug, ...item }];
        }
        return items.map((it) => (it.slug === slug ? { ...it, ...item } : it));
      });

      dirty = false;
      toast.style.display = "";
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
        toast.style.display = "none";
        location.hash = "pages";
      }, 1000);
    } catch (e) {
      alert("Gabim: " + e.message);
      saveBtn.disabled = false;
      saveBtn.textContent = "Ruaj";
    }
  });
}
