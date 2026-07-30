/* ─────────────────────────────────────────
   LANGUAGE SWITCHER — TH / EN / ZH-CN / ZH-TW / MY / VI
   Translates every [data-i18n] element's text on the page.
   Selection is remembered per-device via localStorage.
───────────────────────────────────────── */
(function(){
  var LANG_KEY = "lcaiLang";
  var LABELS = { th:"TH", en:"EN", "zh-CN":"简", "zh-TW":"繁", my:"MM", vi:"VI" };

  var dict = {
    th: {
      nav_home:"หน้าแรก", nav_about:"เกี่ยวกับเรา", nav_services:"บริการ", nav_products:"สินค้า",
      nav_solutions:"โซลูชันธุรกิจ", nav_repair:"แจ้งซ่อม", nav_videos:"วิดีโอ", nav_contact:"ติดต่อเรา", cta_quote:"ขอใบเสนอราคา",
      videos_title:"วิดีโอจากช่อง ลุงชัย ไชโย", videos_sub:"อัปเดตความรู้ เทคนิคช่าง และเบื้องหลังงานของเราแบบสดๆ", videos_cta:"ดูทุกวิดีโอบน YouTube",
      hero_desc:"เรารวมสินค้า เทคโนโลยี และบริการ เพื่อช่วยให้ธุรกิจ โรงงาน และองค์กร ทำงานได้ง่ายขึ้น",
      hero_cta1:"ขอใบเสนอราคา", hero_cta2:"แคตตาล็อกสินค้า",
      solutions_title:"Business Solutions", solutions_sub:"โซลูชันสำหรับธุรกิจ โรงงาน และองค์กร",
      card1_title:"LUNGCHAI IT SOLUTION", card1_sub:"ระบบเทคโนโลยีสารสนเทศ", card1_desc:"จำหน่ายและติดตั้งระบบ IT สำหรับองค์กรและโรงงาน",
      card2_title:"LUNGCHAI INDUSTRIAL", card2_sub:"Industrial Supply & Service", card2_desc:"สินค้าและบริการสำหรับภาคอุตสาหกรรม",
      card3_title:"LUNGCHAI SERVICE", card3_sub:"Technical Service", card3_desc:"บริการช่างและงานติดตั้ง",
      btn_detail:"ดูรายละเอียด", btn_service_request:"แจ้งบริการ",
      products_title:"Products", products_sub:"สินค้าเทคโนโลยีและอุปกรณ์สำหรับธุรกิจ",
      ecosystem_title:"LUNGCHAI BUSINESS ECOSYSTEM", ecosystem_desc:"ระบบธุรกิจที่เชื่อมโยง สินค้า บริการ เทคโนโลยี และเครือข่ายผู้เชี่ยวชาญ เพื่อสร้างประสบการณ์บริการครบวงจร",
      process_title:"ขั้นตอนการให้บริการ",
      step1_title:"ติดต่อเรา", step1_desc:"ลูกค้าแจ้งความต้องการ",
      step2_title:"ประเมินงาน", step2_desc:"วิเคราะห์สินค้า / บริการ",
      step3_title:"ดำเนินงาน", step3_desc:"ติดตั้ง ซ่อม หรือส่งมอบสินค้า",
      step4_title:"บริการหลังการขาย", step4_desc:"ติดตามและดูแลต่อเนื่อง",
      why_title:"ทำไมเลือกเรา",
      why1_title:"One Stop Solution", why1_desc:"ครบทั้งสินค้าและบริการ",
      why2_title:"Technology Driven", why2_desc:"ใช้เทคโนโลยีเพิ่มประสิทธิภาพ",
      why3_title:"Professional Service", why3_desc:"ทำงานเป็นระบบ ตรวจสอบได้",
      why4_title:"Business Partnership", why4_desc:"เติบโตไปพร้อมกับลูกค้า",
      coming_title:"Coming Soon — Digital Business Platform", coming_desc:"เรากำลังพัฒนาระบบดิจิทัลเพื่อเชื่อมต่อสินค้า บริการ และเครือข่ายธุรกิจในอนาคต",
      contact_title:"ติดต่อ LUNGCHAI CHAIYO ALL", contact_desc:"สนใจสินค้า บริการ หรือโซลูชันธุรกิจ ติดต่อทีมงานของเราได้วันนี้",
      footer_tagline:"สินค้า เทคโนโลยี และบริการครบวงจรสำหรับโรงงาน ธุรกิจ และองค์กร",
      footer_services:"บริการหลัก", footer_links:"ลิงก์ที่เป็นประโยชน์", footer_contact:"ติดต่อเรา"
    },
    en: {
      nav_home:"Home", nav_about:"About Us", nav_services:"Services", nav_products:"Products",
      nav_solutions:"Business Solutions", nav_repair:"Request Repair", nav_videos:"Videos", nav_contact:"Contact", cta_quote:"Get a Quote",
      videos_title:"Videos from Lungchai Chaiyo", videos_sub:"Tips, techniques and behind-the-scenes from our team", videos_cta:"Watch more on YouTube",
      hero_desc:"We bring together products, technology and services to help businesses, factories and organizations run more smoothly.",
      hero_cta1:"Get a Quote", hero_cta2:"Product Catalog",
      solutions_title:"Business Solutions", solutions_sub:"Solutions for businesses, factories and organizations",
      card1_title:"LUNGCHAI IT SOLUTION", card1_sub:"Information Technology Systems", card1_desc:"Supply and installation of IT systems for organizations and factories",
      card2_title:"LUNGCHAI INDUSTRIAL", card2_sub:"Industrial Supply & Service", card2_desc:"Products and services for the industrial sector",
      card3_title:"LUNGCHAI SERVICE", card3_sub:"Technical Service", card3_desc:"Technician and installation services",
      btn_detail:"View Details", btn_service_request:"Request Service",
      products_title:"Products", products_sub:"Technology products and equipment for business",
      ecosystem_title:"LUNGCHAI BUSINESS ECOSYSTEM", ecosystem_desc:"A connected business system linking products, services, technology and a network of specialists to create a complete service experience",
      process_title:"Our Service Process",
      step1_title:"Contact Us", step1_desc:"Tell us what you need",
      step2_title:"Assessment", step2_desc:"We review the products / service required",
      step3_title:"Execution", step3_desc:"Installation, repair or delivery",
      step4_title:"After-Sales Care", step4_desc:"Ongoing follow-up and support",
      why_title:"Why Choose Us",
      why1_title:"One Stop Solution", why1_desc:"Complete products and services in one place",
      why2_title:"Technology Driven", why2_desc:"Using technology to boost efficiency",
      why3_title:"Professional Service", why3_desc:"Systematic, verifiable work process",
      why4_title:"Business Partnership", why4_desc:"Growing together with our customers",
      coming_title:"Coming Soon — Digital Business Platform", coming_desc:"We're building a digital system to connect products, services and business networks for the future",
      contact_title:"Contact LUNGCHAI CHAIYO ALL", contact_desc:"Interested in our products, services or business solutions? Get in touch with our team today",
      footer_tagline:"One-stop for every factory and business need — products, services and technology in a single platform",
      footer_services:"Main Services", footer_links:"Useful Links", footer_contact:"Contact Us"
    },
    "zh-CN": {
      nav_home:"首页", nav_about:"关于我们", nav_services:"服务项目", nav_products:"产品",
      nav_solutions:"商业解决方案", nav_repair:"申请维修", nav_videos:"视频", nav_contact:"联系我们", cta_quote:"索取报价",
      videos_title:"来自 Lungchai Chaiyo 的视频", videos_sub:"实时更新技术知识与幕后花絮", videos_cta:"在 YouTube 上观看更多",
      hero_desc:"我们整合产品、技术与服务，协助企业、工厂与组织更高效地运作。",
      hero_cta1:"索取报价", hero_cta2:"产品目录",
      solutions_title:"商业解决方案", solutions_sub:"为企业、工厂与组织提供的解决方案",
      card1_title:"LUNGCHAI IT SOLUTION", card1_sub:"信息技术系统", card1_desc:"为企业与工厂提供IT系统的供应与安装",
      card2_title:"LUNGCHAI INDUSTRIAL", card2_sub:"工业供应与服务", card2_desc:"面向工业领域的产品与服务",
      card3_title:"LUNGCHAI SERVICE", card3_sub:"技术服务", card3_desc:"维修与安装技术服务",
      btn_detail:"查看详情", btn_service_request:"申请服务",
      products_title:"产品", products_sub:"面向企业的科技产品与设备",
      ecosystem_title:"LUNGCHAI 商业生态系统", ecosystem_desc:"连接产品、服务、技术与专业网络的商业系统，打造一站式服务体验",
      process_title:"服务流程",
      step1_title:"联系我们", step1_desc:"告诉我们您的需求",
      step2_title:"评估需求", step2_desc:"分析所需产品/服务",
      step3_title:"执行作业", step3_desc:"安装、维修或交付产品",
      step4_title:"售后服务", step4_desc:"持续跟进与维护",
      why_title:"为什么选择我们",
      why1_title:"一站式解决方案", why1_desc:"产品与服务一应俱全",
      why2_title:"科技驱动", why2_desc:"运用科技提升效率",
      why3_title:"专业服务", why3_desc:"作业系统化，可追溯",
      why4_title:"商业伙伴关系", why4_desc:"与客户共同成长",
      coming_title:"即将推出 — 数字商业平台", coming_desc:"我们正在开发数字系统，未来将连接产品、服务与商业网络",
      contact_title:"联系 LUNGCHAI CHAIYO ALL", contact_desc:"对我们的产品、服务或商业解决方案感兴趣？即刻联系我们的团队",
      footer_tagline:"满足工厂与企业各项需求的一站式平台 — 产品、服务与科技合而为一",
      footer_services:"主要服务", footer_links:"实用链接", footer_contact:"联系我们"
    },
    "zh-TW": {
      nav_home:"首頁", nav_about:"關於我們", nav_services:"服務項目", nav_products:"產品",
      nav_solutions:"商業解決方案", nav_repair:"申請維修", nav_videos:"影片", nav_contact:"聯絡我們", cta_quote:"索取報價",
      videos_title:"來自 Lungchai Chaiyo 的影片", videos_sub:"即時更新技術知識與幕後花絮", videos_cta:"在 YouTube 上觀看更多",
      hero_desc:"我們整合產品、技術與服務，協助企業、工廠與組織更有效率地運作。",
      hero_cta1:"索取報價", hero_cta2:"產品目錄",
      solutions_title:"商業解決方案", solutions_sub:"為企業、工廠與組織提供的解決方案",
      card1_title:"LUNGCHAI IT SOLUTION", card1_sub:"資訊科技系統", card1_desc:"為企業與工廠提供IT系統的供應與安裝",
      card2_title:"LUNGCHAI INDUSTRIAL", card2_sub:"工業供應與服務", card2_desc:"面向工業領域的產品與服務",
      card3_title:"LUNGCHAI SERVICE", card3_sub:"技術服務", card3_desc:"維修與安裝技術服務",
      btn_detail:"查看詳情", btn_service_request:"申請服務",
      products_title:"產品", products_sub:"面向企業的科技產品與設備",
      ecosystem_title:"LUNGCHAI 商業生態系統", ecosystem_desc:"連結產品、服務、技術與專業網路的商業系統，打造一站式服務體驗",
      process_title:"服務流程",
      step1_title:"聯絡我們", step1_desc:"告訴我們您的需求",
      step2_title:"評估需求", step2_desc:"分析所需產品/服務",
      step3_title:"執行作業", step3_desc:"安裝、維修或交付產品",
      step4_title:"售後服務", step4_desc:"持續追蹤與維護",
      why_title:"為什麼選擇我們",
      why1_title:"一站式解決方案", why1_desc:"產品與服務一應俱全",
      why2_title:"科技驅動", why2_desc:"運用科技提升效率",
      why3_title:"專業服務", why3_desc:"作業系統化，可追溯",
      why4_title:"商業夥伴關係", why4_desc:"與客戶共同成長",
      coming_title:"即將推出 — 數位商業平台", coming_desc:"我們正在開發數位系統，未來將連結產品、服務與商業網路",
      contact_title:"聯絡 LUNGCHAI CHAIYO ALL", contact_desc:"對我們的產品、服務或商業解決方案感興趣？立即聯絡我們的團隊",
      footer_tagline:"滿足工廠與企業各項需求的一站式平台 — 產品、服務與科技合而為一",
      footer_services:"主要服務", footer_links:"實用連結", footer_contact:"聯絡我們"
    },
    my: {
      nav_home:"ပင်မစာမျက်နှာ", nav_about:"ကျွန်ုပ်တို့အကြောင်း", nav_services:"ဝန်ဆောင်မှုများ", nav_products:"ကုန်ပစ္စည်းများ",
      nav_solutions:"စီးပွားရေး ဖြေရှင်းချက်များ", nav_repair:"ပြင်ဆင်မှု တောင်းဆိုရန်", nav_videos:"ဗီဒီယိုများ", nav_contact:"ဆက်သွယ်ရန်", cta_quote:"စျေးနှုန်း တောင်းရန်",
      videos_title:"Lungchai Chaiyo ၏ ဗီဒီယိုများ", videos_sub:"နည်းပညာအကြောင်းနှင့် နောက်ကွယ်အချက်အလက်များကို လတ်တလော အပ်ဒိတ်လုပ်ပါ", videos_cta:"YouTube တွင် ပိုမိုကြည့်ရှုရန်",
      hero_desc:"စီးပွားရေး၊ စက်ရုံများနှင့် အဖွဲ့အစည်းများ ပိုမိုလွယ်ကူစွာ လုပ်ဆောင်နိုင်ရန် ကုန်ပစ္စည်း၊ နည်းပညာနှင့် ဝန်ဆောင်မှုများကို ပေါင်းစည်းပေးပါသည်။",
      hero_cta1:"စျေးနှုန်း တောင်းရန်", hero_cta2:"ကုန်ပစ္စည်း စာရင်း",
      solutions_title:"စီးပွားရေး ဖြေရှင်းချက်များ", solutions_sub:"စီးပွားရေး၊ စက်ရုံနှင့် အဖွဲ့အစည်းများအတွက် ဖြေရှင်းချက်များ",
      card1_title:"LUNGCHAI IT SOLUTION", card1_sub:"အချက်အလက်နည်းပညာစနစ်", card1_desc:"အဖွဲ့အစည်းနှင့် စက်ရုံများအတွက် IT စနစ် ရောင်းချခြင်းနှင့် တပ်ဆင်ခြင်း",
      card2_title:"LUNGCHAI INDUSTRIAL", card2_sub:"စက်မှုလုပ်ငန်း ပစ္စည်းနှင့် ဝန်ဆောင်မှု", card2_desc:"စက်မှုကဏ္ဍအတွက် ကုန်ပစ္စည်းနှင့် ဝန်ဆောင်မှုများ",
      card3_title:"LUNGCHAI SERVICE", card3_sub:"နည်းပညာ ဝန်ဆောင်မှု", card3_desc:"ပြင်ဆင်ရေးနှင့် တပ်ဆင်ရေး ဝန်ဆောင်မှုများ",
      btn_detail:"အသေးစိတ် ကြည့်ရန်", btn_service_request:"ဝန်ဆောင်မှု တောင်းရန်",
      products_title:"ကုန်ပစ္စည်းများ", products_sub:"စီးပွားရေးလုပ်ငန်းများအတွက် နည်းပညာပစ္စည်းနှင့် ကိရိယာများ",
      ecosystem_title:"LUNGCHAI စီးပွားရေး အင်ကျစ်စနစ်", ecosystem_desc:"ကုန်ပစ္စည်း၊ ဝန်ဆောင်မှု၊ နည်းပညာနှင့် ကျွမ်းကျင်သူများ၏ ကွန်ရက်ကို ဆက်စပ်ပေးသည့် စီးပွားရေးစနစ်",
      process_title:"ဝန်ဆောင်မှု လုပ်ငန်းစဉ်",
      step1_title:"ဆက်သွယ်ပါ", step1_desc:"သင့်လိုအပ်ချက်ကို ပြောပြပါ",
      step2_title:"အကဲဖြတ်ခြင်း", step2_desc:"လိုအပ်သည့် ကုန်ပစ္စည်း/ဝန်ဆောင်မှုကို စိစစ်ခြင်း",
      step3_title:"လုပ်ဆောင်ခြင်း", step3_desc:"တပ်ဆင်ခြင်း၊ ပြင်ဆင်ခြင်း သို့မဟုတ် ပို့ဆောင်ခြင်း",
      step4_title:"အရောင်းနောက်ပိုင်း ဝန်ဆောင်မှု", step4_desc:"ဆက်လက်ကြည့်ရှုစောင့်ရှောက်ခြင်း",
      why_title:"ဘာကြောင့် ကျွန်ုပ်တို့ကို ရွေးချယ်သင့်သနည်း",
      why1_title:"One Stop ဖြေရှင်းချက်", why1_desc:"ကုန်ပစ္စည်းနှင့် ဝန်ဆောင်မှု အပြည့်အစုံ",
      why2_title:"နည်းပညာ အခြေပြု", why2_desc:"ထိရောက်မှု မြှင့်တင်ရန် နည်းပညာသုံးစွဲခြင်း",
      why3_title:"ကျွမ်းကျင်သော ဝန်ဆောင်မှု", why3_desc:"စနစ်တကျ လုပ်ဆောင်၍ စစ်ဆေးနိုင်သော",
      why4_title:"စီးပွားရေး မိတ်ဖက်အဖွဲ့", why4_desc:"ဖောက်သည်များနှင့်အတူ တိုးတက်ခြင်း",
      coming_title:"မကြာမီရောက်ရှိမည် — ဒီဂျစ်တယ် စီးပွားရေးပလက်ဖောင်း", coming_desc:"အနာဂတ်တွင် ကုန်ပစ္စည်း၊ ဝန်ဆောင်မှုနှင့် စီးပွားရေးကွန်ရက်များကို ဆက်စပ်ပေးရန် ဒီဂျစ်တယ်စနစ်ကို တီထွင်နေပါသည်",
      contact_title:"LUNGCHAI CHAIYO ALL ကို ဆက်သွယ်ရန်", contact_desc:"ကျွန်ုပ်တို့၏ ကုန်ပစ္စည်း၊ ဝန်ဆောင်မှု သို့မဟုတ် စီးပွားရေး ဖြေရှင်းချက်များကို စိတ်ဝင်စားပါက ယနေ့ပင် ဆက်သွယ်ပါ",
      footer_tagline:"စက်ရုံနှင့် စီးပွားရေးလိုအပ်ချက် အားလုံးအတွက် One Stop — ကုန်ပစ္စည်း၊ ဝန်ဆောင်မှုနှင့် နည်းပညာကို ပလက်ဖောင်းတစ်ခုတည်းတွင်",
      footer_services:"အဓိက ဝန်ဆောင်မှုများ", footer_links:"အသုံးဝင်သော လင့်များ", footer_contact:"ဆက်သွယ်ရန်"
    },
    vi: {
      nav_home:"Trang chủ", nav_about:"Về chúng tôi", nav_services:"Dịch vụ", nav_products:"Sản phẩm",
      nav_solutions:"Giải pháp kinh doanh", nav_repair:"Yêu cầu sửa chữa", nav_videos:"Video", nav_contact:"Liên hệ", cta_quote:"Yêu cầu báo giá",
      videos_title:"Video từ Lungchai Chaiyo", videos_sub:"Cập nhật kiến thức kỹ thuật và hậu trường của đội ngũ chúng tôi", videos_cta:"Xem thêm trên YouTube",
      hero_desc:"Chúng tôi kết hợp sản phẩm, công nghệ và dịch vụ để giúp doanh nghiệp, nhà máy và tổ chức hoạt động hiệu quả hơn.",
      hero_cta1:"Yêu cầu báo giá", hero_cta2:"Danh mục sản phẩm",
      solutions_title:"Giải pháp kinh doanh", solutions_sub:"Giải pháp cho doanh nghiệp, nhà máy và tổ chức",
      card1_title:"LUNGCHAI IT SOLUTION", card1_sub:"Hệ thống công nghệ thông tin", card1_desc:"Cung cấp và lắp đặt hệ thống IT cho tổ chức và nhà máy",
      card2_title:"LUNGCHAI INDUSTRIAL", card2_sub:"Vật tư & Dịch vụ công nghiệp", card2_desc:"Sản phẩm và dịch vụ cho ngành công nghiệp",
      card3_title:"LUNGCHAI SERVICE", card3_sub:"Dịch vụ kỹ thuật", card3_desc:"Dịch vụ sửa chữa và lắp đặt",
      btn_detail:"Xem chi tiết", btn_service_request:"Yêu cầu dịch vụ",
      products_title:"Sản phẩm", products_sub:"Sản phẩm công nghệ và thiết bị cho doanh nghiệp",
      ecosystem_title:"HỆ SINH THÁI KINH DOANH LUNGCHAI", ecosystem_desc:"Hệ thống kinh doanh kết nối sản phẩm, dịch vụ, công nghệ và mạng lưới chuyên gia để tạo trải nghiệm dịch vụ trọn vẹn",
      process_title:"Quy trình dịch vụ của chúng tôi",
      step1_title:"Liên hệ", step1_desc:"Cho chúng tôi biết nhu cầu của bạn",
      step2_title:"Đánh giá", step2_desc:"Phân tích sản phẩm / dịch vụ cần thiết",
      step3_title:"Thực hiện", step3_desc:"Lắp đặt, sửa chữa hoặc giao hàng",
      step4_title:"Chăm sóc sau bán hàng", step4_desc:"Theo dõi và hỗ trợ liên tục",
      why_title:"Vì sao chọn chúng tôi",
      why1_title:"Giải pháp trọn gói", why1_desc:"Đầy đủ sản phẩm và dịch vụ",
      why2_title:"Ứng dụng công nghệ", why2_desc:"Sử dụng công nghệ để tăng hiệu quả",
      why3_title:"Dịch vụ chuyên nghiệp", why3_desc:"Quy trình làm việc có hệ thống, có thể kiểm tra",
      why4_title:"Đối tác kinh doanh", why4_desc:"Cùng phát triển với khách hàng",
      coming_title:"Sắp ra mắt — Nền tảng kinh doanh số", coming_desc:"Chúng tôi đang phát triển hệ thống số để kết nối sản phẩm, dịch vụ và mạng lưới kinh doanh trong tương lai",
      contact_title:"Liên hệ LUNGCHAI CHAIYO ALL", contact_desc:"Quan tâm đến sản phẩm, dịch vụ hoặc giải pháp kinh doanh của chúng tôi? Liên hệ đội ngũ của chúng tôi ngay hôm nay",
      footer_tagline:"Giải pháp trọn gói cho mọi nhu cầu của nhà máy và doanh nghiệp — sản phẩm, dịch vụ và công nghệ trong một nền tảng",
      footer_services:"Dịch vụ chính", footer_links:"Liên kết hữu ích", footer_contact:"Liên hệ"
    }
  };

  var btn = document.getElementById("langSwitchBtn");
  var menu = document.getElementById("langMenu");
  var label = document.getElementById("langSwitchLabel");
  if (!btn || !menu) return;

  function applyLang(code){
    if (!dict[code]) code = "th";
    document.documentElement.lang = code;
    label.textContent = LABELS[code] || "TH";
    menu.querySelectorAll("button[data-lang]").forEach(function(b){
      b.classList.toggle("active", b.getAttribute("data-lang") === code);
    });
    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var key = el.getAttribute("data-i18n");
      var text = dict[code][key];
      if (text) el.textContent = text;
    });
    try { localStorage.setItem(LANG_KEY, code); } catch(e){}
  }

  btn.addEventListener("click", function(e){
    e.stopPropagation();
    menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", menu.classList.contains("open") ? "true" : "false");
  });
  document.addEventListener("click", function(){ menu.classList.remove("open"); });
  menu.querySelectorAll("button[data-lang]").forEach(function(b){
    b.addEventListener("click", function(e){
      e.stopPropagation();
      applyLang(b.getAttribute("data-lang"));
      menu.classList.remove("open");
    });
  });

  var saved;
  try { saved = localStorage.getItem(LANG_KEY); } catch(e){}
  applyLang(saved || "th");
})();
