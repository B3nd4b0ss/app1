import {useEffect, useRef, useState} from "react";
import "./Player.css";

export default function Player() {
    const audioRef = useRef(null);
    const [songs, setSongs] = useState([]);
    const [current, setCurrent] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);   // Sekunden

    /* --- Metadaten laden -------------------------------------------------- */
    useEffect(() => {
        fetch("/api/songs")
            .then(res => res.json())
            .then(data => {
                setSongs(data);
                if (data.length) setCurrent(data[0]);            // ersten Song wählen
            });
    }, []);

    /* --- Audio-Events ------------------------------------------------------ */
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const timeHandler = () => setProgress(audio.currentTime);
        audio.addEventListener("timeupdate", timeHandler);
        audio.addEventListener("ended", () => setIsPlaying(false));

        return () => {
            audio.removeEventListener("timeupdate", timeHandler);
        };
    }, [audioRef.current]);

    /* --- Play/Pause -------------------------------------------------------- */
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

    /* --- Songwechsel ------------------------------------------------------- */
    const playSong = song => {
        setCurrent(song);
        setProgress(0);
        setIsPlaying(true);
        // audio src ändert sich über key -> useEffect oben greift erneut
    };

    if (!current) return <div className="player">Lade Songs …</div>;

    return (
        <div className="player">
            {/* Verstecktes Audio-Element */}
            <audio
                key={current._id}                            // zwingt Neuladen beim Songwechsel
                ref={audioRef}
                src={`/api/songs/${current._id}/audio`}
                autoPlay={isPlaying}
            />

            {/* Cover & Infos */}
            <div className="info">
                <img
                    alt="cover"
                    src={`/api/songs/${current._id}/cover`}
                    className="cover"
                />
                <div>
                    <h4>{current.title}</h4>
                    <small>{current.artist}</small>
                </div>
            </div>

            {/* Progressbar */}
            <input
                type="range"
                min="0"
                max={audioRef.current?.duration || 0}
                value={progress}
                onChange={e => {
                    const val = Number(e.target.value);
                    audioRef.current.currentTime = val;
                    setProgress(val);
                }}
            />

            <div className="controls">
                <button onClick={togglePlay}>
                    {isPlaying ? "Pause" : "Play"}
                </button>
            </div>

            {/* Playlist – einfache Liste */}
            <ul className="playlist">
                {songs.map(s => (
                    <li
                        key={s._id}
                        onClick={() => playSong(s)}
                        className={s._id === current._id ? "active" : ""}
                    >
                        {s.title} – {s.artist}
                    </li>
                ))}
            </ul>
        </div>
    );
}