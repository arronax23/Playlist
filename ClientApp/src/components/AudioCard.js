import React, { useRef } from 'react'
import useFetchGet from './../customHooks/useFetchGet'
import { ReactComponent as AudioAnimation} from './audioAnimation.svg'
import { useParams } from 'react-router-dom'

function AudioCard() {
    const { id } = useParams();
    const {data : song, isPending, error, httpResposne} = useFetchGet(`/api/GetOneSong/${id}`);
    
    const audio = useRef();
    const playButton = useRef();
    const pauseButton = useRef();
    const stopButton = useRef();
    const wave = useRef();

    const onTimeUpdate = () => {
        if(audio.current.ended)
        {
            playButton.current.style.display = 'inline-block'
            pauseButton.current.style.display = 'none'
            stopButton.current.style.display = 'none'
            wave.current.style.display = 'none'
        }
    }

    const onPlay = () => {
        audio.current.play();

        playButton.current.style.display = 'none'
        pauseButton.current.style.display = 'inline-block'
        stopButton.current.style.display = 'inline-block'
        wave.current.style.display = 'block'
    }

    const onPause = () => {
        audio.current.pause();

        playButton.current.style.display = 'inline-block'
        pauseButton.current.style.display = 'none'
        stopButton.current.style.display = 'inline-block'
        wave.current.style.display = 'none'
    }

    const onStop = () => {
        audio.current.pause();
        audio.current.currentTime = 0;

        playButton.current.style.display = 'inline-block'
        pauseButton.current.style.display = 'none'
        stopButton.current.style.display = 'none'
        wave.current.style.display = 'none'
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
                    <i className="fa-solid fa-play" onClick={onPlay} ref={playButton}></i>
                    <i className="fa-solid fa-pause" onClick={onPause} ref={pauseButton}></i>
                    <i className="fa-solid fa-stop" onClick={onStop} ref={stopButton}></i>
                </div>
                <audio src={`/audio/${song.audioPath}`} ref={audio} onTimeUpdate={onTimeUpdate}></audio>
            </div>
            <AudioAnimation ref={wave} />
        </div>
        )  
    )
}

export default AudioCard