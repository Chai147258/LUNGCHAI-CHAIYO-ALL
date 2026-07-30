export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-4 text-center">
        LUNGCHAI CHAIYO ALL
      </h1>

      <p className="text-xl mb-10 text-center">
        One Platform. Everything Business.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button className="bg-white text-black rounded-xl py-3 font-semibold">
          เข้าสู่เว็บไซต์หลัก
        </button>

        <button className="bg-white text-black rounded-xl py-3 font-semibold">
          ช่างใกล้ฉัน
        </button>

        <button className="bg-white text-black rounded-xl py-3 font-semibold">
          แจ้งซ่อม-ติดตามงาน
        </button>

        <button className="bg-white text-black rounded-xl py-3 font-semibold">
          สมัครสมาชิก
        </button>
      </div>
    </main>
  );
}