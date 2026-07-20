const SUPABASE_URL =
"https://YOUR_PROJECT.supabase.co";


const SUPABASE_KEY =
"YOUR_ANON_KEY";


const supabaseClient =
supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);


let technician_id=null;
let selectedSlot=null;


console.log("PROFILE JS START");


async function loadProfile(){


technician_id =
new URLSearchParams(
window.location.search
).get("id");


console.log(
"TECH ID:",
technician_id
);



const {data,error}=

await supabaseClient
.from("technician_public_profile")
.select("*")
.eq(
"technician_uuid",
technician_id
)
.single();



console.log(
"PROFILE DATA:",
data
);


console.log(
"PROFILE ERROR:",
error
);



if(error){

document.getElementById("profile")
.innerHTML =
error.message;

return;

}



document.getElementById("profile")
.innerHTML=`

<h2>
${data.full_name}
</h2>

<p>
${data.business_name}
</p>

<p>
⭐ ${data.avg_rating}
</p>

<p>
งานสำเร็จ ${data.completed_jobs}
</p>

`;



}



loadProfile();
