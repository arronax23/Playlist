import React, { useState, useRef}  from 'react'
import { useHistory } from 'react-router'
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
    const [audio, setAudio] = useState();
    const [uploadedSongId, setUploadedSongId] = useState('');
    const [errors, setErrors] = useState([]);

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
      
        const formData = new FormData();
        formData.append('Author', author);
        formData.append('Title', title);
        formData.append('Img', img);
        formData.append('Audio', audio);

      
        const addSongResponse = await fetch('api/audiosongs', {
            method: 'POST',
            body: formData,
        });
    
        if (addSongResponse.ok){
            activatePopupContent('uploaded');
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

        console.log(e.target.files[0].name);

        setImg(e.target.files[0]);
    }

    const handleAudioChange = (e) => {
        audioSelected.current.innerHTML = e.target.files[0].name;

        console.log(e.target.files[0].name);
        setAudio(e.target.files[0]);
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