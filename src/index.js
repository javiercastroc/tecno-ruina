import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import MainPage from './MainPage';
import VideoPlayer from './videoPlayer';
import videoSources from './videoSourcesALL';
import reportWebVitals from './reportWebVitals';


ReactDOM.render( // Cambio aquí
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {Object.keys(videoSources).map((key, index) => (
          <Route key={index} path={`/videos/${key}`} element={<VideoPlayer videoSources={videoSources[key]} />} />
        ))}
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
