"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { supabase } from "../lib/supabase";

type LandingSettings = {
  logo_url: string;
  youtube_playlist_id: string;
  chatbot_heading: string;
  chatbot_subtext: string;
  register_link: string;
  login_link: string;
};

const DEFAULT_SETTINGS: LandingSettings = {
  logo_url: "/images/logo-all.jpg",
  youtube_playlist_id: "UUMgf0_HZwMM4ySb_OuPHAkQ",
  chatbot_heading: "แชทกับผู้ช่วย ลุงชัย",
  chatbot_subtext: "สอบถามสินค้า บริการ หรือแจ้งซ่อมได้ทันทีผ่านแชทบอทมุมขวาล่าง",
  register_link: "/register",
  login_link: "/login",
};

export default function Home() {
  const [settings, setSettings] = useState<LandingSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let active = true;
    supabase
      .from("landing_page_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (active && data) {
          setSettings({
            logo_url: data.logo_url ?? DEFAULT_SETTINGS.logo_url,
            youtube_playlist_id: data.youtube_playlist_id ?? DEFAULT_SETTINGS.youtube_playlist_id,
            chatbot_heading: data.chatbot_heading ?? DEFAULT_SETTINGS.chatbot_heading,
            chatbot_subtext: data.chatbot_subtext ?? DEFAULT_SETTINGS.chatbot_subtext,
            register_link: data.register_link ?? DEFAULT_SETTINGS.register_link,
            login_link: data.login_link ?? DEFAULT_SETTINGS.login_link,
          });
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      {/* STARFIELD / NEBULA BACKGROUND */}
      <canvas
        id="galaxy"
        style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", display: "block" }}
      />

      <main className="min-h-screen flex flex-col items-center px-6 py-12 gap-10">
        {/* LOGO */}
        <div className="flex flex-col items-center gap-4 pt-6">
          <div className="glass-panel w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center overflow-hidden border-2 border-primary/40 shadow-[0_0_60px_rgba(184,252,75,0.25)]">
            <img
              src={settings.logo_url}
              alt="Lungchai Chaiyo All"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold drop-shadow-[0_0_8px_rgba(152,203,255,0.5)] text-center">
            LUNGCHAI CHAIYO ALL
          </h1>
        </div>

        {/* LOGIN / REGISTER */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={settings.register_link}
            className="btn-glossy px-8 py-3 rounded-xl font-bold sun-flare-hover flex items-center gap-2"
          >
            <span className="material-symbols-outlined">person_add</span>
            สมัครสมาชิก
          </a>
          <a
            href={settings.login_link}
            className="btn-glossy-outline px-8 py-3 rounded-xl font-bold sun-flare-hover flex items-center gap-2"
          >
            <span className="material-symbols-outlined">login</span>
            เข้าสู่ระบบ
          </a>
        </div>

        {/* YOUTUBE VIDEO — CENTER */}
        <div className="w-full max-w-3xl glass-panel p-3 sm:p-4 rounded-3xl">
          <div
            className="relative w-full rounded-2xl overflow-hidden"
            style={{ paddingTop: "56.25%" }}
          >
            <iframe
              className="absolute inset-0 w-full h-full rounded-2xl"
              src={`https://www.youtube.com/embed/videoseries?list=${settings.youtube_playlist_id}`}
              title="ลุงชัย ไชโย — YouTube"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        {/* CHATBOT SECTION */}
        <div className="w-full max-w-3xl glass-panel p-6 rounded-3xl text-center space-y-3">
          <h2 className="font-headline-lg text-lg text-white font-bold flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-primary">smart_toy</span>
            {settings.chatbot_heading}
          </h2>
          <p className="text-on-surface-variant text-sm">{settings.chatbot_subtext}</p>
          <div id="chatbot-container" className="min-h-[80px] flex items-center justify-center">
            {/* chatbot widget mounts here via chatbot.js / lungchai-launcher.js */}
          </div>
        </div>
      </main>

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
