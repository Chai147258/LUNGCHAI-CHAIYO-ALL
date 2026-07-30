export default function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">
        LUNGCHAI ADMIN
      </h1>

      <div className="grid md:grid-cols-4 gap-4 mt-8">

        <div className="border p-5 rounded">
          Business Units
          <br />
          7
        </div>

        <div className="border p-5 rounded">
          Services
          <br />
          CMS
        </div>

        <div className="border p-5 rounded">
          Products
          <br />
          Catalog
        </div>

        <div className="border p-5 rounded">
          Repair Jobs
          <br />
          System
        </div>

      </div>
    </main>
  );
}
