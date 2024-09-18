//this is where json data has student has prefix with the id and need to retive it with it 
//Attempt 1

var express = require('express');
var fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/listStudent',(req,res)=>{
    fs.readFile('students1.json','utf8',(err,data)=>{
        if(err){
            return res.status(500).json({error : "error while reading the file "})
        }
        const students = JSON.parse(data);
        res.json(students);
    })
    
});

app.get('/showStudent/:id',(req,res)=>{
    const studentId = req.params.id;
    fs.readFile('students1.json','utf8',(err,data)=>{
        if(err){
            return res.status(500).json({error:"Error while reading the file"});
        }
        const students = JSON.parse(data);
        const studentKey = `student-${studentId}`;
        const student = students[studentKey];
        if(student){
            res.json(student);
        }
        else{
            return res.status(500).json({error:"student not found"});
        }
    })
});


app.post('/addStudent',(req,res)=>{
    fs.readFile('students1.json','utf8',(err,data)=>{
        if(err){
            return res.status(500).json({error:"error while reading the file"})
        }
        const students = JSON.parse(data);
        const newId = Object.keys(students).length + 1;
        const newStudentKey = `student-${newId}`;
        const newStudent = req.body;
        students[newStudentKey]=newStudent;

        fs.writeFile('students1.json',JSON.stringify(students),(err)=>{
            if(err){
                return res.status(500).json({error:"error while adding the student"})
            }
            res.status(201).json({message:"student added successfully"})
        })
    })
});

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})