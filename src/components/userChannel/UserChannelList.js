import React, { useContext, useState, useEffect } from "react";
import { UserChannelContext } from "./UserChannelProvider";
import { YoutubeDataContext } from "../YoutubeDataProvider";
import './UserChannel.css'

export const UserChannelList = () => {
    const { getUserChannelsByUser, userChannels, addUserChannel, deleteUserChannel } = useContext(UserChannelContext)
    const { getYoutubeChannelById } = useContext(YoutubeDataContext)
    const [channel, setChannel] = useState({})

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

    const handleAddUserChannel = () => {
        const channelURL = channel.url
        const [, ytChannelId] = channelURL.split("channel/")
        getYoutubeChannelById(ytChannelId)
        .then((response) => {
            console.log(response.items[0])
            addUserChannel({
                ytId: response.items[0].id,
                userId: parseInt(localStorage.getItem("tv_user")),
                title: response.items[0].snippet.title,
                timestamp: Date.now()
            })
        })
        .then(() => {
            setChannel({url: ""})
            getUserChannelsByUser(parseInt(localStorage.getItem("tv_user")))
        })
    }

    return (
        <>

            <h1>Saved Channels</h1>

            <div className="addInput">
                <fieldset>
                    <label htmlFor="url">Add Channel:</label>
                    <input type="text" id="url" className="input-field" required autoFocus placeholder="Channel url" value={channel.url} onChange={handleControlledInputChange} />
                    <button className="addButton" onClick={handleAddUserChannel}>
                        Submit
            </button>
                </fieldset>
            </div>

            <div className="savedChannels">
                {
                    userChannels.map(c => {
                        return (
                            <>
                                <div className="savedChannel">
                                        <h4>{c.title}</h4>
                                    <button className="button" onClick={() => {
                                        deleteUserChannel(c.id)
                                            .then(() => {
                                                getUserChannelsByUser(parseInt(localStorage.getItem("tv_user")))
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