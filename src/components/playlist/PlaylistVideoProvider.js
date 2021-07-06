import React, { useState, createContext } from "react"

export const PlaylistVideoContext = createContext()

export const PlaylistVideoProvider = (props) => {
    const [playlistVideos, setPlaylistVideos] = useState([{title: ""}])
    const [initialize, setInitialize] = useState(false)
    const API = "http://localhost:8088"

    const getPlaylistVideosByUser = userId => {
        return fetch(`${API}/playlistVideos?userId=${userId}`)
            .then(res => res.json())
            .then((response) => {
                setPlaylistVideos(response)
            })
    }

    const getPlaylistVideosByPlaylistId = playlistId => {
        return fetch(`${API}/playlistVideos?playlistId=${playlistId}`)
            .then(res => res.json())
            .then((response) => {
                setPlaylistVideos(response)
            })
    }

    const addToGenPlaylist = (video) => {
        return fetch(`${API}/playlistVideos/${video.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(video)
        })
            .then(res => res.json())
    }

    const addPlaylistVideo = videoObj => {
        return fetch(`${API}/playlistVideos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(videoObj)
        })
    }

    const deletePlaylistVideo = videoId => {
        return fetch(`${API}/playlistVideos/${videoId}`, {
            method: "DELETE"
        })
    }

    return (
        <PlaylistVideoContext.Provider value={{
            playlistVideos, getPlaylistVideosByUser, getPlaylistVideosByPlaylistId, addToGenPlaylist, addPlaylistVideo, deletePlaylistVideo, initialize, setInitialize
        }}>
            {props.children}
        </PlaylistVideoContext.Provider>
    )
}