import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true},
        passwordHash: {type: String, required: true},
        playlists: [{type: mongoose.Schema.Types.ObjectId, ref: 'Playlist'}]
    },
    {timestamps: true}
);

export default mongoose.model('User', userSchema);