/* ETERNA media base. When IMG_BASE / VIDEO_BASE are set, every string under
   window.ETERNA that starts with "img/" or "video/" is rewritten to the
   corresponding base URL. When both are empty, nothing changes and the
   paths stay as they are (served from public/img and public/video).
   Loaded after data-designers.js and before app.js. */
window.ETERNA_MEDIA = {
  IMG_BASE: "",
  VIDEO_BASE: "",
};

(function () {
  "use strict";
  var M = window.ETERNA_MEDIA;
  var IMG = M.IMG_BASE || "";
  var VID = M.VIDEO_BASE || "";
  if (!IMG && !VID) return;

  function rewrite(s) {
    if (typeof s !== "string") return s;
    if (IMG && s.indexOf("img/") === 0) return IMG + s.slice(4);
    if (VID && s.indexOf("video/") === 0) return VID + s.slice(6);
    return s;
  }

  function walk(obj, seen) {
    if (!obj || typeof obj !== "object") return obj;
    if (seen.has(obj)) return obj;
    seen.add(obj);
    if (Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) obj[i] = rewrite(walk(obj[i], seen));
      return obj;
    }
    for (var k in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
      var v = obj[k];
      if (typeof v === "string") obj[k] = rewrite(v);
      else if (v && typeof v === "object") walk(v, seen);
    }
    return obj;
  }

  if (window.ETERNA) walk(window.ETERNA, new Set());
})();
