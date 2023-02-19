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
    const progress = useRef();
    const wave = useRef();

    const onTimeUpdate = () => {

        let progressPercentage = Math.round(100* audio.current.currentTime / audio.current.duration);
        progress.current.style.width = `${progressPercentage}%`;

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

    const onBackward = () => {
        audio.current.currentTime -= 10;
    }

    const onForward = () => {
        audio.current.currentTime += 10;
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
                <div className="audio-bar">
                    <div className="audio-bar-progress"  ref={progress}>
                    </div>
                </div>
                <div className="audio-buttons">
                    <i class="fa-solid fa-backward" title="-10s" onClick={onBackward}></i>
                    <i className="fa-solid fa-play" title="Play" onClick={onPlay} ref={playButton}></i>
                    <i className="fa-solid fa-pause" title="Pause" onClick={onPause} ref={pauseButton}></i>
                    <i className="fa-solid fa-stop" title="Stop" onClick={onStop} ref={stopButton}></i>
                    <i class="fa-solid fa-forward" title="+10s" onClick={onForward}></i>
                </div>
                <audio src={`/audio/${song.audioPath}`} ref={audio} onTimeUpdate={onTimeUpdate}></audio>
            </div>
            <AudioAnimation ref={wave} />
        </div>
        )  
    )
}

export default AudioCard