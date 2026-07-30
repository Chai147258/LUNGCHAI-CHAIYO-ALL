import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function HomePage() {
  const { data: sections } = await supabase
    .from("cms_sections")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: true });

  const { data: businessUnits } = await supabase
    .from("cms_business_units")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  const { data: buttons } = await supabase
    .from("cms_gateway_buttons")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });


  return (
    <main className="min-h-screen p-8">

      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold">
          LUNGCHAI CHAIYO ALL
        </h1>

        <p className="mt-4 text-xl">
          One Platform. Everything Business.
        </p>
      </section>


      {/* CMS Sections */}
      <section className="grid gap-6">
        {sections?.map((item:any)=>(
          <div 
            key={item.id}
            className="border rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold">
              {item.title}
            </h2>

            <p>
              {item.subtitle}
            </p>
          </div>
        ))}
      </section>


      {/* Business Units */}
      <section className="mt-12">

        <h2 className="text-3xl font-bold mb-6">
          Business Units
        </h2>

        <div className="grid md:grid-cols-3 gap-5">

        {businessUnits?.map((item:any)=>(
          <div
            key={item.id}
            className="border rounded-xl p-5"
          >
            <h3 className="text-xl font-bold">
              {item.name}
            </h3>

            <p>
              {item.description}
            </p>
          </div>
        ))}

        </div>

      </section>


      {/* Gateway */}
      <section className="mt-12">

        <h2 className="text-3xl font-bold mb-6">
          Services
        </h2>


        <div className="grid md:grid-cols-4 gap-4">

        {buttons?.map((item:any)=>(
          <a
            key={item.id}
            href={item.url}
            className="border rounded-xl p-5 text-center"
          >
            {item.title}
          </a>
        ))}

        </div>

      </section>

    </main>
  );
}