import React from "react"
import { Route } from "react-router-dom"
import { PlaylistList } from "./playlist/PlaylistList";
import { PlaylistDetail } from "./playlist/PlaylistDetail";
import { PlaylistProvider } from "./playlist/PlaylistProvider";
import { PlaylistVideoProvider } from "./playlist/PlaylistVideoProvider";
import { PlaylistGenerator } from "./playlistGenerator/PlaylistGenerator";
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
                        <PlaylistProvider>
                            <PlaylistVideoProvider>
                                <YoutubeDataProvider>
                                    <Route exact path="/">
                                        <PlaylistGenerator />
                                    </Route>
                                </YoutubeDataProvider>
                            </PlaylistVideoProvider>
                        </PlaylistProvider>
                    </UserChannelProvider>
                </SavedVideoProvider>
            </UserProvider>

            <PlaylistProvider>
                <PlaylistVideoProvider>
                    <SavedVideoProvider>
                        <YoutubeDataProvider>
                            <Route exact path="/savedvideos">
                                <SavedVideoList />
                            </Route>
                        </YoutubeDataProvider>
                    </SavedVideoProvider>
                </PlaylistVideoProvider>
            </PlaylistProvider>

            <UserChannelProvider>
                <YoutubeDataProvider>
                    <Route exact path="/savedchannels">
                        <UserChannelList />
                    </Route>
                </YoutubeDataProvider>
            </UserChannelProvider>

            <PlaylistProvider>
                <PlaylistVideoProvider>
                    <YoutubeDataProvider>
                        <Route exact path="/playlists">
                            <PlaylistList />
                        </Route>
                        <Route exact path="/playlists/detail/:playlistId(\d+)">
                            <PlaylistDetail />
                        </Route>
                    </YoutubeDataProvider>
                </PlaylistVideoProvider>
            </PlaylistProvider>
        </>
    )
}