console.log("repair.js เริ่มทำงาน");


document
.getElementById("repairForm")
.addEventListener("submit", function(e){

    e.preventDefault();

    alert("ปุ่มส่งทำงานแล้ว");

    console.log("Submit ถูกเรียก");

});