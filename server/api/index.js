const fs = require('node:fs');
const path = require('node:path');
const express = require('express');

const DB_PATH = path.join(__dirname, 'products.json');
const SEED_PATH = path.join(__dirname, 'products.seed.json');

if (!fs.existsSync(DB_PATH)) {
  fs.copyFileSync(SEED_PATH, DB_PATH);
}

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

const app = express();
app.disable('x-powered-by');
app.use(express.json());

app.get('/api/products', (req, res) => {
  const db = readDb();
  res.json({ message: 'Products retrieved successfully', data: db.products });
});

app.get('/api/products/:id', (req, res) => {
  const db = readDb();
  const product = db.products.find((p) => p.productId === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json({ message: 'Product retrieved successfully', data: product });
});

app.post('/api/products', (req, res) => {
  const db = readDb();
  const product = { ...req.body, productId: db.nextId };
  db.products.push(product);
  db.nextId += 1;
  writeDb(db);
  res.status(201).json({ message: 'Product added successfully', id: product.productId });
});

app.put('/api/products/:id', (req, res) => {
  const db = readDb();
  const id = Number(req.params.id);
  const index = db.products.findIndex((p) => p.productId === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  db.products[index] = { ...req.body, productId: id };
  writeDb(db);
  res.json({ message: 'Product updated successfully', data: db.products[index] });
});

app.delete('/api/products/:id', (req, res) => {
  const db = readDb();
  const id = Number(req.params.id);
  const index = db.products.findIndex((p) => p.productId === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  db.products.splice(index, 1);
  writeDb(db);
  res.json({ message: 'Product deleted successfully' });
});

const port = process.env['API_PORT'] || 4000;
app.listen(port, () => {
  console.log(`Smart Grocery API listening on http://localhost:${port}`);
});
