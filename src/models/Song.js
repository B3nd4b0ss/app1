import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
    {
        title:  { type: String, required: true },
        artist: { type: String, required: true },
        album:  String,
        genre:  [String],
        duration:    Number,
        releaseYear: Number,

        audio: {
            data: Buffer,
            contentType: String,
            fileName: String
        },
        cover: {
            data: Buffer,
            contentType: String,
            fileName: String
        }
    },
    { timestamps: true }
);
export default mongoose.model('Song', songSchema);