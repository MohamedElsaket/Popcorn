import { useState } from "react";

const StarRating = ({starNumb= 10, size= 20, color= '#FFD700'}) => {
    const [selectedStars, setSelectedStars] =useState(0)

    function handleClickStar(selectedStar) {
        setSelectedStars(selectedStar);
    }

    return ( <>
        <div className="rating" style={{color: color, fontSize:`${size}px`}}>
        {Array.from({length: starNumb}, (_, i) =>  
        {const starVal = i + 1;
        return (
        <Star starVal={starVal} selectedStars={selectedStars} onclickStart={handleClickStar} />
        )})}
        <span> {selectedStars === 0 ? '-' : selectedStars} / {starNumb} </span>
        </div>
    </> );
}

const Star = ({onclickStart, starVal, selectedStars}) => {
    return ( <>
        <span onClick={() => onclickStart(starVal)}>{starVal <= selectedStars ? '★' : '☆'}</span>
    </> );
}
  
export default StarRating;

// ☆ ★ 