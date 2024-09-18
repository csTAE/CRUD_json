var express = require('express');
var fs = require('fs');
var app = express();
const PORT = 3000;

app.use(express.json());

app.get('/listStudent', (req, res) => {
    fs.readFile('students.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error while reading the file" });
        }
        const students = JSON.parse(data);
        res.json(students);
    });
});

app.get('/showStudent/:id', (req, res) => {
    const studentId = parseInt(req.params.id, 10); // Convert to integer
    fs.readFile('students.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error while reading the file" });
        }
        const students = JSON.parse(data);
        const student = students.find(std => std.id === studentId); // Use number comparison
        
        if (student) {
            return res.json(student);
        } else {
            return res.status(404).json({ error: "Student not found" });
        }
    });
});

app.post('/addStudent', (req, res) => {
    const newStudent = req.body;
    fs.readFile('students.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error while reading the file" });
        }
        const students = JSON.parse(data);
        newStudent.id = students.length ? students[students.length - 1].id + 1 : 1;
        students.push(newStudent);

        fs.writeFile('students.json', JSON.stringify(students, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Error while adding the student" });
            }
            return res.status(201).json({ message: "Student added successfully" });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
