import React, { useEffect, useState, useContext } from "react"
import { SavedVideoContext } from "../savedVideo/SavedVideoProvider"
import { UserContext } from "../user/UserProvider"
import { UserChannelContext } from "../userChannel/UserChannelProvider"
import { YoutubeDataContext } from "../YoutubeDataProvider"

export const AutoselectVidList = () => {
    const { getUserById } = useContext(UserContext)
    const [user, setUser] = useState({})
    const { getYoutubeChannelById, getPlaylistVideosById } = useContext(YoutubeDataContext)
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
        const allChannelVideos = {}

        userChannels.forEach(c => {
            getYoutubeChannelById(c.ytId)
                .then(channel => {
                    getPlaylistVideosById(channel.items[0].contentDetails.relatedPlaylists.uploads)
                        .then(channelVideos => {
                            allChannelVideos[channel.items[0].id] = channelVideos.items
                            if (channelVideos.nextPageToken) {
                                return fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=100&pageToken=${channelVideos.nextPageToken}&playlistId=${channel.items[0].contentDetails.relatedPlaylists.uploads}&key=AIzaSyDAAdOiTTvYC1S1bsk1hgCYOtcMtK5ViLg`)
                                .then(res => res.json())
                                .then(nextPage => {
                                    nextPage.items.forEach(v => {
                                        allChannelVideos[channel.items[0].id].push(v)
                                    })
                                })
                            }

                        })
                })
        })
        console.log(allChannelVideos)
    }


    return (
        <>
            <h2>Hello, {user.firstName}</h2>

            <button onClick={PlaylistGenerator}>Generate Playlist</button>
        </>
    )
}