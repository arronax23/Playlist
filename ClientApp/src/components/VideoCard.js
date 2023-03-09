import React, { useRef, useState } from 'react'
import useFetchGet from './../customHooks/useFetchGet'
import { ReactComponent as AudioAnimation} from './audioAnimation.svg'
import { useParams } from 'react-router-dom'

function VideoCard() {
    const { id } = useParams();
    const {data : videoSong, isPending, error, httpResposne} = useFetchGet(`/api/GetOneVideoSong/${id}`);
    
    const [isStart, setIsStart] = useState(true);
    const [timeStamp, setTimeStamp] = useState();

    const video = useRef();
    const playButton = useRef();
    const pauseButton = useRef();
    const stopButton = useRef();
    const progress = useRef();
    const volumeContainer = useRef();
    const volumeProgress = useRef();

    const imgDiv = useRef();
    const videoDiv = useRef();


    const getSelectedAudioBarTime = (e) => {
        var rect = e.target.getBoundingClientRect();
        const min = rect.left;
        const max = rect.right;
        const positionX = e.clientX - rect.left;
        const percentage  = 100* positionX / (max - min);
        const duration =  video.current.duration;
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
            video.current.currentTime = getSelectedAudioBarTime(e);
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
            video.current.volume = volume;
            console.log(volume);
            const color = -0.5 * percentage + 75;
            volumeProgress.current.style.background =  `hsl(155, 17%, ${color}%)`;
            volumeProgress.current.style.width =  `${percentage}%`;
        }
    }

    const onTimeUpdate = () => {

        let progressPercentage = Math.round(100* video.current.currentTime / video.current.duration);
        progress.current.style.width = `${progressPercentage}%`;

        if(video.current.ended)
        {
            playButton.current.style.display = 'inline-block'
            pauseButton.current.style.display = 'none'
            stopButton.current.style.display = 'none'
        }
    }

    const onPlay = () => {
        video.current.play();

        if (videoSong.customImg && isStart){
            imgDiv.current.classList.toggle('hide');
            videoDiv.current.classList.toggle('hide');
            setIsStart(false);
        }

        playButton.current.style.display = 'none'
        pauseButton.current.style.display = 'inline-block'
        stopButton.current.style.display = 'inline-block'
    }

    const onPause = () => {
        video.current.pause();

        playButton.current.style.display = 'inline-block'
        pauseButton.current.style.display = 'none'
        stopButton.current.style.display = 'inline-block'
    }

    const onStop = () => {
        video.current.pause();
        video.current.currentTime = 0;

        playButton.current.style.display = 'inline-block'
        pauseButton.current.style.display = 'none'
        stopButton.current.style.display = 'none'
    }

    const onBackward = () => {
        video.current.currentTime -= 10;
    }

    const onForward = () => {
        video.current.currentTime += 10;
    }

    const onDisplayVolumeContainer =  () => {
        volumeContainer.current.classList.toggle('hide');
    }

    const onMinusClick = () => {
        let volume = video.current.volume;
        volume -= .1;
        if (volume < 0){
            volume = 0;
        }
        video.current.volume = volume;
        console.log(video.current.volume);

        const percentage = 100 * volume;
        const color = -0.5 * percentage + 75;
        volumeProgress.current.style.background =  `hsl(155, 17%, ${color}%)`;
        volumeProgress.current.style.width =  `${percentage}%`;
    }

    const onPlusClick = () => {
        let volume = video.current.volume;
        volume += .1;
        if (volume > 1){
            volume = 1;
        }
        video.current.volume = volume;
        console.log(video.current.volume);

        const percentage = 100 * volume;
        const color = -0.5 * percentage + 75;
        volumeProgress.current.style.background =  `hsl(155, 17%, ${color}%)`;
        volumeProgress.current.style.width =  `${percentage}%`;

    }

    return (
        videoSong && 
        (
        <div className="audiocard-container">
            <div className="audiocard">
                {
                    videoSong.customImg == true ? 
                    (
                       <div className="audiocard-image" ref={imgDiv}>
                            <img src={`/img/${videoSong.imgPath}`} />
                        </div>
                    )
                    :
                    videoSong.customImg == false ? 
                    (
                        <div className="videocard-video">
                            <video src={`/video/${videoSong.videoPath}`} ref={video} onTimeUpdate={onTimeUpdate}></video>
                        </div>
                    )
                    : null
                }
                {
                     videoSong.customImg == true ? 
                     (
                        <div className="videocard-video hide" ref={videoDiv}>
                        <video src={`/video/${videoSong.videoPath}`} ref={video} onTimeUpdate={onTimeUpdate}></video>
                        </div>
                     )
                     : 
                     null
                }

                <div className="audiocard-author">
                    {videoSong.author}
                </div>
                <div className="audiocard-title">
                    {videoSong.title}
                </div>
                <div className="audio-bar"  title={timeStamp} onMouseMove={onAudioBarMouseMove} onClick={onAudioBarClick}>
                    <div className="audio-bar-progress"  ref={progress}>
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
                <div className="volume-container hide" ref={volumeContainer}>
                    <div className="volume-bar" onClick={onVolumeBarClick}>
                        <div className="volume-bar-progress" ref={volumeProgress}>
                        </div>
                    </div>
                    <div className="controls">
                        <i className="fa-regular fa-square-minus" title="Volume Down" onClick={onMinusClick}></i>
                        <i className="fa-solid fa-volume-high"></i>
                        <i className="fa-regular fa-square-plus" title="Volume Up" onClick={onPlusClick}></i>
                    </div>

                </div>
            </div>

        </div>
        )  
    )
}

export default VideoCard