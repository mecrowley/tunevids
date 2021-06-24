import React, { useEffect, useContext, useState } from "react"
import { PlaylistContext } from "../playlist/PlaylistProvider"
import { PlaylistVideoContext } from "../playlist/PlaylistVideoProvider"
import { SavedVideoContext } from "../savedVideo/SavedVideoProvider"
import { UserContext } from "../user/UserProvider"
import { UserChannelContext } from "../userChannel/UserChannelProvider"
import { GeneratePlaylist } from "./GeneratePlaylist"
import "./PlaylistGenerator.css"

export const PlaylistGenerator = () => {
    const { user, getUserById } = useContext(UserContext)
    const { getSavedVideosByUser, savedUserVideos } = useContext(SavedVideoContext)
    const { getUserChannelsByUser, userChannels } = useContext(UserChannelContext)
    const { getPlaylistsByUser } = useContext(PlaylistContext)
    const { getPlaylistVideosByPlaylistId, playlistVideos, setInitialize } = useContext(PlaylistVideoContext)
    const [playlists, setPlaylists] = useState([])

    useEffect(() => {
        getUserById(parseInt(localStorage.getItem("tv_user")))
            .then(getSavedVideosByUser(parseInt(localStorage.getItem("tv_user"))))
            .then(getUserChannelsByUser(parseInt(localStorage.getItem("tv_user"))))
    }, [])

    useEffect(() => {
        getPlaylistsByUser(parseInt(localStorage.getItem("tv_user")))
            .then(response => {
                const genPlaylist = response.find(p => p.name === "genList")
                getPlaylistVideosByPlaylistId(genPlaylist.id)
                response.shift()
                setPlaylists(response)
            })
    }, [])

    return (
        <>
            <h2>Hello, {user.firstName}</h2>

            <div className="flex-container video-details">
                <div className="center video-embed">
                    <iframe id="ytplayer" type="text/html" width="720" height="405"
                        src={`https://www.youtube.com/embed/?playlist=${playlistVideos.map(v => {
                            return v.ytId
                        }).join()}&version=3`}
                        frameborder="0" allowfullscreen></iframe>

            <div className="video-list">
                <GeneratePlaylist savedVideos={savedUserVideos} userChannels={userChannels} playlistVideos={playlistVideos} playlists={playlists}/>
                </div>

                        <button classname="playlistGenButton" onClick={event => {
                            event.preventDefault()
                            setInitialize(true)
                        }}>Generate New Playlist</button>
                    </div>
                </div>
        </>
    )
}