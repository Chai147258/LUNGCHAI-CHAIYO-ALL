/*!
 * ลุงชัย AI — site-wide floating launcher (draggable)
 * Add <script src="/assets/lungchai-launcher.js" defer></script> before </body> on any page
 * (except lc_ai.html itself). Clicking the floating icon opens lc_ai.html as a
 * full-screen overlay so the visitor never leaves the page they're on.
 * The button can be dragged anywhere on screen; its position is remembered
 * per-device via localStorage.
 */
(function () {
  "use strict";

  // Don't inject on the chat page itself, and avoid double-injection
  if (/lc_ai\.html/i.test(location.pathname) || document.getElementById("lcai-launch-root")) return;

  var POS_KEY = "lcaiLaunchPos";

  var CSS = "\
#lcai-launch-btn{position:fixed;bottom:110px;right:20px;z-index:999997;width:60px;height:60px;border-radius:50%;background:#0A0A18;border:1px solid #C9A84C;display:flex;align-items:center;justify-content:center;cursor:grab;box-shadow:0 6px 30px rgba(201,168,76,0.35);transition:transform .2s ease;overflow:hidden;touch-action:none;user-select:none;}\
#lcai-launch-btn:hover{transform:scale(1.07);}\
#lcai-launch-btn.lcai-dragging{cursor:grabbing;transition:none;box-shadow:0 10px 40px rgba(201,168,76,0.55);}\
#lcai-launch-btn::after{content:\"\";position:absolute;inset:-6px;border-radius:50%;border:1px solid rgba(201,168,76,0.4);animation:lcai-launch-pulse 2.4s ease-out infinite;pointer-events:none;}\
@keyframes lcai-launch-pulse{0%{transform:scale(.9);opacity:.8;}100%{transform:scale(1.4);opacity:0;}}\
#lcai-launch-btn img{width:100%;height:100%;object-fit:cover;border-radius:50%;pointer-events:none;}\
#lcai-launch-overlay{position:fixed;inset:0;z-index:999998;background:#02020C;opacity:0;pointer-events:none;transition:opacity .25s ease;}\
#lcai-launch-overlay.lcai-launch-open{opacity:1;pointer-events:auto;}\
#lcai-launch-overlay iframe{width:100%;height:100%;border:0;display:block;}\
#lcai-launch-close{position:fixed;top:16px;right:16px;z-index:999999;width:42px;height:42px;border-radius:50%;background:rgba(20,20,25,0.85);border:1px solid rgba(201,168,76,0.5);color:#E4CE87;font-size:22px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;}\
@media (max-width:480px){#lcai-launch-btn{right:16px;bottom:100px;}}\
";

  var styleEl = document.createElement("style");
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  var root = document.createElement("div");
  root.id = "lcai-launch-root";
  root.innerHTML =
    '<div id="lcai-launch-btn" aria-label="เปิดแชทลุงชัย AI (ลากเพื่อย้ายตำแหน่ง)">' +
      '<img src="https://raw.githubusercontent.com/Chai147258/LUNGCHAI-CHAIYO-ALL/main/images/logo-all.jpg" alt="ลุงชัย AI" draggable="false" />' +
    "</div>" +
    '<div id="lcai-launch-overlay"></div>';
  document.body.appendChild(root);

  var launchBtn = document.getElementById("lcai-launch-btn");
  var overlay = document.getElementById("lcai-launch-overlay");
  var iframeLoaded = false;

  // Restore saved position (uses top/left once dragged; falls back to CSS default otherwise)
  try {
    var saved = JSON.parse(localStorage.getItem(POS_KEY) || "null");
    if (saved && typeof saved.top === "number" && typeof saved.left === "number") {
      applyPosition(saved.top, saved.left);
    }
  } catch (e) {}

  function applyPosition(top, left) {
    var btnSize = launchBtn.offsetWidth || 60;
    var maxTop = window.innerHeight - btnSize - 8;
    var maxLeft = window.innerWidth - btnSize - 8;
    top = Math.min(Math.max(8, top), Math.max(8, maxTop));
    left = Math.min(Math.max(8, left), Math.max(8, maxLeft));
    launchBtn.style.top = top + "px";
    launchBtn.style.left = left + "px";
    launchBtn.style.bottom = "auto";
    launchBtn.style.right = "auto";
  }

  // --- Drag handling (pointer events cover mouse + touch) ---
  var dragging = false;
  var moved = false;
  var startX, startY, startTop, startLeft;
  var DRAG_THRESHOLD = 6; // px of movement before it counts as a drag, not a tap

  launchBtn.addEventListener("pointerdown", function (e) {
    dragging = true;
    moved = false;
    var rect = launchBtn.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startTop = rect.top;
    startLeft = rect.left;
    launchBtn.setPointerCapture(e.pointerId);
    launchBtn.classList.add("lcai-dragging");
  });

  launchBtn.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    var dy = e.clientY - startY;
    if (!moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) moved = true;
    if (moved) applyPosition(startTop + dy, startLeft + dx);
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    launchBtn.classList.remove("lcai-dragging");
    if (moved) {
      var rect = launchBtn.getBoundingClientRect();
      try {
        localStorage.setItem(POS_KEY, JSON.stringify({ top: rect.top, left: rect.left }));
      } catch (err) {}
    } else {
      // No real movement — treat as a tap/click to open the chat
      openOverlay();
    }
  }

  launchBtn.addEventListener("pointerup", endDrag);
  launchBtn.addEventListener("pointercancel", endDrag);

  // Keep the button on-screen if the viewport is resized/rotated
  window.addEventListener("resize", function () {
    var rect = launchBtn.getBoundingClientRect();
    if (launchBtn.style.top) applyPosition(rect.top, rect.left);
  });

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
})();
