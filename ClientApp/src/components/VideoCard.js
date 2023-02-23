import React, { useRef, useState } from 'react'
import useFetchGet from './../customHooks/useFetchGet'
import { ReactComponent as AudioAnimation} from './audioAnimation.svg'
import { useParams } from 'react-router-dom'

function VideoCard() {
    const { id } = useParams();
    const {data : videoSong, isPending, error, httpResposne} = useFetchGet(`/api/GetOneVideoSong/${id}`);
    
    const [isStart, setIsStart] = useState(true);
    const video = useRef();
    const playButton = useRef();
    const pauseButton = useRef();
    const stopButton = useRef();
    const progress = useRef();

    const imgDiv = useRef();
    const videoDiv = useRef();

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
                <div className="audio-bar">
                    <div className="audio-bar-progress"  ref={progress}>
                    </div>
                </div>
                <div className="audio-buttons">
                    <i className="fa-solid fa-backward" title="-10s" onClick={onBackward}></i>
                    <i className="fa-solid fa-play" title="Play" onClick={onPlay} ref={playButton}></i>
                    <i className="fa-solid fa-pause" title="Pause" onClick={onPause} ref={pauseButton}></i>
                    <i className="fa-solid fa-stop" title="Stop" onClick={onStop} ref={stopButton}></i>
                    <i className="fa-solid fa-forward" title="+10s" onClick={onForward}></i>
                </div>
            </div>
        </div>
        )  
    )
}

export default VideoCard