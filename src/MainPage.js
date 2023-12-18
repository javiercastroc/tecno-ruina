import React from 'react';
import { useNavigate } from 'react-router-dom';
import videoSources from './videoSources';
import './MainPage.css';

function MainPage() {
  let navigate = useNavigate();

  return (
    <div>
      {Object.keys(videoSources).map((key, index) => (
        <button key={index} className="main-page-button" onClick={() => navigate(`/videos/${key}`)}>
          Ver {key}
        </button>
      ))}
    </div>
  );
}

export default MainPage;
