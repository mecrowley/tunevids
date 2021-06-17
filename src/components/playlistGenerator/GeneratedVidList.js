import React, { useEffect, useState, useContext } from "react"
import { SavedVideoContext } from "../savedVideo/SavedVideoProvider"
import { UserContext } from "../user/UserProvider"
import { UserChannelContext } from "../userChannel/UserChannelProvider"
import { YoutubeDataContext } from "../YoutubeDataProvider"

export const AutoselectVidList = () => {
    const { getUserById } = useContext(UserContext)
    const [ user, setUser ] = useState({})
    const { getYoutubeChannelById } = useContext(YoutubeDataContext)
    const { getUserChannelsByUser, userChannels } = useContext(UserChannelContext)
    const { getSavedVideosByUser, savedUserVideos } = useContext(SavedVideoContext)

    useEffect(() => {
            getUserById(parseInt(localStorage.getItem("tv_user")))
            .then((user) => {
                setUser(user)
                getUserChannelsByUser(user.id)
                getSavedVideosByUser(user.id)
            })
    }, [])

    const PlaylistGenerator = () => {
        
        getYoutubeChannelById("UCT2ftth8ztg3xbzPw_LVz3Q")
        .then((response) => {console.log(response)})
    }

    return (
        <>
            <h2>Hello, {user.firstName}</h2>

            <button onClick={PlaylistGenerator}>Generate Playlist</button>
        </>
    )
}