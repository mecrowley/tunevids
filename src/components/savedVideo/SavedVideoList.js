import React, { useContext, useEffect, useState } from "react"
import { SavedVideoContext } from "./SavedVideoProvider"
import { PlaylistContext } from "../playlist/PlaylistProvider";
import { PlaylistVideoContext } from "../playlist/PlaylistVideoProvider";
import { YoutubeDataContext } from "../YoutubeDataProvider";
import "./SavedVideo.css"
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

export const SavedVideoList = () => {
    const { getSavedVideosByUser, savedUserVideos, addSavedVideo, deleteSavedVideo } = useContext(SavedVideoContext)
    const { getPlaylistsByUser } = useContext(PlaylistContext)
    const { addPlaylistVideo } = useContext(PlaylistVideoContext)
    const { getYoutubeVideoById } = useContext(YoutubeDataContext)
    const [playlists, setPlaylists] = useState([])
    const [video, setVideo] = useState({})
    const [videoAdded, setVideoAdded] = useState(null)

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
        if (youtubeId) {
            getYoutubeVideoById(youtubeId)
                .then((response) => {
                    if (response.items[0]) {
                        addSavedVideo({
                            userId: parseInt(localStorage.getItem("tv_user")),
                            title: response.items[0].snippet.title,
                            ytId: youtubeId,
                            ytChannelId: response.items[0].snippet.channelId,
                            channelName: response.items[0].snippet.channelTitle,
                            duration: response.items[0].contentDetails.duration,
                            thumbnail: response.items[0].snippet.thumbnails.default.url,
                            timestamp: Date.now()
                        })
                            .then(() => {
                                setVideo({ url: "" })
                                setVideoAdded(null)
                                getSavedVideosByUser(parseInt(localStorage.getItem("tv_user")))
                            })
                    } else {
                        setVideoAdded(<div className="fail">Video not added!  Please enter a valid url</div>)
                    }
                })
        } else {
            setVideoAdded(<div className="fail">Video not added!  Please enter a valid url</div>)
        }
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
                            {videoAdded}
                        </fieldset>
                    </div>


                    <div className="video-list">
                        {
                            savedUserVideos.map(v => {
                                return (
                                    <>
                                        <div className="video flex-container">
                                            <div className="icon">
                                                {savedUserVideos.find(sv => sv.title === v.title) ?
                                                    <FavoriteIcon onClick={e => {
                                                        e.preventDefault()
                                                        deleteSavedVideo(savedUserVideos.find(sv => sv.title === v.title).id)
                                                            .then(() => {
                                                                getSavedVideosByUser(parseInt(localStorage.getItem("tv_user")))
                                                            })
                                                    }} /> :
                                                    <FavoriteBorderIcon onClick={e => {
                                                        e.preventDefault()
                                                        getYoutubeVideoById(v.ytId)
                                                            .then(response => {
                                                                addSavedVideo({
                                                                    userId: parseInt(localStorage.getItem("tv_user")),
                                                                    title: response.items[0].snippet.title,
                                                                    ytId: v.ytId,
                                                                    ytChannelId: response.items[0].snippet.channelId,
                                                                    channelName: response.items[0].snippet.channelTitle,
                                                                    duration: response.items[0].contentDetails.duration,
                                                                    thumbnail: response.items[0].snippet.thumbnails.default.url,
                                                                    timestamp: Date.now()
                                                                })
                                                                    .then(() => {
                                                                        getSavedVideosByUser(parseInt(localStorage.getItem("tv_user")))
                                                                    })
                                                            })
                                                    }
                                                    } />}
                                            </div>
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
                                                            ytId: v.ytId,
                                                            thumbnail: v.thumbnail
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