import {Buffer} from "buffer";

globalThis.Buffer = globalThis.Buffer || Buffer;

import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {parseBlob} from "music-metadata-browser";
import "./SongUpload.css";


export default function SongUpload() {
    const nav = useNavigate();

    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formValues, setFormValues] = useState({
        title: "",
        artist: "",
        album: "",
        genre: "",
        duration: "",
        releaseYear: "",
    });

    const handleChange = (e) =>
        setFormValues({...formValues, [e.target.name]: e.target.value});

    const readMetaData = async (file) => {
        if (!file) return;
        try {
            const {common, native} = await parseBlob(file);

            let year =
                common.year ??
                common.date ??
                (() => {
                    const frames = Object.values(native || {}).flat();
                    const hit = frames.find((f) =>
                        ["TDRC", "TYER", "YEAR", "TDAT"].includes(f.id)
                    );
                    return hit?.value;
                })();
            if (typeof year === "string") year = year.slice(0, 4);
            if (Array.isArray(year)) year = year[0];

            let genre =
                (common.genre && common.genre.join(", ")) ??
                (() => {
                    const frames = Object.values(native || {}).flat();
                    const hit = frames.find((f) => f.id === "TCON");
                    return hit?.value;
                })() ??
                "";

            setFormValues((v) => ({
                ...v,
                title: common.title ?? v.title,
                artist: common.artist ?? v.artist,
                album: common.album ?? v.album,
                genre: genre || v.genre,
                releaseYear: year || v.releaseYear,
            }));
        } catch (err) {
            console.error("Fehler beim Parsen der Metadaten:", err);
        }

        const audio = document.createElement("audio");
        audio.preload = "metadata";
        audio.src = URL.createObjectURL(file);
        audio.onloadedmetadata = () => {
            setFormValues((v) => ({...v, duration: Math.round(audio.duration)}));
            URL.revokeObjectURL(audio.src);
        };
    };

    const handleAudioSelect = (e) => {
        const file = e.target.files?.[0];
        readMetaData(file);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);

        const data = new FormData(e.target);
        Object.entries(formValues).forEach(([k, v]) => data.set(k, v));

        try {
            const res = await fetch(`/api/upload`, {
                method: "POST",
                body: data,
            });
            setSaving(false);

            if (res.ok) {
                setSuccess(true);
                e.target.reset();          // Formular leeren
            } else {
                alert("Fehler beim Upload");
            }
        } catch (err) {
            setSaving(false);
            alert("Server nicht erreichbar");
            console.error(err);
        }
    };

    return (
        <div className="upload-wrapper">
            <form onSubmit={handleUpload} className="upload-card">
                <h2>Song hochladen</h2>

                {success && (
                    <div style={{color: "var(--text-highlight)", textAlign: "center"}}>
                        ✔ Erfolgreich hochgeladen
                    </div>
                )}

                <input
                    name="title"
                    placeholder="Titel"
                    value={formValues.title}
                    onChange={handleChange}
                    required
                />
                <input
                    name="artist"
                    placeholder="Artist"
                    value={formValues.artist}
                    onChange={handleChange}
                    required
                />
                <input
                    name="album"
                    placeholder="Album"
                    value={formValues.album}
                    onChange={handleChange}
                />
                <input
                    name="genre"
                    placeholder="Genres (Komma-getrennt)"
                    value={formValues.genre}
                    onChange={handleChange}
                />
                <input
                    name="duration"
                    type="number"
                    placeholder="Dauer in Sekunden"
                    value={formValues.duration}
                    onChange={handleChange}
                />
                <input
                    name="releaseYear"
                    type="number"
                    placeholder="Erscheinungsjahr"
                    value={formValues.releaseYear}
                    onChange={handleChange}
                />

                <label>
                    Audiodatei (mp3):
                    <input
                        type="file"
                        name="audio"
                        accept="audio/mpeg"
                        onChange={handleAudioSelect}
                        required
                    />
                </label>

                <label>
                    Cover (jpg/png):
                    <input
                        type="file"
                        name="cover"
                        accept="image/jpeg,image/png"
                        required
                    />
                </label>

                <button type="submit" disabled={saving}>
                    {saving ? "Lade hoch…" : "Hochladen"}
                </button>
            </form>
        </div>
    );
}