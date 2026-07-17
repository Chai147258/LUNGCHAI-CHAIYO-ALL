/*!
 * ลุงชัย AI — embeddable chat widget for lungchaichaiyo.shop
 * Usage: add <script src="/assets/lungchai-ai-widget.js" defer></script> before </body> on any page.
 * Talks to the "lungchai-ai-chat" Supabase Edge Function (server holds the Anthropic API key).
 */
(function () {
  "use strict";

  var SUPABASE_URL = "https://hkwqrllqzfzsbsxqgaoo.supabase.co";
  var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrd3FybGxxemZ6c2JzeHFnYW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNzIzNjAsImV4cCI6MjA5Njk0ODM2MH0.kPT_UY0-2-0cbDlGwya24DnOLJXA-XJGMdM6SIm7Rew";
  var CHAT_FUNCTION_URL = SUPABASE_URL + "/functions/v1/lungchai-ai-chat";

  // Avoid double-injecting if the script is accidentally included twice
  if (document.getElementById("lcai-root")) return;

  var CSS = "\
#lcai-root{--lcai-void:#02020C;--lcai-void-2:#0A0A18;--lcai-gold:#C9A84C;--lcai-gold-soft:#E4CE87;--lcai-ink:#EDEBE2;--lcai-dim:#8B8A9A;--lcai-glass:rgba(255,255,255,0.04);--lcai-glass-brd:rgba(201,168,76,0.28);font-family:'Chakra Petch','Space Mono',sans-serif;}\
#lcai-root *{box-sizing:border-box;}\
#lcai-launcher{position:fixed;bottom:24px;right:24px;z-index:999998;width:60px;height:60px;border-radius:50%;background:linear-gradient(155deg,#1a1830,var(--lcai-void-2));border:1px solid var(--lcai-gold);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 30px rgba(201,168,76,0.25);}\
#lcai-launcher:hover{transform:scale(1.06);}\
#lcai-launcher::after{content:\"\";position:absolute;inset:-6px;border-radius:50%;border:1px solid rgba(201,168,76,0.4);animation:lcai-pulse 2.4s ease-out infinite;}\
@keyframes lcai-pulse{0%{transform:scale(.9);opacity:.8;}100%{transform:scale(1.35);opacity:0;}}\
#lcai-launcher svg{width:24px;height:24px;stroke:var(--lcai-gold-soft);}\
#lcai-panel{position:fixed;bottom:24px;right:24px;z-index:999999;width:min(380px,92vw);height:min(600px,78vh);background:linear-gradient(180deg,rgba(15,14,28,0.97),rgba(6,6,14,0.98));border:1px solid var(--lcai-glass-brd);border-radius:20px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.6);backdrop-filter:blur(18px);opacity:0;transform:translateY(16px) scale(.98);pointer-events:none;transition:opacity .22s ease, transform .22s ease;color:var(--lcai-ink);}\
#lcai-panel.lcai-open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}\
.lcai-head{padding:16px 18px;display:flex;align-items:center;gap:10px;border-bottom:1px solid rgba(201,168,76,0.18);background:rgba(201,168,76,0.04);}\
.lcai-avatar{width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 35% 30%,var(--lcai-gold-soft),var(--lcai-gold) 60%,#7a5f1c);flex-shrink:0;}\
.lcai-head h3{margin:0;font-size:15px;font-weight:600;}\
.lcai-head p{margin:0;font-size:11px;color:var(--lcai-dim);font-family:'Space Mono',monospace;}\
.lcai-status-dot{width:7px;height:7px;border-radius:50%;background:#4ADE80;display:inline-block;margin-right:5px;box-shadow:0 0 6px #4ADE80;}\
#lcai-close{margin-left:auto;background:none;border:none;color:var(--lcai-dim);cursor:pointer;font-size:20px;line-height:1;padding:4px;}\
#lcai-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;}\
.lcai-msg{max-width:84%;padding:10px 13px;border-radius:14px;font-size:13.5px;line-height:1.6;white-space:pre-wrap;}\
.lcai-msg.lcai-bot{align-self:flex-start;background:var(--lcai-glass);border:1px solid rgba(255,255,255,0.06);border-bottom-left-radius:4px;}\
.lcai-msg.lcai-user{align-self:flex-end;background:linear-gradient(135deg,var(--lcai-gold),#a9843a);color:#1a1408;border-bottom-right-radius:4px;font-weight:500;}\
.lcai-msg.lcai-typing{display:flex;gap:4px;align-items:center;padding:12px 14px;}\
.lcai-dot{width:6px;height:6px;border-radius:50%;background:var(--lcai-gold);animation:lcai-blink 1.2s infinite;}\
.lcai-dot:nth-child(2){animation-delay:.2s;} .lcai-dot:nth-child(3){animation-delay:.4s;}\
@keyframes lcai-blink{0%,80%,100%{opacity:.25;}40%{opacity:1;}}\
#lcai-suggestions{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 12px;}\
.lcai-chip{font-family:'Space Mono',monospace;font-size:11px;color:var(--lcai-gold-soft);border:1px solid rgba(201,168,76,0.35);padding:6px 10px;border-radius:100px;cursor:pointer;background:rgba(201,168,76,0.06);white-space:nowrap;}\
.lcai-input-row{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(201,168,76,0.15);}\
#lcai-text{flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:11px 14px;color:var(--lcai-ink);font-family:'Chakra Petch',sans-serif;font-size:13.5px;outline:none;}\
#lcai-text:focus{border-color:var(--lcai-gold);}\
.lcai-icon-btn{width:40px;height:40px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);color:var(--lcai-dim);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}\
.lcai-icon-btn.lcai-recording{background:rgba(220,60,60,0.18);border-color:#e05353;color:#ff8080;}\
#lcai-send{background:linear-gradient(135deg,var(--lcai-gold),#a9843a);border:none;color:#1a1408;}\
.lcai-icon-btn svg{width:17px;height:17px;}\
.lcai-foot{font-family:'Space Mono',monospace;font-size:9.5px;color:#4a4958;text-align:center;padding:6px 0 10px;}\
@media (max-width:480px){#lcai-panel{right:10px;bottom:84px;}#lcai-launcher{right:16px;bottom:16px;}}\
";

  var HTML = "\
<div id=\"lcai-launcher\" aria-label=\"เปิดแชทลุงชัย AI\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 11.5a8.38 8.38 0 0 1-8.5 8.4A8.5 8.5 0 0 1 4 12a8.38 8.38 0 0 1 8.4-8.5A8.5 8.5 0 0 1 21 11.5z\"/><path d=\"M8 10h.01M12 10h.01M16 10h.01\"/></svg></div>\
<div id=\"lcai-panel\">\
  <div class=\"lcai-head\">\
    <div class=\"lcai-avatar\"></div>\
    <div><h3>ลุงชัย AI</h3><p><span class=\"lcai-status-dot\"></span>Lungchai Chaiyo Group · Online</p></div>\
    <button id=\"lcai-close\">×</button>\
  </div>\
  <div id=\"lcai-messages\"></div>\
  <div id=\"lcai-suggestions\">\
    <div class=\"lcai-chip\" data-q=\"อินเทอร์เน็ตหลุดบ่อย ประเมินราคาซ่อมให้หน่อย\">อินเทอร์เน็ตหลุด ราคาเท่าไหร่?</div>\
    <div class=\"lcai-chip\" data-q=\"มีบริการติดตั้งกล้องวงจรปิดไหม ราคาเริ่มต้นเท่าไหร่\">ติดตั้งกล้องวงจรปิด</div>\
    <div class=\"lcai-chip\" data-q=\"Do you offer network maintenance for factories?\">Ask in English</div>\
  </div>\
  <div class=\"lcai-input-row\">\
    <input id=\"lcai-text\" type=\"text\" placeholder=\"พิมพ์คำถามของคุณ...\" autocomplete=\"off\">\
    <button class=\"lcai-icon-btn\" id=\"lcai-mic\" title=\"พูดแทนพิมพ์\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z\"/><path d=\"M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8\"/></svg></button>\
    <button class=\"lcai-icon-btn\" id=\"lcai-send\" title=\"ส่ง\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"22\" y1=\"2\" x2=\"11\" y2=\"13\"/><polygon points=\"22 2 15 22 11 13 2 9 22 2\"/></svg></button>\
  </div>\
  <div class=\"lcai-foot\">AI ประเมินราคาเบื้องต้น · ราคาจริงยืนยันหน้างานอีกครั้ง</div>\
</div>\
";

  function init() {
    var styleEl = document.createElement("style");
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);

    var root = document.createElement("div");
    root.id = "lcai-root";
    root.innerHTML = HTML;
    document.body.appendChild(root);

    var launcher = document.getElementById("lcai-launcher");
    var panel = document.getElementById("lcai-panel");
    var closeBtn = document.getElementById("lcai-close");
    var messagesEl = document.getElementById("lcai-messages");
    var textInput = document.getElementById("lcai-text");
    var sendBtn = document.getElementById("lcai-send");
    var micBtn = document.getElementById("lcai-mic");
    var suggestions = document.getElementById("lcai-suggestions");

    var history = [];
    var sessionId = null;

    launcher.addEventListener("click", function () {
      panel.classList.add("lcai-open");
      if (messagesEl.children.length === 0) {
        addMsg("lcai-bot", "สวัสดีครับ ผมลุงชัย AI 🙏 ผู้ช่วยประจำ Lungchai Chaiyo Group\nถามได้เลยเรื่องบริการ ซ่อม/ติดตั้ง IT, กล้องวงจรปิด, เครือข่าย, งานโรงงาน หรือให้ผมประเมินราคาเบื้องต้นก็ได้ครับ (พิมพ์ได้ทุกภาษา)");
      }
    });
    closeBtn.addEventListener("click", function () { panel.classList.remove("lcai-open"); });

    suggestions.addEventListener("click", function (e) {
      var chip = e.target.closest(".lcai-chip");
      if (!chip) return;
      textInput.value = chip.getAttribute("data-q");
      handleSend();
    });

    sendBtn.addEventListener("click", handleSend);
    textInput.addEventListener("keydown", function (e) { if (e.key === "Enter") handleSend(); });

    function addMsg(cls, text) {
      var el = document.createElement("div");
      el.className = "lcai-msg " + cls;
      el.textContent = text;
      messagesEl.appendChild(el);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return el;
    }
    function addTyping() {
      var el = document.createElement("div");
      el.className = "lcai-msg lcai-bot lcai-typing";
      el.id = "lcai-typing";
      el.innerHTML = '<span class="lcai-dot"></span><span class="lcai-dot"></span><span class="lcai-dot"></span>';
      messagesEl.appendChild(el);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    function removeTyping() {
      var el = document.getElementById("lcai-typing");
      if (el) el.remove();
    }

    function handleSend() {
      var text = textInput.value.trim();
      if (!text) return;
      textInput.value = "";
      addMsg("lcai-user", text);
      addTyping();

      fetch(CHAT_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": "Bearer " + SUPABASE_ANON_KEY
        },
        body: JSON.stringify({ message: text, history: history, session_id: sessionId })
      })
        .then(function (r) { return r.json().then(function (data) { return { ok: r.ok, data: data }; }); })
        .then(function (res) {
          removeTyping();
          if (!res.ok || res.data.error) {
            addMsg("lcai-bot", "ขออภัยครับ ระบบขัดข้องเล็กน้อย รบกวนลองใหม่อีกครั้ง หรือติดต่อทีมงานผ่านเว็บไซต์ได้เลยครับ");
            return;
          }
          if (res.data.session_id) sessionId = res.data.session_id;
          addMsg("lcai-bot", res.data.reply);
          history.push({ role: "user", content: text });
          history.push({ role: "assistant", content: res.data.reply });
        })
        .catch(function () {
          removeTyping();
          addMsg("lcai-bot", "ขออภัยครับ เชื่อมต่อระบบไม่สำเร็จ รบกวนลองใหม่อีกครั้งครับ 🙏");
        });
    }

    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognizing = false;
    if (SpeechRecognition) {
      var recognizer = new SpeechRecognition();
      recognizer.lang = "th-TH";
      recognizer.interimResults = false;
      recognizer.onresult = function (e) { textInput.value = e.results[0][0].transcript; };
      recognizer.onend = function () { recognizing = false; micBtn.classList.remove("lcai-recording"); };
      micBtn.addEventListener("click", function () {
        if (recognizing) { recognizer.stop(); return; }
        recognizing = true;
        micBtn.classList.add("lcai-recording");
        recognizer.start();
      });
    } else {
      micBtn.addEventListener("click", function () {
        alert("เบราว์เซอร์นี้ยังไม่รองรับการพูดสั่งงาน กรุณาพิมพ์ข้อความแทนครับ");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
