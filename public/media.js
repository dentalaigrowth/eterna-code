/* ETERNA media resolver. Single source of truth for every image and video URL
   on the public site and in the admin. Loaded before app.js and before admin code. */
(function () {
  "use strict";

  var IMG_BASE = "https://res.cloudinary.com/l5tyqnmr/image/upload/";
  var VIDEO_BASE = "https://res.cloudinary.com/l5tyqnmr/video/upload/";
  var FULL_LINK = /^https?:\/\//i;
  var VIDEO_EXT = /\.(mp4|webm|mov)(\?.*)?$/i;
  var HAS_EXT = /\.[a-z0-9]{2,5}(\?.*)?$/i;

  function optimizeCloudinary(url, w) {
    var marker = "/image/upload/";
    var at = url.indexOf(marker);
    if (url.indexOf("res.cloudinary.com/") === -1 || at === -1) return url;
    var head = url.slice(0, at + marker.length);
    var rest = url.slice(at + marker.length);
    var first = rest.split("/")[0];
    if (/^[a-z]{1,3}_/.test(first) || first.indexOf(",") > -1) return url;
    return head + "f_auto,q_auto" + (w ? ",w_" + w : "") + "/" + rest;
  }

  function resolveMedia(value, opts) {
    if (typeof value !== "string") return "";
    var s = value.trim();
    if (!s) return "";
    if (/^(data|blob):/i.test(s)) return s;
    if (s.indexOf("//") === 0) s = "https:" + s;
    if (FULL_LINK.test(s)) return optimizeCloudinary(s, opts && opts.w);
    var key = s.replace(/^(img|video)\//, "");
    var isVideo = (opts && opts.type === "video") || s.indexOf("video/") === 0 || VIDEO_EXT.test(key);
    if (!HAS_EXT.test(key)) key += isVideo ? ".mp4" : ".webp";
    if (isVideo) return VIDEO_BASE + key;
    return optimizeCloudinary(IMG_BASE + key, opts && opts.w);
  }

  window.ETERNA_MEDIA = { resolve: resolveMedia };
})();
