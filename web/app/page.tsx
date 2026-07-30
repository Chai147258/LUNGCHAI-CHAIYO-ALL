export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-950 via-black to-slate-950 text-white">

      {/* Header */}
      <header className="flex items-center justify-between p-5 border-b border-white/10">

        {/* Logo */}
        <div className="font-bold text-xl">
          🚀 LUNGCHAI CHAIYO ECO Platform
        </div>

        {/* Menu */}
        <nav className="hidden md:flex gap-5 items-center">
          <button>🌐 ภาษา</button>
          <button>เข้าสู่ระบบ</button>
          <button>สมัครสมาชิก</button>
          <button>ลืมรหัส</button>
          <button>☰ เมนู</button>
        </nav>

      </header>


      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">

        <h1 className="text-4xl md:text-6xl font-bold mb-5">
          One Platform.
          <br />
          Everything Business.
        </h1>

        <p className="text-gray-300 text-lg mb-10">
          LUNGCHAI CHAIYO ALL
        </p>


        {/* Youtube */}
        <div className="w-full max-w-3xl aspect-video bg-black/40 rounded-2xl border border-white/20 flex items-center justify-center mb-8">
          <p>
            🎬 YouTube Channel
          </p>
        </div>


        {/* Main Button */}
        <button className="bg-emerald-400 text-black font-bold px-10 py-4 rounded-full mb-5 hover:scale-105 transition">
          เข้าสู่เว็บไซต์หลัก
        </button>


        {/* Service Buttons */}
        <div className="flex flex-col md:flex-row gap-4">

          <button className="bg-white/10 backdrop-blur px-8 py-4 rounded-xl border border-white/20">
            🛠 ช่างใกล้ฉัน
          </button>

          <button className="bg-white/10 backdrop-blur px-8 py-4 rounded-xl border border-white/20">
            📋 แจ้งซ่อม-ติดตามงาน
          </button>

        </div>


        <button className="mt-5 bg-white/10 px-8 py-3 rounded-xl">
          👤 สมัครสมาชิก
        </button>


      </section>


      {/* Social */}
      <div className="fixed right-4 top-1/2 flex flex-col gap-3">

        <button>🔵</button>
        <button>🟢</button>
        <button>🔴</button>
        <button>🎵</button>

      </div>


      {/* AI BOT Floating */}
      <button
        className="
        fixed
        right-6
        bottom-6
        w-20
        h-20
        rounded-full
        bg-emerald-400
        text-black
        font-bold
        shadow-xl
        flex
        flex-col
        items-center
        justify-center
        "
      >
        🤖
        <span className="text-xs">
          AI BOT
        </span>

      </button>


      {/* Content */}
      <section className="px-6 py-16 text-center">

        <h2 className="text-3xl font-bold mb-8">
          สินค้า พร้อมจำหน่าย
        </h2>


        <div className="grid md:grid-cols-3 gap-5">

          <div className="bg-white/10 rounded-xl p-6">
            📦 สินค้า
          </div>

          <div className="bg-white/10 rounded-xl p-6">
            🛠 บริการ
          </div>

          <div className="bg-white/10 rounded-xl p-6">
            ⭐ รีวิวลูกค้า
          </div>

        </div>

      </section>


      {/* Footer */}
      <footer className="text-center border-t border-white/10 p-6 text-sm text-gray-400">

        © LUNGCHAI CHAIYO ECO Platform

        <br />

        ลิขสิทธิ์ | พ.ร.บ.คอมพิวเตอร์ | PDPA

      </footer>


    </main>
  );
}