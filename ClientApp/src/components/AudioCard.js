import React, { useRef, useState } from 'react'
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
    // const wave = useRef();
    const volumeContainer = useRef();
    const volumeProgress = useRef();


    const [timeStamp, setTimeStamp] = useState();


    const getSelectedAudioBarTime = (e) => {
        var rect = e.target.getBoundingClientRect();
        const min = rect.left;
        const max = rect.right;
        const positionX = e.clientX - rect.left;
        const percentage  = 100* positionX / (max - min);
        const duration =  audio.current.duration;
        const selectedTime = percentage * duration / 100;
        return selectedTime;
    }
    
    const onAudioBarMouseMove = (e) => {
        if (e.target.classList.contains("audio-bar")){
            const selectedTime = getSelectedAudioBarTime(e);
            const minutes = Math.floor(selectedTime / 60); 
            let seconds =  Math.floor(selectedTime  % 60);
            if (seconds < 10){
                seconds = `0${seconds}`
            }
            setTimeStamp(`${minutes}:${seconds}`) 
        }
    }

    const onAudioBarClick = (e) => {
        if (e.target.classList.contains("audio-bar")){
            audio.current.currentTime = getSelectedAudioBarTime(e);
        }
    }

    const onVolumeBarClick = (e) => {
        if (e.target.classList.contains("volume-bar")){
            var rect = e.target.getBoundingClientRect();
            const min = rect.left;
            const max = rect.right;
            const positionX = e.clientX - rect.left;
            const percentage  = 100* positionX / (max - min);
            const volume  = positionX / (max - min);
            audio.current.volume = volume;
            console.log(volume);
            const color = -0.5 * percentage + 75;
            volumeProgress.current.style.background =  `hsl(155, 17%, ${color}%)`;
            volumeProgress.current.style.width =  `${percentage}%`;
        }
    }

    const onTimeUpdate = () => {

        let progressPercentage = Math.round(100* audio.current.currentTime / audio.current.duration);
        progress.current.style.width = `${progressPercentage}%`;

        if(audio.current.ended)
        {
            playButton.current.style.display = 'inline-block'
            pauseButton.current.style.display = 'none'
            stopButton.current.style.display = 'none'
            // wave.current.style.display = 'none'
        }
    }

    const onPlay = () => {
        audio.current.play();

        playButton.current.style.display = 'none'
        pauseButton.current.style.display = 'inline-block'
        stopButton.current.style.display = 'inline-block'
        // wave.current.style.display = 'block'
    }

    const onPause = () => {
        audio.current.pause();

        playButton.current.style.display = 'inline-block'
        pauseButton.current.style.display = 'none'
        stopButton.current.style.display = 'inline-block'
        // wave.current.style.display = 'none'
    }

    const onStop = () => {
        audio.current.pause();
        audio.current.currentTime = 0;

        playButton.current.style.display = 'inline-block'
        pauseButton.current.style.display = 'none'
        stopButton.current.style.display = 'none'
        // wave.current.style.display = 'none'
    }

    const onBackward = () => {
        audio.current.currentTime -= 10;
    }

    const onForward = () => {
        audio.current.currentTime += 10;
    }

    const onDisplayVolumeContainer =  () => {
        volumeContainer.current.classList.toggle('hide');
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
                <div className="audio-bar" title={timeStamp} onMouseMove={onAudioBarMouseMove} onClick={onAudioBarClick} >
                    <div className="audio-bar-progress" ref={progress}>
                    </div>
                </div>
                <div className="audio-buttons">
                    <i className="fa-solid fa-backward" title="-10s" onClick={onBackward}></i>
                    <i className="fa-solid fa-play" title="Play" onClick={onPlay} ref={playButton}></i>
                    <i className="fa-solid fa-pause" title="Pause" onClick={onPause} ref={pauseButton}></i>
                    <i className="fa-solid fa-stop" title="Stop" onClick={onStop} ref={stopButton}></i>
                    <i className="fa-solid fa-forward" title="+10s" onClick={onForward}></i>
                    <i className="fa-solid fa-volume-high" title="Show/Hide Volume Bar" onClick={onDisplayVolumeContainer}></i>
                </div>
                <audio src={`/audio/${song.audioPath}`} ref={audio} onTimeUpdate={onTimeUpdate}></audio>
                {/* <AudioAnimation ref={wave} /> */}
                <div className="volume-container hide" ref={volumeContainer}>
                    <div className="volume-bar" onClick={onVolumeBarClick}>
                        <div className="volume-bar-progress" ref={volumeProgress}>
                        </div>
                    </div>
                    <i className="fa-solid fa-volume-high"></i>
                </div>
            </div>
        </div>
        )  
    )
}

export default AudioCard