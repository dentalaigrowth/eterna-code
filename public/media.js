/* ETERNA media base. Rewrites every string under window.ETERNA that
   starts with "img/" or "video/" to the corresponding Cloudinary base
   URL. Routing is by FILE EXTENSION, not only by prefix: images
   (.webp .jpg .jpeg .png .svg) always use IMG_BASE even if the path
   starts with "video/" (video posters), and videos (.mp4 .webm .mov)
   always use VIDEO_BASE. Values that already start with http are left
   untouched. Loaded after data-designers.js and before app.js.
   db-loader calls applyMediaRewrite() again AFTER merging database
   content on top. */
window.ETERNA_MEDIA = window.ETERNA_MEDIA || {
  IMG_BASE: "",
  VIDEO_BASE: "",
};
window.ETERNA_MEDIA.IMG_BASE = "https://res.cloudinary.com/l5tyqnmr/image/upload/";
window.ETERNA_MEDIA.VIDEO_BASE = "https://res.cloudinary.com/l5tyqnmr/video/upload/";

(function () {
  "use strict";
  var M = window.ETERNA_MEDIA;

  var IMG_EXT = /\.(webp|jpg|jpeg|png|svg)(\?.*)?$/i;
  var VID_EXT = /\.(mp4|webm|mov)(\?.*)?$/i;

  function rewrite(s) {
    if (typeof s !== "string") return s;
    if (s.indexOf("http") === 0) return s; // absolute URL — leave untouched
    var IMG = M.IMG_BASE || "";
    var VID = M.VIDEO_BASE || "";
    if (!IMG && !VID) return s;
    var isImg = IMG_EXT.test(s);
    var isVid = VID_EXT.test(s);
    var body;
    if (isImg) {
      body = s.replace(/^(img\/|video\/)/, "");
      return IMG ? IMG + body : s;
    }
    if (isVid) {
      body = s.replace(/^(img\/|video\/)/, "");
      return VID ? VID + body : s;
    }
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

  // Run once on the static data, then expose for db-loader to re-run after merge.
  function applyMediaRewrite() {
    if (window.ETERNA) walk(window.ETERNA, new Set());
  }
  applyMediaRewrite();
  window.ETERNA_MEDIA.apply = applyMediaRewrite;
  window.ETERNA_MEDIA.rewrite = rewrite;
})();
