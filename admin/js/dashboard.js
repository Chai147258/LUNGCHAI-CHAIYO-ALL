// =============================
// Dashboard - Lungchai Chaiyo All
// =============================

document.addEventListener("DOMContentLoaded", initDashboard);

async function initDashboard() {

    // ตรวจสอบการ Login
    const { data: auth } = await supabaseClient.auth.getUser();

    if (!auth.user) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("adminName").innerHTML =
        auth.user.email;

    loadSummary();
    loadLatestJobs();
}

// ----------------------------
// สรุป Dashboard
// ----------------------------

async function loadSummary() {

    // งานทั้งหมด
    const { data: jobs } = await supabaseClient
        .from("service_requests")
        .select("status");

    let pending = 0;
    let working = 0;
    let completed = 0;

    jobs.forEach(j => {

        if (j.status === "pending")
            pending++;

        if (
            j.status === "confirmed" ||
            j.status === "in_progress"
        )
            working++;

        if (j.status === "completed")
            completed++;

    });

    document.getElementById("pendingCount").innerHTML = pending;
    document.getElementById("workingCount").innerHTML = working;
    document.getElementById("completedCount").innerHTML = completed;

    // ลูกค้า
    const { count } = await supabaseClient
        .from("customers")
        .select("*", { count: "exact", head: true });

    document.getElementById("customerCount").innerHTML =
        count ?? 0;
}

// ----------------------------
// งานล่าสุด
// ----------------------------

async function loadLatestJobs() {

    const { data, error } = await supabaseClient
        .from("service_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

    if (error) {

        console.log(error);

        return;

    }

    const table = document.getElementById("jobsTable");

    table.innerHTML = "";

    data.forEach(job => {

        table.innerHTML += `
<tr>

<td>${job.request_number}</td>

<td>${job.customer_name}</td>

<td>${job.customer_phone}</td>

<td>

<span class="status ${job.status}">

${job.status}

</span>

</td>

<td>

${new Date(job.created_at).toLocaleString("th-TH")}

</td>

</tr>
`;

    });

}

// ----------------------------
// Logout
// ----------------------------

document
.getElementById("logoutBtn")
.addEventListener("click", logout);

async function logout() {

    await supabaseClient.auth.signOut();

    window.location.href = "login.html";

}