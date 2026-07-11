async function loadServices(){

    const { data, error } = await supabaseClient
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("id");

    if(error){
        console.error(error);
        return;
    }

    const box = document.getElementById("service-list");

    if(!box) return;

    box.innerHTML = "";

    data.forEach(service => {

        box.innerHTML += `
        <div class="service-card">

            <div class="icon">
                ${service.icon ?? "🛠️"}
            </div>

            <h3>${service.name}</h3>

            <p>${service.description ?? ""}</p>

            <p>
            ราคาเริ่มต้น 
            <b>${service.normal_price} บาท</b>
            </p>

            <button onclick="selectService(${service.id})">
                แจ้งซ่อม
            </button>

        </div>
        `;

    });
}


function selectService(id){

    localStorage.setItem(
        "selected_service",
        id
    );

    window.location.href="repair.html";

}


document.addEventListener(
"DOMContentLoaded",
loadServices
);