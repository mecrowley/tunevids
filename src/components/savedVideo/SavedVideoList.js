import React, { useContext, useEffect, useState } from "react"
import { SavedVideoContext } from "./SavedVideoProvider"
import { YoutubeDataContext } from "../YoutubeDataProvider";
import "./SavedVideo.css"
import { Link } from "react-router-dom"

export const SavedVideoList = () => {
    const { getSavedVideosByUser, savedUserVideos, addSavedVideo, deleteSavedVideo } = useContext(SavedVideoContext)
    const { getYoutubeVideoById } = useContext(YoutubeDataContext)
    const [video, setVideo] = useState({})

    useEffect(() => {
        getSavedVideosByUser(parseInt(localStorage.getItem("tv_user")))
    }, [])

    savedUserVideos.sort((a,b) => {
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
                setVideo({url: ""})
                getSavedVideosByUser(parseInt(localStorage.getItem("tv_user")))
            })
    }

    return (
        <>
            <h1>Saved Videos</h1>

            <div className="addInput">
                <fieldset>
                    <label htmlFor="url">Add Video:</label>
                    <input type="text" id="url" className="input-field" required autoFocus placeholder="Video url" value={video.url} onChange={handleControlledInputChange} />
                    <button className="addButton" onClick={handleAddVideo}>
                        Submit
            </button>
                </fieldset>
            </div>


            <div className="savedVideos">
                {
                    savedUserVideos.map(v => {
                        return (
                            <>
                                <div className="savedVideo">
                                    <Link to={`/savedvideos/detail/${v.id}`}>
                                        <h4>{v.title}</h4>
                                    </Link>
                                    <button className="button" onClick={() => {
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
        </>
    )
}