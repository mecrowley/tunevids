import React from "react"
import { Route } from "react-router-dom"
import { AutoselectVidList } from "./autoselectVid/autoselectVidList";
import { SavedVideoList } from "./savedVideo/SavedVideoList"
import { SavedVideoProvider } from "./savedVideo/SavedVideoProvider"
import { UserProvider } from "./user/UserProvider";
import { YoutubeDataProvider } from "./YoutubeDataProvider";

export const ApplicationViews = () => {


    return (
        <>
            <UserProvider>
                <Route exact path="/">
                    <AutoselectVidList />
                </Route>
            </UserProvider>

            <SavedVideoProvider>
                <YoutubeDataProvider>
                    <Route exact path="/savedvideos">
                        <SavedVideoList />
                    </Route>
                </YoutubeDataProvider>
            </SavedVideoProvider>
        </>
    )
}