var fs = require('fs');
var express = require('express');
var app = express();
const PORT = 3000;

app.set('port',process.env.PORT || 3000);

app.use(express.json());

app.get('/listStudents',(req,res)=>{
    fs.readFile('students1.json','utf8',(err,data)=>{
        if(err){
            return res.status(500).json({error:"error while reading the file"});
        }
        const students = JSON.parse(data);
        res.json(students);
    });
});

app.get('/showStudents/:id',(req,res)=>{
    const studentId = parseInt(req.params.id);
    fs.readFile('students1.json','utf8',(err,data)=>{
        if(err){
            return res.status(500).json({error:"error while reading the file"});
        }
        let students = JSON.parse(data);
        const studentKey = `student-${studentId}`;
        const student = students[studentKey];
        if(student){
            res.json(student);
        }
        else{
            return res.status(404).json({error:"student not found"});
        }
    });
});

app.post('/addStudents',(req,res)=>{
    
    fs.readFile('students1.json','utf8',(err,data)=>{
        if(err){
            return res.status(500).json({error:"error while reading the file"});
        }
        let students = JSON.parse(data);
        const newId = Object.keys(students).length+1;
        const newStudentKey = `student-${newId}`;
        const newStudent = req.body ;
        students[newStudentKey]=newStudent;

        fs.writeFile('students1.json',JSON.stringify(students),(err)=>{
            if(err){
                return res.status(500).json({error:"error while adding a student in the file"});
            }
            return res.status(201).json({message:"Student added successfully"});
        });
    });
});

app.delete('/deleteStudent/:id',(req,res)=>{
    const studentId = `student-${parseInt(req.params.id)}`;
    fs.readFile('students1.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "error while reading the file" });
        }
        let students = JSON.parse(data);
        
        if (!students[studentId]) {
            return res.status(404).json({ error: "student not found" });
        }

        delete students[studentId]; // Deleting the student

        fs.writeFile('students1.json', JSON.stringify(students, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "error while deleting a student" });
            }
            return res.status(200).json({ message: "student deleted successfully" });
        });
    });
});

app.put('/updateStudent',(req,res)=>{
    const studentId = `student-${parseInt(req.params.id)}`;
    fs.readFile('students1.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "error while reading the file" });
        }
        let students = JSON.parse(data);
        
        if (!students[studentId]) {
            return res.status(404).json({ error: "student not found" });
        }

        const updatedStudent = req.body;
        students[studentId] = { ...students[studentId], ...updatedStudent };

        fs.writeFile('students1.json', JSON.stringify(students, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "error while updating a student" });
            }
            return res.status(200).json({ message: "student updated successfully" });
        });
    }); 
});

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});