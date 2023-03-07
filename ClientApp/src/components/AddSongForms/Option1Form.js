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
    const [errors, setErrors] = useState([]);

    const isResponseProblemJson = (response) => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/problem+json") !== -1){
            return true;
        }
        return false;
    }

    const activatePopupContent = (className) => {
        document.querySelectorAll('.file-upload-popup').forEach(content => {
            if (content.classList.contains(className)){
                content.classList.add('active');
            }
            else {
                content.classList.remove('active');
            }
        })
    }

    const onPopupExit = (e) => {
        fileUploadContainer.current.classList.remove('active');
        setErrors([]);
        activatePopupContent("spinner")
    }

    const navigateToHomePage = (e) => {
        history.push('/');
    }

    const navigateToVideoCard = (e) => {
        history.push(`audiocard/${uploadedSongId}`);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        fileUploadContainer.current.classList.add('active');
      
        const song = { author, title, imgPath, audioPath };
        let formData = new FormData();
        formData.append('img', img);
        formData.append('imgPath', imgPath);
        formData.append('audio', audio);
        formData.append('audioPath', audioPath);
        console.log(song);
      
        const addSongResponse = await fetch('api/AddSong', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(song),
        });
    
        if (addSongResponse.ok) {
            console.log(formData);
            const uploadFileResponse = await fetch('api/UploadFile', {
                method: 'POST',
                body: formData,
            });
        
            if (uploadFileResponse.ok) {
                activatePopupContent('uploaded');
            }
            console.log(uploadFileResponse);
        
            if (isResponseProblemJson(uploadFileResponse)) {
                const uploadFileResponseData = await uploadFileResponse.json();
                if (uploadFileResponseData.errors != null) {
                setErrors([...errors, ...Object.values(uploadFileResponseData.errors)]);
                activatePopupContent('errors');
                }
            }
        }
    
        const addSongResponseData = await addSongResponse.json();
        if (addSongResponseData.errors != null) {
            setErrors([...errors, ...Object.values(addSongResponseData.errors)]);
            activatePopupContent('errors');
        } 
        else if (addSongResponseData.id != null) {
            setUploadedSongId(addSongResponseData.id);
        }
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
                <div className='file-upload-popup errors'>
                    {errors && errors.map(err => <p className='error' key={err}>{err}</p>)}
                    <button onClick={onPopupExit}>Back to form</button>
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