import {useEffect, useRef, useState} from "react";
import "./Player.css";

export default function Player({songs, current, onPlay}) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isShuffled, setIsShuffled] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const [shuffledSongs, setShuffledSongs] = useState([]);
    const progressBarRef = useRef(null);
    const volumeBarRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const timeHandler = () => {
            setProgress(audio.currentTime);
            if (progressBarRef.current && audio.duration) {
                const progressPercent = (audio.currentTime / audio.duration) * 100;
                progressBarRef.current.style.setProperty('--progress', `${progressPercent}%`);
            }
        };

        const endedHandler = () => {
            if (isRepeating) {
                audio.currentTime = 0;
                audio.play();
            } else {
                handleNext();
            }
        };

        audio.addEventListener("timeupdate", timeHandler);
        audio.addEventListener("ended", endedHandler);

        return () => {
            audio.removeEventListener("timeupdate", timeHandler);
            audio.removeEventListener("ended", endedHandler);
        };
    }, [audioRef.current, isRepeating]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            if (volumeBarRef.current) {
                volumeBarRef.current.style.setProperty('--volume', `${volume * 100}%`);
            }
        }
    }, [volume]);

    useEffect(() => {
        if (songs.length > 0) {
            setShuffledSongs([...songs].sort(() => Math.random() - 0.5));
        }
    }, [songs, isShuffled]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const toggleShuffle = () => {
        setIsShuffled(!isShuffled);
    };

    const toggleRepeat = () => {
        setIsRepeating(!isRepeating);
    };

    const getCurrentSongIndex = () => {
        const currentList = isShuffled ? shuffledSongs : songs;
        return currentList.findIndex(song => song._id === current?._id);
    };

    const handleNext = () => {
        const currentList = isShuffled ? shuffledSongs : songs;
        const currentIndex = getCurrentSongIndex();

        if (currentIndex === -1 || currentList.length === 0) return;

        const nextIndex = (currentIndex + 1) % currentList.length;
        onPlay(currentList[nextIndex]);
        setIsPlaying(true);
    };

    const handlePrevious = () => {
        const currentList = isShuffled ? shuffledSongs : songs;
        const currentIndex = getCurrentSongIndex();

        if (currentIndex === -1 || currentList.length === 0) return;

        const prevIndex = (currentIndex - 1 + currentList.length) % currentList.length;
        onPlay(currentList[prevIndex]);
        setIsPlaying(true);
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleProgressChange = (e) => {
        const val = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = val;
            setProgress(val);
            if (progressBarRef.current && audioRef.current.duration) {
                const progressPercent = (val / audioRef.current.duration) * 100;
                progressBarRef.current.style.setProperty('--progress', `${progressPercent}%`);
            }
        }
    };

    const handleVolumeChange = (e) => {
        const val = Number(e.target.value);
        setVolume(val);
        if (volumeBarRef.current) {
            volumeBarRef.current.style.setProperty('--volume', `${val * 100}%`);
        }
    };

    if (!current) return <div className="player spotify-player">Lade Songs …</div>;

    return (
        <div className="player spotify-player">
            <audio
                key={current._id}
                ref={audioRef}
                src={`/api/songs/${current._id}/audio`}
                autoPlay={isPlaying}
            />

            {/* Song info section */}
            <div className="song-info">
                <img
                    alt="cover"
                    src={`/api/songs/${current._id}/cover`}
                    className="cover"
                />
                <div className="song-details">
                    <h4 className="song-title">{current.title}</h4>
                    <small className="song-artist">{current.artist}</small>
                </div>
                <button className="like-btn">
                    <svg viewBox="0 0 16 16" width="16" height="16">
                        <path fill="currentColor"
                              d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.977L9.06 14.566a1.5 1.5 0 0 1-2.12 0L2.32 8.446A4.543 4.543 0 0 1 1.69 2zm3.158.252A3.082 3.082 0 0 0 2.49 7.337l.023.005L8 13.777l5.485-6.43.023-.005A3.081 3.081 0 0 0 11.28.787h-.002a3.117 3.117 0 0 0-2.551 2.463L8 4.295l-.727-2.045A3.116 3.116 0 0 0 4.848.252z"/>
                    </svg>
                </button>
            </div>

            {/* Main controls section */}
            <div className="player-controls">
                <div className="control-buttons">
                    <button
                        className={`control-btn shuffle-btn ${isShuffled ? "active" : ""}`}
                        onClick={toggleShuffle}
                    >
                        <svg viewBox="0 0 16 16" width="16" height="16">
                            <path
                                d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"
                                fill="currentColor"/>
                            <path
                                d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z"
                                fill="currentColor"/>
                        </svg>
                    </button>

                    <button className="control-btn prev-btn" onClick={handlePrevious}>
                        <svg viewBox="0 0 16 16" width="16" height="16">
                            <path
                                d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.85.85 0 0 1 1.35.69v12.108a.85.85 0 0 1-1.35.69L4 9.15V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"
                                fill="currentColor"/>
                        </svg>
                    </button>

                    <button className="play-pause-btn" onClick={togglePlay}>
                        {isPlaying ? (
                            <svg viewBox="0 0 16 16" width="20" height="20">
                                <path
                                    d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"
                                    fill="currentColor"/>
                            </svg>
                        ) : (
                            <svg viewBox="0 0 16 16" width="20" height="20">
                                <path
                                    d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"
                                    fill="currentColor"/>
                            </svg>
                        )}
                    </button>

                    <button className="control-btn next-btn" onClick={handleNext}>
                        <svg viewBox="0 0 16 16" width="16" height="16">
                            <path
                                d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.85.85 0 0 0 .7 1.797v12.108a.85.85 0 0 0 1.35.69L12 9.15V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"
                                fill="currentColor"/>
                        </svg>
                    </button>

                    <button
                        className={`control-btn repeat-btn ${isRepeating ? "active" : ""}`}
                        onClick={toggleRepeat}
                    >
                        <svg viewBox="0 0 16 16" width="16" height="16">
                            <path
                                d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z"
                                fill="currentColor"/>
                        </svg>
                    </button>
                </div>

                <div className="progress-container">
                    <span className="time-current">{formatTime(progress)}</span>
                    <input
                        ref={progressBarRef}
                        type="range"
                        min="0"
                        max={audioRef.current?.duration || 0}
                        value={progress}
                        onChange={handleProgressChange}
                        className="progress-bar"
                        style={{'--progress': audioRef.current?.duration ? `${(progress / audioRef.current.duration) * 100}%` : '0%'}}
                    />
                    <span className="time-total">{formatTime(audioRef.current?.duration || 0)}</span>
                </div>
            </div>

            {/* Volume control section */}
            <div className="volume-control">
                <svg viewBox="0 0 16 16" width="16" height="16">
                    <path
                        d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"
                        fill="currentColor"/>
                    <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z"
                          fill="currentColor"/>
                </svg>
                <input
                    ref={volumeBarRef}
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-bar"
                    style={{'--volume': `${volume * 100}%`}}
                />
            </div>
        </div>
    );
}