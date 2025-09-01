import express from 'express';
import User from '../models/User.js';
import Song from '../models/Song.js';
import Playlist from '../models/Playlist.js';

const router = express.Router();

/* ---------- User ---------- */
router.post('/users', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

/* ---------- Song ---------- */
router.post('/songs', async (req, res) => {
    try {
        const song = await Song.create(req.body);
        res.status(201).json(song);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

/* ---------- Playlist ---------- */
router.post('/playlists', async (req, res) => {
    try {
        const playlist = await Playlist.create(req.body);
        res.status(201).json(playlist);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

export default router;