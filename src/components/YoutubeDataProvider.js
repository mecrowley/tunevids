import React, { useState, createContext } from "react"

export const YoutubeDataContext = createContext()

export const YoutubeDataProvider = (props) => {

    const getYoutubeVideoById = id => {
        return fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics%2CtopicDetails&id=${id}&key=AIzaSyDAAdOiTTvYC1S1bsk1hgCYOtcMtK5ViLg`)
            .then(res => res.json())
    }

    const getYoutubeChannelById = id => {
        return fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=AIzaSyDAAdOiTTvYC1S1bsk1hgCYOtcMtK5ViLg`)
            .then(res => res.json())
    }

    const getYoutubeChannelByUserName = username => {
        return fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2C%20contentDetails%2C%20statistics&forUsername=${username}&key=AIzaSyDAAdOiTTvYC1S1bsk1hgCYOtcMtK5ViLg`)
            .then(res => res.json())
    }

    const getPlaylistVideosById = id => {
        return fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=AIzaSyDAAdOiTTvYC1S1bsk1hgCYOtcMtK5ViLg`)
            .then(res => res.json())
    }

    const getPage2PlaylistVideos = (id, pageToken) => {
        return fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&pageToken=${pageToken}&playlistId=${id}&key=AIzaSyDAAdOiTTvYC1S1bsk1hgCYOtcMtK5ViLg`)
            .then(res => res.json())
    }


    return (
        <YoutubeDataContext.Provider value={{
            getYoutubeVideoById, getYoutubeChannelById, getYoutubeChannelByUserName, getPlaylistVideosById, getPage2PlaylistVideos
        }}>
            {props.children}
        </YoutubeDataContext.Provider>
    )

}