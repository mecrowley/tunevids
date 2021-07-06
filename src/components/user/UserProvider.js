import React, { useState, createContext } from "react"

export const UserContext = createContext()

export const UserProvider = (props) => {
    const [users, setUsers] = useState([])
    const [user, setUser] = useState({})
    const API = "http://localhost:8088"

    const getUsers = () => {
        return fetch(`${API}/users`)
        .then(res => res.json())
        .then(setUsers)
    }

    const getUserById = userId => {
        return fetch(`${API}/users/${userId}`)
        .then(res => res.json())
        .then(setUser)
    }

    return (
        <UserContext.Provider value={{
            user, users, getUsers, getUserById
        }}>
            {props.children}
        </UserContext.Provider>
    )
}