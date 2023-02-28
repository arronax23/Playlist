import React, { useState, useRef}  from 'react'
import { useHistory } from 'react-router'
import {v4 as uuidv4} from 'uuid';
import { ReactComponent as Spinner} from './spinner.svg'

function Option1Form() {
    const imgSelected = useRef();
    const imgInput = useRef();

    const audioSelected = useRef();
    
    const fileUploadContainer = useRef();
    const history = useHistory();

    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [img, setImg] = useState();
    const [imgPath, setimgPath] = useState('');
    const [audio, setAudio] = useState();
    const [audioPath, setAudioPath] = useState('');
    const [uploadedSongId, setUploadedSongId] = useState('');

    const onPopupExit = (e) => {
        fileUploadContainer.current.classList.remove('active');
        document.querySelectorAll('.file-upload-popup').forEach(item => item.classList.toggle('active'));
    }

    const navigateToHomePage = (e) => {
        history.push('/');
    }

    const navigateToVideoCard = (e) => {
        history.push(`audiocard/${uploadedSongId}`)
    }

    const onSubmit = (e) => {
        e.preventDefault();
        fileUploadContainer.current.classList.add('active');

        const song = {author, title, imgPath, audioPath};
        let formData = new FormData();
        formData.append('img',img);
        formData.append('imgPath',imgPath);
        formData.append('audio',audio);
        formData.append('audioPath',audioPath);
        console.log(song);

        fetch('api/AddSong', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(song)  
            })
        .then(response => {
            if (!response.ok){
                alert('Error');
                throw new Error("Something went wrong!");
            }
            else{
                console.log(formData);
                fetch('api/UploadFile', {
                    method: 'POST',
                    body: formData
                })
                .then(resp => {
                    if (!resp.ok){
                        alert('Error');
                        throw new Error("Something went wrong!");
                    }
                    else {
                        document.querySelectorAll('.file-upload-popup').forEach(item => item.classList.toggle('active'));
                    }
                    return resp.text()
                })
                .then(data => console.log(data));
            }
            return response.json();
        })
        .then(uploadedSong => setUploadedSongId(uploadedSong.id))
        .catch(error => {
            console.log(error);
        });
    }

    const handleImgChange = (e) => {
        imgSelected.current.innerHTML = e.target.files[0].name;
        let imgUUID = uuidv4();
        let imgNameArray = e.target.files[0].name.split('.');
        let extension = imgNameArray[imgNameArray.length - 1];
        let imgName = `${imgUUID}.${extension}`;

        console.log(e.target.files[0]);
        setImg(e.target.files[0]);
        setimgPath(imgName);
    }

    const handleAudioChange = (e) => {
        audioSelected.current.innerHTML = e.target.files[0].name;
        let audioUUID = uuidv4();
        let audioNameArray = e.target.files[0].name.split('.');
        let extension = audioNameArray[audioNameArray.length - 1];
        let audioName = `${audioUUID}.${extension}`;

        console.log(e.target.files[0]);
        setAudio(e.target.files[0]);
        setAudioPath(audioName);
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
                <label htmlFor="author">Author</label>
                <input type="text" name="author" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <label className="file-label" htmlFor="img" onChange={handleImgChange}>
                    <p>Image</p>
                    <i className="fa-solid fa-file"></i>
                    <input ref={imgInput} type="file" name="img" id="img"  />
                    <p ref={imgSelected} className="selected-file"></p>
                </label>

                <label className="file-label" htmlFor="audio" onChange={handleAudioChange}>
                    <p>Audio</p>
                    <i className="fa-solid fa-headphones"></i>
                    <input type="file" name="audio" id="audio"  />
                    <p ref={audioSelected} className="selected-file"></p>
                </label>

                <button type="submit" >Submit</button>
            </form>
        </div>
  )
}

export default Option1Form