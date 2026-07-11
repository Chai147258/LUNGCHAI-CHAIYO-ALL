import { createClient }
from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";



const supabase =
createClient(
"YOUR_SUPABASE_URL",
"YOUR_ANON_KEY"
);



//
// ตรวจ Login
//

const session =
await supabase.auth.getSession();


if(!session.data.session){

location.href="login.html";

}




//
// โหลดรายการแจ้งซ่อม
//

async function loadServices(){


const {data,error}=

await supabase

.from("service_requests")

.select(`
*
`)

.order(
"created_at",
{
ascending:false
}
);



if(error){

console.log(error);
return;

}



let html="";



data.forEach(item=>{


html += `

<tr>

<td>
${item.id}
</td>


<td>
${item.customer_id ?? "-"}
</td>


<td>
${item.device_type ?? "-"}
</td>


<td>
${item.problem_detail ?? "-"}
</td>


<td>


<select 
onchange="updateStatus('${item.id}',this.value)"
>


<option ${item.status=="รอรับงาน"?"selected":""}>
รอรับงาน
</option>


<option ${item.status=="รับเรื่องแล้ว"?"selected":""}>
รับเรื่องแล้ว
</option>


<option ${item.status=="กำลังซ่อม"?"selected":""}>
กำลังซ่อม
</option>


<option ${item.status=="เสร็จแล้ว"?"selected":""}>
เสร็จแล้ว
</option>


<option ${item.status=="ปิดงาน"?"selected":""}>
ปิดงาน
</option>


</select>


</td>



<td>

<button
onclick="
viewService('${item.id}')
">

ดู

</button>


</td>


</tr>

`;

});


document
.getElementById("serviceList")
.innerHTML=html;


}



loadServices();





//
// เปลี่ยนสถานะ
//

window.updateStatus = async(id,status)=>{


const {error}=

await supabase

.from("service_requests")

.update({

status:status

})

.eq(
"id",
id
);



if(error){

alert(error.message);

}
else{

alert("อัปเดตสถานะแล้ว");

loadServices();

}


}





//
// ดูรายละเอียด
//

window.viewService=(id)=>{


alert(
"เปิดรายละเอียดงาน : "+id
);


}




//
// Logout
//

window.logout=async()=>{


await supabase.auth.signOut();


location.href="login.html";


}