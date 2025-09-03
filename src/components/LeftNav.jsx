import "./LeftNav.css";

import {useState} from "react";
import SearchIcon from "@mui/icons-material/Search";
import FilterIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import ZoomInIcon from "@mui/icons-material/ZoomInMap";
import ZoomOutIcon from "@mui/icons-material/ZoomOutMap";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LeftDoubleArrowIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import RightDoubleArrowIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

export default function LeftNav({collapsed, setCollapsed}) {
    const [expanded, setExpanded] = useState(false);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
        if (expanded) setExpanded(false);
    };

    const toggleExpand = () => {
        setExpanded(!expanded);
        if (collapsed) setCollapsed(false);
    };
    return (<div
        className={`left-nav ${collapsed ? "collapsed" : ""} ${
            expanded ? "expanded" : ""
        }`}
    >
        <div className="left-nav-top">
            <div className="left-nav-row bib-left-nav">
                <div onClick={toggleCollapse} className="nav-toggle-container">
                    <div className="nav-text-container">
                        <LeftDoubleArrowIcon className="LeftDoubleArrowIcon"/>
                        <span className="nav-text">Bibliothek</span>
                    </div>
                    <RightDoubleArrowIcon className="RightDoubleArrowIcon"/>
                    <MenuBookIcon className="MenuBookIcon"/>
                </div>
                <div className="create-left-nav">
                    <AddIcon/> <span className="nav-text">Erstellen</span>
                </div>
                <div>
                    {expanded ? (
                        <ZoomInIcon className="zoom-icon" onClick={toggleExpand}/>
                    ) : (
                        <ZoomOutIcon className="zoom-icon" onClick={toggleExpand}/>
                    )}
                </div>
            </div>

            <div className="left-nav-row">
                <ul className="left-nav-filter-list">
                    <li>Playlists</li>
                    <li>Podcasts</li>
                    <li>Alben</li>
                    <li>Künstler*in</li>
                </ul>
            </div>

            <div className="left-nav-row with-filter">
                <div className="searchbar left-nav-search">
                    <SearchIcon/>
                    <input type="text" placeholder="Bibliothek durchsuchen"/>
                </div>
                <div className="search-filter-group">
                    <span className="search-text">Zuletzt</span>
                    <FilterIcon className="filter-icon"/>
                </div>
            </div>
        </div>
        <div className="left-nav-bottom"></div>
    </div>)
}