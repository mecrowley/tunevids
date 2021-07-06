import React, { useState, createContext } from "react"

export const PlaylistContext = createContext()

export const PlaylistProvider = (props) => {
    const [playlist, setPlaylist] = useState({})
    const [playlistWarning, setPlaylistWarning] = useState(null)

    const getPlaylistsByUser = userId => {
        return fetch(`http://localhost:8088/playlists?userId=${userId}`)
        .then(res => res.json())
    }
    
    const getPlaylistById = playlistId => {
        return fetch(`http://localhost:8088/playlists/${playlistId}`)
        .then(res => res.json())
        .then(setPlaylist)
    }

    const addPlaylist = playlistObj => {
        return fetch("http://localhost:8088/playlists", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(playlistObj)
        })
        .then(res => res.json())
    }

    const editPlaylist = playlistObj => {
        return fetch(`http://localhost:8088/playlists/${playlistObj.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(playlistObj)
        })
    }

    const deletePlaylist = playlistId => {
        return fetch(`http://localhost:8088/playlists/${playlistId}`, {
            method: "DELETE"
        })
    }

    return (
        <PlaylistContext.Provider value={{
            playlist, getPlaylistsByUser, getPlaylistById, addPlaylist, editPlaylist, deletePlaylist, playlistWarning, setPlaylistWarning
        }}>
            {props.children}
        </PlaylistContext.Provider>
    )
}