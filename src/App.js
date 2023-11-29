import React, { useRef, useEffect } from 'react';
import './App.css';
import videoSources from './videoSources';

function App() {
  const videoRefs = useRef([]);

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videoSources.length);
  }, [videoSources.length]);

  const handleVideoEnd = (index) => () => {
    const nextVideoIndex = index + 1;
    if (nextVideoIndex < videoSources.length) {
      const nextVideo = videoRefs.current[nextVideoIndex];
      nextVideo.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        if (nextVideo && typeof nextVideo.play === 'function') {
          nextVideo.play();
        }
      }, 500);
    }
  };

  return (
    <div className="App">
      <h1 className="title">Tecno Ruina</h1>


      
      {videoSources.map((source, index) => (
        <React.Fragment key={index}>
          <div className="video-container">
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              autoPlay={index === 0}
              controls
              className="centered-video"
              onEnded={handleVideoEnd(index)}
            >
              <source src={source} type="video/mp4" />
            </video>
          </div>
          {index < videoSources.length - 1 && <div className="spacer"></div>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default App;
