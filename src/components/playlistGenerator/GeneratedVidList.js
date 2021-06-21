import React, { useEffect, useState, useContext } from "react"
import { SavedVideoContext } from "../savedVideo/SavedVideoProvider"
import { UserContext } from "../user/UserProvider"
import { UserChannelContext } from "../userChannel/UserChannelProvider"
import { YoutubeDataContext } from "../YoutubeDataProvider"

export const AutoselectVidList = () => {
    const { getUserById } = useContext(UserContext)
    const [user, setUser] = useState({})
    const { getYoutubeChannelById, getPlaylistVideosById, getPage2PlaylistVideos } = useContext(YoutubeDataContext)
    const { getUserChannelsByUser, userChannels } = useContext(UserChannelContext)
    const { getSavedVideosByUser, savedUserVideos } = useContext(SavedVideoContext)
    const [fetchChannelVideos, setFetchChannelVideos] = useState(false)
    const [allChannelVideos, setAllChannelVideos] = useState({})

    useEffect(() => {
        getUserById(parseInt(localStorage.getItem("tv_user")))
            .then((user) => {
                setUser(user)
                getUserChannelsByUser(user.id)
                getSavedVideosByUser(user.id)
            })
    }, [])

    useEffect(() => {
        if (fetchChannelVideos === false) {
            return
        } else {
            let allFetchedVideos = {}
            userChannels.forEach(c => {
                getPlaylistVideosById(c.uploadsId)
                    .then(channelVideos => {
                        allFetchedVideos[c.id] = channelVideos.items
                        if (channelVideos.nextPageToken) {
                            getPage2PlaylistVideos(c.uploadsId)
                                .then(nextPage => {
                                    nextPage.items.forEach(v => {
                                        allFetchedVideos[c.id].push(v)
                                    })
                                })
                        }
                    })
            })
            console.log(allFetchedVideos)
            setAllChannelVideos(allFetchedVideos)
            setFetchChannelVideos(false)
        }
    }, [fetchChannelVideos])


    const PlaylistGenerator = () => {
        console.log(allChannelVideos)

        const getRandomInt = max => {
            return Math.floor(Math.random() * max);
        }

        const allChannelVideosArray = Object.entries(allChannelVideos)

        const newPlaylistVideos = allChannelVideosArray.map(cv => {
            return cv[1][getRandomInt(cv[1].length)]
        })

        if (newPlaylistVideos.length === 25) {
            console.log(newPlaylistVideos)

        } else if (newPlaylistVideos.length < 25) {
            for (const [key, value] of Object.entries(allChannelVideos)) {
                newPlaylistVideos.push(value[getRandomInt(value.length)])
            }
            let numberOfVideosToDelete = newPlaylistVideos.length - 25
            if (numberOfVideosToDelete > 0) {
                for (let i = 1; i <= numberOfVideosToDelete; i++) {
                    newPlaylistVideos.splice(getRandomInt(newPlaylistVideos.length), 1)
                }
            }
            console.log(newPlaylistVideos)

        } else {
            let numberOfVideosToDelete = newPlaylistVideos.length - 25
            for (let i = 1; i <= numberOfVideosToDelete; i++) {
                newPlaylistVideos.splice(getRandomInt(newPlaylistVideos.length), 1)
                console.log(newPlaylistVideos)

            }
        }

        return (
            <>
                <div className="newPlaylist">
                    {newPlaylistVideos.map(v => {
                        return (
                            <div className="newVideo">
                                {v.snippet.title}
                            </div>
                        )
                    })}
                </div>
            </>
        )
    }


    return (
        <>
            <h2>Hello, {user.firstName}</h2>

            {PlaylistGenerator()}

            <button onClick={() => {
                setFetchChannelVideos(true)
            }}>Generate Playlist</button>
        </>
    )
}