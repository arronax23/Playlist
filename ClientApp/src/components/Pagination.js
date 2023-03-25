import useFetchGet from './../customHooks/useFetchGet'
import React, { useEffect } from 'react'

function Pagination({currentPage, setCurrentPage, songsPerPage}) {
    const {data: totalCount, isPendingVideo, errorVideo, httpResposneVideo} = useFetchGet(`api/GetSongsTotalCount`);
    let pages = [];

    for (let i = 1; i <= Math.ceil(totalCount / songsPerPage); i++) {
        pages.push(i);
    }
    
    
    const handlePaginationBtnClick = (e,page) => {
        setCurrentPage(page);
        document.querySelectorAll('.pagination-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
    }

    return (
        <div className="pagination-buttons">
            {pages.map((page,index) => 
            <button
                className = {page == 1 ?  "pagination-btn active" : "pagination-btn"} 
                key={index} 
                onClick={(e) => handlePaginationBtnClick(e,page) }
            >
                {page}
            </button>)}
        </div>
    )
}

export default Pagination