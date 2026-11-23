/* =====================================================================
   BRAND IDENTITIES — VIDEO SETTINGS  (the only file to edit for videos)
   ---------------------------------------------------------------------
   One list per project slug. A project's mood board shows its list with
   { k:'videos', set:'<slug>' } in projects.js.

   Each video:
     src     a direct video file (.mp4 / .webm) — a file beside the site
             (e.g. 'projects/speak-up/videos/x.mp4') or any https link
     poster  picture shown while the video loads (and if it fails)
     hls     optional .m3u8 link; used where the browser plays HLS itself
             (Safari / iPhone), otherwise `src` is used
     stream  optional Cloudflare Stream video instead of src / hls / poster:
             { id:'<video id>', customer:'customer-xxxxxxxx' }
             (the mp4 fallback needs "MP4 downloads" switched on in Stream)
     title   optional { en, ar } — read by screen readers
     w, h    the video's size (keeps the shape before it loads)

   Never put video files inside the code (no base64) — only links.
   ===================================================================== */
window.BRAND_VIDEOS = {
  'speak-up': [
    { src: 'projects/speak-up/videos/speakup-1.mp4', poster: 'projects/speak-up/videos/speakup-1.webp', w: 720, h: 1280,
      title: { en: 'SpeakUp campaign video 1', ar: 'فيديو حملة SpeakUp 1' } },
    { src: 'projects/speak-up/videos/speakup-2.mp4', poster: 'projects/speak-up/videos/speakup-2.webp', w: 720, h: 1280,
      title: { en: 'SpeakUp campaign video 2', ar: 'فيديو حملة SpeakUp 2' } },
    { src: 'projects/speak-up/videos/speakup-3.mp4', poster: 'projects/speak-up/videos/speakup-3.webp', w: 720, h: 1280,
      title: { en: 'SpeakUp campaign video 3', ar: 'فيديو حملة SpeakUp 3' } },
    { src: 'projects/speak-up/videos/speakup-4.mp4', poster: 'projects/speak-up/videos/speakup-4.webp', w: 720, h: 1280,
      title: { en: 'SpeakUp campaign video 4', ar: 'فيديو حملة SpeakUp 4' } }
  ]
};
