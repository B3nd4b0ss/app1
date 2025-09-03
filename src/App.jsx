import "./App.css";
import TopNav from "./components/TopNav";
import LeftNav from "./components/LeftNav";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Player from "./components/Player";
import SongUpload from "./components/SongUpload";

import {Routes, Route, Navigate, Outlet} from "react-router-dom";
import {useEffect, useState, Fragment} from "react";

const isAuthenticated = () => Boolean(localStorage.getItem('token'));

function AuthOnlyPublic() {
    return isAuthenticated() ? <Navigate to="/" replace/> : <Outlet/>;
}

function RequireAuth() {
    return isAuthenticated() ? <Outlet/> : <Navigate to="/register" replace/>;
}

function MainLayout({collapsed, setCollapsed, songs, current, onPlay, fetchSongs}) {
    const navWidth = collapsed ? "80px" : "20%";
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        document.documentElement.style.setProperty("--left-nav-width", navWidth);
    }, [navWidth]);

    const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (<Fragment>
        <TopNav onSearchChange={setSearchQuery}></TopNav>
        <LeftNav collapsed={collapsed} setCollapsed={setCollapsed}></LeftNav>

        <div className="main-content">
            <div className="content-filter">
                <ul>
                    <li>Alle</li>
                    <li>Musik</li>
                    <li>Podcasts</li>
                    <li>Hörbücher</li>
                </ul>
            </div>
            <div className="content-wrapper">
                <ul className="last-visited-content">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <ul className="song-list">
                    {filteredSongs.map(s => (<li
                        key={s._id}
                        onClick={() => {
                            onPlay(s);
                            fetchSongs();
                        }}
                        className={` songlist-item ${s._id === current?._id ? "active" : ""}`}>
                        <div className="`songlist-item-content`">
                            <img
                                src={`/api/songs/${s._id}/cover`}
                                alt={s.title}
                                className="songlist-item-cover"
                            />
                            <div className="songlist-item-title">{s.title}</div>
                        </div>

                    </li>))}
                </ul>
            </div>
        </div>
        <div className="song-informations"></div>
        <Player songs={songs} current={current} onPlay={onPlay}/>
    </Fragment>);
}

function App() {
    const [collapsed, setCollapsed] = useState(false);
    const [songs, setSongs] = useState([]);
    const [current, setCurrent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSongs = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/songs");
            if (!res.ok) throw new Error("Server error " + res.status);
            const data = await res.json();
            setSongs(data);
            if (data.length && !current) setCurrent(data[0]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isAuthenticated()) {
            fetchSongs();
        }
    }, []);

    const onPlay = song => {
        setCurrent(song);
    }

    return (<div className="App">
        <Routes>
            <Route element={<AuthOnlyPublic/>}>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
            </Route>

            <Route element={<RequireAuth/>}>
                <Route
                    path="*"
                    element={<MainLayout
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                        songs={songs}
                        current={current}
                        onPlay={onPlay}
                        fetchSongs={fetchSongs}
                    />}
                />
                <Route path="/upload" element={<SongUpload/>}/>
            </Route>

        </Routes>
    </div>);
}

export default App;