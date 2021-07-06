import React, { useContext, useState } from "react"
import { useHistory } from "react-router-dom"
import { SavedVideoContext } from "../savedVideo/SavedVideoProvider"
import { YoutubeDataContext } from "../YoutubeDataProvider"

export const NewUserVideos = () => {
    const { addSavedVideo } = useContext(SavedVideoContext)
    const { getYoutubeVideoById } = useContext(YoutubeDataContext)
    const [video, setVideo] = useState({ url1: "", url2: "", url3: "", url4: "", url5: "" })
    const history = useHistory()

    const handleControlledInputChange = (event) => {
        const newVideo = { ...video }
        newVideo[event.target.id] = event.target.value
        setVideo(newVideo)
    }

    const handleAddVideos = () => {
        const videoURLs = []
        for (const [key, value] of Object.entries(video)) {
            const [, youtubeShareId] = value.split(".be/")
            const [, youtubeBrowserId] = value.split("=")
        if (youtubeShareId) {
            videoURLs.push(youtubeShareId)
        } else if (youtubeBrowserId) {
            videoURLs.push(youtubeBrowserId)
        } else {continue}
        }
        if (videoURLs.length > 0) {
        Promise.all(videoURLs.map(u => {
            getYoutubeVideoById(u)
            .then((response) => {
                console.log(response.items[0])
                if (response.items[0]) {

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
                } else {return}
            })
        })
        ).then(() => {
                history.push("/register/addchannels")
            })
        } else {
            history.push("/register/addchannels")
        }
    }

    return (
        <>
        <div className="add-form">
            <h3 className="">Start by adding the URLs of up to 5 Youtube Videos that you like</h3>
            <div className="center">You can also skip this for now, and do it later.</div>
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
                <button className="next-button" onClick={handleAddVideos}>
                    Next
                </button>
            </div>
            </div>
        </>
    )
}