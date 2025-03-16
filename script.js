document.addEventListener("DOMContentLoaded", () => {
    fetchStudents(); // Load students on page load

    document.getElementById("studentForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const age = document.getElementById("age").value.trim();
        const grade = document.getElementById("grade").value.trim();

        if (!name || !age || !grade) {
            alert("Please fill in all fields.");
            return;
        }

        fetch("students.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, age, grade }),
        })
        .then(response => response.json())
        .then(() => {
            fetchStudents();
            this.reset();
        });
    });
});

// Fetch and display students
function fetchStudents() {
    fetch("students.php")
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById("studentTable");
            table.innerHTML = "";
            data.forEach(student => {
                table.innerHTML += `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.age}</td>
                        <td>${student.grade}</td>
                        <td>
                            <button onclick="editStudent('${student.name}', ${student.age}, '${student.grade}')">Edit</button>
                            <button onclick="deleteStudent('${student.name}')">Delete</button>
                        </td>
                    </tr>
                `;
            });
        });
}

// Delete student
function deleteStudent(name) {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
        fetch("students.php", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        }).then(() => fetchStudents());
    }
}

// Edit student
function editStudent(oldName, oldAge, oldGrade) {
    const newName = prompt("Enter new name:", oldName) || oldName;
    const newAge = prompt("Enter new age:", oldAge) || oldAge;
    const newGrade = prompt("Enter new grade:", oldGrade) || oldGrade;

    if (!newName.trim() || !newAge.trim() || !newGrade.trim()) {
        alert("Invalid input. Update canceled.");
        return;
    }

    fetch("students.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldName, newName, newAge, newGrade }),
    })
    .then(response => response.json())
    .then(() => fetchStudents());
}
