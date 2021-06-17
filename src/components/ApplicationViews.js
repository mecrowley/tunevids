import React from "react"
import { Route } from "react-router-dom"
import { AutoselectVidList } from "./playlistGenerator/GeneratedVidList";
import { SavedVideoList } from "./savedVideo/SavedVideoList"
import { SavedVideoProvider } from "./savedVideo/SavedVideoProvider"
import { UserProvider } from "./user/UserProvider";
import { UserChannelList } from "./userChannel/UserChannelList";
import { UserChannelProvider } from "./userChannel/UserChannelProvider";
import { YoutubeDataProvider } from "./YoutubeDataProvider";

export const ApplicationViews = () => {


    return (
        <>
            <UserProvider>
                <SavedVideoProvider>
                    <UserChannelProvider>
                        <YoutubeDataProvider>
                            <Route exact path="/">
                                <AutoselectVidList />
                            </Route>
                        </YoutubeDataProvider>
                    </UserChannelProvider>
                </SavedVideoProvider>
            </UserProvider>

            <SavedVideoProvider>
                <YoutubeDataProvider>
                    <Route exact path="/savedvideos">
                        <SavedVideoList />
                    </Route>
                </YoutubeDataProvider>
            </SavedVideoProvider>

            <UserChannelProvider>
                <YoutubeDataProvider>
                    <Route exact path="/savedchannels">
                        <UserChannelList />
                    </Route>
                </YoutubeDataProvider>
            </UserChannelProvider>
        </>
    )
}