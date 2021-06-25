import React, { useContext, useState, useEffect } from "react";
import { UserChannelContext } from "./UserChannelProvider";
import { YoutubeDataContext } from "../YoutubeDataProvider";
import './UserChannel.css'

export const UserChannelList = () => {
    const { getUserChannelsByUser, userChannels, addUserChannel, deleteUserChannel } = useContext(UserChannelContext)
    const { getYoutubeChannelById, getYoutubeChannelByUserName } = useContext(YoutubeDataContext)
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

    const handleAddChannelById = () => {
        getYoutubeChannelById(channel.id)
            .then((response) => {
                console.log(response.items[0])
                addUserChannel({
                    userId: parseInt(localStorage.getItem("tv_user")),
                    title: response.items[0].snippet.title,
                    ytId: response.items[0].id,
                    uploadsId: response.items[0].contentDetails.relatedPlaylists.uploads,
                    thumbnail: response.items[0].snippet.thumbnails.default.url,
                    timestamp: Date.now()
                })
            })
            .then(() => {
                setChannel({ id: "" })
                getUserChannelsByUser(parseInt(localStorage.getItem("tv_user")))
            })
    }

    const handleAddChannelByUser = () => {
        getYoutubeChannelByUserName(channel.userName)
            .then((response) => {
                addUserChannel({
                    userId: parseInt(localStorage.getItem("tv_user")),
                    title: response.items[0].snippet.title,
                    ytId: response.items[0].id,
                    uploadsId: response.items[0].contentDetails.relatedPlaylists.uploads,
                    thumbnail: response.items[0].snippet.thumbnails.default.url,
                    timestamp: Date.now()
                })
            })
            .then(() => {
                setChannel({ userName: "" })
                getUserChannelsByUser(parseInt(localStorage.getItem("tv_user")))
            })
    }


    return (
        <>

            <h1>Saved Channels</h1>
            <div className="addInput">
                <fieldset>
                    <label htmlFor="url">Add Channel by Id:</label>
                    <input type="text" id="id" className="input-field" required autoFocus placeholder="Channel Id" value={channel.id} onChange={handleControlledInputChange} />
                    <button className="addButton" onClick={handleAddChannelById}>
                        Submit
            </button>
                </fieldset>
                <fieldset>
                    <label htmlFor="url">Add Channel by User Name:</label>
                    <input type="text" id="userName" className="input-field" required autoFocus placeholder="User Name" value={channel.userName} onChange={handleControlledInputChange} />
                    <button className="addButton" onClick={handleAddChannelByUser}>
                        Submit
            </button>
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