import React, { useEffect, useState, useContext } from "react"
import { PlaylistVideoContext } from "../playlist/PlaylistVideoProvider"
import { YoutubeDataContext } from "../YoutubeDataProvider"
import "./PlaylistGenerator.css"

export const GeneratePlaylist = ({ savedVideos, playlistVideos, userChannels, playlists }) => {
    const { addToGenPlaylist, getPlaylistVideosByPlaylistId, addPlaylistVideo, initialize, setInitialize } = useContext(PlaylistVideoContext)
    const { getYtVideosByChannelId, getPage2ChannelVideos } = useContext(YoutubeDataContext)
    const [page1ChannelVideos, setPage1ChannelVideos] = useState([])
    const [page2ChannelVideos, setPage2ChannelVideos] = useState([])

    useEffect(() => {
        if (initialize === true) {
            Promise.all(userChannels.map(c => {
                return getYtVideosByChannelId(c.uploadsId)
            })
            )
                .then(response => {
                    setPage1ChannelVideos(response)
                    const channelsToGetPage2 = response.filter(r => r.nextPageToken)
                    const videoPromises = channelsToGetPage2.map(c => {
                        return getPage2ChannelVideos(c.items[0].snippet.playlistId, c.nextPageToken)
                    })
                    Promise.all(videoPromises)
                        .then(videos => {
                            setPage2ChannelVideos(videos)
                        })
                })
            setInitialize(false)
        }
    }, [initialize])

    useEffect(() => {

        if (page2ChannelVideos.length > 1) {

            const getRandomInt = max => {
                return Math.floor(Math.random() * max);
            }

            let filteredPlaylistVideos = []
            let numberOfVideosToAdd = null

            const savedVideosToAdd = []

            if (savedVideos.length < 10) {
                savedVideos.forEach(v => {
                    savedVideosToAdd.push(v)
                })
                numberOfVideosToAdd = 40 - savedVideos.length

            } else if (savedVideos.length >= 10) {
                const randomSavedVideos = []
                for (let i = 0; i < 10; i++) {
                    randomSavedVideos.push(savedVideos[getRandomInt(savedVideos.length)])
                }
                savedVideosToAdd = [...new Set(randomSavedVideos)]
                numberOfVideosToAdd = 40 - savedVideosToAdd.length
            }

            const newPlaylistVideos = page1ChannelVideos.map(videosObj => {
                return videosObj.items[getRandomInt(videosObj.items.length)]
            })

            if (newPlaylistVideos.length < numberOfVideosToAdd) {

                while (filteredPlaylistVideos.length < numberOfVideosToAdd) {

                    page2ChannelVideos.forEach(videosObj => {
                        newPlaylistVideos.push(videosObj.items[getRandomInt(videosObj.items.length)])
                    })

                    if (newPlaylistVideos.length < numberOfVideosToAdd) {
                        page1ChannelVideos.forEach(videosObj => {
                            newPlaylistVideos.push(videosObj.items[getRandomInt(videosObj.items.length)])
                        })
                    }

                    filteredPlaylistVideos = [...new Set(newPlaylistVideos)]

                    let numberOfVideosToDelete = filteredPlaylistVideos.length - numberOfVideosToAdd
                    if (numberOfVideosToDelete > 0) {
                        for (let i = 1; i <= numberOfVideosToDelete; i++) {
                            filteredPlaylistVideos.splice(getRandomInt(filteredPlaylistVideos.length), 1)
                        }
                    }
                }

            } else if (newPlaylistVideos.length > numberOfVideosToAdd) {
                filteredPlaylistVideos = [...new Set(newPlaylistVideos)]

                let numberOfVideosToDelete = filteredPlaylistVideos.length - numberOfVideosToAdd
                if (numberOfVideosToDelete > 0) {
                    for (let i = 1; i <= numberOfVideosToDelete; i++) {
                        filteredPlaylistVideos.splice(getRandomInt(filteredPlaylistVideos.length), 1)
                    }
                } else if (numberOfVideosToDelete < 0) {
                    page2ChannelVideos.forEach(videosObj => {
                        newPlaylistVideos.push(videosObj.items[getRandomInt(videosObj.items.length)])
                    })

                    filteredPlaylistVideos = [...new Set(newPlaylistVideos)]

                    let numberOfVideosToDelete = filteredPlaylistVideos.length - numberOfVideosToAdd
                    for (let i = 1; i <= numberOfVideosToDelete; i++) {
                        filteredPlaylistVideos.splice(getRandomInt(filteredPlaylistVideos.length), 1)
                    }
                }
            }
            savedVideosToAdd.forEach(v => {
                filteredPlaylistVideos.splice(getRandomInt(45), 0, v)
            })

            const genPlaylistId = playlistVideos[0].playlistId
            const playlistVideoIds = playlistVideos.map(pv => pv.id)
            let counter = playlistVideoIds[0] - 2

            const newVideos = filteredPlaylistVideos.map(v => {
                counter += 1
                return {
                    id: playlistVideoIds[counter],
                    playlistId: genPlaylistId,
                    userId: parseInt(localStorage.getItem("tv_user")),
                    title: (v.hasOwnProperty("snippet") ? v.snippet.title : v.title),
                    ytId: (v.hasOwnProperty("snippet") ? v.snippet.resourceId.videoId : v.ytId)
                }
            })

            const videopromises = newVideos.map(v => addToGenPlaylist(v))
            Promise.all(videopromises)
                .then(() => setPage2ChannelVideos([]))
                .then(() => getPlaylistVideosByPlaylistId(genPlaylistId))
            console.log(newVideos)
        }
    }, [page2ChannelVideos])

    return (
        <>
            {playlistVideos.map(v => {
                    return (
                        <div className="video flex-container">
                            <div className="title">
                                {v.title}
                            </div>
                            <div className="dropdown">
                                <select name="playlistId" id="playlistId" className="dropdown"
                                    onChange={(event) => {
                                        addPlaylistVideo({
                                            playlistId: parseInt(event.target.value),
                                            userId: parseInt(localStorage.getItem("tv_user")),
                                            title: v.title,
                                            ytId: v.ytId
                                        })
                                    }}>
                                    <option value="0">Add to playlist</option>
                                    {
                                        playlists.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="remove-button">
                                <button onClick={e => {
                                    e.preventDefault()
                                    addToGenPlaylist({
                                        id: v.id,
                                        playlistId: v.playlistId,
                                        userId: v.userId,
                                        title: "",
                                        ytId: ""
                                    }).then(() => {
                                        getPlaylistVideosByPlaylistId(v.userId)
                                    })
                                }
                                }>Remove</button>
                            </div>
                        </div>
                    )
                }
            )}
        </>
    )
}