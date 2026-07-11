import { createClient }
from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";



const supabase =
createClient(

"YOUR_SUPABASE_URL",

"YOUR_ANON_KEY"

);



window.sendRequest =
async()=>{


let name =
document.getElementById("name").value;


let phone =
document.getElementById("phone").value;


let device =
document.getElementById("device").value;


let problem =
document.getElementById("problem").value;



const {data,error}=

await supabase

.from("service_requests")

.insert({

customer_name:name,

phone:phone,

device_type:device,

problem_detail:problem,

status:"รอรับงาน",

priority:"ปกติ"

});



if(error){

alert(error.message);

return;

}



alert(
"ส่งแจ้งซ่อมเรียบร้อย"
);



location.reload();


}