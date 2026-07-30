import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getDashboardData() {
  const [
    business,
    services,
    products,
    repairs,
  ] = await Promise.all([
    supabase
      .from("cms_business_units")
      .select("id", { count: "exact" }),

    supabase
      .from("service_catalog")
      .select("id", { count: "exact" }),

    supabase
      .from("products")
      .select("id", { count: "exact" }),

    supabase
      .from("repair_jobs")
      .select("id", { count: "exact" }),
  ]);

  return {
    business: business.count ?? 0,
    services: services.count ?? 0,
    products: products.count ?? 0,
    repairs: repairs.count ?? 0,
  };
}


export default async function AdminDashboardPage() {

  const data = await getDashboardData();

  return (
    <main className="min-h-screen bg-gray-50 p-8">

      <h1 className="text-3xl font-bold">
        LUNGCHAI ADMIN DASHBOARD
      </h1>

      <p className="mt-2 text-gray-600">
        CMS Management System
      </p>


      <div className="grid gap-6 mt-8 md:grid-cols-4">


        <DashboardCard
          title="Business Units"
          value={data.business}
        />


        <DashboardCard
          title="Services"
          value={data.services}
        />


        <DashboardCard
          title="Products"
          value={data.products}
        />


        <DashboardCard
          title="Repair Jobs"
          value={data.repairs}
        />


      </div>


      <section className="mt-10 bg-white rounded-xl p-6">

        <h2 className="text-xl font-bold mb-4">
          CMS MENU
        </h2>


        <div className="grid md:grid-cols-3 gap-4">


          <MenuCard
            title="Homepage CMS"
            link="/admin/content"
          />


          <MenuCard
            title="Business Units"
            link="/admin/business"
          />


          <MenuCard
            title="Services"
            link="/admin/services"
          />


          <MenuCard
            title="Products"
            link="/admin/products"
          />


          <MenuCard
            title="Media"
            link="/admin/media"
          />


        </div>

      </section>


    </main>
  );
}



function DashboardCard(
  {
    title,
    value
  }:{
    title:string;
    value:number;
  }
){

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <h3 className="text-gray-500">
        {title}
      </h3>

      <p className="text-4xl font-bold mt-3">
        {value}
      </p>

    </div>

  );
}



function MenuCard(
{
 title,
 link
}:{
 title:string;
 link:string;
}
){

return (

<a
 href={link}
 className="border rounded-lg p-5 hover:bg-gray-100"
>

{title}

</a>

);

}