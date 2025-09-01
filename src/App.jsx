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

function MainLayout({collapsed, setCollapsed}) {
    const navWidth = collapsed ? "80px" : "20%";

    useEffect(() => {
        document.documentElement.style.setProperty("--left-nav-width", navWidth);
    }, [navWidth]);

    return (
        <Fragment>
            <TopNav></TopNav>
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
            </div>
            <div className="song-informations"></div>
            <Player/>
        </Fragment>
    );
}

function App() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="App">
            <Routes>
                <Route element={<AuthOnlyPublic/>}>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                </Route>

                <Route element={<RequireAuth/>}>
                    <Route
                        path="*"
                        element={<MainLayout collapsed={collapsed} setCollapsed={setCollapsed}/>}
                    />
                    <Route path="/upload" element={<SongUpload/>}/>
                </Route>

            </Routes>
        </div>
    );
}

export default App;
