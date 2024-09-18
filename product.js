var fs = require('fs');
var express = require('express');
var app = express();
const PORT = 3000;

app.use(express.json());

app.get('/listProduct',(req,res)=>{
    fs.readFile('product.json','utf8',(err,data)=>{
        if(err){
            return res.status(500).json({error:"error while reading the file"});
        }
        const product = JSON.parse(data);
        res.json(product);
    });
});

app.get('/showProduct/:id',(req,res)=>{
    const productId = parseInt(req.params.id);
    fs.readFile('product.json','utf8',(err,data)=>{
        if(err){
            return res.status(500).json({error:"error while reading the file"});
        }
        let product = JSON.parse(data);
        const products = product[productId];
        if(products){
            res.json(products);
        }
        else{
            return res.status(404).json({error:"product not found"});
        }
    });
});

app.post('/addProduct', (req, res) => {
    fs.readFile('product.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error while reading the file" });
        }
        let products = JSON.parse(data);
        
        // Generate a new ID
        const newProduct = req.body;
        newProduct.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        
        // Add the new product to the array
        products.push(newProduct);

        // Write the updated products array to the file
        fs.writeFile('product.json', JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Error while adding a product" });
            }
            return res.status(201).json({ message: "Product added successfully" });
        });
    });
});


app.delete('/deleteProduct/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    
    fs.readFile('product.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error while reading the file" });
        }

        let products = JSON.parse(data);
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Remove the product
        products.splice(productIndex, 1);

        fs.writeFile('product.json', JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Error while deleting the product" });
            }
            return res.status(200).json({ message: "Product deleted successfully" });
        });
    });
});
app.delete('/deleteProduct/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    
    fs.readFile('product.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error while reading the file" });
        }

        let products = JSON.parse(data);
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Remove the product
        products.splice(productIndex, 1);

        fs.writeFile('product.json', JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Error while deleting the product" });
            }
            return res.status(200).json({ message: "Product deleted successfully" });
        });
    });
});


app.put('/updateProduct/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    
    fs.readFile('product.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Error while reading the file" });
        }

        let products = JSON.parse(data);
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex === -1) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Update the product with new data
        const updatedProduct = req.body;
        products[productIndex] = { ...products[productIndex], ...updatedProduct };

        fs.writeFile('product.json', JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Error while updating the product" });
            }
            return res.status(200).json({ message: "Product updated successfully" });
        });
    });
});

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});