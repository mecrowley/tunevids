import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router"
import { YoutubeDataContext } from "../YoutubeDataProvider";
import { PlaylistContext } from "./PlaylistProvider";
import { PlaylistVideoContext } from "./PlaylistVideoProvider";
import { SavedVideoContext } from "../savedVideo/SavedVideoProvider";
import "./Playlist.css"
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

export const PlaylistDetail = () => {
    const { getPlaylistById, playlist, deletePlaylist } = useContext(PlaylistContext)
    const { savedUserVideos, getSavedVideosByUser, addSavedVideo, deleteSavedVideo } = useContext(SavedVideoContext)
    const { getPlaylistVideosByPlaylistId, playlistVideos, addPlaylistVideo, deletePlaylistVideo } = useContext(PlaylistVideoContext)
    const { getYoutubeVideoById } = useContext(YoutubeDataContext)
    const [video, setVideo] = useState({})
    const { playlistId } = useParams()
    const history = useHistory()

    useEffect(() => {
        getPlaylistById(parseInt(playlistId))
            .then(() => { getPlaylistVideosByPlaylistId(parseInt(playlistId)) })
            .then(() => { getSavedVideosByUser(parseInt(localStorage.getItem("tv_user"))) })
    }, [])

    playlistVideos.sort((a, b) => {
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
                addPlaylistVideo({
                    userId: parseInt(localStorage.getItem("tv_user")),
                    title: response.items[0].snippet.title,
                    ytId: youtubeId,
                    thumbnail: response.items[0].snippet.thumbnails.default.url,
                    timestamp: Date.now()
                })
            }).then(() => {
                setVideo({ url: "" })
                getPlaylistVideosByPlaylistId(parseInt(localStorage.getItem("tv_user")))
            })
    }

    return (
        <>

            <h2>{playlist.name}</h2>

            <div className="video-details flex-container">
                <div className="video-embed center">
                    <iframe id="ytplayer" type="text/html" width="720" height="405"
                        src={`https://www.youtube.com/embed/?playlist=${playlistVideos.map(v => v.ytId).join()}&version=3`}
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
                            playlistVideos.map(v => {
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

                                            <button className="remove-button" onClick={() => {
                                                deletePlaylistVideo(v.id)
                                                    .then(() => {
                                                        getPlaylistVideosByPlaylistId(parseInt(playlistId))
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
                    <button onClick={e => {
                        e.preventDefault()
                        Promise.all(playlistVideos.map(pv => {return deletePlaylistVideo(pv.id)}))
                        .then(() => {
                            deletePlaylist(playlist.id)
                        }).then(history.push("/playlists"))
                    }}>Delete Playlist</button>
                </div>
            </div>

        </>
    )
}