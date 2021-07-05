import React, { useContext, useState } from "react"
import { SavedVideoContext } from "../savedVideo/SavedVideoProvider"
import { YoutubeDataContext } from "../YoutubeDataProvider"

export const NewUserVideos = () => {
    const { addSavedVideo } = useContext(SavedVideoContext)
    const { getYoutubeVideoById } = useContext(YoutubeDataContext)
    const [video, setVideo] = useState({ url1: "", url2: "", url3: "", url4: "", url5: "" })

    const handleControlledInputChange = (event) => {
        const newVideo = { ...video }
        newVideo[event.target.id] = event.target.value
        setVideo(newVideo)
    }

    const handleAddVideos = () => {
        const videoURLs = []
        const video1URL = video.url1
        const [, youtubeId1] = video1URL.split(".be/")
        if (youtubeId1) {videoURLs.push(youtubeId1)}
        const video2URL = video.url2
        const [, youtubeId2] = video2URL.split(".be/")
         if (youtubeId2) {videoURLs.push(youtubeId2)}
        const video3URL = video.url3
        const [, youtubeId3] = video3URL.split(".be/")
        if (youtubeId3) {videoURLs.push(youtubeId3)}
        const video4URL = video.url4
        const [, youtubeId4] = video4URL.split(".be/")
        if (youtubeId4) {videoURLs.push(youtubeId4)}
        const video5URL = video.url5
        const [, youtubeId5] = video5URL.split(".be/")
        if (youtubeId5) {videoURLs.push(youtubeId5)}
        if (videoURLs.length > 0) {
        Promise.all(videoURLs.map(u => {
            getYoutubeVideoById(u)
            .then((response) => {
                console.log(response.items[0])
                addSavedVideo({
                    userId: parseInt(localStorage.getItem("tv_user")),
                    title: response.items[0].snippet.title,
                    ytId: u,
                    ytChannelId: response.items[0].snippet.channelId,
                    channelName: response.items[0].snippet.channelTitle,
                    duration: response.items[0].contentDetails.duration,
                    thumbnail: response.items[0].snippet.thumbnails.default.url,
                    timestamp: Date.now()
                })
            })
        })
        ).then(() => {
                setVideo({ url1: "", url2: "", url3: "", url4: "", url5: "" })
            })
        }
    }

    return (
        <>

            <h3>Start by adding the URLs of up to 5 Youtube Videos that you like</h3>
            You can also skip this for now, and do it later.
            <div className="addInput">
                <fieldset>
                    <input type="text" id="url1" className="input-field" required autoFocus placeholder="Video url" value={video.url1} onChange={handleControlledInputChange} />
                </fieldset>
                <fieldset>
                    <input type="text" id="url2" className="input-field" required autoFocus placeholder="Video url" value={video.url2} onChange={handleControlledInputChange} />
                </fieldset>
                <fieldset>
                    <input type="text" id="url3" className="input-field" required autoFocus placeholder="Video url" value={video.url3} onChange={handleControlledInputChange} />
                </fieldset>
                <fieldset>
                    <input type="text" id="url4" className="input-field" required autoFocus placeholder="Video url" value={video.url4} onChange={handleControlledInputChange} />
                </fieldset>
                <fieldset>
                    <input type="text" id="url5" className="input-field" required autoFocus placeholder="Video url" value={video.url5} onChange={handleControlledInputChange} />
                </fieldset>
                <button className="addButton" onClick={handleAddVideos}>
                    Next
                </button>
            </div>

        </>
    )
}