import React, { useContext, useState } from "react"
import { useHistory } from "react-router-dom"
import { UserChannelContext } from "../userChannel/UserChannelProvider"
import { YoutubeDataContext } from "../YoutubeDataProvider"

export const NewUserChannels = () => {
    const { addUserChannel } = useContext(UserChannelContext)
    const { getYoutubeChannelById, getYoutubeChannelByUserName } = useContext(YoutubeDataContext)
    const history = useHistory()
    const [channel, setChannel] = useState({})


    const handleControlledInputChange = (event) => {
        const newChannel = { ...channel }
        newChannel[event.target.id] = event.target.value
        setChannel(newChannel)
    }

    const handleAddChannel = () => {
        const channelURLs = []
        for (const [key, value] of Object.entries(channel)) {
            if (value !== "") {
            channelURLs.push(value)
            }
        }
        if (channelURLs.length > 0) {
        Promise.all(channelURLs.map(u => {
            const channelURLsplit = u.split("/")
            const hasChannelId = channelURLsplit.includes("channel")
            const hasChannelUserName = channelURLsplit.includes("user")
            if (hasChannelId) {
                const channelId = channelURLsplit[channelURLsplit.indexOf("channel") + 1]
                getYoutubeChannelById(channelId)
                    .then((response) => {
                        if (response.items) {
                            addUserChannel({
                                userId: parseInt(localStorage.getItem("tv_user")),
                                title: response.items[0].snippet.title,
                                ytId: response.items[0].id,
                                uploadsId: response.items[0].contentDetails.relatedPlaylists.uploads,
                                thumbnail: response.items[0].snippet.thumbnails.default.url,
                                timestamp: Date.now()
                            })
                        } else {return}
                    })
            } else if (hasChannelUserName) {
                const channelUserName = channelURLsplit[channelURLsplit.indexOf("user") + 1]
                getYoutubeChannelByUserName(channelUserName)
                    .then((response) => {
                        if (response.items) {
                            addUserChannel({
                                userId: parseInt(localStorage.getItem("tv_user")),
                                title: response.items[0].snippet.title,
                                ytId: response.items[0].id,
                                uploadsId: response.items[0].contentDetails.relatedPlaylists.uploads,
                                thumbnail: response.items[0].snippet.thumbnails.default.url,
                                timestamp: Date.now()
                            })
                        } else {return}
                    })
            } else {return}
        })
        ).then(() => {
            history.push("/")
        })
    } else { history.push("/")}
    }


    return (
        <>

            <div className="add-channels-form">
                <h3 className="">Add the URLs of up to 5 Youtube Channels that you like</h3>
                <div className="center">You can also skip this for now, and do it later.</div>
                <div className="addInput">
                    <fieldset>
                        <input type="text" id="url1" className="input-field" required autoFocus placeholder="Channel url" value={channel.url1} onChange={handleControlledInputChange} />
                    </fieldset>
                    <fieldset>
                        <input type="text" id="url2" className="input-field" required autoFocus placeholder="Channel url" value={channel.url2} onChange={handleControlledInputChange} />
                    </fieldset>
                    <fieldset>
                        <input type="text" id="url3" className="input-field" required autoFocus placeholder="Channel url" value={channel.url3} onChange={handleControlledInputChange} />
                    </fieldset>
                    <fieldset>
                        <input type="text" id="url4" className="input-field" required autoFocus placeholder="Channel url" value={channel.url4} onChange={handleControlledInputChange} />
                    </fieldset>
                    <fieldset>
                        <input type="text" id="url5" className="input-field" required autoFocus placeholder="Channel url" value={channel.url5} onChange={handleControlledInputChange} />
                    </fieldset>
                    <button className="next-button" onClick={handleAddChannel}>
                        Next
                    </button>
                </div>
            </div>

        </>
    )
}