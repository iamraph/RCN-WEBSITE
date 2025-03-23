const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const socketio = require('socket.io');
const http = require('http');
const cloudinary = require('cloudinary').v2;
const { authMiddleware } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/rcn_portfolio', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static('static'));

// API Routes
const testimonialSchema = new mongoose.Schema({
    quote: String,
    name: String,
    position: String,
    image: String
});

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
const Contact = mongoose.model('Contact', contactSchema);

// GET testimonials
app.get('/api/testimonials', async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        res.json(testimonials);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST contact form
app.post('/api/contact', async (req, res) => {
    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
    });

    try {
        const newContact = await contact.save();
        res.status(201).json(newContact);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/admin', authMiddleware, require('./routes/admin'));

// WebSocket connection
io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('join_blog', (blogId) => {
        socket.join(`blog_${blogId}`);
    });

    socket.on('new_comment', (data) => {
        io.to(`blog_${data.blogId}`).emit('comment_added', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
