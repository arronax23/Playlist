import React, { useState, useRef}  from 'react'
import { useHistory } from 'react-router'
import {v4 as uuidv4} from 'uuid';

function Option2Form() {
    const imgSelected = useRef();
    const imgInput = useRef();

    const videoSelected = useRef();
    const audioInput = useRef();

    const history = useHistory();

    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [customImg, setCustomImg] = useState(false);
    const [img, setImg] = useState();
    const [imgPath, setimgPath] = useState();
    const [video, setVideo] = useState();
    const [videoPath, setVideoPath] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(img);

        const song = {author, title, imgPath, audioPath: videoPath};
        let formData = new FormData();
        formData.append('img',img);
        formData.append('imgPath',imgPath);
        formData.append('video',video);
        formData.append('videoPath',videoPath);
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
                  .then(response => {
                    if (!response.ok){
                        alert('Error');
                        throw new Error("Something went wrong!");
                    }
                    else {
                        history.push('/');
                    }
                });
                
       
            }
        })
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

    const handleVideoChange = (e) => {
        videoSelected.current.innerHTML = e.target.files[0].name;
        let videoUUID = uuidv4();
        let videoNameArray = e.target.files[0].name.split('.');
        let extension = videoNameArray[videoNameArray.length - 1];
        let videoName = `${videoUUID}.${extension}`;

        console.log(e.target.files[0]);
        setVideo(e.target.files[0]);
        setVideoPath(videoName);
    }
    return (
        <div className="form-container">
            <form onSubmit={onSubmit}>
                <label htmlFor="author">Author</label>
                <input type="text" name="author" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <label htmlFor="custom-img">Custom Image</label>
                <input type="checkbox" name="custom-img" id="custom-img" value={customImg} onChange={(e) => setCustomImg(previous => !previous) } />
                {/* <input type="checkbox" name="custom-img" id="custom-img"  onChange={(e) => console.log(e.target) } /> */}

                { customImg ?
                (
                    <label className="file-label" htmlFor="img" onChange={handleImgChange}>
                        <p>Image</p>
                        <i className="fa-solid fa-file"></i>
                        <input ref={imgInput} type="file" name="img" id="img"  />
                        <p ref={imgSelected} className="selected-file"></p>
                    </label>
                )
                 : 
                (
                    <label className="file-label disabled" htmlFor="img" onChange={handleImgChange}>
                        <p>Image</p>
                        <i className="fa-solid fa-file"></i>
                        <input disabled ref={imgInput} type="file" name="img" id="img"  />
                        <p ref={imgSelected} className="selected-file"></p>
                    </label>
                )}

                <label className="file-label" htmlFor="audio" onChange={handleVideoChange}>
                    <p>Video</p>
                    <i className="fa-solid fa-film"></i>
                    <input ref={audioInput} type="file" name="video" id="video"  />
                    <p ref={videoSelected} className="selected-file"></p>
                </label>

                <button type="submit" >Submit</button>
            </form>
        </div>
  )
}

export default Option2Form