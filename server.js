require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser, findUserById, addSign, getSignsByUserId, deleteSign } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// --- Authentication Middleware ---
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        return res.status(401).json({ message: 'Authentication token required.' });
    }

    if (!JWT_SECRET) {
        console.error("JWT_SECRET is not defined! Check .env file in backend directory.");
        return res.status(500).json({ message: 'Server configuration error: JWT secret not set.' });
    }

    jwt.verify(token, JWT_SECRET, async (err, user) => {
        if (err) {
            console.warn("JWT verification failed:", err.message);
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        // Attach the full user object (including ID) to the request
        try {
            const dbUser = await findUserByEmail(user.email);
            if (!dbUser) {
                return res.status(404).json({ message: 'User not found.' });
            }
            req.user = dbUser; // user object from DB: { id, email, password }
            next();
        } catch (dbError) {
            console.error('Error fetching user from DB during token authentication:', dbError);
            res.status(500).json({ message: 'Server error during authentication.' });
        }
    });
}


// --- Authentication Routes ---

// Signup Route
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    try {
        // Check if user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

        // Create new user
        await createUser(email, hashedPassword);

        res.status(201).json({ message: 'Registration successful! Please log in.' });
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find user by email
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Compare provided password with stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT
        if (!JWT_SECRET) {
            console.error("JWT_SECRET is not defined! Check .env file in backend directory.");
            return res.status(500).json({ message: 'Server configuration error.' });
        }
        // Include user ID in the token payload
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful!', token, email: user.email, id: user.id });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
});

// --- Custom Sign Endpoints ---

// POST /api/signs - Add a new custom sign
app.post('/api/signs', authenticateToken, async (req, res) => {
    const { word, videoUrl } = req.body; // videoUrl will be a placeholder for now

    if (!word) {
        return res.status(400).json({ message: 'Sign word is required.' });
    }

    try {
        const userId = req.user.id;
        // Mock videoUrl for now as actual file upload/storage is not implemented
        const mockVideoUrl = videoUrl || `https://example.com/signs/${encodeURIComponent(word)}.mp4`;

        const newSign = await addSign(userId, word.trim(), mockVideoUrl);
        res.status(201).json({ message: 'Custom sign added successfully.', sign: newSign });
    } catch (error) {
        console.error('Error adding custom sign:', error.message);
        if (error.message.includes('SQLITE_CONSTRAINT_UNIQUE')) {
            return res.status(409).json({ message: `You've already added a sign for "${word}".` });
        }
        res.status(500).json({ message: 'Server error adding custom sign.', error: error.message });
    }
});

// GET /api/signs - Get all custom signs for the authenticated user
app.get('/api/signs', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const signs = await getSignsByUserId(userId);
        res.status(200).json({ signs });
    } catch (error) {
        console.error('Error fetching custom signs:', error.message);
        res.status(500).json({ message: 'Server error fetching custom signs.', error: error.message });
    }
});

// DELETE /api/signs/:id - Delete a custom sign
app.delete('/api/signs/:id', authenticateToken, async (req, res) => {
    const signId = parseInt(req.params.id);

    if (isNaN(signId)) {
        return res.status(400).json({ message: 'Invalid sign ID provided.' });
    }

    try {
        const userId = req.user.id;
        const deleted = await deleteSign(signId, userId);

        if (deleted) {
            res.status(200).json({ message: 'Custom sign deleted successfully.' });
        } else {
            // Either signId does not exist or it does not belong to the user
            res.status(404).json({ message: 'Sign not found or you do not have permission to delete it.' });
        }
    } catch (error) {
        console.error('Error deleting custom sign:', error.message);
        res.status(500).json({ message: 'Server error deleting custom sign.', error: error.message });
    }
});


// --- Placeholder for other API endpoints (e.g., /predict-sign, /translate) ---
// These would be implemented using the Google GenAI SDK or other ML models as specified in the original prompt.
// For now, these are just illustrative.

app.post('/api/predict-sign', (req, res) => {
    // In a real implementation, this would involve receiving image frames,
    // running ML inference, and returning predicted sign text.
    // This is a placeholder.
    res.status(501).json({ message: "Sign prediction endpoint not yet implemented." });
});

app.post('/api/translate', (req, res) => {
    // In a real implementation, this would connect to the Google Translate API
    // or similar and return translated text.
    // For now, frontend directly calls Gemini API for translation.
    res.status(501).json({ message: "Translation endpoint not yet implemented (frontend handles this)." });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});