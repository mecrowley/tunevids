import React, { useState, createContext } from "react"

export const UserChannelContext = createContext()

export const UserChannelProvider = (props) => {
    const [userChannels, setUserChannels] = useState([])

    const getUserChannelsByUser = userId => {
        return fetch(`http://localhost:8088/userChannels?userId=${userId}`)
        .then(res => res.json())
        .then(setUserChannels)
    }
    
    const getUserChannelById = userChannelId => {
        return fetch(`http://localhost:8088/userChannels/${userChannelId}`)
        .then(res => res.json())
    }

    const addUserChannel = userChannelObj => {
        return fetch("http://localhost:8088/userChannels", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userChannelObj)
        })
    }

    const deleteUserChannel = userChannelId => {
        return fetch(`http://localhost:8088/userChannels/${userChannelId}`, {
            method: "DELETE"
        })
    }

    return (
        <UserChannelContext.Provider value={{
            userChannels, getUserChannelsByUser, getUserChannelById, addUserChannel, deleteUserChannel
        }}>
            {props.children}
        </UserChannelContext.Provider>
    )
}