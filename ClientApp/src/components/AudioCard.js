import React, { useRef } from 'react'
import useFetchGet from './../customHooks/useFetchGet'
import { useParams } from 'react-router-dom'

function AudioCard() {
    const { id } = useParams();
    const {data : song, isPending, error, httpResposne} = useFetchGet(`/api/GetOneSong/${id}`);
    
    const audio = useRef();
    const playButton = useRef();
    const pauseButton = useRef();
    const stopButton = useRef();

    const onPlay = () => {
        audio.current.play();

        playButton.current.style.display = 'none'
        pauseButton.current.style.display = 'inline-block'
        stopButton.current.style.display = 'inline-block'
    }

    const onPause = () => {
        audio.current.pause();

        playButton.current.style.display = 'inline-block'
        pauseButton.current.style.display = 'none'
        stopButton.current.style.display = 'inline-block'
    }

    const onStop = () => {
        audio.current.pause();
        audio.current.currentTime = 0;

        playButton.current.style.display = 'inline-block'
        pauseButton.current.style.display = 'none'
        stopButton.current.style.display = 'none'
    }


    
    return (
        song && 
        (
        <div className="audiocard-container">
            <div className="audiocard">
                <div className="audiocard-image">
                    <img src={`/img/${song.imgPath}`} />
                </div>
                <div className="audiocard-author">
                    {song.author}
                </div>
                <div className="audiocard-title">
                    {song.title}
                </div>
                <div className="audio-buttons">
                    <i class="fa-solid fa-play" onClick={onPlay} ref={playButton}></i>
                    <i class="fa-solid fa-pause" onClick={onPause} ref={pauseButton}></i>
                    <i class="fa-solid fa-stop" onClick={onStop} ref={stopButton}></i>
                </div>
                <audio src={`/audio/${song.audioPath}`} ref={audio}></audio>
            </div>
        </div>
        )  
    )
}

export default AudioCard