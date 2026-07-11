console.log("repair.js เริ่มทำงาน");


document
.getElementById("repairForm")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const serviceId = localStorage.getItem("selected_service");

    const name = document.getElementById("customer_name").value;
    const phone = document.getElementById("customer_phone").value;
    const express = document.getElementById("express").checked;
    const note = document.getElementById("note").value;


    console.log({
        serviceId,
        name,
        phone,
        express,
        note
    });


    const { data, error } = await supabaseClient
    .from("service_requests")
    .insert([
        {
            service_id: Number(serviceId),
            request_number: "REQ-" + Date.now(),
            customer_name: name,
            customer_phone: phone,
            is_express: express,
            status: "pending",
            note: note,
            channel: "website"
        }
    ])
    .select();


    console.log("Supabase Result:", data, error);


    if(error){

        alert(
            "เกิดข้อผิดพลาด:\n" + error.message
        );

        return;
    }


    alert(
        "แจ้งซ่อมสำเร็จ\nเลขที่งาน: " 
    );


});