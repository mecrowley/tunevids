import React, { useContext, useState, useEffect } from "react";
import { UserChannelContext } from "./UserChannelProvider";
import { YoutubeDataContext } from "../YoutubeDataProvider";
import './UserChannel.css'

export const UserChannelList = () => {
    const { getUserChannelsByUser, userChannels, addUserChannel, deleteUserChannel } = useContext(UserChannelContext)
    const { getYoutubeChannelById, getYoutubeChannelByUserName } = useContext(YoutubeDataContext)
    const [channel, setChannel] = useState({})
    const [channelAdded, setChannelAdded] = useState(null)

    useEffect(() => {
        getUserChannelsByUser(parseInt(localStorage.getItem("tv_user")))
    }, [])

    userChannels.sort((a, b) => {
        return b.timestamp - a.timestamp
    })

    const handleControlledInputChange = (event) => {
        const newChannel = { ...channel }
        newChannel[event.target.id] = event.target.value
        setChannel(newChannel)
    }

    const handleAddChannel = () => {
            const channelURL = channel.url
            const channelURLsplit = channelURL.split("/")
            const hasChannelId = channelURLsplit.includes("channel")
            const hasChannelUserName = channelURLsplit.includes("user")
            const hasCustomName = channelURLsplit.includes("c")
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
                    .then(() => {
                        setChannel({ url: "" })
                        setChannelAdded(null)
                        getUserChannelsByUser(parseInt(localStorage.getItem("tv_user")))
                    })
                } else {
                    setChannelAdded(<div className="fail">Channel not found</div>)
                }
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
                    .then(() => {
                        setChannel({ url: "" })
                        setChannelAdded(null)
                        getUserChannelsByUser(parseInt(localStorage.getItem("tv_user")))
                    })
                } else {
                    setChannelAdded(<div className="fail">Channel not found</div>)
                }
            })
            } else if (hasCustomName) {
                setChannelAdded(<div className="fail">Cannot add Channel with custom name in url</div>)
            } else if (!hasChannelId && !hasChannelUserName && !hasCustomName) {
                setChannelAdded(<div className="fail">Channel not added! Please enter a valid url</div>)
            }

    }


    return (
        <>

            <h1>Saved Channels</h1>
            <div className="addInput">
                <fieldset>
                    <label htmlFor="url">Add Channel:</label>
                    <input type="text" id="url" className="input-field" required autoFocus placeholder="Channel url" value={channel.url} onChange={handleControlledInputChange} />
                    <button className="addButton" onClick={handleAddChannel}>
                        Submit
            </button>
            {channelAdded}
                </fieldset>
            </div>

            <div className="channels flex-container">
                {
                    userChannels.map(c => {
                        return (
                            <>
                                <div className="channel">
                                    <div className="title">
                                    <h4>{c.title}</h4>
                                    </div>
                                    <div className="thumbnail">
                                    <img className="thumbnail" src={`${c.thumbnail}`} />
                                    </div>
                                    <div>
                                    <button className="button" onClick={() => {
                                        deleteUserChannel(c.id)
                                            .then(() => {
                                                getUserChannelsByUser(parseInt(localStorage.getItem("tv_user")))
                                            })
                                    }}>
                                        Remove
                                    </button>
                                    </div>
                                </div>
                            </>
                        )
                    })
                }
            </div>

        </>
    )
}