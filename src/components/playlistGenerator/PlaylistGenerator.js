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
    const { getPlaylistsByUser, addPlaylist, playlistWarning, setPlaylistWarning } = useContext(PlaylistContext)
    const { getPlaylistVideosByPlaylistId, playlistVideos, addPlaylistVideo, setInitialize } = useContext(PlaylistVideoContext)
    const [playlists, setPlaylists] = useState([])
    const [playlistSaved, setPlaylistSaved] = useState(false)

    useEffect(() => {
        setPlaylistWarning(null)
    }, [])
    
    useEffect(() => {
        getUserById(parseInt(localStorage.getItem("tv_user")))
            .then(getSavedVideosByUser(parseInt(localStorage.getItem("tv_user"))))
            .then(getUserChannelsByUser(parseInt(localStorage.getItem("tv_user"))))
    }, [])

        useEffect(() => {
            getPlaylistsByUser(parseInt(localStorage.getItem("tv_user")))
                .then(response => {
                    if (response.length < 1) {
                        getPlaylistVideosByPlaylistId(response.id)
                        setPlaylists(response)
                    } else {
                        const genPlaylist = response.find(p => p.name === "genList")
                        getPlaylistVideosByPlaylistId(genPlaylist.id)
                        response.shift()
                        setPlaylists(response)
                    }
                })
        }, [])

    return (
        <>
            <h2>Hello, {user.firstName}</h2>

            <div className="flex-container video-embed">
                <div className="center video-details">
                    <iframe id="ytplayer" type="text/html" width="720" height="405"
                        src={`https://www.youtube.com/embed/?playlist=${playlistVideos.map(v => {
                            return v.ytId
                        }).join()}&version=3`}
                        frameborder="0" allowfullscreen></iframe>

                    <div className="video-list">
                        <GeneratePlaylist userChannels={userChannels} playlistVideos={playlistVideos} playlists={playlists} />
                    </div>
                    <div className="buttons">
                    <button onClick={e => {
                        e.preventDefault()
                        addPlaylist({
                            userId: parseInt(localStorage.getItem("tv_user")),
                            name: `Playlist ${new Date(Date.now()).toLocaleDateString('en-US')}`,
                            timestamp: Date.now()
                        }).then(response => {
                            Promise.all(playlistVideos.map(pv => {
                                if (pv.title === "") { return } else {
                                    return addPlaylistVideo({
                                        playlistId: response.id,
                                        userId: parseInt(localStorage.getItem("tv_user")),
                                        title: pv.title,
                                        ytId: pv.ytId,
                                        thumbnail: pv.thumbnail
                                    })
                                }
                            })).then(() => setPlaylistSaved(true))
                        })
                    }}>{playlistSaved ? "Playlist Saved!" : "Save Playlist"}</button>
                    <button classname="playlistGenButton" onClick={event => {
                        event.preventDefault()
                        if (userChannels.length > 4) {
                            setPlaylistWarning(null)
                            setInitialize(true)
                    } else {setPlaylistWarning(<div className="fail">You must have at least 5 Channels saved to generate a new playlist</div>)}
                    }}>Generate New Playlist</button>
                    </div>
                    {playlistWarning}
                </div>
            </div>
        </>
    )
}