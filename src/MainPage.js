import React from 'react';
import { useNavigate } from 'react-router-dom';
import videoSources from './videoSources';

function MainPage() {
  let navigate = useNavigate();

  return (
    <div>
      {Object.keys(videoSources).map((key, index) => (
        <button key={index} onClick={() => navigate(`/videos/${key}`)}>
          Ver {key}
        </button>
      ))}
    </div>
  );
}

export default MainPage;
