"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function Home() {
  useEffect(() => {
    // Sun-flare cursor tracking
    const buttons = document.querySelectorAll<HTMLElement>(".sun-flare-hover");
    const handlers: Array<() => void> = [];
    buttons.forEach((button) => {
      const onMove = (e: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        button.style.setProperty("--x", x + "px");
        button.style.setProperty("--y", y + "px");
      };
      button.addEventListener("mousemove", onMove as EventListener);
      handlers.push(() => button.removeEventListener("mousemove", onMove as EventListener));
    });

    // Mobile menu toggle
    const burgerBtn = document.getElementById("burgerBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    let menuOpen = false;
    const toggleMenu = () => {
      menuOpen = !menuOpen;
      if (mobileMenu) {
        if (menuOpen) {
          mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
          mobileMenu.style.opacity = "1";
        } else {
          mobileMenu.style.maxHeight = "0px";
          mobileMenu.style.opacity = "0";
        }
      }
    };
    burgerBtn?.addEventListener("click", toggleMenu);

    const closeOnLinkClick = () => {
      menuOpen = false;
      if (mobileMenu) {
        mobileMenu.style.maxHeight = "0px";
        mobileMenu.style.opacity = "0";
      }
    };
    const mobileLinks = mobileMenu?.querySelectorAll("a") ?? [];
    mobileLinks.forEach((a) => a.addEventListener("click", closeOnLinkClick));

    return () => {
      handlers.forEach((off) => off());
      burgerBtn?.removeEventListener("click", toggleMenu);
      mobileLinks.forEach((a) => a.removeEventListener("click", closeOnLinkClick));
    };
  }, []);

  return (
    <>
      {/* STARFIELD / NEBULA BACKGROUND */}
      <canvas
        id="galaxy"
        style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", display: "block" }}
      />

      {/* TOP NAVIGATION BAR */}
      <header className="fixed top-0 w-full z-[100] bg-glass-fill backdrop-blur-md border-b border-glass-stroke">
        <nav className="max-w-[1440px] mx-auto px-margin-desktop py-3 flex justify-between items-center">
          <a href="#" className="flex items-center gap-3">
            <img
              src="/images/logo-all.jpg"
              alt="Lungchai Chaiyo All"
              className="w-10 h-10 rounded-lg object-cover border border-primary/30"
            />
            <div className="font-headline-lg text-lg md:text-headline-md text-primary drop-shadow-[0_0_8px_rgba(152,203,255,0.5)] font-bold leading-tight">
              LUNGCHAI CHAIYO ALL
            </div>
          </a>
          <div className="hidden lg:flex items-center gap-7">
            <a className="font-nav-link text-nav-link text-on-surface-variant font-medium hover:text-primary transition-colors" href="/" data-i18n="nav_home">หน้าแรก</a>
            <a className="font-nav-link text-nav-link text-on-surface-variant font-medium hover:text-primary transition-colors" href="/main/about.html" data-i18n="nav_about">เกี่ยวกับเรา</a>
            <a className="font-nav-link text-nav-link text-on-surface-variant font-medium hover:text-primary transition-colors" href="#solutions" data-i18n="nav_services">บริการ</a>
            <a className="font-nav-link text-nav-link text-on-surface-variant font-medium hover:text-primary transition-colors" href="/main/catalog.html" data-i18n="nav_products">สินค้า</a>
            <a className="font-nav-link text-nav-link text-on-surface-variant font-medium hover:text-primary transition-colors" href="#ecosystem" data-i18n="nav_solutions">โซลูชันธุรกิจ</a>
            <a className="font-nav-link text-nav-link text-on-surface-variant font-medium hover:text-primary transition-colors" href="/user/service-request.html" data-i18n="nav_repair">แจ้งซ่อม</a>
            <a className="font-nav-link text-nav-link text-on-surface-variant font-medium hover:text-primary transition-colors" href="#videos" data-i18n="nav_videos">วิดีโอ</a>
            <a className="font-nav-link text-nav-link text-on-surface-variant font-medium hover:text-primary transition-colors" href="#contact" data-i18n="nav_contact">ติดต่อเรา</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div id="langSwitch" className="relative">
              <button id="langSwitchBtn" className="glass-panel text-on-surface-variant hover:text-primary text-sm" aria-haspopup="true" aria-expanded="false">
                <span className="material-symbols-outlined text-[18px]">language</span>
                <span id="langSwitchLabel">TH</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
              <div id="langMenu" role="menu">
                <button data-lang="th" role="menuitem"><span>🇹🇭</span> ไทย</button>
                <button data-lang="en" role="menuitem"><span>🇬🇧</span> English</button>
                <button data-lang="zh-CN" role="menuitem"><span>🇨🇳</span> 简体中文</button>
                <button data-lang="zh-TW" role="menuitem"><span>🇹🇼</span> 繁體中文（台灣）</button>
                <button data-lang="my" role="menuitem"><span>🇲🇲</span> မြန်မာ</button>
                <button data-lang="vi" role="menuitem"><span>🇻🇳</span> Tiếng Việt</button>
              </div>
            </div>
            <a href="/main/inquiry.html" className="hidden sm:inline-flex btn-glossy px-6 md:px-8 py-2 rounded-full font-bold sun-flare-hover transition-all text-sm items-center gap-2" data-i18n="cta_quote">
              ขอใบเสนอราคา
            </a>
            <button id="burgerBtn" className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg glass-panel" aria-label="เมนู">
              <span className="material-symbols-outlined text-white">menu</span>
            </button>
          </div>
        </nav>
        <div id="mobileMenu" className="mobile-menu lg:hidden overflow-hidden max-h-0 opacity-0 border-t border-glass-stroke">
          <div className="flex flex-col px-margin-desktop py-4 gap-1">
            <a className="py-3 border-b border-white/5 text-on-surface-variant hover:text-primary" href="/" data-i18n="nav_home">หน้าแรก</a>
            <a className="py-3 border-b border-white/5 text-on-surface-variant hover:text-primary" href="/main/about.html" data-i18n="nav_about">เกี่ยวกับเรา</a>
            <a className="py-3 border-b border-white/5 text-on-surface-variant hover:text-primary" href="#solutions" data-i18n="nav_services">บริการ</a>
            <a className="py-3 border-b border-white/5 text-on-surface-variant hover:text-primary" href="/main/catalog.html" data-i18n="nav_products">สินค้า</a>
            <a className="py-3 border-b border-white/5 text-on-surface-variant hover:text-primary" href="#ecosystem" data-i18n="nav_solutions">โซลูชันธุรกิจ</a>
            <a className="py-3 border-b border-white/5 text-on-surface-variant hover:text-primary" href="/user/service-request.html" data-i18n="nav_repair">แจ้งซ่อม</a>
            <a className="py-3 border-b border-white/5 text-on-surface-variant hover:text-primary" href="#videos" data-i18n="nav_videos">วิดีโอ</a>
            <a className="py-3 border-b border-white/5 text-on-surface-variant hover:text-primary" href="#contact" data-i18n="nav_contact">ติดต่อเรา</a>
            <a className="py-3 text-primary font-bold" href="/main/inquiry.html" data-i18n="cta_quote">ขอใบเสนอราคา →</a>
          </div>
        </div>
      </header>

      <main className="pt-24">
        {/* HERO — FIXED: this <section> tag was truncated/missing in the broken deploy */}
        <section
          id="hero"
          className="relative px-margin-desktop max-w-container-max min-h-[80vh] grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center mx-auto"
        >
          <div className="z-10 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-panel border-primary/20 text-primary-container text-label-caps uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              One Stop Industrial Supply &amp; Service
            </div>
            <h1 className="font-headline-display text-4xl sm:text-5xl lg:text-headline-display text-white leading-tight">
              LUNGCHAI CHAIYO ALL
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto lg:mx-0" data-i18n="hero_desc">
              เรารวมสินค้า เทคโนโลยี และบริการ เพื่อช่วยให้ธุรกิจ โรงงาน และองค์กร ทำงานได้ง่ายขึ้น
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
              <span className="text-xs px-3 py-1.5 rounded-full glass-panel text-on-surface-variant flex items-center gap-1.5">💻 IT Solution</span>
              <span className="text-xs px-3 py-1.5 rounded-full glass-panel text-on-surface-variant flex items-center gap-1.5">🏭 Industrial Supply</span>
              <span className="text-xs px-3 py-1.5 rounded-full glass-panel text-on-surface-variant flex items-center gap-1.5">🔧 Technical Service</span>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <a href="/main/inquiry.html" className="btn-glossy px-10 py-4 rounded-xl font-bold sun-flare-hover flex items-center gap-2">
                <span className="material-symbols-outlined">request_quote</span>
                <span data-i18n="hero_cta1">ขอใบเสนอราคา</span>
              </a>
              <a href="/main/catalog.html" className="btn-glossy-outline px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-all">
                <span data-i18n="hero_cta2">แคตตาล็อกสินค้า</span>
              </a>
            </div>
          </div>

          {/* Orbital badge */}
          <div className="relative flex justify-center items-center py-10 lg:py-0">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="relative floating-ui">
              <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border border-white/10 flex items-center justify-center relative">
                <div className="absolute inset-4 rounded-full border border-primary/20 spin-slow"></div>
                <div className="absolute inset-10 rounded-full border border-dashed border-secondary/20 spin-slow-rev"></div>
                <div className="glass-panel w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full flex items-center justify-center overflow-hidden border-2 border-primary/40 shadow-[0_0_60px_rgba(184,252,75,0.25)]">
                  <img src="/images/logo-all.jpg" alt="Lungchai Chaiyo All" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-2 right-4 sm:right-8 glass-panel px-3 py-2 rounded-xl text-[11px] font-bold text-primary floating-ui">💻 IT</div>
                <div className="absolute -bottom-2 left-2 sm:left-6 glass-panel px-3 py-2 rounded-xl text-[11px] font-bold text-secondary floating-ui">🏭 Industrial</div>
                <div className="absolute top-1/2 -right-6 glass-panel px-3 py-2 rounded-xl text-[11px] font-bold text-orbital-yellow hidden md:block floating-ui">🔧 Service</div>
              </div>
            </div>
          </div>
        </section>

        {/* OUR SOLUTIONS */}
        <section id="solutions" className="py-section-gap px-margin-desktop max-w-container-max mx-auto scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-headline-lg text-headline-lg text-white mb-3" data-i18n="solutions_title">Business Solutions</h2>
            <p className="text-on-surface-variant text-body-lg" data-i18n="solutions_sub">โซลูชันสำหรับธุรกิจ โรงงาน และองค์กร</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-8 rounded-2xl flex flex-col group hover:border-primary/50 transition-all">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-4xl">computer</span>
              </div>
              <h3 className="font-headline-lg text-lg text-white mb-1" data-i18n="card1_title">LUNGCHAI IT SOLUTION</h3>
              <p className="text-primary-container text-sm font-bold mb-3" data-i18n="card1_sub">ระบบเทคโนโลยีสารสนเทศ</p>
              <p className="text-on-surface-variant text-sm mb-4" data-i18n="card1_desc">จำหน่ายและติดตั้งระบบ IT สำหรับองค์กรและโรงงาน</p>
              <ul className="text-on-surface-variant text-sm space-y-1.5 mb-6">
                <li>✓ Computer</li><li>✓ Network</li><li>✓ Printer</li><li>✓ CCTV</li><li>✓ Server</li><li>✓ IT Support</li>
              </ul>
              <a href="/main/catalog.html" className="mt-auto btn-glossy px-6 py-3 rounded-xl font-bold text-center sun-flare-hover" data-i18n="btn_detail">ดูรายละเอียด</a>
            </div>
            <div className="glass-panel p-8 rounded-2xl flex flex-col group hover:border-secondary/50 transition-all">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-secondary text-4xl">precision_manufacturing</span>
              </div>
              <h3 className="font-headline-lg text-lg text-white mb-1" data-i18n="card2_title">LUNGCHAI INDUSTRIAL</h3>
              <p className="text-secondary text-sm font-bold mb-3" data-i18n="card2_sub">Industrial Supply &amp; Service</p>
              <p className="text-on-surface-variant text-sm mb-4" data-i18n="card2_desc">สินค้าและบริการสำหรับภาคอุตสาหกรรม</p>
              <ul className="text-on-surface-variant text-sm space-y-1.5 mb-6">
                <li>✓ อุปกรณ์โรงงาน</li><li>✓ ระบบไฟฟ้า</li><li>✓ Control System</li><li>✓ Installation</li><li>✓ Maintenance</li>
              </ul>
              <a href="/main/catalog.html" className="mt-auto btn-glossy px-6 py-3 rounded-xl font-bold text-center sun-flare-hover" data-i18n="btn_detail">ดูรายละเอียด</a>
            </div>
            <div className="glass-panel p-8 rounded-2xl flex flex-col group hover:border-orbital-yellow/50 transition-all">
              <div className="w-16 h-16 rounded-full bg-orbital-yellow/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-orbital-yellow text-4xl">build</span>
              </div>
              <h3 className="font-headline-lg text-lg text-white mb-1" data-i18n="card3_title">LUNGCHAI SERVICE</h3>
              <p className="text-orbital-yellow text-sm font-bold mb-3" data-i18n="card3_sub">Technical Service</p>
              <p className="text-on-surface-variant text-sm mb-4" data-i18n="card3_desc">บริการช่างและงานติดตั้ง</p>
              <ul className="text-on-surface-variant text-sm space-y-1.5 mb-6">
                <li>✓ ซ่อมอุปกรณ์</li><li>✓ ติดตั้งระบบ</li><li>✓ ตรวจสอบหน้างาน</li><li>✓ Maintenance</li>
              </ul>
              <a href="/user/service-request.html" className="mt-auto btn-glossy px-6 py-3 rounded-xl font-bold text-center sun-flare-hover" data-i18n="btn_service_request">แจ้งบริการ</a>
            </div>
          </div>
        </section>

        {/* PRODUCT CATEGORIES */}
        <section id="products" className="py-section-gap px-margin-desktop max-w-container-max mx-auto scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-headline-lg text-headline-lg text-white mb-3" data-i18n="products_title">Products</h2>
            <p className="text-on-surface-variant text-body-lg" data-i18n="products_sub">สินค้าเทคโนโลยีและอุปกรณ์สำหรับธุรกิจ</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <a href="/main/catalog.html" className="glass-panel p-5 rounded-xl text-center hover:border-primary/50 transition-all flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">devices</span>
              <span className="text-on-surface-variant text-sm font-medium">IT Equipment</span>
            </a>
            <a href="/main/catalog.html" className="glass-panel p-5 rounded-xl text-center hover:border-primary/50 transition-all flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">router</span>
              <span className="text-on-surface-variant text-sm font-medium">Network</span>
            </a>
            <a href="/main/catalog.html" className="glass-panel p-5 rounded-xl text-center hover:border-primary/50 transition-all flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">videocam</span>
              <span className="text-on-surface-variant text-sm font-medium">CCTV Security</span>
            </a>
            <a href="/main/catalog.html" className="glass-panel p-5 rounded-xl text-center hover:border-primary/50 transition-all flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
              <span className="text-on-surface-variant text-sm font-medium">Electrical Equipment</span>
            </a>
            <a href="/main/catalog.html" className="glass-panel p-5 rounded-xl text-center hover:border-primary/50 transition-all flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">factory</span>
              <span className="text-on-surface-variant text-sm font-medium">Industrial Supply</span>
            </a>
            <a href="/main/catalog.html" className="glass-panel p-5 rounded-xl text-center hover:border-primary/50 transition-all flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">print</span>
              <span className="text-on-surface-variant text-sm font-medium">Office Equipment</span>
            </a>
          </div>
        </section>

        {/* VIDEO SHOWCASE */}
        <section id="videos" className="py-section-gap px-margin-desktop max-w-container-max mx-auto scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-headline-lg text-headline-lg text-white mb-3">วิดีโอจากช่อง ลุงชัย ไชโย</h2>
            <p className="text-on-surface-variant text-body-lg">อัปเดตความรู้ เทคนิคช่าง และเบื้องหลังงานของเราแบบสดๆ</p>
          </div>
          <div className="glass-panel p-3 sm:p-4 rounded-3xl relative overflow-hidden">
            <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full rounded-2xl"
                src="https://www.youtube.com/embed/videoseries?list=UUMgf0_HZwMM4ySb_OuPHAkQ"
                title="ลุงชัย ไชโย — YouTube"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="flex justify-center mt-4">
              <a href="https://www.youtube.com/@chai147258" target="_blank" rel="noopener" className="btn-glossy px-8 py-3 rounded-xl font-bold sun-flare-hover flex items-center gap-2">
                <span className="material-symbols-outlined">smart_display</span>
                <span data-i18n="videos_cta">ดูทุกวิดีโอบน YouTube</span>
              </a>
            </div>
          </div>
        </section>

        {/* BUSINESS ECOSYSTEM */}
        <section id="ecosystem" className="py-section-gap px-margin-desktop max-w-container-max mx-auto scroll-mt-24">
          <div className="glass-panel rounded-3xl p-8 md:p-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="font-headline-lg text-headline-lg text-white mb-3" data-i18n="ecosystem_title">LUNGCHAI BUSINESS ECOSYSTEM</h2>
              <p className="text-on-surface-variant text-body-lg" data-i18n="ecosystem_desc">ระบบธุรกิจที่เชื่อมโยง สินค้า บริการ เทคโนโลยี และเครือข่ายผู้เชี่ยวชาญ เพื่อสร้างประสบการณ์บริการครบวงจร</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="glass-panel px-6 py-3 rounded-full text-white font-bold border border-primary/30">CUSTOMER</div>
              <span className="material-symbols-outlined text-on-surface-variant">arrow_downward</span>
              <div className="glass-panel px-8 py-3 rounded-full text-primary font-bold border border-primary/40">LUNGCHAI PLATFORM</div>
              <span className="material-symbols-outlined text-on-surface-variant">arrow_downward</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
                <div className="glass-panel px-4 py-4 rounded-2xl text-center text-primary font-bold border border-primary/20">IT</div>
                <div className="glass-panel px-4 py-4 rounded-2xl text-center text-orbital-yellow font-bold border border-orbital-yellow/20">SERVICE</div>
                <div className="glass-panel px-4 py-4 rounded-2xl text-center text-secondary font-bold border border-secondary/20">INDUSTRIAL</div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">arrow_downward</span>
              <div className="glass-panel px-6 py-3 rounded-full text-on-surface-variant font-bold">PARTNER NETWORK</div>
            </div>
          </div>
        </section>

        {/* SERVICE PROCESS */}
        <section className="py-section-gap px-margin-desktop max-w-container-max mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-white text-center mb-12" data-i18n="process_title">ขั้นตอนการให้บริการ</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl text-center relative">
              <div className="w-10 h-10 rounded-full bg-primary text-black font-bold flex items-center justify-center mx-auto mb-3">1</div>
              <h3 className="text-white font-bold mb-1" data-i18n="step1_title">ติดต่อเรา</h3>
              <p className="text-on-surface-variant text-sm" data-i18n="step1_desc">ลูกค้าแจ้งความต้องการ</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl text-center relative">
              <div className="w-10 h-10 rounded-full bg-primary text-black font-bold flex items-center justify-center mx-auto mb-3">2</div>
              <h3 className="text-white font-bold mb-1" data-i18n="step2_title">ประเมินงาน</h3>
              <p className="text-on-surface-variant text-sm" data-i18n="step2_desc">วิเคราะห์สินค้า / บริการ</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl text-center relative">
              <div className="w-10 h-10 rounded-full bg-primary text-black font-bold flex items-center justify-center mx-auto mb-3">3</div>
              <h3 className="text-white font-bold mb-1" data-i18n="step3_title">ดำเนินงาน</h3>
              <p className="text-on-surface-variant text-sm" data-i18n="step3_desc">ติดตั้ง ซ่อม หรือส่งมอบสินค้า</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl text-center relative">
              <div className="w-10 h-10 rounded-full bg-primary text-black font-bold flex items-center justify-center mx-auto mb-3">4</div>
              <h3 className="text-white font-bold mb-1" data-i18n="step4_title">บริการหลังการขาย</h3>
              <p className="text-on-surface-variant text-sm" data-i18n="step4_desc">ติดตามและดูแลต่อเนื่อง</p>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="py-section-gap px-margin-desktop max-w-container-max mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-white text-center mb-12" data-i18n="why_title">ทำไมเลือกเรา</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-3 block">hub</span>
              <h3 className="text-white font-bold mb-1" data-i18n="why1_title">One Stop Solution</h3>
              <p className="text-on-surface-variant text-sm" data-i18n="why1_desc">ครบทั้งสินค้าและบริการ</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl text-center">
              <span className="material-symbols-outlined text-secondary text-4xl mb-3 block">memory</span>
              <h3 className="text-white font-bold mb-1" data-i18n="why2_title">Technology Driven</h3>
              <p className="text-on-surface-variant text-sm" data-i18n="why2_desc">ใช้เทคโนโลยีเพิ่มประสิทธิภาพ</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl text-center">
              <span className="material-symbols-outlined text-orbital-yellow text-4xl mb-3 block">verified</span>
              <h3 className="text-white font-bold mb-1" data-i18n="why3_title">Professional Service</h3>
              <p className="text-on-surface-variant text-sm" data-i18n="why3_desc">ทำงานเป็นระบบ ตรวจสอบได้</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl text-center">
              <span className="material-symbols-outlined text-primary-fixed text-4xl mb-3 block">handshake</span>
              <h3 className="text-white font-bold mb-1" data-i18n="why4_title">Business Partnership</h3>
              <p className="text-on-surface-variant text-sm" data-i18n="why4_desc">เติบโตไปพร้อมกับลูกค้า</p>
            </div>
          </div>
        </section>

        {/* COMING SOON PLATFORM */}
        <section className="py-section-gap px-margin-desktop max-w-container-max mx-auto">
          <div className="glass-panel rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <span className="absolute top-4 right-4 text-[10px] px-3 py-1 rounded-full bg-white/10 text-white/60 font-bold tracking-wider">COMING SOON</span>
            <h2 className="font-headline-lg text-headline-lg text-white mb-3" data-i18n="coming_title">Coming Soon — Digital Business Platform</h2>
            <p className="text-on-surface-variant text-body-lg max-w-xl mx-auto mb-6" data-i18n="coming_desc">เรากำลังพัฒนาระบบดิจิทัลเพื่อเชื่อมต่อสินค้า บริการ และเครือข่ายธุรกิจในอนาคต</p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-xs px-3 py-1.5 rounded-full glass-panel text-on-surface-variant">✓ Service Platform</span>
              <span className="text-xs px-3 py-1.5 rounded-full glass-panel text-on-surface-variant">✓ Customer Portal</span>
              <span className="text-xs px-3 py-1.5 rounded-full glass-panel text-on-surface-variant">✓ Business Automation</span>
              <span className="text-xs px-3 py-1.5 rounded-full glass-panel text-on-surface-variant">✓ Partner Network</span>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-section-gap px-margin-desktop max-w-container-max mx-auto scroll-mt-24">
          <div className="glass-panel rounded-3xl p-8 md:p-12 text-center">
            <h2 className="font-headline-lg text-headline-lg text-white mb-3" data-i18n="contact_title">ติดต่อ LUNGCHAI CHAIYO ALL</h2>
            <p className="text-on-surface-variant text-body-lg max-w-xl mx-auto mb-8" data-i18n="contact_desc">สนใจสินค้า บริการ หรือโซลูชันธุรกิจ ติดต่อทีมงานของเราได้วันนี้</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://line.me/R/ti/p/@971yzyyd" target="_blank" rel="noopener" className="btn-glossy px-8 py-3.5 rounded-xl font-bold sun-flare-hover flex items-center gap-2">
                <span className="material-symbols-outlined">chat</span> LINE Official
              </a>
              <a href="https://www.facebook.com/lungchai147258" target="_blank" rel="noopener" className="btn-glossy-outline px-8 py-3.5 rounded-xl font-bold sun-flare-hover flex items-center gap-2">
                <span className="material-symbols-outlined">forum</span> Facebook
              </a>
              <a href="/user/service-request.html" className="btn-glossy-outline px-8 py-3.5 rounded-xl font-bold sun-flare-hover flex items-center gap-2" data-i18n="nav_repair">
                แจ้งซ่อม
              </a>
              <a href="/main/inquiry.html" className="btn-glossy px-8 py-3.5 rounded-xl font-bold sun-flare-hover flex items-center gap-2">
                <span className="material-symbols-outlined">request_quote</span> <span data-i18n="cta_quote">ขอใบเสนอราคา</span>
              </a>
            </div>
          </div>
        </section>

        {/* SEARCH HUB */}
        <section className="pb-section-gap px-margin-desktop max-w-container-max mx-auto">
          <div className="glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 hidden md:block">
              <span className="material-symbols-outlined text-9xl">search</span>
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="font-headline-lg text-headline-lg text-white mb-6">Search Hub</h2>
              <form className="flex flex-col md:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                <div className="flex-grow relative">
                  <input
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-12 py-4 text-white focus:border-primary focus:ring-0 transition-all"
                    placeholder="ค้นหาบริการ / สินค้าอุตสาหกรรม..."
                    type="text"
                    name="q"
                  />
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                </div>
                <button type="submit" className="btn-glossy px-12 py-4 rounded-xl font-bold sun-flare-hover">ค้นหาเดี๋ยวนี้</button>
              </form>
              <div className="mt-4 flex flex-wrap gap-3 items-center">
                <span className="text-on-surface-variant text-sm">ยอดนิยม:</span>
                <a className="text-primary-container hover:underline text-sm" href="/main/catalog.html">คอมพิวเตอร์</a>
                <a className="text-primary-container hover:underline text-sm" href="/user/service-request.html">ซ่อมเครื่องพิมพ์</a>
                <a className="text-primary-container hover:underline text-sm" href="/main/catalog.html">กล้องวงจรปิด</a>
                <a className="text-primary-container hover:underline text-sm" href="/main/catalog.html">PPE Safety</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-void-black border-t border-glass-stroke w-full py-12 px-margin-desktop">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/images/logo-all.jpg" alt="Lungchai Chaiyo All" className="w-9 h-9 rounded-lg object-cover border border-primary/30" />
              <div className="font-headline-md text-headline-md text-primary font-bold">LUNGCHAI CHAIYO ALL</div>
            </div>
            <p className="text-on-surface-variant text-body-md" data-i18n="footer_tagline">สินค้า เทคโนโลยี และบริการครบวงจรสำหรับโรงงาน ธุรกิจ และองค์กร</p>
            <div className="flex gap-4">
              <a className="text-secondary hover:text-primary transition-all" href="https://www.facebook.com/lungchai147258" target="_blank" rel="noopener" aria-label="Facebook"><span className="material-symbols-outlined">public</span></a>
              <a className="text-secondary hover:text-primary transition-all" href="https://www.instagram.com/lungchaimarket" target="_blank" rel="noopener" aria-label="Instagram"><span className="material-symbols-outlined">photo_camera</span></a>
              <a className="text-secondary hover:text-primary transition-all" href="https://www.tiktok.com/@lungchai147258" target="_blank" rel="noopener" aria-label="TikTok"><span className="material-symbols-outlined">music_note</span></a>
              <a className="text-secondary hover:text-primary transition-all" href="https://line.me/R/ti/p/@971yzyyd" target="_blank" rel="noopener" aria-label="LINE"><span className="material-symbols-outlined">chat</span></a>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="text-white font-bold mb-4" data-i18n="footer_services">บริการหลัก</h5>
            <ul className="space-y-2 text-on-surface-variant text-body-md">
              <li><a className="hover:text-primary transition-colors" href="/main/catalog.html">IT &amp; Computer</a></li>
              <li><a className="hover:text-primary transition-colors" href="/user/service-request.html">ซ่อมเครื่องพิมพ์</a></li>
              <li><a className="hover:text-primary transition-colors" href="/main/catalog.html">อุปกรณ์ไฟฟ้า</a></li>
              <li><a className="hover:text-primary transition-colors" href="/main/catalog.html">ติดตั้งกล้องวงจรปิด</a></li>
              <li><a className="hover:text-primary transition-colors" href="/main/catalog.html">PPE &amp; Safety</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-white font-bold mb-4" data-i18n="footer_links">ลิงก์ที่เป็นประโยชน์</h5>
            <ul className="space-y-2 text-on-surface-variant text-body-md">
              <li><a className="hover:text-secondary transition-colors" href="/">หน้าแรก</a></li>
              <li><a className="hover:text-secondary transition-colors" href="/main/catalog.html">สินค้าทั้งหมด</a></li>
              <li><a className="hover:text-secondary transition-colors" href="/user/member.html">สมัครสมาชิก</a></li>
              <li><a className="hover:text-secondary transition-colors" href="/main/inquiry.html">ขอใบเสนอราคา</a></li>
              <li><a className="hover:text-secondary transition-colors" href="/user/service-request.html">แจ้งซ่อมออนไลน์</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-white font-bold mb-4" data-i18n="footer_contact">ติดต่อเรา</h5>
            <p className="text-on-surface-variant text-body-md leading-relaxed">
              LUNGCHAI CHAIYO ALL<br />
              เปิดบริการ จันทร์–เสาร์: 08:00–18:00<br />
              ออนไลน์: ตลอด 24 ชั่วโมง
            </p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Copyright</p>
              <p className="text-secondary font-bold text-body-md">© 2026 LUNGCHAI CHAIYO ALL. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Language switcher (unchanged vanilla-JS logic, loaded after hydration) */}
      <Script id="lang-switcher" strategy="afterInteractive" src="/lang-switcher.js" />

      {/* Galaxy canvas background animation */}
      <Script id="galaxy-canvas" strategy="afterInteractive">{`
        (function(){
          const C = document.getElementById('galaxy');
          if(!C) return;
          const ctx = C.getContext('2d');
          let W, H, stars = [], comets = [];
          function resize(){ W = C.width = window.innerWidth; H = C.height = window.innerHeight; initStars(); }
          function initStars(){
            stars = [];
            for(let i=0;i<400;i++) stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*.7+.1,a:Math.random(),da:(Math.random()-.5)*.003,type:'d'});
            for(let i=0;i<150;i++) stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.5,a:Math.random(),da:(Math.random()-.5)*.005,type:Math.random()>.75?'g':'w'});
            for(let i=0;i<22;i++) stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2+1.2,a:Math.random(),da:(Math.random()-.5)*.003,type:'b',gold:Math.random()>.45});
          }
          function spawnComet(){
            if(comets.length<6 && Math.random()<.006){
              const fromLeft = Math.random()>.5;
              comets.push({x: fromLeft ? -60 : W+60, y: Math.random()*H*.65, vx: fromLeft ? 5+Math.random()*5 : -(5+Math.random()*5), vy: .6+Math.random()*1.8, life:1, tail:140+Math.random()*180, gold:Math.random()>.35});
            }
          }
          function draw(){
            ctx.clearRect(0,0,W,H);
            const nebulae=[{cx:.12,cy:.18,rx:W*.45,ry:H*.38,col:'40,25,180',a:.22},{cx:.82,cy:.72,rx:W*.5,ry:H*.4,col:'90,15,160',a:.18},{cx:.5,cy:.45,rx:W*.6,ry:H*.55,col:'0,70,200',a:.14},{cx:.05,cy:.85,rx:W*.35,ry:H*.3,col:'0,160,200',a:.12},{cx:.92,cy:.08,rx:W*.3,ry:H*.25,col:'180,15,70',a:.13},{cx:.5,cy:.5,rx:W*.3,ry:H*.3,col:'80,40,255',a:.1}];
            nebulae.forEach(n=>{
              const g=ctx.createRadialGradient(n.cx*W,n.cy*H,0,n.cx*W,n.cy*H,Math.max(n.rx,n.ry));
              g.addColorStop(0,'rgba('+n.col+','+n.a+')'); g.addColorStop(.5,'rgba('+n.col+','+(n.a*.4)+')'); g.addColorStop(1,'rgba('+n.col+',0)');
              ctx.save(); ctx.scale(1,n.ry/n.rx);
              ctx.beginPath(); ctx.arc(n.cx*W,(n.cy*H)*(n.rx/n.ry),n.rx,0,Math.PI*2);
              ctx.fillStyle=g; ctx.fill(); ctx.restore();
            });
            stars.forEach(s=>{
              s.a+=s.da; if(s.a<=0||s.a>=1) s.da*=-1;
              if(s.type==='d'){ ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle='rgba(200,200,240,'+(s.a*.3)+')'; ctx.fill(); }
              else if(s.type==='g'){ ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle='rgba(201,168,76,'+(s.a*.8)+')'; ctx.fill(); }
              else if(s.type==='w'){ ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle='rgba(210,220,255,'+(s.a*.65)+')'; ctx.fill(); }
              else if(s.type==='b'){
                const col=s.gold?'201,168,76':'210,225,255'; const al=s.a*.95;
                ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle='rgba('+col+','+al+')'; ctx.fill();
                const h2=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*6);
                h2.addColorStop(0,'rgba('+col+','+(al*.5)+')'); h2.addColorStop(1,'rgba('+col+',0)');
                ctx.beginPath(); ctx.arc(s.x,s.y,s.r*6,0,Math.PI*2); ctx.fillStyle=h2; ctx.fill();
                ctx.save(); ctx.globalAlpha=al*.4; ctx.strokeStyle='rgba('+col+',1)'; ctx.lineWidth=.6;
                const fl=s.r*10;
                ctx.beginPath(); ctx.moveTo(s.x-fl,s.y); ctx.lineTo(s.x+fl,s.y); ctx.moveTo(s.x,s.y-fl); ctx.lineTo(s.x,s.y+fl); ctx.stroke(); ctx.restore();
              }
            });
            spawnComet();
            comets=comets.filter(c=>c.life>0 && c.x>-300 && c.x<W+300);
            comets.forEach(c=>{
              const col=c.gold?'255,220,80':'180,210,255';
              const steps=c.tail/Math.max(Math.abs(c.vx),1);
              const grd=ctx.createLinearGradient(c.x-c.vx*steps,c.y-c.vy*steps,c.x,c.y);
              grd.addColorStop(0,'rgba('+col+',0)'); grd.addColorStop(.6,'rgba('+col+','+(c.life*.25)+')'); grd.addColorStop(1,'rgba('+col+','+c.life+')');
              ctx.beginPath(); ctx.strokeStyle=grd; ctx.lineWidth=2;
              ctx.moveTo(c.x-c.vx*steps,c.y-c.vy*steps); ctx.lineTo(c.x,c.y); ctx.stroke();
              const hg=ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,8);
              hg.addColorStop(0,'rgba('+col+','+c.life+')'); hg.addColorStop(1,'rgba('+col+',0)');
              ctx.beginPath(); ctx.arc(c.x,c.y,8,0,Math.PI*2); ctx.fillStyle=hg; ctx.fill();
              c.x+=c.vx; c.y+=c.vy; c.life-=.007;
            });
            requestAnimationFrame(draw);
          }
          window.addEventListener('resize',resize);
          resize(); draw();
        })();
      `}</Script>

      <Script src="/assets/lungchai-launcher.js" strategy="afterInteractive" />
      <Script src="/chatbot.js" strategy="afterInteractive" />
    </>
  );
}
