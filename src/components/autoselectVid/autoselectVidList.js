import React, { useEffect, useState, useContext } from "react"
import { UserContext } from "../user/UserProvider"

export const AutoselectVidList = () => {
    const { getUserById } = useContext(UserContext)
    const [ user, setUser ] = useState({})

    useEffect(() => {
        getUserById(parseInt(localStorage.getItem("tv_user")))
        .then((user) => {
            setUser(user)
        })
    }, [])

    return (
        <>
            <h2>Hello, {user.firstName}</h2>
        </>
    )
}