const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database. Use __dirname to ensure the db file is relative to this script.
const dbPath = path.resolve(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Initialize the database schema
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error('Error creating users table:', err.message);
            } else {
                console.log('Users table created or already exists.');
            }
        });

        // New table for custom signs
        db.run(`
            CREATE TABLE IF NOT EXISTS signs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                word TEXT NOT NULL,
                videoUrl TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(userId, word), -- Ensure a user cannot add the same word twice
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            )
        `, (err) => {
            if (err) {
                console.error('Error creating signs table:', err.message);
            } else {
                console.log('Signs table created or already exists.');
            }
        });

        // New table for speech recordings (for future expansion)
        db.run(`
            CREATE TABLE IF NOT EXISTS speech_recordings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                transcribedText TEXT NOT NULL,
                audioUrl TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            )
        `, (err) => {
            if (err) {
                console.error('Error creating speech_recordings table:', err.message);
            } else {
                console.log('Speech_recordings table created or already exists.');
            }
        });
    });
}

/**
 * Finds a user by their email address.
 * @param {string} email - The email of the user to find.
 * @returns {Promise<object|null>} A promise that resolves to the user object or null if not found.
 */
function findUserByEmail(email) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

/**
 * Finds a user by their ID.
 * @param {number} id - The ID of the user to find.
 * @returns {Promise<object|null>} A promise that resolves to the user object or null if not found.
 */
function findUserById(id) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

/**
 * Creates a new user in the database.
 * @param {string} email - The email of the new user.
 * @param {string} hashedPassword - The hashed password of the new user.
 * @returns {Promise<object>} A promise that resolves to the new user's ID.
 */
function createUser(email, hashedPassword) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, email, hashedPassword });
            }
        });
    });
}

/**
 * Adds a new custom sign for a user.
 * @param {number} userId - The ID of the user.
 * @param {string} word - The word for the sign.
 * @param {string} videoUrl - The URL/path to the video/animation of the sign.
 * @returns {Promise<object>} A promise that resolves to the new sign object.
 */
function addSign(userId, word, videoUrl) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO signs (userId, word, videoUrl) VALUES (?, ?, ?)',
            [userId, word, videoUrl],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    // Fetch the newly inserted sign to include createdAt and id
                    db.get('SELECT * FROM signs WHERE id = ?', [this.lastID], (err, row) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row);
                        }
                    });
                }
            }
        );
    });
}

/**
 * Retrieves all custom signs for a given user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of sign objects.
 */
function getSignsByUserId(userId) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM signs WHERE userId = ? ORDER BY word ASC', [userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

/**
 * Deletes a custom sign.
 * @param {number} signId - The ID of the sign to delete.
 * @param {number} userId - The ID of the user who owns the sign.
 * @returns {Promise<boolean>} A promise that resolves to true if deleted, false otherwise.
 */
function deleteSign(signId, userId) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM signs WHERE id = ? AND userId = ?', [signId, userId], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes > 0); // true if a row was deleted
            }
        });
    });
}


module.exports = {
    db,
    findUserByEmail,
    findUserById, // Exported for authentication middleware
    createUser,
    addSign,
    getSignsByUserId,
    deleteSign
};