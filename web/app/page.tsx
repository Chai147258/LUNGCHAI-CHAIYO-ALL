export default function Home() {
  return (
    <main className="min-h-screen text-white bg-black overflow-hidden">

      {/* Background */}
      <div
        className="
        fixed inset-0
        bg-gradient-to-br
        from-emerald-900
        via-black
        to-slate-950
        -z-10
        "
      />

      {/* Header */}
      <header
        className="
        flex items-center justify-between
        px-5 py-4
        backdrop-blur-md
        bg-white/5
        border-b border-white/10
        "
      >

        <div className="font-bold text-lg md:text-xl">
          🚀 LUNGCHAI CHAIYO ECO Platform
        </div>


        <div className="hidden md:flex gap-5 text-sm">

          <button>
            🌐 ภาษา
          </button>

          <button>
            เข้าสู่ระบบ
          </button>

          <button>
            สมัครสมาชิก
          </button>

          <button>
            ลืมรหัส
          </button>

          <button>
            ☰ เมนู
          </button>

        </div>


        <button className="md:hidden">
          ☰
        </button>

      </header>



      {/* Hero */}
      <section
        className="
        flex flex-col
        items-center
        text-center
        px-6
        py-16
        "
      >

        <h1
          className="
          text-4xl
          md:text-6xl
          font-bold
          leading-tight
          "
        >

          LUNGCHAI CHAIYO ALL

          <br />

          <span className="text-emerald-400">
            One Platform.
          </span>

          <br />

          Everything Business.

        </h1>


        <p
          className="
          mt-6
          text-gray-300
          max-w-xl
          "
        >
          เชื่อมต่อสินค้า บริการ เทคโนโลยี
          และเครือข่ายธุรกิจในแพลตฟอร์มเดียว
        </p>



        {/* Youtube */}
        <div
          className="
          mt-10
          w-full
          max-w-3xl
          aspect-video
          rounded-3xl
          bg-white/10
          backdrop-blur
          border border-white/20
          flex items-center justify-center
          "
        >

          🎬 YouTube Channel

        </div>




        {/* Main Button */}
        <button
          className="
          mt-10
          px-10 py-4
          rounded-full
          bg-emerald-400
          text-black
          font-bold
          hover:scale-105
          transition
          "
        >

          เข้าสู่เว็บไซต์หลัก

        </button>




        {/* Service Cards */}

        <div
          className="
          grid
          md:grid-cols-2
          gap-5
          mt-8
          w-full
          max-w-xl
          "
        >


          <button
            className="
            p-6
            rounded-2xl
            bg-white/10
            border border-white/20
            backdrop-blur
            hover:bg-white/20
            "
          >

            <div className="text-3xl">
              🛠
            </div>

            <div className="font-bold mt-2">
              ช่างใกล้ฉัน
            </div>

            <div className="text-sm text-gray-300">
              ค้นหาช่างบริการใกล้พื้นที่
            </div>

          </button>




          <button
            className="
            p-6
            rounded-2xl
            bg-white/10
            border border-white/20
            backdrop-blur
            hover:bg-white/20
            "
          >

            <div className="text-3xl">
              📋
            </div>

            <div className="font-bold mt-2">
              แจ้งซ่อม-ติดตามงาน
            </div>

            <div className="text-sm text-gray-300">
              ตรวจสอบสถานะงานซ่อม
            </div>

          </button>


        </div>




        <button
          className="
          mt-6
          px-8 py-3
          rounded-xl
          bg-white/10
          border border-white/20
          "
        >

          👤 สมัครสมาชิก

        </button>


      </section>





      {/* Works & Review */}

      <section
        className="
        px-6
        py-16
        "
      >

        <h2
          className="
          text-3xl
          font-bold
          text-center
"
>
         