import express from 'express';
import Song from '../models/Song.js';

const router = express.Router();

// Nur Metadaten (keine Binärdaten) – Liste
router.get('/', async (_, res) => {
    const songs = await Song.find({}, {
        title: 1, artist: 1, duration: 1, cover: 0, audio: 0   // nur Felder, die wir anzeigen
    });
    res.json(songs);
});

// Einzelnes Audio (Stream)
router.get('/:id/audio', async (req, res) => {
    const song = await Song.findById(req.params.id).select('audio');
    if (!song) return res.sendStatus(404);

    res.set('Content-Type', song.audio.contentType);
    res.set('Content-Disposition', `inline; filename="${song.audio.fileName}"`);
    res.send(song.audio.data);
});

// Cover Bild
router.get('/:id/cover', async (req, res) => {
    const song = await Song.findById(req.params.id).select('cover');
    if (!song) return res.sendStatus(404);

    res.set('Content-Type', song.cover.contentType);
    res.send(song.cover.data);
});

export default router;