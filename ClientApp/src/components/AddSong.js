import React, {useState}  from 'react'

function AddSong() {
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        alert(author)
    }
    return (
        <div className="form-container">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <label htmlFor="author">Author</label>
                    <input type="text" name="author" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <button type="submit" >Submit</button>
                </form>
            </div>
    </div>
    )
}

export default AddSong