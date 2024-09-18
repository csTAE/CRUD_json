const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

// Route to list all students
app.get('/listStudent', (req, res) => {
    fs.readFile('students.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading the file.');
        }
        const students = JSON.parse(data);
        res.json(students);
    });
});

// Route to show a specific student by ID
app.get('/showStudent/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    fs.readFile('students.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading the file.');
        }
        const students = JSON.parse(data);
        const student = students.find(s => s.id === studentId);
        if (student) {
            res.json(student);
        } else {
            res.status(404).send('Student not found.');
        }
    });
});

// Route to add a new student
app.post('/addStudent', (req, res) => {
    const newStudent = req.body;
    
    fs.readFile('students.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading the file.');
        }
        const students = JSON.parse(data);
        newStudent.id = students.length ? students[students.length - 1].id + 1 : 1;  // Assign a new ID
        students.push(newStudent);
        
        fs.writeFile('students.json', JSON.stringify(students, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing to the file.');
            }
            res.status(201).send('Student added successfully.');
        });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
