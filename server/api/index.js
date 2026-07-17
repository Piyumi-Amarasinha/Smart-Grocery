require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const express = require('express');

const productSchema = new mongoose.Schema({
  productId: { type: Number, required: true, unique: true },
  productName: String,
  productDescription: String,
  category: String,
  brand: String,
  batchNumber: String,
  expireDate: String,
  manufacturedDate: String,
  createdDate: String,
  quantity: Number,
  unitPrice: Number,
});

const Product = mongoose.model('Product', productSchema);

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

const app = express();
app.disable('x-powered-by');
app.use(express.json());

const fields = { _id: 0, __v: 0 };

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({}, fields).sort({ productId: 1 });
    res.json({ message: 'Products retrieved successfully', data: products });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: Number(req.params.id) }, fields);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product retrieved successfully', data: product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve product' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const last = await Product.findOne().sort({ productId: -1 });
    const productId = last ? last.productId + 1 : 1;
    await Product.create({ ...req.body, productId });
    res.status(201).json({ message: 'Product added successfully', id: productId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await Product.findOneAndUpdate(
      { productId: id },
      { ...req.body, productId: id },
      { new: true, projection: fields }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully', data: product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const result = await Product.findOneAndDelete({ productId: Number(req.params.id) });
    if (!result) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Smart Grocery API listening on http://localhost:${port}`));
