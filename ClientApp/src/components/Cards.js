import React from 'react'
import Card from './Card';
import useFetchGet from './../customHooks/useFetchGet'

function Cards() {
    const {data : songs, isPending, error, httpResposne} = useFetchGet("api/GetAllSongs");
    const {data : videoSongs, isPendingVideo, errorVideo, httpResposneVideo} = useFetchGet("api/GetAllVideoSongs");

  return (
    <div className="cards-container">
    {songs && songs.map(song => 
    <Card 
      key={song.id} 
      id = {song.id}
      imgPath={song.imgPath} 
      author={song.author} 
      title={song.title}
      audioOrVideo = "audio"
    />)}
    {videoSongs && videoSongs.map(videoSong => 
    <Card 
      key={videoSong.id} 
      id = {videoSong.id}
      imgPath={videoSong.imgPath} 
      customImg={videoSong.customImg}
      videoPath={videoSong.videoPath}
      author={videoSong.author} 
      title={videoSong.title}
      audioOrVideo = "video"
    />)}
  </div>
  )
}

export default Cards