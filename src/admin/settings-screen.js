/* Cilësimet: site-wide contact, social, location, footer, WhatsApp and SEO values.
   Saved as the "settings" row in site_content, holding only overrides of the defaults. */

import { supabase } from "./supabase.js";
import { ADMIN_EMAIL_DOMAIN } from "./config.js";
import { el, biText, textInput, imageInput, fieldCard, langSwitch, collectFields } from "./fields.js";
import {
  SITE_SETTINGS_DEFAULTS,
  mergeSiteSettings,
  settingsOverrides,
} from "../site-settings.js";

const KEY = "settings";
const REQUIRED_MSG = "Ky fushë është e detyrueshme";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WA_RE = /^\d{8,15}$/;
const URL_RE = /^https?:\/\/\S+$/i;

const REQUIRED_LABELS = { phone: "Telefoni i shfaqur", whatsapp: "Numri WhatsApp", seoTitle: "Titulli i sajtit" };

function instagramHandle(value) {
  const s = value.trim();
  const m = s.match(/instagram\.com\/([^/?#\s]+)/i);
  return (m ? m[1] : s).replace(/^@/, "").replace(/\/$/, "");
}

function validate(c) {
  const errors = [];
  if (!c.phone.trim()) errors.push(REQUIRED_LABELS.phone + ": " + REQUIRED_MSG + ".");
  if (!c.whatsapp.trim()) errors.push(REQUIRED_LABELS.whatsapp + ": " + REQUIRED_MSG + ".");
  else if (!WA_RE.test(c.whatsapp.trim())) errors.push("Numri WhatsApp duhet të ketë vetëm shifra, me prefiksin e shtetit (p.sh. 355698772605).");
  if (!c.seoTitle.en.trim() || !c.seoTitle.sq.trim()) errors.push(REQUIRED_LABELS.seoTitle + ": " + REQUIRED_MSG + " në të dy gjuhët.");
  if (c.infoEmail.trim() && !EMAIL_RE.test(c.infoEmail.trim())) errors.push("Email-i i informacionit nuk është i vlefshëm.");
  if (c.salesEmail.trim() && !EMAIL_RE.test(c.salesEmail.trim())) errors.push("Email-i i shitjeve nuk është i vlefshëm.");
  for (const key of ["facebook", "tiktok", "linkedin", "pinterest", "mapsUrl", "seoImage"]) {
    const v = c[key].trim();
    if (v && !URL_RE.test(v)) errors.push("Lidhja e " + key + " duhet të fillojë me https://");
  }
  return errors;
}

function withReset(field, key) {
  const btn = el("button", "btn sm line reset-default");
  btn.type = "button";
  btn.dataset.resetKey = key;
  btn.textContent = "Rikthe default";
  field.append(btn);
  return field;
}

function adminLoginCard() {
  const details = el("details", "card");
  const summary = el("summary");
  summary.textContent = "Hyrja në admin";
  const body = el("div");
  const h = el("h3");
  h.textContent = "Domeni i emailit të adminit";
  const p1 = el("p");
  p1.append("Përdoruesi që shkruan në formularin e hyrjes kthehet në ");
  const code1 = el("code");
  code1.textContent = "<username>@" + ADMIN_EMAIL_DOMAIN;
  p1.append(code1, ". Krijo këtë përdorues në Supabase Auth.");
  const p2 = el("p");
  p2.append("Për të ndryshuar domenin, ndrysho ");
  const code2 = el("code");
  code2.textContent = "ADMIN_EMAIL_DOMAIN";
  p2.append(code2, " në ");
  const code3 = el("code");
  code3.textContent = "src/admin/config.js";
  p2.append(code3, ".");
  body.append(h, p1, p2);
  details.append(summary, body);
  return details;
}

async function persistSettings(values) {
  const { data: current, error: readError } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", KEY)
    .maybeSingle();
  if (readError) throw readError;
  const value = { ...((current && current.value) || {}) };
  for (const key of Object.keys(SITE_SETTINGS_DEFAULTS)) delete value[key];
  Object.assign(value, settingsOverrides(values));
  const { error: saveError } = await supabase
    .from("site_content")
    .upsert({ key: KEY, value }, { onConflict: "key" });
  if (saveError) throw saveError;
}

export async function renderSettingsForm(main, notice) {
  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", KEY)
    .maybeSingle();
  if (error) throw error;
  const s = mergeSiteSettings(data && data.value);
  main.innerHTML = "";

  const contact = fieldCard(
    "Kontakti",
    withReset(textInput("Telefoni i shfaqur", s.phone, { key: "phone" }), "phone"),
    withReset(textInput("Numri WhatsApp (vetëm shifra)", s.whatsapp, { key: "whatsapp" }), "whatsapp"),
    withReset(textInput("Email informacioni", s.infoEmail, { key: "infoEmail" }), "infoEmail"),
    withReset(textInput("Email shitjesh", s.salesEmail, { key: "salesEmail" }), "salesEmail")
  );
  const social = fieldCard(
    "Rrjetet sociale",
    withReset(textInput("Instagram (emri ose lidhja)", s.instagram, { key: "instagram" }), "instagram"),
    withReset(textInput("Facebook (lidhja)", s.facebook, { key: "facebook" }), "facebook"),
    withReset(textInput("TikTok (lidhja)", s.tiktok, { key: "tiktok" }), "tiktok"),
    withReset(textInput("LinkedIn (lidhja)", s.linkedin, { key: "linkedin" }), "linkedin"),
    withReset(textInput("Pinterest (lidhja)", s.pinterest, { key: "pinterest" }), "pinterest")
  );
  const location = fieldCard(
    "Vendndodhja dhe orari",
    withReset(biText("Adresa / orari i takimit", s.address, { key: "address" }), "address"),
    withReset(textInput("Lidhja e hartës (Google Maps)", s.mapsUrl, { key: "mapsUrl" }), "mapsUrl")
  );
  const footer = fieldCard(
    "Footer",
    withReset(biText("Slogan", s.footerTagline, { key: "footerTagline", long: true }), "footerTagline"),
    withReset(biText("Rreshti i të drejtave", s.footerCopyright, { key: "footerCopyright" }), "footerCopyright"),
    withReset(biText("Rreshti i djathtë (vendndodhja)", s.footerLocation, { key: "footerLocation" }), "footerLocation")
  );
  const whatsapp = fieldCard(
    "WhatsApp",
    withReset(biText("Mesazhi i parazgjedhur i butonit", s.waDefault, { key: "waDefault" }), "waDefault"),
    withReset(biText("Hyrja e mesazheve nga formularët", s.formIntro, { key: "formIntro", long: true }), "formIntro")
  );
  const seo = fieldCard(
    "SEO",
    withReset(biText("Titulli i sajtit", s.seoTitle, { key: "seoTitle" }), "seoTitle"),
    withReset(biText("Përshkrimi", s.seoDescription, { key: "seoDescription", long: true }), "seoDescription"),
    withReset(imageInput("Imazhi i ndarjes (URL)", s.seoImage, { key: "seoImage" }), "seoImage")
  );

  const topBar = el("div", "form-topbar");
  const left = el("div", "topbar-l");
  const titleSpan = el("span", "topbar-title");
  titleSpan.textContent = "Cilësimet";
  left.append(titleSpan);
  const topActions = el("div", "topbar-r");
  const cancelBtn = el("button", "btn sm line");
  cancelBtn.type = "button";
  cancelBtn.textContent = "Anulo";
  const saveBtn = el("button", "btn sm");
  saveBtn.type = "button";
  saveBtn.textContent = "Ruaj";
  topActions.append(cancelBtn, saveBtn);
  topBar.append(left, topActions);

  const toast = el("div", "toast");
  toast.textContent = notice || "";
  toast.style.display = notice ? "" : "none";

  const layout = el("div", "form-layout");
  const colMain = el("div", "form-col-main");
  const colSide = el("div", "form-col-side");
  layout.append(colMain, colSide);
  colMain.append(contact, social, location, footer);
  colSide.append(whatsapp, seo);
  main.append(topBar, toast, langSwitch(), layout, adminLoginCard());

  async function save(resetKey) {
    const values = { ...collectFields(layout) };
    values.instagram = instagramHandle(values.instagram);
    if (resetKey) values[resetKey] = SITE_SETTINGS_DEFAULTS[resetKey];
    const errors = validate(values);
    if (errors.length) {
      alert(errors.join("\n"));
      return;
    }
    saveBtn.disabled = true;
    saveBtn.textContent = "Po ruan…";
    try {
      await persistSettings(values);
      renderSettingsForm(main, "Ndryshimet u ruajtën");
    } catch (e) {
      alert("Gabim: " + e.message);
      saveBtn.disabled = false;
      saveBtn.textContent = "Ruaj";
    }
  }

  cancelBtn.addEventListener("click", () => renderSettingsForm(main));
  saveBtn.addEventListener("click", () => save(null));
  layout.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-reset-key]");
    if (btn) save(btn.dataset.resetKey);
  });

  if (notice) {
    setTimeout(() => {
      toast.style.display = "none";
    }, 1500);
  }
}
