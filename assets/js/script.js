document.addEventListener("DOMContentLoaded", function () {
    // --- Login Logic ---
    let loginForm = document.getElementById("loginForm");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let eye = document.getElementById("eye");
    let show = document.getElementById("show");
    let hide = document.getElementById("hide");
    let logInFormWhaper = document.getElementById("logInFormWhaper");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            let emailValue = email.value.trim();
            let passValue = password.value.trim();

            let webSiteMail = "website@gmail.com";
            let webSitePass = "website123";
            let gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

            if (!gmailPattern.test(emailValue)) {
                alert("Only Gmail allowed");
            } else if (emailValue !== webSiteMail) {
                Swal.fire({ title: "Invalid email", icon: "error" });
            } else if (passValue !== webSitePass) {
                Swal.fire({ title: "Invalid password", icon: "error" });
            } else {
                logInFormWhaper.style.display = "none";
                Swal.fire({
                    title: "Login Success",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1000
                }).then(() => {
                    window.location.href = "index.html";
                });
            }
        });
    }

    if (eye) {
        eye.addEventListener("click", function () {
            if (password.type === "password") {
                password.type = "text";
                show.style.display = "block";
                hide.style.display = "none";
            } else {
                password.type = "password";
                show.style.display = "none";
                hide.style.display = "block";
            }
        });
    }
});

let logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        alert("Logout successful");
        window.location.href = "login.html";
    });
}


// --- CRUD Logic ---
let addStudentForm = document.getElementById("addStudentForm");
let studentName = document.getElementById("studentName");
let studentEmail = document.getElementById("studentEmail");
let studentPhone = document.getElementById("studentPhone");
let studentEnroll = document.getElementById("studentEnroll");
let studentDate = document.getElementById("studentDate");
let studentImage = document.getElementById("studentImage");
let addStudentBtn = document.getElementById("addStudentBtn");
let studentTableBody = document.getElementById("studentsTableBody");


let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = null;

// Function to render table
function renderTable() {
    studentTableBody.innerHTML = "";
    students.forEach((student, index) => {
        let newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><img src="${student.image}" class="student-img"></td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.enroll}</td>
            <td>${student.date}</td> 
            <td>
                <button type="button" onclick="editRow(${index})">
             <span>
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_21_225)">
                        <path d="M18.3033 2.08777L16.9113 0.695801C16.4478 0.231934 15.8399 0 15.2321 0C14.6242 0 14.0164 0.231934 13.5525 0.69543L0.475916 13.772L0.00462689 18.0107C-0.0547481 18.5443 0.365701 19 0.88783 19C0.920858 19 0.953885 18.9981 0.987654 18.9944L5.22332 18.5265L18.3036 5.44617C19.231 4.51881 19.231 3.01514 18.3033 2.08777ZM4.67818 17.3924L1.2259 17.775L1.61035 14.3175L11.4031 4.52475L14.4747 7.59629L4.67818 17.3924ZM17.4639 4.60676L15.3141 6.7565L12.2426 3.68496L14.3923 1.53521C14.6164 1.31107 14.9148 1.1875 15.2321 1.1875C15.5494 1.1875 15.8474 1.31107 16.0719 1.53521L17.4639 2.92719C17.9266 3.39031 17.9266 4.14363 17.4639 4.60676Z" fill="#FEAF00"/>
                    </g><defs><clipPath id="clip0_21_225"><rect width="19" height="19" fill="white"/></clipPath></defs>
                </svg>
            </span>
                </button>

                <button type="button" onclick="deleteRow(${index})">
             <span>
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_21_223)">
                        <path d="M0.285713 2.25H4L5.2 0.675C5.35968 0.465419 5.56674 0.295313 5.80478 0.178154C6.04281 0.0609948 6.30529 0 6.57143 0L9.42857 0C9.69471 0 9.95718 0.0609948 10.1952 0.178154C10.4333 0.295313 10.6403 0.465419 10.8 0.675L12 2.25H15.7143C15.7901 2.25 15.8627 2.27963 15.9163 2.33238C15.9699 2.38512 16 2.45666 16 2.53125V3.09375C16 3.16834 15.9699 3.23988 15.9163 3.29262C15.8627 3.34537 15.7901 3.375 15.7143 3.375H15.0393L13.8536 16.4637C13.8152 16.8833 13.6188 17.2737 13.3029 17.558C12.987 17.8423 12.5745 17.9999 12.1464 18H3.85357C3.42554 17.9999 3.01302 17.8423 2.69711 17.558C2.38121 17.2737 2.18477 16.8833 2.14643 16.4637L0.960713 3.375H0.285713C0.209937 3.375 0.137264 3.34537 0.083683 3.29262C0.0301008 3.23988 0 3.16834 0 3.09375V2.53125C0 2.45666 0.0301008 2.38512 0.083683 2.33238C0.137264 2.27963 0.209937 2.25 0.285713 2.25ZM9.88571 1.35C9.8323 1.28034 9.76324 1.22379 9.68393 1.18475C9.60463 1.14572 9.51723 1.12527 9.42857 1.125H6.57143C6.48277 1.12527 6.39537 1.14572 6.31606 1.18475C6.23676 1.22379 6.1677 1.28034 6.11429 1.35L5.42857 2.25H10.5714L9.88571 1.35ZM3.28571 16.3617C3.29748 16.5019 3.36245 16.6325 3.46768 16.7277C3.57292 16.8228 3.7107 16.8754 3.85357 16.875H12.1464C12.2893 16.8754 12.4271 16.8228 12.5323 16.7277C12.6376 16.6325 12.7025 16.5019 12.7143 16.3617L13.8929 3.375H2.10714L3.28571 16.3617Z" fill="#FEAF00"/>
                    </g> <defs><clipPath id="clip0_21_223"><rect width="16" height="18" fill="white" transform="matrix(-1 0 0 1 16 0)"/></clipPath></defs>
                </svg>
                   </span>
                      </button>
            </td>
        `;
        studentTableBody.appendChild(newRow);
    });
}

addStudentBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (!studentName.value || !studentEmail.value || !studentPhone.value || !studentEnroll.value) {
        alert("Please fill required fields");
        return;
    }

    const file = studentImage.files[0];

    if (editIndex === null && !file) {
        alert("Please upload an image");
        return;
    }

    // Function to save the student data
    const saveStudent = (imageData) => {
        let studentData = {
            name: studentName.value,
            email: studentEmail.value,
            phone: studentPhone.value,
            enroll: studentEnroll.value,
            date: studentDate.value,
            image: imageData || (editIndex !== null ? students[editIndex].image : "")
        };

        if (editIndex === null) {
            students.push(studentData);
        } else {
            students[editIndex] = studentData;
            editIndex = null;
            addStudentBtn.innerText = "ADD STUDENT";
        }

        localStorage.setItem("students", JSON.stringify(students));
        addStudentForm.reset();
        renderTable();
    };


    if (file) {
        let reader = new FileReader();
        reader.onload = function (event) {
            saveStudent(event.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        saveStudent();
    }
});

// Edit function
window.editRow = function (index) {
    let student = students[index];
    studentName.value = student.name;
    studentEmail.value = student.email;
    studentPhone.value = student.phone;
    studentEnroll.value = student.enroll;
    studentDate.value = student.date;

    editIndex = index;
    addStudentBtn.innerText = "UPDATE STUDENT";
};


window.deleteRow = function (index) {
    if (confirm("Are you sure you want to delete?")) {
        students.splice(index, 1);
        localStorage.setItem("students", JSON.stringify(students));
        renderTable();
    }
};


renderTable();