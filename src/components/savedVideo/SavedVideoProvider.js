import React, { useState, createContext } from "react"

export const SavedVideoContext = createContext()

export const SavedVideoProvider = (props) => {
    const [savedUserVideos, setSavedUserVideos] = useState([])

    const getSavedVideosByUser = userId => {
        return fetch(`http://localhost:8088/savedVideos?userId=${userId}`)
        .then(res => res.json())
        .then(setSavedUserVideos)
    }
    
    const getSavedVideoById = savedVideoId => {
        return fetch(`http://localhost:8088/savedVideos/${savedVideoId}`)
        .then(res => res.json())
    }

    const addSavedVideo = savedVideoObj => {
        return fetch("http://localhost:8088/savedVideos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(savedVideoObj)
        })
    }

    const updateSavedVideo = savedVideo => {
        return fetch(`http://localhost:8088/savedVideos/${savedVideo.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(savedVideo)
        })
      }

    const deleteSavedVideo = savedVideoId => {
        return fetch(`http://localhost:8088/savedVideos/${savedVideoId}`, {
            method: "DELETE"
        })
    }

    return (
        <SavedVideoContext.Provider value={{
            savedUserVideos, getSavedVideosByUser, getSavedVideoById, addSavedVideo, updateSavedVideo, deleteSavedVideo
        }}>
            {props.children}
        </SavedVideoContext.Provider>
    )
}