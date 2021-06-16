import React, { useContext, useEffect, useState } from "react"
import { SavedVideoContext } from "./SavedVideoProvider"
import "./SavedVideo.css"
import { useParams } from "react-router"

export const SavedVideo = () => {
    const { getSavedVideoById, getSavedVideosByUser, savedUserVideos } = useContext(SavedVideoContext)
    const [savedVideo, setSavedVideo] = useState({})
    const { videoId } = useParams()

    useEffect(() => {
        if (savedUserVideos.length > 0) {
            const video = savedUserVideos.find(v => v.id === parseInt(videoId))
            setSavedVideo(video)
        } else {
            getSavedVideoById(parseInt(videoId))
                .then(video => setSavedVideo(video))
        }
    }, [])

    return (
        <>

            <h2>{savedVideo.title}</h2>

        </>
    )


}