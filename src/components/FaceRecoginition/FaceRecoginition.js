import React from 'react';
import './FaceRecoginition.css';


// destructuring in the parameters itself
const FaceRecoginition = ({imageUrl, box}) => {
  // the parenthesis after return statement 
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto'/>
        <div 
          className='bounding-box' 
          style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}
          >
        </div>
      </div>
    </div>
  );
}

export default FaceRecoginition;