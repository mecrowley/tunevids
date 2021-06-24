import React from "react"
import { Link } from "react-router-dom"
import "./NavBar.css"

export const NavBar = () => {
    return (
        <ul className="navbar">
            <li className="navbar__item active">
                <Link className="navbar__link" to="/">TuneVids</Link>
            </li>
            <li className="navbar__item">
                <Link className="navbar__link" to="/savedvideos">Saved Videos</Link>
            </li>
            <li className="navbar__item">
                <Link className="navbar__link" to="/savedchannels">Saved Channels</Link>
            </li>
            <li className="navbar__item">
                <Link className="navbar__link" to="/playlists">Playlists</Link>
            </li>
            <li className="navbar__item">
                <Link className="navbar__link" to="/"
                onClick={
                    (event) => {
                        localStorage.removeItem("tv_user")
                    }
                }>Logout</Link>
            </li>
        </ul>
    )
}