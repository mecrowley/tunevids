import React, { useContext, useEffect, useState } from "react"
import { PlaylistContext } from "./PlaylistProvider"
import "./Playlist.css"
import { useHistory } from "react-router"
import { Link } from "react-router-dom"

export const PlaylistList = () => {
    const { getPlaylistsByUser, addPlaylist } = useContext(PlaylistContext)
    const [playlists, setPlaylists] = useState([])
    const [playlist, setPlaylist] = useState({})
    const history = useHistory()

    useEffect(() => {
        getPlaylistsByUser(parseInt(localStorage.getItem("tv_user")))
            .then(playlists => {
                playlists.shift()
                setPlaylists(playlists)
            })
    }, [])

    playlists.sort((a, b) => {
        return b.timestamp - a.timestamp
    })

    const handleControlledInputChange = (event) => {
        const newPlaylist = { ...playlist }
        newPlaylist[event.target.id] = event.target.value
        setPlaylist(newPlaylist)
    }

    const handleCreatePlaylist = () => {
        addPlaylist({
            userId: parseInt(localStorage.getItem("tv_user")),
            name: playlist.name,
            timestamp: Date.now()
        })
            .then(() => {
                getPlaylistsByUser(parseInt(localStorage.getItem("tv_user")))
                    .then(playlists => {
                        playlists.shift()
                        setPlaylists(playlists)
                    })
            })
    }

    return (
        <>

            <h1>Playlists</h1>

            <div className="addInput">
                <fieldset>
                    <label htmlFor="url">Create New Playlist:</label>
                    <input type="text" id="name" className="input-field" required autoFocus placeholder="Playlist Name" value={playlist.name} onChange={handleControlledInputChange} />
                    <button className="addButton" onClick={e => {
                        e.preventDefault()
                        handleCreatePlaylist()
                    }
                    }>
                        Submit
            </button>
                </fieldset>
            </div>

            <div className="playlists flex-container">
                {playlists.map(p => {
                    return (
                        <div className="playlist">
                            <Link to={`/playlists/detail/${p.id}`}><h4>{p.name}</h4></Link>
                        </div>
                    )
                })}
            </div>

        </>
    )

}