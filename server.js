const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webwonder',
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database Connection Error:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database!');
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle signup
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);


    // Insert user into the database
    const query = 'INSERT INTO wdr (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err, results) => {
        if (err) {
            console.error('Database Error during signup:', err);
            return res.status(500).json({ error: 'Failed to register user.' });
        }
        console.log('User registered:', results);
        res.redirect('/landing.html');
    });
    
} catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ error: 'Failed to register user.' });
}
});

// Handle login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const query = 'SELECT * FROM wdr WHERE email  = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Database Error during login:', err);
            return res.status(500).json({ error: 'Failed to log in.' });
        }
    
        if (results.length === 0) {
            console.log('No user found for email:', email);
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
    
        const user = results[0];
        console.log('Found user:', user);
    
        const isMatch = bcrypt.compareSync(password, user.password);
        console.log('Password match:', isMatch);
    
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
    
        res.redirect('/landing.html');
    });
    
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
