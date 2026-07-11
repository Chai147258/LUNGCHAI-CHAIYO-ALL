const serviceId =
localStorage.getItem("selected_service");


document
.getElementById("repairForm")
.addEventListener("submit", async(e)=>{

e.preventDefault();


const name =
document.getElementById("customer_name").value;


const phone =
document.getElementById("customer_phone").value;


const express =
document.getElementById("express").checked;


const note =
document.getElementById("note").value;



const requestNumber =
"REQ-" + Date.now();



const {data,error}=await supabaseClient
.from("service_requests")
.insert({

service_id: serviceId,

request_number: requestNumber,

customer_name:name,

customer_phone:phone,

is_express:express,

status:"pending",

note:note,

channel:"website"


})
.select();



if(error){

alert(error.message);

return;

}


alert(
"แจ้งซ่อมสำเร็จ เลขที่งาน "+requestNumber
);


window.location.href="index.html";


});