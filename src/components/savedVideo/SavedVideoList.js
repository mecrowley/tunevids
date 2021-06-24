import React, { useContext, useEffect, useState } from "react"
import { SavedVideoContext } from "./SavedVideoProvider"
import { PlaylistContext } from "../playlist/PlaylistProvider";
import { YoutubeDataContext } from "../YoutubeDataProvider";
import "./SavedVideo.css"
import { PlaylistVideoContext } from "../playlist/PlaylistVideoProvider";

export const SavedVideoList = () => {
    const { getSavedVideosByUser, savedUserVideos, addSavedVideo, deleteSavedVideo } = useContext(SavedVideoContext)
    const { getPlaylistsByUser } = useContext(PlaylistContext)
    const { addPlaylistVideo } = useContext(PlaylistVideoContext)
    const { getYoutubeVideoById } = useContext(YoutubeDataContext)
    const [playlists, setPlaylists] = useState([])
    const [video, setVideo] = useState({})

    useEffect(() => {
        getSavedVideosByUser(parseInt(localStorage.getItem("tv_user")))
            .then(() => {
                getPlaylistsByUser(parseInt(localStorage.getItem("tv_user")))
                    .then(playlists => {
                        playlists.shift()
                        setPlaylists(playlists)
                    })
            })
    }, [])

    savedUserVideos.sort((a, b) => {
        return b.timestamp - a.timestamp
    })

    const handleControlledInputChange = (event) => {
        const newVideo = { ...video }
        newVideo[event.target.id] = event.target.value
        setVideo(newVideo)
    }

    const handleAddVideo = () => {
        const videoURL = video.url
        const [, youtubeId] = videoURL.split(".be/")
        getYoutubeVideoById(youtubeId)
            .then((response) => {
                console.log(response.items[0])
                addSavedVideo({
                    userId: parseInt(localStorage.getItem("tv_user")),
                    title: response.items[0].snippet.title,
                    ytId: youtubeId,
                    ytChannelId: response.items[0].snippet.channelId,
                    channelName: response.items[0].snippet.channelTitle,
                    duration: response.items[0].contentDetails.duration,
                    timestamp: Date.now()
                })
            }).then(() => {
                setVideo({ url: "" })
                getSavedVideosByUser(parseInt(localStorage.getItem("tv_user")))
            })
    }

    return (
        <>
            <h1>Saved Videos</h1>

            <div className="video-details flex-container">
                <div className="video-embed center">
                    <iframe id="ytplayer" type="text/html" width="720" height="405"
                        src={`https://www.youtube.com/embed/?playlist=${savedUserVideos.map(v => v.ytId).join()}&version=3`}
                        frameborder="0" allowfullscreen></iframe>

                    <div className="addInput">
                        <fieldset>
                            <label htmlFor="url">Add Video:</label>
                            <input type="text" id="url" className="input-field" required autoFocus placeholder="Video url" value={video.url} onChange={handleControlledInputChange} />
                            <button className="addButton" onClick={handleAddVideo}>
                                Submit
            </button>
                        </fieldset>
                    </div>


                    <div className="video-list">
                        {
                            savedUserVideos.map(v => {
                                return (
                                    <>
                                        <div className="video flex-container">
                                            <div className="title">
                                                {v.title}
                                            </div>
                                            <div className="dropdown">
                                                <select name="playlistId" id="playlistId" className="dropdown" value={video.playlistId}
                                                    onChange={(event) => {
                                                        addPlaylistVideo({
                                                            playlistId: parseInt(event.target.value),
                                                            userId: parseInt(localStorage.getItem("tv_user")),
                                                            title: v.title,
                                                            ytId: v.ytId
                                                        })
                                                    }}>
                                                    <option value="0">Add to playlist</option>
                                                    {
                                                        playlists.map(p => (
                                                            <option key={p.id} value={p.id}>
                                                                {p.name}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <button className="remove-button" onClick={() => {
                                                deleteSavedVideo(v.id)
                                                    .then(() => {
                                                        getSavedVideosByUser(parseInt(localStorage.getItem("tv_user")))
                                                    })
                                            }}>
                                                Remove
                                    </button>
                                        </div>
                                    </>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}