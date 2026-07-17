/*!
 * ลุงชัย AI — site-wide floating launcher
 * Add <script src="/assets/lungchai-launcher.js" defer></script> before </body> on any page
 * (except lc_ai.html itself). Clicking the floating icon opens lc_ai.html as a
 * full-screen overlay so the visitor never leaves the page they're on.
 */
(function () {
  "use strict";

  // Don't inject on the chat page itself, and avoid double-injection
  if (/lc_ai\.html/i.test(location.pathname) || document.getElementById("lcai-launch-root")) return;

  var CSS = "\
#lcai-launch-btn{position:fixed;bottom:24px;right:24px;z-index:999997;width:60px;height:60px;border-radius:50%;background:#0A0A18;border:1px solid #C9A84C;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 30px rgba(201,168,76,0.3);transition:transform .2s ease;overflow:hidden;}\
#lcai-launch-btn:hover{transform:scale(1.07);}\
#lcai-launch-btn::after{content:\"\";position:absolute;inset:-6px;border-radius:50%;border:1px solid rgba(201,168,76,0.4);animation:lcai-launch-pulse 2.4s ease-out infinite;pointer-events:none;}\
@keyframes lcai-launch-pulse{0%{transform:scale(.9);opacity:.8;}100%{transform:scale(1.4);opacity:0;}}\
#lcai-launch-btn img{width:100%;height:100%;object-fit:cover;border-radius:50%;}\
#lcai-launch-overlay{position:fixed;inset:0;z-index:999998;background:#02020C;opacity:0;pointer-events:none;transition:opacity .25s ease;}\
#lcai-launch-overlay.lcai-launch-open{opacity:1;pointer-events:auto;}\
#lcai-launch-overlay iframe{width:100%;height:100%;border:0;display:block;}\
#lcai-launch-close{position:fixed;top:16px;right:16px;z-index:999999;width:42px;height:42px;border-radius:50%;background:rgba(20,20,25,0.85);border:1px solid rgba(201,168,76,0.5);color:#E4CE87;font-size:22px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;}\
@media (max-width:480px){#lcai-launch-btn{right:16px;bottom:16px;}}\
";

  var styleEl = document.createElement("style");
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  var root = document.createElement("div");
  root.id = "lcai-launch-root";
  root.innerHTML =
    '<div id="lcai-launch-btn" aria-label="เปิดแชทลุงชัย AI">' +
      '<img src="/images/logo-all.jpg" alt="ลุงชัย AI" />' +
    "</div>" +
    '<div id="lcai-launch-overlay"></div>';
  document.body.appendChild(root);

  var launchBtn = document.getElementById("lcai-launch-btn");
  var overlay = document.getElementById("lcai-launch-overlay");
  var iframeLoaded = false;

  function openOverlay() {
    if (!iframeLoaded) {
      var iframe = document.createElement("iframe");
      iframe.src = "/lc_ai.html";
      iframe.setAttribute("allow", "microphone");
      overlay.appendChild(iframe);

      var closeBtn = document.createElement("div");
      closeBtn.id = "lcai-launch-close";
      closeBtn.innerHTML = "×";
      closeBtn.addEventListener("click", closeOverlay);
      overlay.appendChild(closeBtn);

      iframeLoaded = true;
    }
    overlay.classList.add("lcai-launch-open");
    document.body.style.overflow = "hidden";
  }

  function closeOverlay() {
    overlay.classList.remove("lcai-launch-open");
    document.body.style.overflow = "";
  }

  launchBtn.addEventListener("click", openOverlay);
})();
