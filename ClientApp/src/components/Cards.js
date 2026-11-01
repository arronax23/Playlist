import React, { useState, useEffect } from 'react'
import Card from './Card';
import Pagination from './Pagination';
import useFetchGet from './../customHooks/useFetchGet'

function Cards() {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const {data: songs } = useFetchGet(`api/songs?pageNumber=${pageNumber}&pageSize=${pageSize}`);


    const mofidySongsPerPage = () => {
      if (window.innerWidth > 1400){
        setPageSize(10);
      }
      else if (window.innerWidth > 960){
        setPageSize(8);
      }
      else{
        setPageSize(4);
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
            imgFileName={song.imgFileName} 
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
              imgFileName={song.imgFileName} 
              customImg={song.customImg}
              videoFileName={song.videoFileName}
              author={song.author} 
              title={song.title}
              audioOrVideo = "video"
            />
            )
          }
        }
        )}
      </div>
      <Pagination currentPage={pageNumber} setCurrentPage={setPageNumber} songsPerPage={pageSize} />
    </div>
  )
}

export default Cards