const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


let products = [];


app.get("/", (req, res) => {
  res.send("Backend running");
});


app.get("/products", (req, res) => {
  res.json(products);
});


app.post("/products", (req, res) => {
  const product = req.body;
  product.id = Date.now();  
  products.push(product);
  res.json(product);
});


app.put("/products/:id", (req, res) => {
  const id = Number(req.params.id);

  products = products.map((p) => {
    if (p.id === id) {
      return { ...p, ...req.body };
    }
    return p;
  });

  res.json({ message: "Updated" });
});


app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  products = products.filter((p) => p.id !== id);
  res.json({ message: "Deleted" });
});


app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
