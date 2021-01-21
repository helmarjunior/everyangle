import React, { Component, useEffect, useState } from "react";
import ReactWebMediaPlayer from "react-web-media-player";
const API_HOST = "http://localhost:8000/api";
const Player = (props) => {
    const [url, setUrl] = useState(null);
    const [fileName, setFileName] = useState(null);

    useEffect(() => {
        const media = props.media;

        if (media.id) {
            setUrl(`${API_HOST}/media/${media.id}`);
            setFileName(media.original_file_name);
        } else {
            setUrl(null);
            setFileName(null);
        }
    }, [props.media.id]);
    return url ? (
        <ReactWebMediaPlayer
            width={500}
            height={350}
            title={fileName}
            thumbnail={"/assets/music.jpg"}
            // audio={url}
            video={url}
            autoplay={true}
        />
    ) : (
        "Select the media."
    );
};

export default Player;
