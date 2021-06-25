import React, { useContext, useEffect, useState } from "react"
import { PlaylistContext } from "./PlaylistProvider"
import "./Playlist.css"
import { Link } from "react-router-dom"
import { PlaylistVideoContext } from "./PlaylistVideoProvider"
import CreateIcon from '@material-ui/icons/Create';

export const PlaylistList = () => {
    const { getPlaylistsByUser, addPlaylist, editPlaylist, deletePlaylist } = useContext(PlaylistContext)
    const { playlistVideos, getPlaylistVideosByUser, deletePlaylistVideo } = useContext(PlaylistVideoContext)
    const [playlists, setPlaylists] = useState([])
    const [playlist, setPlaylist] = useState({})
    const [reset, setReset] = useState(false)
    const [editName, setEditName] = useState({id: null, edit: false})

    useEffect(() => {
        getPlaylistVideosByUser(parseInt(localStorage.getItem("tv_user")))
            .then(() => {
                getPlaylistsByUser(parseInt(localStorage.getItem("tv_user")))
                    .then(playlists => {
                        playlists.shift()
                        setPlaylists(playlists)
                    })
            })
    }, [reset])

    playlists.sort((a, b) => {
        return b.timestamp - a.timestamp
    })

    const handleControlledInputChange = (event) => {
        const newPlaylist = { ...playlist }
        newPlaylist[event.target.id] = event.target.value
        setPlaylist(newPlaylist)
    }

    const handleKeyDown = (event) => {
        if(event.keyCode === 13){
          editPlaylist({
              id: event.target.id,
              name: event.target.value
          }).then(() => {
              setEditName({id: null, edit: false})
          }).then(() => {
            {reset ? setReset(false) : setReset(true)}
          })
        }
      }

    const handleCreatePlaylist = () => {
        addPlaylist({
            userId: parseInt(localStorage.getItem("tv_user")),
            name: playlist.name,
            timestamp: Date.now()
        })
            .then(() => {
                getPlaylistsByUser(parseInt(localStorage.getItem("tv_user")))
                    .then(playlists => {
                        playlists.shift()
                        setPlaylists(playlists)
                        setPlaylist({ name: "" })
                    })
            })
    }

    return (
        <>

            <h1>Playlists</h1>

            <div className="addInput">
                <fieldset>
                    <label htmlFor="url">Create New Playlist:</label>
                    <input type="text" id="name" className="input-field" required autoFocus placeholder="Playlist Name" value={playlist.name} onChange={handleControlledInputChange} />
                    <button className="addButton" onClick={e => {
                        e.preventDefault()
                        handleCreatePlaylist()
                    }
                    }>
                        Submit
            </button>
                </fieldset>
            </div>

            <div className="playlists flex-container">
                {playlists.map(p => {
                    return (
                        <div className="playlist">
                            { editName.edit && p.id === editName.id ?
                                <div className="playlist_title">
                                <div className="addInput">
                                    {/* <fieldset> */}
                                        <input type="text" id={p.id} key={p.id} className="input-field" required autoFocus placeholder={p.name} value={playlist.name}
                                        onKeyDown={handleKeyDown}/>
                                    {/* </fieldset> */}
                                    </div>
                                    <CreateIcon fontSize="small" onClick={e => {
                                        e.preventDefault()
                                        setEditName({id: null, edit: false})
                                    }} />
                                </div> :
                                <div className="playlist_title">
                                    <Link to={`/playlists/detail/${p.id}`}>
                                        <h4 className="h4_playlist">{p.name}</h4>
                                    </Link>
                                    <CreateIcon fontSize="small" className="create_icon" onClick={e => {
                                        e.preventDefault()
                                        setEditName({id: p.id, edit: true})
                                    }} />
                                </div>}
                            {
                                playlistVideos.find(pv => pv.playlistId === p.id) ?
                                    <div className="thumbnail_border">
                                        <img className="video_thumbnail" src={`${playlistVideos.find(pv => pv.playlistId === p.id).thumbnail}`} /> </div> :
                                    <div className="thumbnail_border"><div className="empty_playlist"></div></div>
                            }
                            <button onClick={e => {
                                e.preventDefault()
                                Promise.all(playlistVideos.map(pv => {
                                    if (pv.playlistId === p.id) {
                                        return deletePlaylistVideo(pv.id)
                                    }
                                })).then(() => {
                                    deletePlaylist(p.id)
                                }).then(() => reset === false ? setReset(true) : setReset(false))
                            }}>Delete</button>
                        </div>
                    )

                })}
            </div>

        </>
    )

}