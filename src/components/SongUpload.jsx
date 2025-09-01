import {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./SongUpload.css";

export default function SongUpload() {
    const nav = useNavigate();
    const [saving, setSaving] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        setSaving(true);

        const data = new FormData(e.target);

        const res = await fetch("/api/songs", {  // gleicher Endpunkt wie in songs.js
            method: "POST",
            body: data,
        });

        setSaving(false);
        if (res.ok) {
            alert("Upload erfolgreich");
            nav("/");                // nach Startseite zurück
        } else {
            alert("Fehler beim Upload");
        }
    };

    return (
        <div className="upload-wrapper">
            <form onSubmit={handleUpload} className="upload-card">
                <h2>Song hochladen</h2>

                <input name="title" placeholder="Titel" required/><br/>
                <input name="artist" placeholder="Artist" required/><br/>
                <input name="album" placeholder="Album"/><br/>
                <input name="genre" placeholder="Genres (Komma-getrennt)"/><br/>
                <input name="duration" type="number" placeholder="Dauer in Sekunden"/><br/>
                <input name="releaseYear" type="number" placeholder="Erscheinungsjahr"/><br/><br/>

                <label>Audiodatei (mp3):
                    <input type="file" name="audio" accept="audio/mpeg" required/>
                </label><br/><br/>

                <label>Cover (jpg/png):
                    <input type="file" name="cover" accept="image/jpeg,image/png" required/>
                </label><br/><br/>

                <button type="submit" disabled={saving}>
                    {saving ? "Lade hoch…" : "Hochladen"}
                </button>
            </form>
        </div>
    );
}