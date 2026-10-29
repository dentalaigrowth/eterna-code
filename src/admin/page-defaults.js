/* Built-in default texts for every page editor.
   These mirror the T object in public/app.js so that when no
   site_content override exists, the admin form still shows the
   current public-site text (both EN and SQ).

   Each page's defaults object has the same shape as the site_content
   value: { fieldKey: { en, sq } } for bi-text fields, or plain strings
   for mono-text fields (explore, book, heroPoster, featuredIds). */

export function getPageDefaults(pageId) {
  const t = window.ETERNA_T;
  if (!t) return {};
  const en = t.en || {};
  const sq = t.sq || {};
  const bi = (k) => ({ en: en[k] || "", sq: sq[k] || "" });

  switch (pageId) {
    case "home":
      return {
        heroH: bi("heroH"),
        heroP: bi("heroP"),
        tag: bi("tag"),
        explore: en.explore || "",
        book: en.book || "",
        heroPoster: "img/hero-poster-poster.webp",
        stmtH: bi("stmtH"),
        stmtP: bi("stmtP"),
        ourBrands: bi("ourBrands"),
        discover: bi("discover"),
        icons: bi("icons"),
        iconsH: bi("iconsH"),
        viewAll: bi("viewAll"),
        eggEy: bi("eggEy"),
        eggH: bi("eggH"),
        eggP: bi("eggP"),
        seePiece: bi("seePiece"),
        readStory: bi("readStory"),
        byRoom: bi("byRoom"),
        byRoomH: bi("byRoomH"),
        locusEy: bi("locusEy"),
        locusH: bi("locusH"),
        locusP: bi("locusP"),
        jH: bi("jH"),
        allArticles: bi("allArticles"),
        visitH: bi("visitH"),
        visitP: bi("visitP"),
        whatsapp: bi("whatsapp"),
        book2: bi("book"),
        footVision: bi("footVision"),
        featuredIds: [],
      };

    case "collection":
      return {
        collH: bi("collH"),
        collP: bi("collP"),
        priceReq: bi("priceReq"),
        onReq: bi("onReq"),
      };

    case "brand":
      return {
        aboutBrand: bi("aboutBrand"),
        pieces: bi("pieces"),
        piece: bi("piece"),
      };

    case "designers":
      return {
        dH: bi("dH"),
        dIntro: bi("dIntro"),
        piecesBy: bi("piecesBy"),
      };

    case "journal":
      return {
        jP: bi("jP"),
        allArticles2: bi("allArticles"),
      };

    case "showroom":
      return {
        showH: bi("showH"),
        showP: bi("showP"),
        bookH: bi("bookH"),
        waVisit: bi("waVisit"),
      };

    case "trade":
      return {
        tradeH: bi("tradeH"),
        tradeP: bi("tradeP"),
        applyH: bi("applyH"),
      };

    case "about":
      return {
        phH: bi("phH"),
        phLead: bi("phLead"),
        phOpen: bi("phOpen"),
        phWhyH: bi("phWhyH"),
        phWhy: bi("phWhy"),
        phMeanH: bi("phMeanH"),
        phMean: bi("phMean"),
        phPillarsH: bi("phPillarsH"),
        phQuote: bi("phQuote"),
        phSacredH: bi("phSacredH"),
        phSacred: bi("phSacred"),
        phPromiseH: bi("phPromiseH"),
        phSign: bi("phSign"),
      };

    case "contact":
      return {
        contactH: bi("contactH"),
        contactP: bi("contactP"),
        writeH: bi("writeH"),
      };

    default:
      return {};
  }
}
