import React, { useEffect, useState, useContext } from "react"
import { SavedVideoContext } from "../savedVideo/SavedVideoProvider"
import { UserContext } from "../user/UserProvider"
import { UserChannelContext } from "../userChannel/UserChannelProvider"
import { YoutubeDataContext } from "../YoutubeDataProvider"

export const AutoselectVidList = () => {
    const { getUserById } = useContext(UserContext)
    const [user, setUser] = useState({})
    const { getPlaylistVideosById, getPage2PlaylistVideos } = useContext(YoutubeDataContext)
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

    let counter = 1
    
    allChannelVideos.forEach(channelObj=> {
        channelObj.items.forEach(videoObj => {
            videoObj.counterId = counter
            counter = counter + 1
        })
    })
    
    const getRandomInt = max => {
        return Math.floor(Math.random() * max);
    }

    const playlistVideos = allChannelVideos.map(videosObj => {
        return videosObj.items[getRandomInt(videosObj.items.length)]
    })

    let filteredPlaylistVideos = []

    if (playlistVideos.length > 0) {

        const savedVideosToAdd = []
        let numberOfVideosToAdd = null

        if (savedUserVideos.length < 5) {
            savedUserVideos.forEach(v => {
                savedVideosToAdd.push(v)
            })
            numberOfVideosToAdd = 50 - savedUserVideos.length

        } else if (savedUserVideos.length >= 5) {
            for (let i = 0; i < 5; i++) {
                savedVideosToAdd.push(savedUserVideos[getRandomInt(savedUserVideos.length)])
            }
            savedVideosToAdd.sort((a, b) => { return a.id - b.id })
            savedVideosToAdd.forEach(v => {
                const lastVid = [...savedVideosToAdd].pop()
                if (v.id === lastVid.id) {
                    savedVideosToAdd.splice(playlistVideos.indexOf(v), 1)
                }
            })
            numberOfVideosToAdd = 50 - savedVideosToAdd.length
        }

        if (playlistVideos.length < numberOfVideosToAdd) {

            while (playlistVideos.length < numberOfVideosToAdd) {

                allChannelVideos.forEach(videosObj => {
                    playlistVideos.push(videosObj.items[getRandomInt(videosObj.items.length)])
                })

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
                allChannelVideos.forEach(videosObj => {
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