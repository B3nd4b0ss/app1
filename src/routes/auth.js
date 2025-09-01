import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret';

// ---------- Registrierung ----------
router.post('/register', async (req, res) => {
    try {
        const {username, email, password} = req.body;

        // Plausibilitäts-Checks
        if (!username || !email || !password) {
            return res.status(400).json({error: 'Alle Felder sind Pflicht.'});
        }

        // Passwort hashen
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // User anlegen
        const user = await User.create({username, email, passwordHash});
        res.status(201).json({_id: user._id, username: user.username, email: user.email});
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

// ---------- Login ----------
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) return res.status(401).json({error: 'Ungültige Anmeldedaten.'});

        const pwOk = await bcrypt.compare(password, user.passwordHash);
        if (!pwOk) return res.status(401).json({error: 'Ungültige Anmeldedaten.'});

        // JWT erzeugen (24 h gültig)
        const token = jwt.sign({id: user._id, username: user.username}, JWT_SECRET, {
            expiresIn: '24h',
        });

        res.json({token, user: {_id: user._id, username: user.username, email: user.email}});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

export default router;