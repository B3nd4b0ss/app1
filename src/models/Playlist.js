import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        description: String,
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        songs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Song'}],
        isPublic: {type: Boolean, default: false}
    },
    {timestamps: true}
);

export default mongoose.model('Playlist', playlistSchema);