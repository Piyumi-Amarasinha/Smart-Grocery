require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');

// ── Schemas ──────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'admin' },
});

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
  imageUrl: String,
});

const orderItemSchema = new mongoose.Schema({
  productId: Number,
  productName: String,
  imageUrl: String,
  unitPrice: Number,
  quantity: Number,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: Number, required: true, unique: true },
  items: [orderItemSchema],
  total: Number,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  deliveryAddress: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// ── Seed admin on first run ───────────────────────────────────────────────────

async function seedAdmin() {
  const count = await User.countDocuments();
  if (count > 0) return;
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  await User.create({ username: process.env.ADMIN_USERNAME, passwordHash, role: 'admin' });
  console.log(`Admin user "${process.env.ADMIN_USERNAME}" created`);
}

// ── DB connect ────────────────────────────────────────────────────────────────

mongoose
  .connect(process.env.DATABASE)
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedAdmin();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// ── Express setup ─────────────────────────────────────────────────────────────

const app = express();
app.disable('x-powered-by');
app.use(express.json());

// ── Auth middleware ───────────────────────────────────────────────────────────

function requireAuth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// ── Auth routes (public) ──────────────────────────────────────────────────────

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ message: 'Login successful', token });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, passwordHash, role: 'admin' });
    res.status(201).json({ message: 'Account created successfully' });
  } catch {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// ── Product routes ────────────────────────────────────────────────────────────
// GET routes are public (retail site reads without login)
// POST / PUT / DELETE require admin auth

const fields = { _id: 0, __v: 0 };

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({}, fields).sort({ productId: 1 });
    res.json({ message: 'Products retrieved successfully', data: products });
  } catch {
    res.status(500).json({ message: 'Failed to retrieve products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: Number(req.params.id) }, fields);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product retrieved successfully', data: product });
  } catch {
    res.status(500).json({ message: 'Failed to retrieve product' });
  }
});

app.post('/api/products', requireAuth, async (req, res) => {
  try {
    const last = await Product.findOne().sort({ productId: -1 });
    const productId = last ? last.productId + 1 : 1;
    await Product.create({ ...req.body, productId });
    res.status(201).json({ message: 'Product added successfully', id: productId });
  } catch {
    res.status(500).json({ message: 'Failed to add product' });
  }
});

app.put('/api/products/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await Product.findOneAndUpdate(
      { productId: id },
      { ...req.body, productId: id },
      { new: true, projection: fields }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated successfully', data: product });
  } catch {
    res.status(500).json({ message: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', requireAuth, async (req, res) => {
  try {
    const result = await Product.findOneAndDelete({ productId: Number(req.params.id) });
    if (!result) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// ── Order routes ──────────────────────────────────────────────────────────────

app.post('/api/orders', async (req, res) => {
  try {
    const { items, total, customerName, customerEmail, customerPhone, deliveryAddress } = req.body;
    if (!items?.length || !customerName || !customerEmail || !deliveryAddress) {
      return res.status(400).json({ message: 'Missing required order fields' });
    }
    const last = await Order.findOne().sort({ orderId: -1 });
    const orderId = last ? last.orderId + 1 : 1001;
    await Order.create({ orderId, items, total, customerName, customerEmail, customerPhone, deliveryAddress });
    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch {
    res.status(500).json({ message: 'Failed to place order' });
  }
});

app.get('/api/orders', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({}, { __v: 0 }).sort({ createdAt: -1 });
    res.json({ message: 'Orders retrieved successfully', data: orders });
  } catch {
    res.status(500).json({ message: 'Failed to retrieve orders' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Smart Grocery API listening on http://localhost:${port}`));
