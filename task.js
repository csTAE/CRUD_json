var express = require('express');
var fs = require('fs');
var app = express();
const PORT = 3000;

app.use(express.json());

app.get('/task',(req,res)=>{
    fs.readFile('task.json','utf8',(err,data) => {
        if(err){
            return res.status(500).json({error:"error while reading the file"})
        }
        const task = JSON.parse(data);
        res.json(task);
    });
});

app.get('/task/:id',(req,res)=>{
    const taskId = parseInt(req.params.id);
    fs.readFile('task.json','utf8',(err,data)=>{
        if(err){
            return res.status(500).json({error:"error while reading the file"})
        }
        const task = JSON.parse(data);
        const tasks = task.find(td => td.id === taskId);
        if(tasks){
            res.json(tasks);
        }
        else{
            return res.status(404).json({error:"Task not found"})
        }
    })
});

app.post('/addTask',(req,res)=>{
    const newTask = req.body;
    fs.readFile('task.json','utf8',(err,data)=>{
        if(err){
            return res.status(500).json({error:"error while reading the file"})
        }
        const task = JSON.parse(data);
        newTask.id = task.length ? task[task.length - 1].id +1 : 1;
        task.push(newTask);

        fs.writeFile('task.json',JSON.stringify(task),(err)=>{
            if(err){
                return res.status(500).json({error:"error while adding the file"})
            }
            res.status(201).json({message:"Task added successfully"})
        });
    });
});

app.delete('/deleteTask/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    fs.readFile('task.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error while reading the file" });
        }
        let tasks = JSON.parse(data);
        const indexTask = tasks.findIndex(td => td.id === taskId);
        if (indexTask === -1) {
            return res.status(404).json({ error: "Task not found" });
        }

        tasks = tasks.filter(td => td.id !== taskId);  

        fs.writeFile('task.json', JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Error while deleting" });
            }
            res.status(200).json({ message: "Task deleted successfully", tasks });  
        });
    });
});

app.put('/updateTask/:id',(req,res)=>{
    const taskId = parseInt(req.params.id);
    fs.readFile('task.json','utf8',(err,data)=>{
        if(err){
            return res.status(500).json({error:"error while reading the file"})
        }
        let tasks = JSON.parse(data);
        const indexTask = tasks.findIndex(td => td.id === taskId);
        if(indexTask === -1){
            return res.status(404).json({error:"task not found"})
        }
        const upTask = req.body;
        tasks[indexTask]={ ...tasks[indexTask], ...upTask};

        fs.writeFile('task.json', JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Error while updating" });
            }
            res.status(200).json({ message: "Task updated successfully", tasks });  
        });

    });
});

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});

