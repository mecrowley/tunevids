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
    const [allChannelVideos, setAllChannelVideos] = useState([])

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
            const videoPromises = userChannels.map(c => {
                return getPlaylistVideosById(c.uploadsId)
            })
            Promise.all(videoPromises)
                .then(videos => {
                    setAllChannelVideos(videos)
                })
            setFetchChannelVideos(false)
        }
    }, [fetchChannelVideos])


    const PlaylistGenerator = () => {

        const getRandomInt = max => {
            return Math.floor(Math.random() * max);
        }

        const newPlaylistVideos = allChannelVideos.map(videosObj => {
            return videosObj.items[getRandomInt(videosObj.items.length)]
        })

        if (newPlaylistVideos.length === 25) {
            console.log(newPlaylistVideos)

        } else if (newPlaylistVideos.length < 25) {
            allChannelVideos.forEach(videosObj => {
                newPlaylistVideos.push(videosObj.items[getRandomInt(videosObj.items.length)])
            })
            let numberOfVideosToDelete = newPlaylistVideos.length - 25
            
            if (numberOfVideosToDelete > 0) {
                for (let i = 1; i <= numberOfVideosToDelete; i++) {
                    newPlaylistVideos.splice(getRandomInt(newPlaylistVideos.length), 1)
                }
            }

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