import React, { useEffect, useState, useContext } from "react"
import { SavedVideoContext } from "../savedVideo/SavedVideoProvider"
import { UserContext } from "../user/UserProvider"
import { UserChannelContext } from "../userChannel/UserChannelProvider"
import { YoutubeDataContext } from "../YoutubeDataProvider"

export const AutoselectVidList = () => {
    const { getUserById } = useContext(UserContext)
    const [user, setUser] = useState({})
    const { getSavedVideosByUser, savedUserVideos } = useContext(SavedVideoContext)
    const { getUserChannelsByUser, userChannels } = useContext(UserChannelContext)
    const [fetchChannelVideos, setFetchChannelVideos] = useState(false)
    const { getPlaylistVideosById, getPage2PlaylistVideos } = useContext(YoutubeDataContext)
    const [page1ChannelVideos, setPage1ChannelVideos] = useState([])
    const [page2ChannelVideos, setPage2ChannelVideos] = useState([])

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
                    setPage1ChannelVideos(videos)
                })
            setFetchChannelVideos(false)
        }
    }, [fetchChannelVideos])

    useEffect(() => {
        if (page1ChannelVideos.length === 0) {
            return
        } else {
            const channelsToGetPage2 = page1ChannelVideos.filter(o => o.nextPageToken)
            const videoPromises = channelsToGetPage2.map(channelObj => {
                return getPage2PlaylistVideos(channelObj.items[0].snippet.playlistId, channelObj.nextPageToken)
            })
            Promise.all(videoPromises)
                .then(videos => {
                    setPage2ChannelVideos(videos)
                })
        }
    }, [page1ChannelVideos])

    const getRandomInt = max => {
        return Math.floor(Math.random() * max);
    }

    console.log(page2ChannelVideos)

    const playlistVideos = page1ChannelVideos.map(videosObj => {
        return videosObj.items[getRandomInt(videosObj.items.length)]
    })

    let filteredPlaylistVideos = []

    if (playlistVideos.length > 0) {

        const savedVideosToAdd = []
        let numberOfVideosToAdd = null

        if (savedUserVideos.length < 10) {
            savedUserVideos.forEach(v => {
                savedVideosToAdd.push(v)
            })
            numberOfVideosToAdd = 50 - savedUserVideos.length

        } else if (savedUserVideos.length >= 10) {
            const randomSavedVideos = []
            for (let i = 0; i < 10; i++) {
                randomSavedVideos.push(savedUserVideos[getRandomInt(savedUserVideos.length)])
            }
            savedVideosToAdd = [...new Set(randomSavedVideos)]
            numberOfVideosToAdd = 50 - savedVideosToAdd.length
        }

        if (playlistVideos.length < numberOfVideosToAdd) {

            while (playlistVideos.length < numberOfVideosToAdd) {

                page2ChannelVideos.forEach(videosObj => {
                    playlistVideos.push(videosObj.items[getRandomInt(videosObj.items.length)])
                })

                if (playlistVideos.length < numberOfVideosToAdd) {
                    page1ChannelVideos.forEach(videosObj => {
                        playlistVideos.push(videosObj.items[getRandomInt(videosObj.items.length)])
                    })
                }

                filteredPlaylistVideos = [...new Set(playlistVideos)]

                let numberOfVideosToDelete = filteredPlaylistVideos.length - numberOfVideosToAdd
                if (numberOfVideosToDelete > 0) {
                    for (let i = 1; i <= numberOfVideosToDelete; i++) {
                        playlistVideos.splice(getRandomInt(playlistVideos.length), 1)
                    }
                }
            }

        } else if (playlistVideos.length > numberOfVideosToAdd) {
            filteredPlaylistVideos = [...new Set(playlistVideos)]

            let numberOfVideosToDelete = filteredPlaylistVideos.length - numberOfVideosToAdd
            if (numberOfVideosToDelete > 0) {
                for (let i = 1; i <= numberOfVideosToDelete; i++) {
                    playlistVideos.splice(getRandomInt(playlistVideos.length), 1)
                }
            } else if (numberOfVideosToDelete < 0) {
                page2ChannelVideos.forEach(videosObj => {
                    playlistVideos.push(videosObj.items[getRandomInt(videosObj.items.length)])
                })

                filteredPlaylistVideos = [...new Set(playlistVideos)]

                let numberOfVideosToDelete = filteredPlaylistVideos.length - numberOfVideosToAdd
                for (let i = 1; i <= numberOfVideosToDelete; i++) {
                    playlistVideos.splice(getRandomInt(playlistVideos.length), 1)
                }
            }
        }
        savedVideosToAdd.forEach(v => {
            filteredPlaylistVideos.splice(getRandomInt(45), 0, v)
        })
        console.log(filteredPlaylistVideos)
    }


    return (
        <>
            <h2>Hello, {user.firstName}</h2>

            <div className="newPlaylist">
                {filteredPlaylistVideos.map(v => {
                    return (
                        <div className="newVideo">
                            { v.hasOwnProperty("snippet") ? v.snippet.title : v.title}
                        </div>
                    )
                })}
            </div>

            <button onClick={() => {
                setFetchChannelVideos(true)
            }}>Generate Playlist</button>
        </>
    )
}