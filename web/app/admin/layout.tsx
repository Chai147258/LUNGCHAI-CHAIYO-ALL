"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ok" | "denied">("checking");

  useEffect(() => {
    let active = true;

    async function check() {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        if (active) setStatus("denied");
        router.replace("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!active) return;

      const role = profile?.role;
      const isAdmin = !error && (role === "admin" || role === "superadmin");

      if (!isAdmin) {
        setStatus("denied");
        router.replace("/login");
        return;
      }

      setStatus("ok");
    }

    check();
    return () => {
      active = false;
    };
  }, [router]);

  if (status !== "ok") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-gray-400 text-sm">
        {status === "checking" ? "กำลังตรวจสอบสิทธิ์เข้าถึง..." : "ไม่มีสิทธิ์เข้าถึง กำลังนำไปหน้าเข้าสู่ระบบ..."}
      </main>
    );
  }

  return <>{children}</>;
}
