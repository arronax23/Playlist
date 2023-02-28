import React, { useState, useRef}  from 'react'
import { useHistory } from 'react-router'
import {v4 as uuidv4} from 'uuid';
import { ReactComponent as Spinner} from './spinner.svg'

function Option3Form() {
    const downloadSongInfoOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '***REMOVED***',
            'X-RapidAPI-Host': 'youtube-video-download-info.p.rapidapi.com'
        }
    };

    const history = useHistory();
    const fileUploadContainer = useRef();
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [videoLink, setVideoLink] = useState('');
    // const [videoPath, setVideoPath] = useState('');
    const customImg = true;
    // const [imgPath, setImgPath] = useState('');
    const [imgLink, setImgLink] = useState('');
    const [uploadedSongId, setUploadedSongId] = useState('');


    const onPopupExit = (e) => {
        fileUploadContainer.current.classList.remove('active');
        document.querySelectorAll('.file-upload-popup').forEach(item => item.classList.toggle('active'));
    }

    const navigateToHomePage = (e) => {
        history.push('/');
    }

    const navigateToVideoCard = (e) => {
        history.push(`videocard/${uploadedSongId}`)
    }


    const handleLinkChange = (e) => {
        setVideoLink(e.target.value);
    }

    const handleDownloadSongInfo = (e) => {
        let linkArray = videoLink.split('v=');
        let ytID = linkArray[linkArray.length - 1];

        fetch(`https://youtube-video-download-info.p.rapidapi.com/dl?id=${ytID}`, downloadSongInfoOptions)
        .then(response => response.json())
        .then(youtubeInfo => {
            console.log(youtubeInfo);
            let authorTitleInfoArray = youtubeInfo.title.split("-");
            setAuthor(authorTitleInfoArray[0]);
            setTitle(authorTitleInfoArray[1]);
            setImgLink(youtubeInfo.thumb)
        })
        .catch(err => console.error(err));
    }

    const onSubmit = (e) => {
        e.preventDefault();
        fileUploadContainer.current.classList.add('active');

        let videoUUID = uuidv4();
        let videoPath = `${videoUUID}.mp4`;
        
        let imgUUID = uuidv4();
        let imgLinkArray = imgLink.split('.');
        let imgExtension = imgLinkArray[imgLinkArray.length - 1];
        let imgPath = `${imgUUID}.${imgExtension}`;

        const song = {author, title, customImg, videoPath, imgPath};
        fetch('api/AddVideoSong', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(song)  
        })
        .then(resp => {
            console.log(resp);
            if (resp.ok){
                fetch('api/DownloadYoutubeVideo', 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({videoPath, videoLink, imgPath, imgLink})  
                })
                .then(response => {
                    console.log(response);
                    if (response.ok){
                        document.querySelectorAll('.file-upload-popup').forEach(item => item.classList.toggle('active'));
                    }
                })
            }
            return resp.json();
           
        })
        .then(uploadedSong => setUploadedSongId(uploadedSong.id))
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <div className="form-container">
            <div className="file-upload-container" ref={fileUploadContainer}>
                <div className='file-upload-popup spinner active'>
                    <Spinner />
                </div>
                <div className='file-upload-popup uploaded'>
                    <h3>Files uploaded!</h3>
                    <i className="fa-solid fa-xmark" onClick={onPopupExit}></i>
                    <div className="buttons">
                        <button onClick={navigateToHomePage}>Back to Home Page</button>
                        <button onClick={navigateToVideoCard}>Listen to the song</button>
                    </div>
                </div>
            </div>
            <form onSubmit={onSubmit}>
                <label htmlFor="link">Link</label>
                <input type="text" name="link" id="link" value={videoLink} onChange={handleLinkChange} />
                <button type="button" onClick={handleDownloadSongInfo}>Download Song Info</button>
                <label htmlFor="author">Author</label>
                <input type="text" name="author" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <button type="submit" >Submit</button>
            </form>
        </div>
  )
}

export default Option3Form