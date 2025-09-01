import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './routes/api.js';
import authRouter from './routes/auth.js';
import songRouter from './routes/songs.js';
import songUploadRouter from './routes/songUpload.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MIDDLEWARES -------------------------------------------------
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ROUTES ------------------------------------------------------
app.use('/api', apiRouter);
app.use('/api/auth', authRouter);
app.use('/api/songs', songRouter);
app.use('/api', songUploadRouter);
app.get('/', (_, res) => res.send('Hello World mit MongoDB!'));

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('MongoDB verbunden ✅');
        app.listen(port, () =>
            console.log(`Server läuft auf http://localhost:${port}`)
        );
    })
    .catch((err) => {
        console.error('Fehler bei MongoDB-Verbindung ❌', err);
        process.exit(1);
    });
app.get('/', (req, res) => res.send('Hello World mit MongoDB!'));
