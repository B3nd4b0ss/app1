import "./TopNav.css";
import HomeIcon from "@mui/icons-material/Home";
import AccountIcon from "@mui/icons-material/AccountCircle";
import LeftArrowIcon from "@mui/icons-material/ChevronLeft";
import RightArrowIcon from "@mui/icons-material/ChevronRight";
import NotificationIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/MoreHoriz";
import FriendIcon from "@mui/icons-material/Group";
import SearchIcon from "@mui/icons-material/Search";

import {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";

export default function TopNav() {
    const [open, setOpen] = useState(false);
    const nav = useNavigate();
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });

    const logout = () => {
        localStorage.removeItem('token');
        nav('/login', {replace: true});
    }

    return (
        <div className="top-nav">
            <div className="top-nav-left">
                <SettingsIcon/>
                <div className="top-nav-arrows">
                    <LeftArrowIcon/>
                    <RightArrowIcon/>
                </div>
            </div>

            <div className="top-nav-middle">
                <div className="gray-background-circle">
                    <HomeIcon/>
                </div>
                <div className="searchbar">
                    <SearchIcon/>
                    <input type="text" placeholder="Was möchtest du wiedergeben?"/>
                </div>
            </div>
            <div className="top-nav-right">
                <NotificationIcon/>
                <FriendIcon/>
                <div className="top-nav-account-wrapper" ref={menuRef}>
                    <div className={`gray-background-circle account-btn ${open ? "menu-open" : ""}`}
                         onClick={() => setOpen((o) => !o)}>
                        <AccountIcon/>
                        {open && (
                            <ul className={"top-nav-dropdown"}>
                                <li onClick={() => nav('/profil')}>Profil</li>
                                <li onClick={() => nav('/settings')}>Einstellungen</li>
                                <li onClick={() => nav('/upload')}>Song hochladen</li>
                                <li onClick={logout}>Abmelden</li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
