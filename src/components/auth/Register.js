import React, { useContext, useRef } from "react"
import { useHistory } from "react-router-dom"
import { PlaylistContext } from "../playlist/PlaylistProvider"
import { PlaylistVideoContext } from "../playlist/PlaylistVideoProvider"
import "./Login.css"

export const Register = (props) => {
    const firstName = useRef()
    const lastName = useRef()
    const email = useRef()
    const conflictDialog = useRef()
    const history = useHistory()
    const { addPlaylist } = useContext(PlaylistContext)
    const { addPlaylistVideo } = useContext(PlaylistVideoContext)

    const existingUserCheck = () => {
        return fetch(`http://tunevids-dev.us-east-2.elasticbeanstalk.com/api/users?email=${email.current.value}`)
            .then(res => res.json())
            .then(user => !!user.length)
    }

    const handleRegister = (e) => {
        e.preventDefault()


        existingUserCheck()
            .then((userExists) => {
                if (!userExists) {
                    fetch("http://tunevids-dev.us-east-2.elasticbeanstalk.com/api/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: email.current.value,
                            firstName: `${firstName.current.value}`,
                            lastName: `${lastName.current.value}`
                        })
                    })
                        .then(res => res.json())
                        .then(createdUser => {
                            if (createdUser.hasOwnProperty("id")) {
                                localStorage.setItem("tv_user", createdUser.id)
                                addPlaylist({
                                    userId: createdUser.id,
                                    name: "genList",
                                    timestamp: Date.now()
                                })
                                .then(playlist => {
                                    for (let i = 0; i < 40; i++) {
                                        addPlaylistVideo({
                                            playlistId: playlist.id,
                                            userId: createdUser.id,
                                            title: "",
                                            ytId: "",
                                            thumbnail: ""
                                        })
                                    }
                                })
                                history.push("/register/addvideos")
                            }
                        })
                }
                else {
                    conflictDialog.current.showModal()
                }
            })
        
    }

    return (
        <main style={{ textAlign: "center" }}>

            <dialog className="dialog dialog--password" ref={conflictDialog}>
                <div>Account with that email address already exists</div>
                <button className="button--close" onClick={e => conflictDialog.current.close()}>Close</button>
            </dialog>

                <h2 className="h3 mb-3 font-weight-normal register__h">Create a New Account</h2>
            <form className="form--login" onSubmit={handleRegister}>
                <fieldset>
                    <label htmlFor="firstName"> First Name </label>
                    <input ref={firstName} type="text" name="firstName" className="form-control" placeholder="First name" required autoFocus />
                </fieldset>
                <fieldset>
                    <label htmlFor="lastName"> Last Name </label>
                    <input ref={lastName} type="text" name="lastName" className="form-control" placeholder="Last name" required />
                </fieldset>
                <fieldset>
                    <label htmlFor="inputEmail"> Email address </label>
                    <input ref={email} type="email" name="email" className="form-control" placeholder="Email address" required />
                </fieldset>
                <fieldset>
                    <button type="submit"> Submit </button>
                </fieldset>
            </form>
        </main>
    )
}

