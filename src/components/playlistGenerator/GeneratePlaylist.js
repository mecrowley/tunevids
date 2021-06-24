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

            //all videos for the playlist are now stored in filteredPlaylistVideos

            //finding the playlistId of the user's generated playlist from the playlistVideos (which contains all the videos in
            //the user's last generated playlist)
            const genPlaylistId = playlistVideos[0].playlistId
            
            //creating an array of all the ids of the videos in the user's generated playlist (they are always the same,
            // neither created nor deleted, only edited to contain video data or not)
            const playlistVideoIds = playlistVideos.map(pv => pv.id)

            //creating a counter that starts with one value lower than the first index number of the lowest (aka first) id in the
            //playlistVideoIds array 
            let counter = -1

            //creating new playlistVideo objects by mapping through all of the new videos in filteredPlaylistVideos
            const newVideos = filteredPlaylistVideos.map(v => {
                counter += 1
                return {
                    id: playlistVideoIds[counter],
                    //the id value above starts with the lowest id value in the playlistVideoIds array which is at the
                    //index value of 0 currently stored in the counter variable
                    //every time the map goes to the next video the counter is increased by 1, therefore simultaneously
                    //iterating through all of the playlistVideoIds indexes, capturing their id value and assigning it a
                    //the corresponging new video that will replace it
                    playlistId: genPlaylistId,
                    userId: parseInt(localStorage.getItem("tv_user")),
                    //some of the videos are from the user's saved videos, and therefore they have different keys than the
                    //videos fetched from youtube
                    //the following ternary statements account for which key to access depending on where the video is from
                    //the youtube videos have a "snippet" key that I check for first
                    //if the video has it, then I access that value for the title, if it doesn't, than I only use the title key
                    //that the saved user videos have.  Same for the youtube video id value
                    title: (v.hasOwnProperty("snippet") ? v.snippet.title : v.title),
                    ytId: (v.hasOwnProperty("snippet") ? v.snippet.resourceId.videoId : v.ytId)
                }
            })

            //Mapping through the converted newVideos array and adding them to the user's generated playlist by using the
            //PUT fetch method to replace the video data there with the new video data and capturing all the returned promises
            //in the videopromises array
            const videopromises = newVideos.map(v => addToGenPlaylist(v))
            //Passing the array of promises through Promise.all so my .then() functions won't start until all the promises
            //have resolved (aka, all the videos have finished posting)
            Promise.all(videopromises)
            //reset the page2ChannelVideos because the component no longer needs them and it signals to the function not to
            //run again
                .then(() => setPage2ChannelVideos([]))
                .then(() => getPlaylistVideosByPlaylistId(genPlaylistId))
            console.log(newVideos)
        }
    }, [page2ChannelVideos])//the function to generate a new playlist is signalled to begin when the state of page2ChannelVideos changes
                            //specifically, when page2ChannelVideos holds videos

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