import React from "react";
import { Route, Redirect } from "react-router-dom";
import { ApplicationViews } from "./ApplicationViews";
import { NavBar } from "./nav/NavBar";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { NewUserChannels } from "./auth/NewUserChannels";
import { NewUserVideos } from "./auth/NewUserVideos";
import "./TuneVids.css";
import "./nav/NavBar.css"
import { PlaylistProvider } from "./playlist/PlaylistProvider";
import { PlaylistVideoProvider } from "./playlist/PlaylistVideoProvider";
import { SavedVideoProvider } from "./savedVideo/SavedVideoProvider";
import { UserChannelProvider } from "./userChannel/UserChannelProvider";
import { YoutubeDataProvider } from "./YoutubeDataProvider";

export const TuneVids = () => (
    <>
        <Route
            render={() => {
                if (localStorage.getItem("tv_user")) {
                    return (
                        <>
                            <NavBar />
                            <ApplicationViews />
                        </>
                    );
                } else {
                    return <Redirect to="/login" />;
                }
            }}
        />

        <Route path="/login">
            <Login />
        </Route>
        <PlaylistProvider>
            <PlaylistVideoProvider>
                <SavedVideoProvider>
                    <UserChannelProvider>
                        <YoutubeDataProvider>
                            <Route exact path="/register">
                                <Register />
                            </Route>
                            <Route exact path="/register/addvideos">
                                <NewUserVideos />
                            </Route>
                            <Route exact path="/register/addchannels">
                                <NewUserChannels />
                            </Route>
                        </YoutubeDataProvider>
                    </UserChannelProvider>
                </SavedVideoProvider>
            </PlaylistVideoProvider>
        </PlaylistProvider>

    </>
);