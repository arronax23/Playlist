import React from 'react'
import useFetchGet from './../customHooks/useFetchGet'
import { useParams } from 'react-router-dom'

function AudioCard() {
    const { id } = useParams();
    const {data : song, isPending, error, httpResposne} = useFetchGet(`/api/GetOneSong/${id}`);
    return (
        song && 
        (
            <div className="audio-card">
            <div className="image">
                <img src={`/img/${song.imgPath}`} />
            </div>
            <div className="author">
                {song.author}
            </div>
            <div className="title">
                {song.title}
            </div>
            <audio src={`/audio/${song.audioPath}`} autoPlay></audio>
        </div>
        )  
    )
}

export default AudioCard