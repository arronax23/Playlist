import React, { useState, useEffect } from 'react'
import Card from './Card';
import Pagination from './Pagination';
import useFetchGet from './../customHooks/useFetchGet'

function Cards() {
    // const {data : songs, isPending, error, httpResposne} = useFetchGet("api/GetAllSongs");
    // const {data : videoSongs, isPendingVideo, errorVideo, httpResposneVideo} = useFetchGet("api/GetAllVideoSongs");
    const [currentPage, setCurrentPage] = useState(1);
    const [songsPerPage, setSongsPerPage] = useState(10);
    const {data: songs, isPendingVideo, errorVideo, httpResposneVideo} = useFetchGet(`api/GetAudioAndVideoSongsForPage/${currentPage}/${songsPerPage}`);

    const lastSongsIndex = currentPage * songsPerPage;
    const firstSongsIndex = lastSongsIndex - songsPerPage;

    const mofidySongsPerPage = () => {
      if (window.innerWidth > 1400){
        setSongsPerPage(10);
      }
      else if (window.innerWidth > 960){
        setSongsPerPage(8);
      }
      else{
        setSongsPerPage(4);
      }
    }

    useEffect(() => {
      mofidySongsPerPage();
    }, [])
    
    window.addEventListener("resize", () =>{
      mofidySongsPerPage();
    })


  return (
    <div className="cards-page">
      <div className="cards-container">
        {songs && songs.map(song => {
          if (song.type == 0){
            return(
            <Card 
            key={song.id} 
            id = {song.id}
            imgPath={song.imgPath} 
            author={song.author} 
            title={song.title}
            audioOrVideo = "audio"
          />)
          }
          else if (song.type == 1){
            return (
              <Card 
              key={song.id} 
              id = {song.id}
              imgPath={song.imgPath} 
              customImg={song.customImg}
              videoPath={song.videoPath}
              author={song.author} 
              title={song.title}
              audioOrVideo = "video"
            />
            )
          }
        }
        )}
      </div>
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} songsPerPage={songsPerPage} />
    </div>
  )
}

export default Cards