import express from 'express';
import Song from '../models/Song.js';
import multer from 'multer';

const upload = multer({storage: multer.memoryStorage()});

const filesMiddleware = upload.fields([
    {name: 'audio', maxCount: 1},
    {name: 'cover', maxCount: 1}
]);

const router = express.Router();

router.post('/songs', filesMiddleware, async (req, res) => {
    try {
        const {title, artist, album, genre, duration, releaseYear} = req.body;

        const audioFile = req.files?.audio?.[0];
        const coverFile = req.files?.cover?.[0];

        if (!audioFile || !coverFile)
            return res.status(400).json({message: 'audio und cover sind Pflicht'});

        const newSong = await Song.create({
            title,
            artist,
            album,
            genre: genre?.split(',').map(g => g.trim()),
            duration,
            releaseYear,
            audio: {
                data: audioFile.buffer,
                contentType: audioFile.mimetype,
                fileName: audioFile.originalname
            },
            cover: {
                data: coverFile.buffer,
                contentType: coverFile.mimetype,
                fileName: coverFile.originalname
            }
        });

        res.status(201).json(newSong);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

export default router;