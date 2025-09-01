import {useState} from "react";
import {useNavigate} from "react-router-dom";
import jsmediatags from "jsmediatags";
import "./SongUpload.css";

export default function SongUpload() {
    const nav = useNavigate();
    const [saving, setSaving] = useState(false);

    const [formValues, setFormValues] = useState({
            title:
                "",
            artist:
                "",
            album:
                "",
            genre:
                "",
            duration:
                "",
            releaseYear:
                "",

        })
    ;

    const handleChange = (e) =>
        setFormValues({...formValues, [e.target.name]: e.target.value});


    const readMetaData = (file) => {
        jsmediatags.read(file, {
            onSuccess:
                ({tags}) => {
                    setFormValues(v => ({

                        ...
                            v,
                        title:
                            tags.title || v.title,
                        artist:
                            tags.artist || v.artist,
                        album:
                            tags.album || v.album,
                        genre:
                            tags.genre || v.genre,
                        releaseYear:
                            tags.year || v.releaseYear,

                    }))
                    ;
                },
            onError:
                () => {
                }

        })
        ;

        const audio = document.createElement("audio");
        audio.preload = "metadata";
        audio.src = URL.createObjectURL(file);
        audio.onloadedmetadata = () => {
            setFormValues(v => ({...v, duration: Math.round(audio.duration)}));
            URL.revokeObjectURL(audio.src);

        };
    };

    const handleAudioSelect = (e) => {

        const file = e.target.files?.[0];

        if (file) readMetaData(file);

    };


    const handleUpload = async (e) => {
        e.preventDefault();
        setSaving(true);

        const data = new FormData(e.target);
        Object.entries(formValues).forEach(([k, v]) => data.set(k, v));

        const res = await fetch("/api/songs", {
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